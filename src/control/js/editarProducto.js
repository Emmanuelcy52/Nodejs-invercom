// Llamar a la función para cargar los datos del producto si se está editando
var formData = new FormData();
var productoId 
$(document).ready(function () {
  var urlParams = new URLSearchParams(window.location.search);
  productoId = urlParams.get("id");

  if (productoId) {
    cargarDatosProducto(productoId);
  }

  // Función para agregar una nueva entrada cuando se hace clic en el botón
  $("#agregar_entrada_precio").click(function () {
    agregarEntradaVacia();
  });
  // Llamar a la función para guardar los datos del formulario cuando se envíe el formulario
  $("#enviarDatos").click(function () {
    guardarDatosFormulario(); // Llamar a la función para guardar los datos del formulario
  });

  $(document).on("click", ".eliminar_entrada", function () {
    var id = $(this).data("id");
    $("#entrada_" + id).remove();
    // Actualizar los IDs de los conjuntos restantes
    actualizarIDs();
  });
});
var contador_entradas = 0;
var datos_formulario = [];

function cargarDatosProducto(id) {
  $.ajax({
    url: "/api/productos/ObtenerPorId?id=" + id, // Endpoint para obtener los datos del producto por su ID
    type: "GET",
    dataType: "json",
    success: function (response) {
      if (!response.error) {
        console.log(response);
        var producto = response.producto;

        // Llenar los campos del formulario con los datos del producto
        $("#nombre_inversor").val(producto.nombreInversor);
        $("#producto_id").val(producto.id);

        // Limpiar las entradas existentes
        $("#entradas_precios").empty();
        $("#imagenes_existentes").empty();

        // Agregar las entradas con los datos del producto
        JSON.parse(producto.informacion_tipo).forEach(function (tipo, index) {
          agregarNuevaEntrada(tipo); // Agregar una nueva entrada
          // Llenar los campos de la entrada con los datos del tipo
          $("#entrada_" + (index + 1)).val(tipo.entrada);
          $("#salida_" + (index + 1)).val(tipo.salida);
          $("#precio_" + (index + 1)).val(tipo.precio);
          $("#cantidad_" + (index + 1)).val(tipo.cantidad);
          $("#ficha_tecnica_" + (index + 1)).val(tipo.ficha_Tecnica);
          $("#clave_" + (index + 1)).val(tipo.clave);
          $("#datos_tecnicos_" + (index + 1)).val(tipo.datos_tecnicos);
          $("#cuerpo_inversor_" + (index + 1)).val(tipo.cuerpo_inversor);
          $("#dimensiones_" + (index + 1)).val(tipo.dimenciones);
          $("#peso_" + (index + 1)).val(tipo.peso);
        });
        if (producto.imagen_url) {
          var imagenes = JSON.parse(producto.imagen_url);
          var totalImagenes = imagenes.length;
          JSON.parse(producto.imagen_url).forEach(function (imagen, index) {
            var imagenNueva = `<div class="col-md-6">
                <label for="imagen_${index}">Imagen ${index}:</label><br />
                <img src="${imagen}" alt="Imagen ${index}" class="img-thumbnail" width="150">
                <div class="input-group mb-3">
                  <div class="custom-file">
                    <input
                      type="file"
                      class="form-control-file custom-file-input"
                      id="imagen_${index}"
                      name="imagen[]"
                      accept="image/*"
                      required
                      onchange="updateFileName('imagen_${index}')"
                    />
                    <label class="custom-file-label" for="imagen_${index}"
                      >Seleccionar archivo</label
                    >
                  </div>
                </div>
              </div>`;
            $("#imagenes_existentes").append(imagenNueva);
          });
          // Agregar campos vacíos si hay menos de 3 imágenes
          for (var i = totalImagenes; i < 4; i++) {
            var imagenHtmlVacia = `
              <div class="col-md-6">
                  <label for="imagen_${i}">Imagen ${i}:</label><br />
                  <div class="input-group mb-3">
                    <div class="custom-file">
                      <input
                        type="file"
                        class="form-control-file custom-file-input"
                        id="imagen_${i}"
                        name="imagen[]"
                        accept="image/*"
                        required
                        onchange="updateFileName('imagen_${i}')"
                      />
                      <label class="custom-file-label" for="imagen_${i}"
                        >Seleccionar archivo</label
                      >
                    </div>
                  </div>
              </div>
            `;
            $("#imagenes_existentes").append(imagenHtmlVacia);
          }
        }
      } else {
        mostrarMensaje("error", response.mensaje);
      }
    },
    error: function (xhr, status, error) {
      mostrarMensaje("error", "Error al cargar los datos del producto.");
    },
  });
}

