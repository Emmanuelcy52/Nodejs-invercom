$(document).ready(function () {
    // Obtener el parámetro 'id' de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const facturaId = urlParams.get("id");
    const facturaIdNumero = parseInt(facturaId);

    // Función para validar el teléfono en tiempo real
    $('#phone').on('input', function () {
      let telefono = this.value.trim();
      
      // Truncar a 10 caracteres si se supera la longitud máxima
      if (telefono.length > 10) {
        telefono = telefono.slice(0, 10);
        this.value = telefono;
      }
      
      const isValid = validarTelefono(telefono);
      
      // Establecer estilo visual según la validación
      if (telefono.length !== 10 || !isValid) {
        $(this).addClass('is-invalid');
      } else {
        $(this).removeClass('is-invalid');
      }
    });
  
    // Función para validar el correo en tiempo real
    $('#email').on('input', function () {
      const correo = this.value.trim();
      const isValid = validarCorreo(correo);
  
      // Establecer estilo visual según la validación
      if (!isValid) {
        $(this).addClass('is-invalid');
      } else {
        $(this).removeClass('is-invalid');
      }
    });
  
    // Obtener datos para prellenar el formulario de edición
    fetch("/api/Factura/obtenerDatos")
      .then((response) => response.json())
      .then((data) => {
        if (!data.error && data.datosFactura.length > 0) {
          const factura = data.datosFactura.find(item => item.id === facturaIdNumero); // Buscar la factura por su ID
          console.log(factura);

          if (factura) {
            // Preencher los campos del formulario con los datos actuales
            $('#fullname').val(factura.nombre);
            $('#email').val(factura.correo);
            $('#address').val(factura.Dirección);
            $('#tax-id').val(factura.identificacion);
            $('#phone').val(factura.telefono);
          } else {
            console.error('No se encontraron datos para editar.');
          }
        } else {
          console.error('No se encontraron datos para editar.');
        }
      })
      .catch((error) => console.error('Error al obtener datos:', error));
  
    // Manejar el envío del formulario de edición
    $('#editForm').submit(function (event) {
      event.preventDefault();
  
      const fullname = $('#fullname').val();
      const email = $('#email').val();
      const address = $('#address').val();
      const identificacion = $('#tax-id').val();
      const telefono = $('#phone').val();
  
      // Validar que todos los campos estén llenos
      if (!fullname || !email || !address || !identificacion || !telefono) {
        mostrarMensaje('error', 'Por favor, complete todos los campos.');
        return;
      }
  
      // Validar formato de teléfono
      if (!validarTelefono(telefono)) {
        mostrarMensaje('error', 'El teléfono debe contener exactamente 10 dígitos numéricos.');
        return;
      }
  
      // Validar formato de correo electrónico
      if (!validarCorreo(email)) {
        mostrarMensaje('error', 'El correo electrónico ingresado no tiene un formato válido.');
        return;
      }
  
      const data = {
        id: facturaIdNumero,
        fullname: fullname,
        email: email,
        address: address,
        telefono: telefono,
        identificacion: identificacion
      };
  
      // Realizar la solicitud para actualizar los datos
      fetch('/api/Factura/ActualizarDatos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('La solicitud no pudo ser completada');
          }
          return response.json();
        })
        .then(data => {
          if (data.error) {
            mostrarMensaje('error', data.mensaje);
          } else {
            mostrarMensaje('exito', 'Los cambios han sido guardados correctamente.');
          }
        })
        .catch(error => {
          mostrarMensaje('error', 'Error en la solicitud AJAX: ' + error.message);
        });
    });
  });
  
  function validarTelefono(telefono) {
    // Expresión regular para verificar que el teléfono tenga exactamente 10 dígitos numéricos
    const telefonoRegex = /^\d{10}$/;
    return telefonoRegex.test(telefono);
  }
  
  function validarCorreo(correo) {
    // Expresión regular para verificar que el correo tenga la estructura adecuada
    const correoRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return correoRegex.test(correo);
  }
  
  function mostrarMensaje(tipo, mensaje) {
    var imagenSrc = '';
    var accion;
    $('.cerrar').click(function () {
      $('#modal-mensaje').hide();
    });
  
    if (tipo === 'exito') {
      imagenSrc = '../../../../vistas/extras/img/exito.gif';
      accion = function () {
        $('#modal-mensaje').hide();
        setTimeout(function () {
          history.replaceState(null, '', '/Factura'); // Reemplaza la URL actual en el historial
          window.location.reload();
        }, 1000);
      };
    } else if (tipo === 'error') {
      imagenSrc = '../../../../vistas/extras/img/fallar.gif';
      accion = function () {
        $('#modal-mensaje').hide();
        setTimeout(function () {
          window.location.reload();
        }, 1000);
      };
    }
    $('#mensaje-imagen').attr('src', imagenSrc);
    $('#mensaje-texto').text(mensaje);
    $('#modal-mensaje').show();
  
    $('#btn-aceptar-mensaje').click(accion);
  }
