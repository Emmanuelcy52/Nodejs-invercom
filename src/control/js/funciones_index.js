var productosSeleccionados = [];
var cantidadDisponible = 0;
var verificado;
document.addEventListener("DOMContentLoaded", function () {
  // Llamar a la función mostrarProductos aquí
  obtenerProductos(); // Asumiendo que obtenerProductos hace la solicitud AJAX y luego llama a mostrarProductos
});
var idUsuario;

function verificarSesion() {
  fetch("/api/user/verificarSession", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("La solicitud no pudo ser completada");
      }
      return response.json();
    })
    .then((data) => {
      if (data.error) {
        $("#dropdown").show();
        $("#login-link").show();
        $("#register-link").show();
        $("#profile-link").hide();
        $("#productos-link").hide();
        $("#cerrarSesion-link").hide();
        $("#carrito").hide();
        $("#panel-link").hide();
      } else {
        $("#login-link").hide();
        $("#register-link").hide();
        $("#profile-link").show();
        $("#productos-link").show();
        $("#cerrarSesion-link").show();
        $("#User").text("Hola, " + data.usuario);
        $("#dropdown-user").show();
        idUsuario = data.idUsuario;
        $(".btnpagar").prop("disabled", false);
        $(".enlace-carrito").prop("disabled", false);
      }
    })
    .catch((error) => {});
}

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

function obtenerProductos() {
  $.ajax({
    url: "/api/productos/obtenerProducto",
    type: "GET",
    dataType: "json",
    data: { accion: "obtener" },
    success: function (response) {
      if (!response.error) {
        mostrarProductos(response.productos);
      } else {
        console.error("Error al obtener los productos:", response.mensaje);
      }
    },
    error: function (xhr, status, error) {
      console.error("Error en la solicitud AJAX:", error);
    },
  });
}