// Función para agregar una nueva entrada de Entrada y Salida con su respectivo precio
function agregarNuevaEntrada(tipo) {
  contador_entradas++;

  var nueva_entrada =
    '<div id="entrada_' + contador_entradas + '" class="mb-3">';
  nueva_entrada += '<div class="row">';
  nueva_entrada += '<div class="col-md-12">';
  nueva_entrada += '<div class="form-group">';
  nueva_entrada +=
    '<label for="entrada_' + contador_entradas + '">Entrada:</label>';
  nueva_entrada +=
    '<input type="text" class="form-control" id="entrada_' +
    contador_entradas +
    '" name="entrada[]" value="' +
    tipo.entrada +
    '" required>';
  nueva_entrada += "</div>";
  nueva_entrada += '<div class="form-group">';
  nueva_entrada +=
    '<label for="salida_' + contador_entradas + '">Salida:</label>';
  nueva_entrada +=
    '<input type="text" class="form-control" id="salida_' +
    contador_entradas +
    '" name="salida[]" value="' +
    tipo.salida +
    '" required>';
  nueva_entrada += "</div>";
  nueva_entrada += '<div class="form-group">';
  nueva_entrada +=
    '<label for="precio_' + contador_entradas + '">Precio:</label>';
  nueva_entrada +=
    '<input type="text" class="form-control" id="precio_' +
    contador_entradas +
    '" name="precio[]" value="' +
    tipo.precio +
    '" required>';
  nueva_entrada +=
    '<label for="cantidad_' + contador_entradas + '">cantidad:</label>';
  nueva_entrada +=
    '<input type="number" class="form-control" id="cantidad_' +
    contador_entradas +
    '" name="cantidad[]" value="' +
    tipo.cantidad +
    '" required>';
  nueva_entrada += "</div>";
  nueva_entrada += "</div>";
  nueva_entrada += "</div>";
  nueva_entrada += '<div class="row">';
  nueva_entrada += '<div class="col-md-6">';
  nueva_entrada += '<div class="form-group">';
  nueva_entrada +=
    '<label for="ficha_tecnica_' +
    contador_entradas +
    '">Ficha Técnica:</label>';
  nueva_entrada +=
    '<textarea class="form-control" id="ficha_tecnica_' +
    contador_entradas +
    '" name="ficha_tecnica[]" required>' +
    tipo.ficha_Tecnica +
    "</textarea>";
  nueva_entrada += "</div>";
  nueva_entrada += '<div class="form-group">';
  nueva_entrada +=
    '<label for="clave_' + contador_entradas + '">Clave:</label>';
  nueva_entrada +=
    '<textarea class="form-control" id="clave_' +
    contador_entradas +
    '" name="clave[]" required>' +
    tipo.clave +
    "</textarea>";
  nueva_entrada += "</div>";
  nueva_entrada += '<div class="form-group">';
  nueva_entrada +=
    '<label for="datos_tecnicos_' +
    contador_entradas +
    '">Datos Técnicos:</label>';
  nueva_entrada +=
    '<textarea class="form-control" id="datos_tecnicos_' +
    contador_entradas +
    '" name="datos_tecnicos[]" required>' +
    tipo.datos_tecnicos +
    "</textarea>";
  nueva_entrada += "</div>";
  nueva_entrada += "</div>";
  nueva_entrada += '<div class="col-md-6">';
  nueva_entrada += '<div class="form-group">';
  nueva_entrada +=
    '<label for="cuerpo_inversor_' +
    contador_entradas +
    '">Cuerpo del Inversor:</label>';
  nueva_entrada +=
    '<textarea class="form-control" id="cuerpo_inversor_' +
    contador_entradas +
    '" name="cuerpo_inversor[]" required>' +
    tipo.cuerpo_inversor +
    "</textarea>";
  nueva_entrada += "</div>";
  nueva_entrada += '<div class="form-group">';
  nueva_entrada +=
    '<label for="dimensiones_' + contador_entradas + '">Dimensiones:</label>';
  nueva_entrada +=
    '<textarea class="form-control" id="dimensiones_' +
    contador_entradas +
    '" name="dimensiones[]" required>' +
    tipo.dimenciones +
    "</textarea>";
  nueva_entrada += "</div>";
  nueva_entrada += '<div class="form-group">';
  nueva_entrada += '<label for="peso_' + contador_entradas + '">Peso:</label>';
  nueva_entrada +=
    '<textarea class="form-control" id="peso_' +
    contador_entradas +
    '" name="peso[]" required>' +
    tipo.peso +
    "</textarea>";
  nueva_entrada += "</div>";
  nueva_entrada +=
    '<label for="codigounico_' + contador_entradas + '">codigoUnico:</label>';
  nueva_entrada +=
    '<textarea class="form-control" id="codigounico_' +
    contador_entradas +
    '" name="codigo_unico[]" required readonly>' +
    tipo.codigoUnico +
    "</textarea>";
  nueva_entrada += "</div>";
  nueva_entrada +=
    '<input type="hidden" name="id[]" value="' + contador_entradas + '">';
  nueva_entrada += "</div>";
  nueva_entrada += "</div>";
  // Agregar el botón de eliminar solo si el contador de entradas es mayor a 1
  if (contador_entradas > 0) {
    nueva_entrada +=
      '<button type="button" class="btn btn-danger eliminar_entrada" data-id="' +
      contador_entradas +
      '">Eliminar</button>';
  }
  nueva_entrada += "</div>";

  $("#entradas_precios").append(nueva_entrada);
}

