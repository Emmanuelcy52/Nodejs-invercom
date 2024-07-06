$(document).ready(function () {
  $("#productosTabla").on("mousemove", function (event) {
    var mouseX = event.clientX;
    var tableCenterX = $(this).offset().left + $(this).outerWidth() / 2;
    var displacement = mouseX - tableCenterX;

    // Ajusta la velocidad del desplazamiento según tu preferencia
    var adjustedDisplacement = displacement / 50;

    // Invierte el desplazamiento si el ratón está a la izquierda del centro de la tabla
    if (mouseX < tableCenterX) {
        adjustedDisplacement *= -1;
    }

    $(this).css("transform", "translateX(" + adjustedDisplacement + "px)");
});

  fetch("/api/productos/obtenerProductos")
  .then(response => response.json())
    .then(data => {
      if (!data.error) {
        const productosTbody = document.getElementById('productosTbody');
        productosTbody.innerHTML = ''; // Limpiar el tbody

        data.productos.forEach(producto => {
          // Parsear la información de tipo y las imágenes
          const informacionTipo = JSON.parse(producto.informacion_tipo);
          const imagenes = JSON.parse(producto.imagen_url);

          const filaProducto = document.createElement('tr');

          filaProducto.innerHTML = `
            <th scope="row" rowspan="${informacionTipo.length}">${producto.id}</th>
            <td rowspan="${informacionTipo.length}">${producto.nombreInversor}</td>
            <td>${informacionTipo[0].ficha_Tecnica}</td>
            <td>${informacionTipo[0].clave}</td>
            <td>${informacionTipo[0].datos_tecnicos}</td>
            <td>${informacionTipo[0].cuerpo_inversor}</td>
            <td>${informacionTipo[0].dimenciones}</td>
            <td>${informacionTipo[0].peso}</td>
            <td>${informacionTipo[0].entrada}</td>
            <td>${informacionTipo[0].salida}</td>
            <td>$${informacionTipo[0].precio}</td>
            <td>${informacionTipo[0].cantidad}</td>
            <td>${informacionTipo[0].codigoUnico}</td>
            <td rowspan="${informacionTipo.length}">
              ${imagenes.map(url => `<img src="${url}" alt="Imagen del producto" style="width: 50px; height: 50px;">`).join('')}
            </td>
            <td rowspan="${informacionTipo.length}">
                <a class="btn btn-primary" href="/EditarProducto?id=${producto.id}">Editar</a>
              <button class="btn btn-danger" onclick="eliminarProducto(${producto.id})">Eliminar</button>
            </td>
          `;

          productosTbody.appendChild(filaProducto);

          for (let i = 1; i < informacionTipo.length; i++) {
            const filaFichaTecnica = document.createElement('tr');

            filaFichaTecnica.innerHTML = `
              <td>${informacionTipo[i].ficha_Tecnica}</td>
              <td>${informacionTipo[i].clave}</td>
              <td>${informacionTipo[i].datos_tecnicos}</td>
              <td>${informacionTipo[i].cuerpo_inversor}</td>
              <td>${informacionTipo[i].dimenciones}</td>
              <td>${informacionTipo[i].peso}</td>
              <td>${informacionTipo[i].entrada}</td>
              <td>${informacionTipo[i].salida}</td>
              <td>$${informacionTipo[i].precio}</td>
              <td>${informacionTipo[i].cantidad}</td>
              <td>${informacionTipo[i].codigoUnico}</td>
            `;

            productosTbody.appendChild(filaFichaTecnica);
          }
        });
      } else {
        console.error(data.mensaje);
      }
    })
    .catch(error => console.error('Error:', error));
});

function eliminarProducto(id) {
  const confirmarEliminacion = confirm('¿Seguro que desea eliminar el producto?');

  if (confirmarEliminacion) {
    const url = '/api/productos/eliminarProducto';
    const data = {
      id: id
    };

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };

    fetch(url, options)
      .then(response => {
        if (!response.ok) {
          throw new Error('Hubo un problema al eliminar el producto.');
        }
        return response.json();
      })
      .then(response => {
        if (response.error) {
          mostrarMensaje('error', response.mensaje);
        } else {
          mostrarMensaje('exito', response.mensaje);
        }
      })
      .catch(error => {
        mostrarMensaje('error', "Error en la solicitud AJAX: " + error.message);
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