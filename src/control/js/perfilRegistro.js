document.addEventListener("DOMContentLoaded", function () {
    verificarSesion();
    // Función para validar el teléfono en tiempo real
    $('#telefono').on('input', function () {
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
    $('#correo').on('input', function () {
        const correo = this.value.trim();
        const isValid = validarCorreo(correo);

        // Establecer estilo visual según la validación
        if (!isValid) {
            $(this).addClass('is-invalid');
        } else {
            $(this).removeClass('is-invalid');
        }
    });
    $('#nombre_real').on('blur', function () {
        // Obtener el valor actual del campo
        let nombreReal = $(this).val().trim();
    
        // Convertir la primera letra de cada palabra a mayúscula
        nombreReal = nombreReal.toLowerCase().replace(/(?:^|\s)\w/g, function (char) {
            return char.toUpperCase();
        });
    
        // Eliminar espacios adicionales después de un espacio
        nombreReal = nombreReal.replace(/\s\s+/g, ' ');
    
        // Asignar el valor transformado de vuelta al campo
        $(this).val(nombreReal);
    
        // Validar el nombre real después de transformarlo
        const isValid = validarNombreReal(nombreReal);
    
        // Establecer estilo visual según la validación
        if (!isValid) {
            $(this).addClass('is-invalid');
        } else {
            $(this).removeClass('is-invalid');
        }
    });    
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

            } else {
                // Habilitar botones de pago y carrito
                idUsuario = data.idUsuario;
                obtenerDatos(idUsuario)

            }
        })
        .catch((error) => {
        });
}

function obtenerDatos(idUser) {
    const data = {
        idusuario: idUser
    };
    // Realizar solicitud para obtener datos del usuario
    fetch('/api/user/obtenerDatos', {
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
            // Llenar los campos del formulario con los datos obtenidos
            document.getElementById('nombre_real').value = data.usuario.nombre_real || '';
            document.getElementById('correo').value = data.usuario.correo || '';
            document.getElementById('nombre_usuario').value = data.usuario.nombre_usuario || '';
        })
        .catch(error => {
            mostrarMensaje('error', "Error al obtener datos del usuario: " + error.message);
        });
}

function Registar() {
    const fullname = document.getElementById('nombre_real').value;
    const email = document.getElementById('correo').value;
    const username = document.getElementById('nombre_usuario').value;
    const telefono = document.getElementById('telefono').value;
    const direccion = document.getElementById('direccion').value;
    const identificacion = document.getElementById('identificacion').value;

    // Validar que todos los campos estén llenos
    if (!fullname || !email || !direccion || !identificacion || !telefono || !username) {
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
    if (!validarNombreReal(fullname)) {
        mostrarMensaje('error', 'El nombre completo debe tener el formato "Nombre Apellido Apellido".');
        return; // Detener la ejecución si el nombre completo no cumple con el formato
    }

    const data = {
        idusuario: idUsuario,
        fullname: fullname,
        email: email,
        username: username,
        telefono: telefono,
        direccion: direccion,
        identificacion: identificacion
    };
    
    console.log(data);
    
    $.ajax({
        url: '/api/user/llenarperfil',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(response) {
            if (response.error) {
                mostrarMensaje('error', response.mensaje);
            } else {
                mostrarMensaje('exito', response.mensaje);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            mostrarMensaje('error', 'Error en la solicitud AJAX: ' + errorThrown);
        }
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
function validarNombreReal(nombreReal) {
    // Expresión regular para verificar que el nombre completo tenga el formato "Nombre Apellido Apellido"
    const nombreRealRegex = /^[a-zA-Z]+(\s[a-zA-Z]+){2,}$/;
    return nombreRealRegex.test(nombreReal);
}

// Función para mostrar un mensaje en el modal
function mostrarMensaje(tipo, mensaje) {
    var imagenSrc = '';
    var accion;
    $('.cerrar').click(function () {
        $('#modal-mensaje').hide();
    });

    if (tipo === 'exito') {
        imagenSrc = '../../vistas/extras/img/exito.gif';
        accion = function () {
            $('#modal-mensaje').hide();
            setTimeout(function () {
                history.replaceState(null, '', '/'); // Reemplaza la URL actual en el historial
                window.location.reload();
            }, 1000);
        };
    } else if (tipo === 'error') {
        imagenSrc = '../../vistas/extras/img/fallar.gif';
        accion = function () {
            $('#modal-mensaje').hide();
            setTimeout(function () {
            }, 1000);
        };
    }
    $('#mensaje-imagen').attr('src', imagenSrc);
    $('#mensaje-texto').text(mensaje);
    $('#modal-mensaje').show();

    $('#btn-aceptar-mensaje').click(accion);

}