// Función para agregar una nueva entrada de Entrada y Salida con su respectivo precio
function agregarEntradaVacia() {
  contador_entradas++;
  var codigoUnico = generarCodigoUnico();

  var nueva_entrada =
    '<div id="entrada_' + contador_entradas + '" class="mb-3">';
  nueva_entrada += '<div class="row">';
  nueva_entrada += '<div class="col-md-12">';
  nueva_entrada += '<div class="form-group">';
  nueva_entrada +=
    '<label for="entrada_' + contador_entradas + '">Entrada:</label>';
  nueva_entrada +=
    '<input type="text" class="form-control" id="entrada_' +
    contador_entradas +
    '" name="entrada[]" required>';
  nueva_entrada += "</div>";
  nueva_entrada += '<div class="form-group">';
  nueva_entrada +=
    '<label for="salida_' + contador_entradas + '">Salida:</label>';
  nueva_entrada +=
    '<input type="text" class="form-control" id="salida_' +
    contador_entradas +
    '" name="salida[]" required>';
  nueva_entrada += "</div>";
  nueva_entrada += '<div class="form-group">';
  nueva_entrada +=
    '<label for="precio_' + contador_entradas + '">Precio:</label>';
  nueva_entrada +=
    '<input type="text" class="form-control" id="precio_' +
    contador_entradas +
    '" name="precio[]" required>';
  nueva_entrada +=
    '<label for="cantidad_' + contador_entradas + '">cantidad:</label>';
  nueva_entrada +=
    '<input type="number" class="form-control" id="cantidad_' +
    contador_entradas +
    '" name="cantidad[]" required>';
  nueva_entrada += "</div>";
  nueva_entrada += "</div>";
  nueva_entrada += "</div>";
  nueva_entrada += '<div class="row">';
  nueva_entrada += '<div class="col-md-6">';
  nueva_entrada += '<div class="form-group">';
  nueva_entrada +=
    '<label for="ficha_tecnica_' +
    contador_entradas +
    '">Ficha Técnica:</label>';
  nueva_entrada +=
    '<textarea class="form-control" id="ficha_tecnica_' +
    contador_entradas +
    '" name="ficha_tecnica[]" required></textarea>';
  nueva_entrada += "</div>";
  nueva_entrada += '<div class="form-group">';
  nueva_entrada +=
    '<label for="clave_' + contador_entradas + '">Clave:</label>';
  nueva_entrada +=
    '<textarea class="form-control" id="clave_' +
    contador_entradas +
    '" name="clave[]" required></textarea>';
  nueva_entrada += "</div>";
  nueva_entrada += '<div class="form-group">';
  nueva_entrada +=
    '<label for="datos_tecnicos_' +
    contador_entradas +
    '">Datos Técnicos:</label>';
  nueva_entrada +=
    '<textarea class="form-control" id="datos_tecnicos_' +
    contador_entradas +
    '" name="datos_tecnicos[]" required></textarea>';
  nueva_entrada += "</div>";
  nueva_entrada += "</div>";
  nueva_entrada += '<div class="col-md-6">';
  nueva_entrada += '<div class="form-group">';
  nueva_entrada +=
    '<label for="cuerpo_inversor_' +
    contador_entradas +
    '">Cuerpo del Inversor:</label>';
  nueva_entrada +=
    '<textarea class="form-control" id="cuerpo_inversor_' +
    contador_entradas +
    '" name="cuerpo_inversor[]" required></textarea>';
  nueva_entrada += "</div>";
  nueva_entrada += '<div class="form-group">';
  nueva_entrada +=
    '<label for="dimensiones_' + contador_entradas + '">Dimensiones:</label>';
  nueva_entrada +=
    '<textarea class="form-control" id="dimensiones_' +
    contador_entradas +
    '" name="dimensiones[]" required></textarea>';
  nueva_entrada += "</div>";
  nueva_entrada += '<div class="form-group">';
  nueva_entrada += '<label for="peso_' + contador_entradas + '">Peso:</label>';
  nueva_entrada +=
    '<textarea class="form-control" id="peso_' +
    contador_entradas +
    '" name="peso[]" required></textarea>';
  nueva_entrada += "</div>";
  nueva_entrada += '<div class="form-group">';
  nueva_entrada +=
    '<label for="codigounico_' + contador_entradas + '">codigoUnico:</label>';
  nueva_entrada +=
    '<textarea class="form-control" id="codigounico_' +
    contador_entradas +
    '" name="codigo_unico[]" required readonly>' +
    codigoUnico +
    "</textarea>";
  nueva_entrada += "</div>";
  nueva_entrada +=
    '<input type="hidden" name="id[]" value="' + contador_entradas + '">';
  nueva_entrada += "</div>";
  nueva_entrada += "</div>";
  // Agregar el botón de eliminar solo si el contador de entradas es mayor a 1
  if (contador_entradas > 1) {
    nueva_entrada +=
      '<button type="button" class="btn btn-danger eliminar_entrada" data-id="' +
      contador_entradas +
      '">Eliminar</button>';
  }
  nueva_entrada += "</div>";

  $("#entradas_precios").append(nueva_entrada);
}

