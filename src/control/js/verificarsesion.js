document.addEventListener("DOMContentLoaded", function () {
  // Llamar a la función mostrarProductos aquí
  verificarSesion();
});

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
        // Si el usuario no está autenticado, muestra los enlaces de inicio de sesión y registro
        $("#dropdown").show();
        $("#login-link").show();
        $("#register-link").show();
        $("#profile-link").hide();
        $("#productos-link").hide();
        $("#cerrarSesion-link").hide();
        $("#carrito").hide();
        $("#panel-link").hide();

        usuarioLogiado("error", data.mensaje);
      } else {
        // Si el usuario está autenticado, muestra el enlace de perfil y oculta los de inicio de sesión y registro
        $("#login-link").hide();
        $("#register-link").hide();
        $("#profile-link").show();
        $("#productos-link").show();
        $("#cerrarSesion-link").show();
        $("#User").text("Hola, " + data.usuario);
        $("#dropdown-user").show();
        idUsuario = data.idUsuario;
      }
    })
    .catch((error) => {
      usuarioLogiado("error", "Error en la solicitud AJAX: " + error.message);
    });
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
      setTimeout(function () {}, 100);
    };
  } else if (tipo === "error") {
    imagenSrc = "/vistas/extras/img/fallar.gif";
    accion = function () {
      $("#modal-mensaje-index").hide();
      window.location.href = "/vistas/html/login.html";
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
