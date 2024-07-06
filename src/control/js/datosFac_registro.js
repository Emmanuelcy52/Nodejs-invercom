$(document).ready(function () {
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
  });
  
  function Registar() {
    const fullname = document.getElementById('fullname').value;
    const email = document.getElementById('email').value;
    const address = document.getElementById('address').value;
    const identificacion = document.getElementById('tax-id').value;
    const telefono = document.getElementById('phone').value;
  
    // Validar que todos los campos estén llenos
    if (!fullname || !email || !address || !identificacion || !telefono) {
      mostrarMensaje('error', 'Por favor, complete todos los campos.');
      return; // Detener la ejecución si falta algún campo
    }
  
    // Validar formato de teléfono
    if (!validarTelefono(telefono)) {
      mostrarMensaje('error', 'El teléfono debe contener exactamente 10 dígitos numéricos.');
      return; // Detener la ejecución si el teléfono no cumple con el formato
    }
  
    // Validar formato de correo electrónico
    if (!validarCorreo(email)) {
      mostrarMensaje('error', 'El correo electrónico ingresado no tiene un formato válido.');
      return; // Detener la ejecución si el correo electrónico no cumple con el formato
    }
  
    const data = {
      fullname: fullname,
      email: email,
      address: address,
      telefono: telefono,
      identificacion: identificacion
    };
  
    fetch('/api/Factura/RegistarDatos', {
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
          mostrarMensaje('exito', data.mensaje);
        }
      })
      .catch(error => {
        mostrarMensaje('error', 'Error en la solicitud AJAX: ' + error.message);
      });
  }
  
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
  