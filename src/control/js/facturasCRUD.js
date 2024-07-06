$(document).ready(function () {
  fetch("/api/Factura/obtenerDatos")
    .then((response) => response.json())
    .then((data) => {
      const FacturaTbody = document.getElementById("FacturaTbody");
      FacturaTbody.innerHTML = ""; // Limpiar el tbody

      if (!data.error) {
        if (!data.datosFactura || data.datosFactura.length === 0) {
          var btnGenerar = document.getElementById("btn-generar");
        if (btnGenerar) {
          btnGenerar.style.display = "inline-block";
        }
        } else {
          var btnGenerar = document.getElementById("btn-generar");
          if (btnGenerar) {
            btnGenerar.style.display = "none";
          }
          data.datosFactura.forEach((datosFactura) => {
            // Parsear la fecha y hora
            const fechaHora = new Date(datosFactura.fecha_creacion);
            const fecha = fechaHora.toLocaleDateString("es-MX");
            const hora = fechaHora.toLocaleTimeString("en-US", {
              hour12: true,
            });
            // Parsear la información de tipo y las imágenes

            const filaDatos = document.createElement("tr");

            filaDatos.innerHTML = `
              <td>${datosFactura.nombre}</td>
              <td>${datosFactura.Dirección}</td>
              <td>${datosFactura.identificacion}</td>
              <td>${datosFactura.telefono}</td>
              <td>${datosFactura.correo}</td>
              <td>${fecha} ${hora}</td>
              <td">
                  <a class="btn btn-primary" href="/vistas/html/administrador/facturas/editarDatosfact.html?id=${datosFactura.id}">Editar</a>
                <button class="btn btn-danger" onclick="eliminarDatos(${datosFactura.id})">Eliminar</button>
              </td>
            `;

            FacturaTbody.appendChild(filaDatos);
          });
        }
      } else {
        console.error(data.mensaje);
      }
    })
    .catch((error) => console.error("Error:", error));
});

function eliminarDatos(id) {
  const confirmarEliminacion = confirm("¿Seguro que desea eliminar el producto?");

  if (confirmarEliminacion) {
    // URL a la que enviar la solicitud POST
    const url = "/api/Factura/EliminarDatos";

    // Objeto con los datos que se enviarán en la solicitud
    const data = {
      id: id,
    };

    // Opciones de la solicitud Fetch
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Indicamos que estamos enviando datos en formato JSON
      },
      body: JSON.stringify(data), // Convertimos el objeto 'data' a formato JSON
    };

    // Realizamos la solicitud Fetch
    fetch(url, options)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Hubo un problema al eliminar el producto.");
        }
        return response.json(); // Devolvemos los datos de la respuesta en formato JSON
      })
      .then((data) => {
        if (data.error) {
          mostrarMensaje("error", data.mensaje);
        } else {
          mostrarMensaje("exito", data.mensaje);
        }
      })
      .catch((error) => {
        mostrarMensaje("error", "Error en la solicitud AJAX: " + error.message);
      });
  }
}

function mostrarMensaje(tipo, mensaje) {
  var imagenSrc = "";
  var accion;
  $(".cerrar").click(function () {
    $("#modal-mensaje").hide();
  });

  if (tipo === "exito") {
    imagenSrc = "../../../vistas/extras/img/exito.gif";
    accion = function () {
      $("#modal-mensaje").hide();
      setTimeout(function () {
        window.location.reload();
      }, 1000);
    };
  } else if (tipo === "error") {
    imagenSrc = "../../../vistas/extras/img/fallar.gif";
    accion = function () {
      $("#modal-mensaje").hide();
      setTimeout(function () {
        window.location.reload();
      }, 1000);
    };
  }
  $("#mensaje-imagen").attr("src", imagenSrc);
  $("#mensaje-texto").text(mensaje);
  $("#modal-mensaje").show();

  $("#btn-aceptar-mensaje").click(accion);
}
