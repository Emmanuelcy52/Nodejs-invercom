$(document).ready(function () {
  var datos_formulario = [];
  var contador_entradas = 0;

  // Función para agregar una nueva entrada de Entrada y Salida con su respectivo precio
  function agregarNuevaEntrada() {
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
    nueva_entrada +=
      '<label for="peso_' + contador_entradas + '">Peso:</label>';
    nueva_entrada +=
      '<textarea class="form-control" id="peso_' +
      contador_entradas +
      '" name="peso[]" required></textarea>';
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

  // Llamar a la función para agregar una entrada al cargar la página
  agregarNuevaEntrada();

  // Función para agregar una nueva entrada cuando se hace clic en el botón
  $("#agregar_entrada_precio").click(function () {
    agregarNuevaEntrada();
    actualizarAutoNumeric();
    actualizarUnidades();
  });
  // Función para eliminar una entrada de Entrada/Salida y Precio
  $(document).on("click", ".eliminar_entrada", function () {
    var id = $(this).data("id");
    $("#entrada_" + id).remove();
    // Actualizar los IDs de los conjuntos restantes
    actualizarIDs();
  });

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
    // Obtener las imágenes seleccionadas
    var imagenes = [];
    $('input[type="file"]').each(function () {
      if (this.files && this.files[0]) {
        imagenes.push(this.files[0]);
      }
    });

    nombreProducto = $("#nombre_inversor").val();

    // Crear un nuevo objeto FormData
    var formData = new FormData();
    formData.append("accion", "registro");
    formData.append("nombre_producto", nombreProducto);

    // Agregar las imágenes al objeto FormData
    for (var i = 0; i < imagenes.length; i++) {
      formData.append("imagen[]", imagenes[i]);
    }

    // Agregar los datos de las entradas de Entrada/Salida y Precio al objeto FormData
    var informacion_tipo = [];
    $("#entradas_precios > div").each(function () {
      var ficha_tecnica = $(this)
        .find('textarea[name^="ficha_tecnica[]"]')
        .val();
      var clave = $(this).find('textarea[name^="clave[]"]').val();
      var datos_tecnicos = $(this)
        .find('textarea[name^="datos_tecnicos[]"]')
        .val();
      var cuerpo_inversor = $(this)
        .find('textarea[name^="cuerpo_inversor[]"]')
        .val();
      var dimensiones = $(this).find('textarea[name^="dimensiones[]"]').val();
      var peso = $(this).find('textarea[name^="peso[]"]').val();
      var entrada = $(this).find('input[name^="entrada[]"]').val();
      var salida = $(this).find('input[name^="salida[]"]').val();
      var precio = $(this).find('input[name^="precio[]"]').val();
      var cantidad = $(this).find('input[name^="cantidad[]"]').val();
      var id = $(this).find('input[type="hidden"]').val();

      var codigoUnico = generarCodigoUnico();

      informacion_tipo.push({
        ficha_Tecnica: ficha_tecnica,
        clave: clave,
        datos_tecnicos: datos_tecnicos,
        cuerpo_inversor: cuerpo_inversor,
        dimenciones: dimensiones,
        peso: peso,
        entrada: entrada,
        salida: salida,
        precio: precio,
        cantidad: cantidad,
        id: id,
        codigoUnico: codigoUnico,
      });
    });

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
    var detallesTipo = JSON.stringify(informacion_tipo, null, 2);
    formData.append("informacion_tipo", detallesTipo);

    // Enviar los datos al servidor a través de AJAX
    $.ajax({
      url: "/api/productos/Registar",
      type: "POST",
      data: formData,
      dataType: "json",
      processData: false,
      contentType: false,
      success: function (response) {
        mostrarMensaje("exito", response.mensaje);
      },
      error: function (xhr, status, error) {
        // Manejar errores de la solicitud AJAX
        mostrarMensaje(
          "error",
          "Error en la solicitud AJAX: " + xhr.responseText
        );
      },
    });
  }

  // Llamar a la función para guardar los datos del formulario cuando se envíe el formulario
  $("#enviarDatos").click(function () {
    guardarDatosFormulario(); // Llamar a la función para guardar los datos del formulario
  });
  function agregarUnidades() {
    // Agregar "VCD" después del número en el campo de entrada
    $('input[name^="entrada"]').each(function () {
      var valor = $(this).val();
      if (!isNaN(valor)) {
        $(this).val(valor + " VCD");
      }
    });

    // Agregar "VCA" después del número en el campo de salida
    $('input[name^="salida"]').each(function () {
      var valor = $(this).val();
      if (!isNaN(valor)) {
        $(this).val(valor + " VCA");
      }
    });
  }

  // Llamar a la función para agregar las unidades cuando se cargue la página
  agregarUnidades();

  // Esta función se llama cada vez que se agrega una nueva entrada para agregar automáticamente las unidades
  function actualizarUnidades() {
    // Esperar un breve momento para asegurarse de que los nuevos campos se hayan agregado completamente
    setTimeout(function () {
      agregarUnidades();
    }, 100);
  }

  function inicializarAutoNumeric() {
    // Seleccionar todos los campos de precio que aún no tienen autoNumeric aplicado
    $('input[name^="precio"]')
      .not('[data-autonumeric-applied="true"]')
      .each(function () {
        new AutoNumeric(this, {
          decimalCharacter: ".",
          digitGroupSeparator: ",",
          decimalPlaces: 2,
          minimumValue: "0",
        });
        // Marcar el campo como aplicado con autoNumeric
        $(this).attr("data-autonumeric-applied", "true");
      });
  }

  // Llamar a la función para inicializar autoNumeric cuando se carga la página
  inicializarAutoNumeric();

  // Esta función se llama cada vez que se agrega una nueva entrada para inicializar autoNumeric en el nuevo campo de precio
  function actualizarAutoNumeric() {
    // Esperar un breve momento para asegurarse de que los nuevos campos se hayan agregado completamente
    setTimeout(function () {
      inicializarAutoNumeric();
    }, 100);
  }

  // Función para eliminar espacios en blanco al final del valor cuando se pierde el foco del campo de entrada
  $('input[type="text"]').on("blur", function () {
    $(this).val($(this).val().trim());
  });

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
});

function updateFileName(inputId) {
  var input = document.getElementById(inputId);
  var fileName = input.files[0].name;
  var label = input.nextElementSibling;
  label.innerHTML = fileName;
}