function actualizarIDs() {
  $("#entradas_precios > div").each(function (index) {
    var nuevo_id = index + 2; // Comenzamos desde 1
    var id_actual = $(this).attr("id");

    if (id_actual !== "entrada_" + nuevo_id) {
      $(this).attr("id", "entrada_" + nuevo_id);
      $(this)
        .find('label[for^="entrada_"]')
        .attr("for", "entrada_" + nuevo_id);
      $(this)
        .find('input[name^="entrada["]')
        .attr("id", "entrada_" + nuevo_id)
        .attr("name", "entrada[]");
      $(this)
        .find('label[for^="salida_"]')
        .attr("for", "salida_" + nuevo_id);
      $(this)
        .find('input[name^="salida["]')
        .attr("id", "salida_" + nuevo_id)
        .attr("name", "salida[]");
      $(this)
        .find('label[for^="precio_"]')
        .attr("for", "precio_" + nuevo_id);
      $(this)
        .find('input[name^="precio["]')
        .attr("id", "precio_" + nuevo_id)
        .attr("name", "precio[]");
      $(this)
        .find('label[for^="cantidad_"]')
        .attr("for", "cantidad_" + nuevo_id);
      $(this)
        .find('input[name^="cantidad["]')
        .attr("id", "cantidad_" + nuevo_id)
        .attr("name", "cantidad[]");
      $(this)
        .find('label[for^="ficha_tecnica_"]')
        .attr("for", "ficha_tecnica_" + nuevo_id);
      $(this)
        .find('textarea[name^="ficha_tecnica["]')
        .attr("id", "ficha_tecnica_" + nuevo_id)
        .attr("name", "ficha_tecnica[]");
      $(this)
        .find('label[for^="clave_"]')
        .attr("for", "clave_" + nuevo_id);
      $(this)
        .find('textarea[name^="clave["]')
        .attr("id", "clave_" + nuevo_id)
        .attr("name", "clave[]");
      $(this)
        .find('label[for^="datos_tecnicos_"]')
        .attr("for", "datos_tecnicos_" + nuevo_id);
      $(this)
        .find('textarea[name^="datos_tecnicos["]')
        .attr("id", "datos_tecnicos_" + nuevo_id)
        .attr("name", "datos_tecnicos[]");
      $(this)
        .find('label[for^="cuerpo_inversor_"]')
        .attr("for", "cuerpo_inversor_" + nuevo_id);
      $(this)
        .find('textarea[name^="cuerpo_inversor["]')
        .attr("id", "cuerpo_inversor_" + nuevo_id)
        .attr("name", "cuerpo_inversor[]");
      $(this)
        .find('label[for^="dimensiones_"]')
        .attr("for", "dimensiones_" + nuevo_id);
      $(this)
        .find('textarea[name^="dimensiones["]')
        .attr("id", "dimensiones_" + nuevo_id)
        .attr("name", "dimensiones[]");
      $(this)
        .find('label[for^="peso_"]')
        .attr("for", "peso_" + nuevo_id);
      $(this)
        .find('textarea[name^="peso["]')
        .attr("id", "peso_" + nuevo_id)
        .attr("name", "peso[]");
      $(this).find('input[type="hidden"]').val(nuevo_id);
      $(this).find(".eliminar_entrada").data("id", nuevo_id);
    }
  });
}

