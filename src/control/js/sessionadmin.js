document.addEventListener("DOMContentLoaded", function () {
    verificarSesion();
    
});

function verificarSesion() {
    fetch("/api/admin/verificarSession", {
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
            usuarioLogiado("error", data.mensaje);
        } else if (data.datos) {
            mostrarModalNuevoAdmin(data.datos);
        } else {
        }
    })
    .catch((error) => {
        usuarioLogiado("error", "Error en la solicitud AJAX: " + error.message);
    });
}

function mostrarModalNuevoAdmin(datosAdmin) {
    var imagenSrc = "/vistas/extras/img/exito.gif";
    var mensaje = "Se ha creado un perfil de Administrador para iniciar sesión. tus datos para iniciar sesion son: nombreUsuario: "+datosAdmin.username + " , tu contaseña es: "+  datosAdmin.password;
    var accion = function () {
        $("#modal-mensaje-index").hide();
        // Redireccionar al inicio de sesión
        window.location.href = "/loginAdmin";
    };

    $("#mensaje-imagen-index").attr("src", imagenSrc);
    $("#mensaje-texto-index").text(mensaje);
    $("#modal-mensaje-index").show();

    // Mostrar botón para iniciar sesión
    $("#btn-aceptar-mensaje-index").text("Iniciar Sesión");
    $("#btn-aceptar-mensaje-index").click(accion);
    $("#btn-cancelar-mensaje-index").hide(); // Ocultar botón de cancelar
}

function usuarioLogiado(tipo, mensaje) {
    var imagenSrc = "";
    var accion;

    $(".cerrar").click(function () {
        $("#modal-mensaje-index").hide();
    });

    if (tipo === "exito") {
        imagenSrc = "/vistas/extras/img/exito.gif";
        accion = function () {
            $("#modal-mensaje-index").hide();
            // Aquí puedes realizar alguna acción adicional si es necesario
        };
    } else if (tipo === "error") {
        imagenSrc = "/vistas/extras/img/fallar.gif";
        accion = function () {
            $("#modal-mensaje-index").hide();
            window.location.href = "/loginAdmin";
        };
    }

    $("#mensaje-imagen-index").attr("src", imagenSrc);
    $("#mensaje-texto-index").text(mensaje);
    $("#modal-mensaje-index").show();

    $("#btn-aceptar-mensaje-index").click(accion);
    $("#btn-cancelar-mensaje-index").click(function () {
        $("#modal-mensaje-index").hide();
    });
}
