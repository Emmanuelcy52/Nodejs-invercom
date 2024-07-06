var verificado;
$(document).ready(function () {
  var productosSeleccionados = []; // Array para almacenar los productos seleccionados con sus precios predeterminados y cantidades
  var totalProductos = 0;
  var idUsuario;

  // Realiza la solicitud AJAX al servidor
  $.ajax({
    url: "/api/carrito/Obtener", // Aquí deberás colocar la URL de tu endpoint que devuelve los datos
    type: "GET",
    dataType: "json",
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

  async function Pago(productosSeleccionados) {
    try {
      const res = await fetch("/api/checkout/pagar", {
        method: "post",
        body: JSON.stringify(productosSeleccionados),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const session = await res.json();
      window.location = session.url;
      // Aquí puedes procesar la respuesta del pago si es necesario
    } catch (error) {
      console.error("Error al realizar el pago:", error);
      // Maneja el error aquí
    }
    console.log("Productos seleccionados para pagar:", productosSeleccionados);
  }

  // Función para mostrar los productos en la interfaz
  function mostrarProductos(data) {
    var card;
    data.forEach(function (data) {
      // Parseamos la cadena JSON en un objeto JavaScript
      var productos = JSON.parse(data.contenido);
      idUsuario = data.id_usuario

      // Iteramos sobre cada producto y creamos las tarjetas dinámicamente
      productos.forEach(function (producto) {
        var imagen = $("<img>").attr({
          src: producto.img,
          alt: producto.nombreProducto,
          title: producto.nombreProducto,
        });

        var precioSinComas = producto.precio.replace(",", "");
        var precioFormateado = formatearNumero(
          parseFloat(precioSinComas).toFixed(2)
        );

        card = `
            <div class="row item">
              <h4 class="codigo-unico" style="display: none;">${
                producto.codigoUnico
              }</h4>
              <div class="col">
                ${imagen.prop("outerHTML")}
              </div>
              <div class="col-6">
                <span>${producto.nombreProducto}</span></br>
                <div class="row mt-3">
                  <div class="col">
                    <div class="quantity-input">
                      <span class="btn btn-outline-primary decrement-btn">-</span>
                      <span class="num m-2">${producto.cantidad}</span>
                      <span class="stock" style="display: none;">${
                        producto.stock
                      }</span>
                      <span class="btn btn-outline-primary increment-btn">+</span>
                    </div>
                  </div>
                  <div class="col">
                    <a class="actions-buttons btn btn-danger">Eliminar</a>
                  </div>
                </div>
              </div>
            </div>
            <div class="dropdown-divider"></div>
          `;
        $(".card-body").append(card);

        // Agrega el producto seleccionado con su precio predeterminado y cantidad al array productosSeleccionados
        productosSeleccionados.push({
          precioProducto: precioFormateado,
          codigoUnico: producto.codigoUnico,
          nombreProducto: producto.nombreProducto,
          cantidad: producto.cantidad,
        });
      });

      actualizarResumen();
    });
  }

  // Función para calcular el total de los productos
  function calcularTotalProductos(productos) {
    var total = 0;
    productos.forEach(function (producto) {
      var precioSinComas = producto.precioProducto.replace(",", "");
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

  // Función para actualizar el resumen de productos
  function actualizarResumen() {
    $(".detalles-resumen").empty();
    var resumen = "";
    var totalProductos = 0;

    productosSeleccionados.forEach(function (producto) {
      var precioSinComas = producto.precioProducto.replace(",", "");
      var precioFormateado = formatearNumero(
        parseFloat(precioSinComas).toFixed(2)
      );

      resumen += `
          <div class="row">
            <div class="col-8">
              <span>${producto.nombreProducto}</span>
            </div>
            <div class="col text-center align-self-center">
              <p class="item-price mb-1" title="unidades-precio">$ ${precioFormateado}</p>
              <p class="cantidad">Cantidad: ${producto.cantidad}</p>
              <a class="actions-buttons btn btn-danger">Eliminar</a>
            </div>
          </div>
          <hr>
        `;

      totalProductos += parseInt(producto.cantidad);
    });

    $(".detalles-resumen").append(`
        <div class="col">
          <div class="row">
            ${resumen}
          </div>
          <div class="row">
            <span>Total de Productos: <span>${totalProductos}</span></span>
            <span>Total a Pagar: <span class="total-pagar">$ ${calcularTotalProductos(
              productosSeleccionados
            )}</span></span>
            <button class="btn btn-primary checkout-btn">Pagar</button>
          </div>
        </div>
      `);
  }

  $(".detalles-resumen").on("click", ".checkout-btn", function () {
    var precioSinComas = totalProductos.replace(",", "");
    var precio = parseFloat(precioSinComas);
    console.log("Total a pagar:", precio);
    verificarperfil(idUsuario);
    if (verificado == true) {
      // Mostrar modal de factura
      $("#modal-factura").show();
  
      // Manejar clic en el botón "SI" del modal
      $("#btn-aceptar-modal").click(function () {
        // Agregar producto con factura
        productosSeleccionados.push({
          factura: true  // Agregar la variable factura con valor true
        });

        // Cerrar modal de factura
        $("#modal-factura").hide();

        // Llamar a la función Pago con productos seleccionados
        Pago(productosSeleccionados);
      });

      // Manejar clic en el botón "NO" del modal
      $("#btn-rechazar-modal").click(function () {
        // Agregar producto sin factura (o no agregar la variable factura)
        productosSeleccionados.push({
          factura: false
          // No agregamos factura aquí, asumiendo que se omite o se agrega false según tu lógica
        });

        // Cerrar modal de factura
        $("#modal-factura").hide();

        // Llamar a la función Pago con productos seleccionados
        Pago(productosSeleccionados);
      });
    }
  });

  $(".card-body").on("click", ".increment-btn", function () {
    var item = $(this).closest(".item");
    var cantidadElement = item.find(".num");
    var stock = item.find(".stock");
    var Stock = parseInt(stock.text());
    var cantidad = parseInt(cantidadElement.text());

    if (cantidad < Stock) {
      cantidad++;
      cantidadElement.text(cantidad);
      actualizarCantidadProducto(item, cantidad);
    } else {
      console.log("cantidad máxima alcanzada");
    }

    actualizarTotal();
    actualizarResumen();
  });

  $(".card-body").on("click", ".decrement-btn", function () {
    var item = $(this).closest(".item");
    var cantidadElement = item.find(".num");
    var cantidad = parseInt(cantidadElement.text());
    if (cantidad > 1) {
      cantidad--;
      cantidadElement.text(cantidad);
      actualizarCantidadProducto(item, cantidad);
      actualizarTotal();
      actualizarResumen();
    }
  });

  function actualizarCantidadProducto(item, cantidad) {
    var codigoUnico = item.find(".codigo-unico").text();
    var productoExistente = productosSeleccionados.find(
      (producto) => producto.codigoUnico === codigoUnico
    );
    if (productoExistente) {
      productoExistente.cantidad = cantidad;
    }
  }

  function actualizarTotal() {
    var total = calcularTotalProductos(productosSeleccionados);
    $(".item-resumen-productos span").text("$ " + total);
    $(".item-resumen-total span").text("$ " + total);
  }

  $(".card-body").on("click", ".actions-buttons", function () {
    var item = $(this).closest(".item");
    var codigoUnico = item.find(".codigo-unico").text();
    $.ajax({
      url: "/api/carrito/eliminarProducto",
      type: "POST",
      dataType: "json",
      data: { codigoUnico: codigoUnico },
      success: function (response) {
        if (!response.error) {
          console.log(response.mensaje);
        } else {
          console.error("Error al eliminar el producto:", response.mensaje);
        }
      },
      error: function (xhr, status, error) {
        console.error("Error al eliminar el producto:", error);
      },
    });

    item.remove();
    productosSeleccionados = productosSeleccionados.filter(
      (producto) => producto.codigoUnico !== codigoUnico
    );

    actualizarTotal();
    actualizarResumen();
  });
});

function verificarperfil(idUser) {
  const data = {
    idusuario: idUser,
  };
  fetch("/api/user/verificarPerfil", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("La solicitud no pudo ser completada");
      }
      return response.json();
    })
    .then((data) => {
      if (data.error) {
        // Deshabilitar botones de pago y carrito
        mostrarmensajePerfil("error", data.mensaje);
      } else {
        verificado = data.encontrado;
      }
    })
    .catch((error) => {});
}

function mostrarmensajePerfil(tipo, mensaje) {
  var imagenSrc = "";
  var accion;
  $(".cerrar").click(function () {
    $("#modal-mensaje").hide();
  });

  if (tipo === "exito") {
    imagenSrc = "../../vistas/extras/img/exito.gif";
    accion = function () {
      $("#modal-mensaje").hide();
      setTimeout(function () {
        history.replaceState(null, "", "/"); // Reemplaza la URL actual en el historial
        window.location.reload();
      }, 1000);
    };
  } else if (tipo === "error") {
    imagenSrc = "../../vistas/extras/img/fallar.gif";
    accion = function () {
      $("#modal-mensaje").hide();
      setTimeout(function () {
        history.replaceState(null, "", "/llenarPerfil"); // Reemplaza la URL actual en el historial
        window.location.reload();
      }, 1000);
    };
  }
  $("#btn-seguir-comprando").hide();
  $("#btn-ir-carrito").hide();
  $("#mensaje-imagen").attr("src", imagenSrc);
  $("#mensaje-texto").text(mensaje);
  $("#modal-mensaje").show();

  $("#btn-aceptar-mensaje").click(accion);
}