function guardarDatosFormulario() {
  var formData = new FormData();
  var formularioValido = true; // Variable para verificar la validez del formulario
  var inputNoModificadoIndices = []; // Arreglo para almacenar los índices de los inputs no modificados

  // Obtener las imágenes seleccionadas
  var imagenes = [];
  $('input[type="file"]').each(function (index) {
    if (this.files && this.files[0]) {
      imagenes.push(this.files[0]);
    } else {
      // Si no hay archivos seleccionados, agregar el índice al arreglo de inputs no modificados
      inputNoModificadoIndices.push(index);
    }
  });

  console.log(inputNoModificadoIndices);

  // Agregar el nombre del producto al objeto FormData
  var nombreProducto = $("#nombre_inversor").val();
  formData.append("nombre_producto", nombreProducto);
  formData.append("idProducto",productoId);

  // Agregar las imágenes al objeto FormData
  for (var i = 0; i < imagenes.length; i++) {
    formData.append("imagen[]", imagenes[i]);
  }

  // Recolectar entradas de precios
  var informacion_tipo = [];
  $("#entradas_precios > div").each(function () {
    var ficha_tecnica = $(this).find('textarea[name^="ficha_tecnica[]"]').val();
    var clave = $(this).find('textarea[name^="clave[]"]').val();
    var datos_tecnicos = $(this).find('textarea[name^="datos_tecnicos[]"]').val();
    var cuerpo_inversor = $(this).find('textarea[name^="cuerpo_inversor[]"]').val();
    var dimensiones = $(this).find('textarea[name^="dimensiones[]"]').val();
    var peso = $(this).find('textarea[name^="peso[]"]').val();
    var entrada = $(this).find('input[name^="entrada[]"]').val();
    var salida = $(this).find('input[name^="salida[]"]').val();
    var precio = $(this).find('input[name^="precio[]"]').val();
    var cantidad = $(this).find('input[name^="cantidad[]"]').val();
    var codigoUnico = $(this).find('textarea[name^="codigo_unico[]"]').val();

    // Verificar si algún campo está vacío
    if (
      ficha_tecnica == "" ||
      clave == "" ||
      datos_tecnicos == "" ||
      cuerpo_inversor == "" ||
      dimensiones == "" ||
      peso == "" ||
      entrada == "" ||
      salida == "" ||
      precio == "" ||
      cantidad == "" ||
      codigoUnico == ""
    ) {
      formularioValido = false;
      alert("Por favor, complete todos los campos antes de enviar el formulario.");
      return false; // Salir del each loop
    }

    informacion_tipo.push({
      ficha_Tecnica: ficha_tecnica,
      clave: clave,
      datos_tecnicos: datos_tecnicos,
      cuerpo_inversor: cuerpo_inversor,
      dimensiones: dimensiones,
      peso: peso,
      entrada: entrada,
      salida: salida,
      precio: precio,
      cantidad: cantidad,
      codigoUnico: codigoUnico || generarCodigoUnico(), // Usar generarCodigoUnico si no hay código único
    });
  });

  if (formularioValido) {
    var detallesTipo = JSON.stringify(informacion_tipo, null, 2);
    formData.append("informacion_tipo", detallesTipo);

    // Agregar los índices de los inputs no modificados al objeto FormData
    formData.append("inputs_no_modificados", JSON.stringify(inputNoModificadoIndices));

    // Debug: Mostrar las entradas de FormData
    for (var pair of formData.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }

    // Envío de datos vía AJAX
    $.ajax({
      url: "/api/productos/Editar", // Endpoint para editar el producto
      type: "POST",
      data: formData,
      dataType: "json",
      processData: false,
      contentType: false,
      success: function (response) {
        if (!response.error) {
          mostrarMensaje("exito", response.mensaje);
        } else {
          mostrarMensaje("error", response.mensaje);
        }
      },
      error: function (xhr, status, error) {
        mostrarMensaje("error", "Error en la solicitud AJAX: " + xhr.responseText);
      },
    });
  }
}


function generarCodigoUnico() {
  var codigoUnico = "";
  var caracteres =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < 5; i++) {
    codigoUnico += caracteres.charAt(
      Math.floor(Math.random() * caracteres.length)
    );
  }
  return codigoUnico;
}

function updateFileName(inputId) {
  var input = document.getElementById(inputId);
  var fileName = input.files[0].name;
  var label = input.nextElementSibling;
  label.innerHTML = fileName;
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