function mostrarProductos(productos) {
  verificarSesion();
  // Obtener el contenedor donde se agregarán los productos
  var contenedor = $("#contenedor-productos");

  // Limpiar el contenedor antes de agregar nuevos productos
  contenedor.empty();

  // Iterar sobre cada producto recibido
  productos.forEach(function (producto) {
    var nombreProducto = producto.nombreInversor;
    var imagenes = JSON.parse(producto.imagen_url);

    // Crear un nuevo artículo para el producto
    var articulo = $('<article class="inversor"></article>');

    // Crear la figura con la imagen del producto y el título
    var figura = $('<figure class="imgInv"></figure>');
    var imagen = $("<img>").attr({
      src: imagenes[0], // Mostrar la primera imagen
      alt: "Inversor " + producto.nombreInversor,
      title: "Inversor " + producto.nombreInversor,
      height: "82", // Ajustar altura si es necesario
      width: "88", // Ajustar anchura si es necesario
    });
    var titulo = $("<h4>").html(
      producto.nombreInversor.replace(/\n/g, "<br />")
    );
    figura.append(titulo, imagen);

    // Agregar la figura al artículo
    articulo.append(figura);

    // Crear la tabla para mostrar la información del producto
    var tabla = $('<table class="tablaInv"></table>');
    var thead = $("<thead></thead>");
    var trHead = $("<tr></tr>");
    trHead.append(
      $('<th scope="col">Entrada</th>'),
      $('<th scope="col">Salida</th>'),
      $('<th scope="col">Precio MXN</th>'),
      $('<th scope="col">Pagos a 12 meses</th>'),
      $('<th scope="col">Productos disponibles</th> '),
      $('<th scope="col">Comprar</th>'),
      $('<th scope="col">Ficha Técnica</th>'),
      $('<th scope="col">Agregar al carrito</th>')
    );
    thead.append(trHead);
    tabla.append(thead);

    var tbody = $("<tbody></tbody>");

    // Iterar sobre cada tipo de producto y agregarlo a la tabla
    JSON.parse(producto.informacion_tipo).forEach(function (info) {
      var trBody = $("<tr></tr>");
      var cantidadDisponible = info.cantidad;

      // Llamar a la función restarcantidad para obtener la cantidad inicial
      var cantidad = restarcantidad(cantidadDisponible, "conservar");

      // Crear el párrafo para mostrar la cantidad disponible
      var cantidadParagraph = $("<p>")
        .addClass("cantidad-disponible")
        .text("Disponibles: " + cantidad);
      var meses = calcularMeses(info.precio);

      trBody.append(
        
        $("<td></td>").text(info.entrada),
        $("<td></td>").text(info.salida),
        $("<td></td>").text("$ " + info.precio),
        $("<td></td>").text("$ " + meses),
        $("<td>").append(cantidadParagraph), // Aquí se agrega el párrafo con la cantidad disponible
        $("<td></td>").append(
          $("<a></a>")
            .attr({
              type: "button",
              class: "btnpagar",
              "data-precio": info.precio,
              "data-img": imagenes,
              "data-clave": info.clave,
              "data-codigo": info.codigoUnico,
              "data-nombre": nombreProducto,
              "data-entrada": info.entrada,
              "data-salida": info.salida,
            })
            .text("pagar")
        ),
        $("<td></td>").append(
          $("<a></a>")
            .attr({
              type: "button",
              class: "enlace-ficha",
              "data-ficha":
                '<div class="main">' +
                "<h1>Ficha técnica</h1>" +
                "<article>" +
                '<p class="data">' +
                info.ficha_Tecnica
                  .split("\n")
                  .map((line) => `<p>${line}</p>`)
                  .join("") +
                "<br />" +
                "</p>" +
                '<img src="' +
                imagenes[0] + // Mostrar la primera imagen en la ficha técnica
                '" alt="" height="149" width="160" />' +
                '<img src="' +
                imagenes[1] + // Mostrar la segunda imagen en la ficha técnica
                '" alt="" height="149" width="160" />' +
                '<h2 class="clave"> ' +
                info.clave +
                "</h2>" +
                "</article>" +
                '<div class="enlaces">' +
                '<p align="center">' +
                '<a href="../instructivos/Inst2400-12-120.html" title="instructivo 2400-12-120.html">Ver instructivo</a>' +
                "</p>" +
                "</div>" +
                '<h3 class="datos-tecnicos">Datos Tecnicos: </h3>' +
                "<p>" +
                info.datos_tecnicos
                  .split("\n")
                  .map((line) => `<p>${line}</p>`)
                  .join("") + // Aquí iteramos y generamos los párrafos
                "</p>" +
                "<article>" +
                "<h3>Cuerpo del Inversor</h3>" +
                "<p>Fabricado en aluminio extruido anodizado en color natural</p>" +
                "<h3>Dimensiones</h3>" +
                "<p>" +
                info.dimenciones +
                "</p>" +
                "<h3>Peso en Kilos</h3>" +
                "<p>" +
                info.peso +
                " kilogramos</p>" +
                '<p><strong style="color: red">NOTA: </strong>' +
                "Recuerde que en todos los inversores de todas las marcas, los watts máximo son de uso momentáneo.</p>" +
                "</article>" +
                '<button id="cerrarFicha">Cerrar</button>' +
                "</div>",
              title: "Ver Ficha Técnica " + info.ficha_Tecnica,
            })
            .text("Ver")
        ),
        $("<td></td>").append(
          $("<a></a>")
            .attr({
              type: "button",
              class: "enlace-carrito",
              idUsuario: idUsuario,
              "data-img": imagenes,
              "data-nombre": producto.nombreInversor,
              "data-id": info.id,
              "data-codigo": info.codigoUnico,
              "data-entrada": info.entrada,
              "data-salida": info.salida,
              "data-precio": info.precio,
              "data-stock": info.cantidad,
            })
            .text("Agregar")
            .prop("disabled", cantidadParagraph === 0)
        )
      );
      tbody.append(trBody);
    });

    tabla.append(tbody);

    // Agregar la tabla al artículo
    articulo.append(tabla);
    var ficha_Tecnica = $(
      '<div class="ficha-tecnica" style="display: none;"></div>'
    );
    articulo.append(ficha_Tecnica);

    var vistaPago = $('<div class="vista-pago" style="display: none;"></div>');
    articulo.append(vistaPago);

    // Agregar el artículo al contenedor de productos
    contenedor.append(articulo);
  });

  // Evento clic en enlaces de ficha técnica
  $(document).on("click", ".enlace-ficha", function (event) {
    event.preventDefault();

    var enlace = $(this);
    var fichaTecnica = enlace.attr("data-ficha");
    var contenedor = enlace.closest("article").find(".ficha-tecnica");

    $(".ficha-tecnica").not(contenedor).slideUp(); // Oculta otras fichas técnicas abiertas

    if (!contenedor.is(":visible")) {
      var fichaTecnicaHtml = fichaTecnica;

      // Mostrar la ficha técnica
      contenedor.html(fichaTecnicaHtml);
      contenedor.slideDown(); // Mostrar la ficha técnica actual
    } else {
      contenedor.slideUp(); // Ocultar la ficha técnica actual si ya está visible
    }
  });

  // Evento clic al botón de cerrar ficha técnica
  $(document).on("click", "#cerrarFicha", function () {
    $(".ficha-tecnica").slideUp();
  });

  $(document).on("click", ".btnpagar", function () {
    var precio = $(this).data("precio");
    var precioSinComas = precio.replace(",", "");
    var precioFormateado = formatearNumero(parseFloat(precioSinComas).toFixed(2));
    var clave = $(this).data("clave");
    var img = $(this).data("img");
    var nombre = $(this).data("nombre");
    var codigoUnico = $(this).data("codigo");
    var entrada = $(this).data("entrada");
    var salida = $(this).data("salida");
    var cantidad = 1;
  
    if (idUsuario) {
      verificarperfil(idUsuario);
      if (verificado == true) {
        // Mostrar modal de factura
        $("#modal-factura").show();
  
        // Manejar clic en el botón "SI" del modal
        $("#btn-aceptar-modal").click(function () {
          // Agregar producto con factura
          productosSeleccionados.push({
            precioProducto: precioFormateado,
            clave: clave,
            img: img,
            codigoUnico: codigoUnico,
            nombreProducto: nombre,
            cantidad: cantidad,
            entrada: entrada,
            salida: salida,
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
            precioProducto: precioFormateado,
            clave: clave,
            img: img,
            codigoUnico: codigoUnico,
            nombreProducto: nombre,
            cantidad: cantidad,
            entrada: entrada,
            salida: salida,
            factura: false
            // No agregamos factura aquí, asumiendo que se omite o se agrega false según tu lógica
          });
  
          // Cerrar modal de factura
          $("#modal-factura").hide();
  
          // Llamar a la función Pago con productos seleccionados
          Pago(productosSeleccionados);
        });
      }
    } else {
      // Mostrar el modal de inicio de sesión
      $("#modal-iniciar-sesion").show();
  
      // Manejar clic en el botón "Iniciar sesión" del modal
      $("#btn-iniciar-sesion-modal").click(function () {
        // Redirigir a la página de inicio de sesión o realizar alguna acción para iniciar sesión
        window.location.href = "/vistas/html/login.html"; // Ejemplo de redirección a la página de inicio de sesión
      });
    }
  });
  

  // Cerrar el modal de inicio de sesión al hacer clic en la 'x'
  $(".cerrar").click(function () {
    $("#modal-iniciar-sesion").hide();
  });

  // Function to handle payment processing
  $(document).on("click", ".enlace-carrito", function (e) {
    if (idUsuario) {
      e.preventDefault();
      var button = $(this);
      var cantidadDisponible = parseInt($(this).data("stock"));
      var nuevaCantidad = restarcantidad(cantidadDisponible, "restar");

      if (nuevaCantidad >= 0) {
        $(this).data("stock", nuevaCantidad);

        // Actualizar el texto de la cantidad disponible en la tabla
        $(this)
          .closest("tr")
          .find(".cantidad-disponible")
          .text("Disponibles: " + nuevaCantidad);

        if (nuevaCantidad === 0) {
          $(this).prop("disabled", true);
        }
      } else {
        $(this).prop("disabled", true);
        return;
      }

      carritoContenido = [];
      var nombre = $(this).data("nombre");
      idUsuario;
      var cantidad = 1;
      var img = $(this).data("img");
      var codigoUnico = $(this).data("codigo");
      var id = $(this).data("id");
      var entrada = $(this).data("entrada");
      var salida = $(this).data("salida");
      var precio = $(this).data("precio");
      var stock = $(this).data("stock") + 1;

      carritoContenido.push({
        nombreProducto: nombre,
        codigoUnico: codigoUnico,
        id: id,
        img: img,
        entrada: entrada,
        salida: salida,
        precio: precio,
        cantidad: cantidad,
        stock: stock,
      });
      var detallesCarrito = JSON.stringify(carritoContenido, null, 2);

      // Llamar a la API para agregar al carrito
      $.ajax({
        url: "/api/productos/AgregarCarrito",
        type: "POST",
        dataType: "json",
        data: {
          DetallesCarrito: detallesCarrito,
          idUsuario: idUsuario,
        },
        success: function (response) {
          if (!response.error) {
            mostrarMensaje("exito", response.mensaje);

            // No se necesita mostrarProductos aquí, ya que no es necesario volver a cargar todos los productos
            // Limpiar carritoContenido después de agregar el producto
            carritoContenido = [];
          } else {
            mostrarMensaje("error", response.mensaje);
            console.error("Error al agregar al carrito:", response.mensaje);
          }
        },
        error: function (xhr, status, error) {
          mostrarMensaje(
            "error",
            "Error en la solicitud AJAX: " + xhr.responseText
          );
          console.error("Error en la solicitud AJAX:", error);
        },
      });
    } else {
      // Mostrar el modal de inicio de sesión
      $("#modal-iniciar-sesion").show();

      // Manejar clic en el botón "Iniciar sesión" del modal
      $("#btn-iniciar-sesion-modal").click(function () {
        // Redirigir a la página de inicio de sesión o realizar alguna acción para iniciar sesión
        window.location.href = "/vistas/html/login.html"; // Ejemplo de redirección a la página de inicio de sesión
      });
    }
  });

  // Cerrar el modal de inicio de sesión al hacer clic en la 'x'
  $(".cerrar").click(function () {
    $("#modal-iniciar-sesion").hide();
  });

  // Función para mostrar un mensaje en el modal
  function mostrarMensaje(tipo, mensaje) {
    var imagenSrc = "";
    var accion;

    $(".cerrar")
      .off("click")
      .on("click", function () {
        $("#modal-mensaje").hide();
      });

    if (tipo === "exito") {
      imagenSrc = "vistas/extras/img/exito.gif";
      accion = function () {
        $("#modal-mensaje").hide();
        setTimeout(function () {
          window.location.href = "/carrito"; // Redirige a la ruta /carrito
        }, 1000);
      };

      // Mostrar botones cuando hay éxito
      $("#btn-seguir-comprando").show();
      $("#btn-ir-carrito").show();
      $("#btn-aceptar-mensaje").hide();
    } else if (tipo === "error") {
      imagenSrc = "vistas/extras/img/fallar.gif";
      accion = function () {
        $("#modal-mensaje").hide();
        setTimeout(function () {
          window.location.reload();
        }, 1000);
      };

      // Ocultar botones cuando hay error
      $("#btn-seguir-comprando").hide();
      $("#btn-ir-carrito").hide();
    }

    $("#mensaje-imagen").attr("src", imagenSrc);
    $("#mensaje-texto").text(mensaje);
    $("#modal-mensaje").show();

    // Manejar el evento de clic para el botón "Aceptar"
    $("#btn-aceptar-mensaje").on("click", accion);

    // Manejar el evento de clic para el botón "Seguir comprando"
    $("#btn-seguir-comprando")
      .off("click")
      .on("click", function () {
        $("#modal-mensaje").hide();
      });

    // Manejar el evento de clic para el botón "Ir al carrito"
    $("#btn-ir-carrito")
      .off("click")
      .on("click", function () {
        window.location.href = "/carrito";
      });
  }
  function calcularMeses(precio) {
    // Eliminar comas del precio y convertir a número
    var precioNumerico = parseFloat(precio.replace(/,/g, ''));
    
    var mensualidades = precioNumerico / 12;
    
    // Redondear a dos decimales y convertir de nuevo a string
    var mensualidadesFormateadas = mensualidades.toFixed(2);
    
    console.log(mensualidadesFormateadas); // Mostrar el resultado formateado
    
    return mensualidadesFormateadas;
}


  function formatearNumero(numero) {
    return numero.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  function restarcantidad(cantidadDisponible, accion) {
    if (accion == "conservar") {
      return cantidadDisponible;
    }
    if (accion == "restar") {
      var cantidadRestada = cantidadDisponible - 1;
      return cantidadRestada;
    }
  }
  async function Pago(productosSeleccionados) {
    try {
      const res = await fetch("/api/checkout/pagoDirecto", {
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
}
