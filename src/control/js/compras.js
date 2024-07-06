$(document).ready(function () {
  var procedencia = obtenerProcedencia();
  var Factura = obtenerFactura();
  

  // Función para obtener la procedencia de la URL
  function obtenerProcedencia() {
    var url = window.location.href;
    var urlParams = new URLSearchParams(url.split("?")[1]);
    var procedencia = urlParams.get("procedencia"); // Obtener el valor de procedencia

    return procedencia;
  }

  function obtenerFactura() {
    var url = window.location.href;
    var urlParams = new URLSearchParams(url.split("?")[1]);
    var factura = urlParams.get("factura"); // Obtener el valor de procedencia
    return factura;
  }
  if (Factura == "true"){
    Factura = true
    console.log("factura : "+ Factura);
  }

  

  // Verificar la procedencia y realizar acciones según sea necesario
  if (procedencia === "carrito") {
    var cantidadesProductos = obtenerCantidadesDeURL();
    var productosSeleccionados = [];
    var cantidad;

    // Función para obtener las cantidades de productos de la URL
    function obtenerCantidadesDeURL() {
      var url = window.location.href;
      var urlParams = new URLSearchParams(url.split("?")[1]);
      var cantidades = urlParams.getAll("cantidad");
      return cantidades.map(function (cantidad) {
        return parseInt(cantidad);
      });
    }
    // Realiza la solicitud AJAX al servidor
    $.ajax({
      url: "/api/carrito/Obtener", // Aquí deberás colocar la URL de tu endpoint que devuelve los datos
      type: "GET",
      dataType: "json",
      data: { accion: "obtener" },
      success: function (response) {
        if (!response.error) {
          console.log("Productos obtenidos con éxito:");
          console.log(response.productos);
          mostrarProductos(response.productos);
        } else {
          console.error("Error al obtener los productos:", response.mensaje);
        }
      },
      error: function (xhr, status, error) {
        console.error("Error al obtener los productos:", error);
        // Maneja el error aquí
      },
    });

    // Función para mostrar los productos en la interfaz
    function mostrarProductos(data) {
      var card;
      data.forEach(function (data) {
        // Parseamos la cadena JSON en un objeto JavaScript
        var productos = JSON.parse(data.contenido);

        // Iteramos sobre cada producto y creamos las tarjetas dinámicamente
        productos.forEach(function (producto, index) {
          cantidad = cantidadesProductos[index];

          // Creamos una imagen dinámica
          var imagen = $("<img>").attr({
            src: producto.img, // Usar la primera URL de imagen
            alt: producto.nombreProducto,
            title: producto.nombreProducto,
          });

          var precioSinComas = producto.precio.replace(",", "");
          var precioFormateado = formatearNumero(
            parseFloat(precioSinComas).toFixed(2)
          );

          card = `
        <div class="item">
            <h4 class="codigo-unico" style="display: none;">${producto.codigoUnico
            }</h4>
            ${imagen.prop("outerHTML")}
          <div class="item-details">
            <div>
              <h5 class="card-title">${producto.nombreProducto}</h5>
            </div>
          </div>
          <div>
            <div class="quantity-input">
              <span class="num m-2">${cantidad}</span>
            </div>
          </div>
          <span class="item-price" title="unidades-precio"><strong>Total: </strong>$ ${precioFormateado}</span>
        </div>
        <div class="dropdown-divider"></div>
      `;
          $(".lista-productos").append(card);

          // Agrega el producto seleccionado con su precio predeterminado y cantidad al array productosSeleccionados
          productosSeleccionados.push({
            codigoUnico: producto.codigoUnico,
            nombreProducto: producto.nombreProducto,
            cantidad: cantidad,
            entrada: producto.entrada,
            salida: producto.salida,
            precio: producto.precio,
          });
        });
        const totalCompra = calcularTotalProductos(productos);
        $(".detalles-resumen").append(`
            <div class="item-resumen-productos">Productos (${productos.length})</div>
            <div class="item-resumen-total">Total: <span>$ ${calcularTotalProductos(productos)}</span></div>
        `);
      });
      setTimeout(function () {
        $.ajax({
          url: "/api/carrito/eliminar",
          type: "POST", // Cambiado a POST
          dataType: "json",
          contentType: "application/json",
          data: JSON.stringify({
            accion: "eliminarCarrito",
            productos: productosSeleccionados,
          }),
          success: function (response) {
            if (!response.error) {
              console.log(response.mensaje);
              // Redireccionar la página al inicio después de eliminar el carrito y limpiar el historial de navegación
              history.replaceState(null, '', '/'); // Reemplaza la URL actual en el historial
              window.location.reload();
            } else {
              console.error("Error al eliminar el carrito:", response.mensaje);
            }
          },
          error: function (xhr, status, error) {
            console.error("Error al eliminar el carrito:", error);
            // Manejar el error aquí
          },
        });
      }, 10000); // Esperar 10 segundos
      $.ajax({
        url: "/api/email/ticket-pago", // Aquí deberás colocar la URL de tu endpoint que devuelve los datos
        type: "POST", // Cambiado a POST
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify({ productosSeleccionados: productosSeleccionados, Factura: Factura}),
        success: function (response) {
          if (!response.error) {
          } else {
            console.error("Error al obtener los productos:", response.mensaje);
          }
        },
        error: function (xhr, status, error) {
          console.error("Error al obtener los productos:", error);
          // Maneja el error aquí
        },
      });
    }

    // Función para calcular el total de los productos
    function calcularTotalProductos(productos) {
      var total = 0;
      productos.forEach(function (producto) {
        // Eliminar las comas del precio y luego convertirlo a punto flotante
        var precioSinComas = producto.precio.replace(",", "");
        total += parseFloat(precioSinComas) * parseInt(producto.cantidad);
      });
      var totalFormateado = formatearNumero(total.toFixed(2));
      totalProductos = totalFormateado;
      return totalFormateado;
    }

    // Función para formatear el número con comas
    function formatearNumero(numero) {
      return numero.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    $(".detalles-resumen").on("click", ".checkout-btn", function () {
      var precioSinComas = totalProductos.replace(",", "");
      var precio = parseFloat(precioSinComas); // Convertir el precio a un número decimal
      console.log("Total a pagar:", precio);
      Pago(productosSeleccionados); // Pasa los productos seleccionados al realizar el pago
    });

    // Función para obtener los productos desde la interfaz
    function obtenerProductos() {
      var productos = [];
      $(".card-body .item").each(function () {
        var producto = {
          nombreProducto: $(this).find(".card-title").text(),
          precio: $(this)
            .find(".item-price")
            .text()
            .replace("$", "")
            .replace(",", ""), // Eliminar el símbolo de dólar y las comas
          cantidad: parseInt($(this).find(".num").text()),
        };
        productos.push(producto);
      });
      return productos;
    }
  }





  if (procedencia === "PagoDirecto") {
    var datosJSON = obtenerProducto(); // Obtener el JSON de datos desde la URL
    var productosSeleccionados = [];
    var factura

    // Función para obtener los datos de productos desde la URL
    function obtenerProducto() {
        var url = window.location.href;
        var urlParams = new URLSearchParams(url.split("?")[1]);
        var datos = urlParams.get("datos");
        return JSON.parse(decodeURIComponent(datos)); // Decodificar y parsear JSON
    }

    // Mostrar productos en la interfaz
    mostrarProductos(datosJSON);

    function mostrarProductos(data) {
        var card;
        data.forEach(function (producto) { // Iterar sobre los productos
            // Crear elementos HTML dinámicamente
            var imagen = $("<img>").attr({
                src: producto.img.split(',')[0], // Usar la primera URL de imagen
                alt: producto.nombreProducto,
                title: producto.nombreProducto,
            });

            var precioSinComas = producto.precioProducto.replace(",", "");
            var precioFormateado = formatearNumero(parseFloat(precioSinComas).toFixed(2));

            card = `
                <div class="item">
                    <h4 class="codigo-unico" style="display: none;">${producto.codigoUnico}</h4>
                    ${imagen.prop("outerHTML")}
                    <div class="item-details">
                        <div>
                            <h5 class="card-title">${producto.nombreProducto}</h5>
                        </div>
                    </div>
                    <div>
                        <div class="quantity-input">
                            <span class="num m-2">${producto.cantidad}</span>
                        </div>
                    </div>
                    <span class="item-price" title="unidades-precio"><strong>Total: </strong>$ ${precioFormateado}</span>
                </div>
                <div class="dropdown-divider"></div>
            `;
            $(".lista-productos").append(card);

            factura = producto.factura;

            // Agregar al array de productos seleccionados
            productosSeleccionados.push({
                codigoUnico: producto.codigoUnico,
                nombreProducto: producto.nombreProducto,
                cantidad: producto.cantidad,
                entrada: producto.entrada,
                salida: producto.salida,
                precio: producto.precioProducto,
            });
        });

        // Calcular y mostrar el total de la compra
        var totalCompra = calcularTotalProductos(data);
        $(".detalles-resumen").append(`
            <div class="item-resumen-productos">Productos (${data.length})</div>
            <div class="item-resumen-total">Total: <span>$ ${totalCompra}</span></div>
        `);
    }

    // Función para calcular el total de los productos
    function calcularTotalProductos(productos) {
        var total = 0;
        productos.forEach(function (producto) {
            var precioSinComas = producto.precioProducto.replace(",", "");
            total += parseFloat(precioSinComas) * parseInt(producto.cantidad);
        });
        return formatearNumero(total.toFixed(2));
    }

    // Función para formatear el número con comas
    function formatearNumero(numero) {
        return numero.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    // Evento click en el botón de checkout
    $(".detalles-resumen").on("click", ".checkout-btn", function () {
        var precioSinComas = totalCompra.replace(",", "");
        var precio = parseFloat(precioSinComas); // Convertir el precio a número decimal
        console.log("Total a pagar:", precio);
        Pago(productosSeleccionados); // Llamar a función de pago con productos seleccionados
    });

    // Función para enviar datos al servidor (ejemplo con AJAX)
    function enviarDatosAlServidor() {
        // AJAX para actualizar cantidad en el carrito
        $.ajax({
            url: "/api/carrito/actualizarCantidad",
            type: "POST",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({ productos: productosSeleccionados }),
            success: function (response) {
                if (!response.error) {
                    console.log(response.mensaje);
                    // Ejemplo de redirección o recarga después de éxito
                    history.replaceState(null, '', '/');
                    window.location.reload();
                } else {
                    console.error("Error al actualizar carrito:", response.mensaje);
                }
            },
            error: function (xhr, status, error) {
                console.error("Error en petición AJAX:", error);
                // Manejar errores aquí
            }
        });

        // AJAX para enviar ticket de pago por correo
        $.ajax({
            url: "/api/email/ticket-pago",
            type: "POST",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({ productosSeleccionados: productosSeleccionados, Factura: factura}),
            success: function (response) {
                if (!response.error) {
                    console.log("Ticket de pago enviado correctamente.");
                } else {
                    console.error("Error al enviar ticket de pago:", response.mensaje);
                }
            },
            error: function (xhr, status, error) {
                console.error("Error en petición AJAX:", error);
                // Manejar errores aquí
            }
        });
    }

    // Llamar a la función para enviar datos al servidor
    setTimeout(function () {
      enviarDatosAlServidor();
    }, 10000);
}
});
