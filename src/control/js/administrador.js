function CerrarSesion() {
    fetch("/api/user/cerrarSession", {
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
          mostrarCerrarsesion("error", data.mensaje);
        } else {
          mostrarCerrarsesion("exito", data.mensaje);
        }
      })
      .catch((error) => {
        mostrarCerrarsesion(
          "error",
          "Error en la solicitud AJAX: " + error.message
        );
      });
  }
  
  function Login() {
    var procedencia = "";
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const data = {
      username: username,
      password: password,
    };
    fetch("/api/admin/iniciarSession", {
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
          mostrarMensaje("error", data.mensaje);
        } else {
          mostrarMensaje("exito", data.mensaje);
        }
      })
      .catch((error) => {
        mostrarMensaje("error", "Error en la solicitud AJAX: " + error.message);
      });
  }
  
  function Registar() {
    const fullname = document.getElementById("fullname").value;
    const email = document.getElementById("email").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const confirm_password = document.getElementById("confirm_password").value;
  
    const data = {
      fullname: fullname,
      email: email,
      username: username,
      password: password,
      confirm_password: confirm_password,
    };
  
    fetch("/api/user/register", {
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
          mostrarMensaje("error", data.mensaje);
        } else {
        }
      })
      .catch((error) => {
        mostrarMensaje("error", "Error en la solicitud AJAX: " + error.message);
      });
  }
  
  
  // Función para mostrar un mensaje en el modal
  function mostrarMensaje(tipo, mensaje) {
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
          var referrer = document.referrer; // Obtén la URL de la página anterior
          if (referrer) {
            history.replaceState(null, "", referrer); // Reemplaza la URL actual con la URL de la página anterior
          } else {
            history.replaceState(null, "", "/"); // Si no hay URL anterior, redirige a la página de inicio
          }
          window.location.reload();
        }, 1000);
      };
    } else if (tipo === "error") {
      imagenSrc = "../../vistas/extras/img/fallar.gif";
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
  function mostrarCerrarsesion(tipo, mensaje) {
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
      $("#btn-seguir-comprando").hide();
      $("#btn-ir-carrito").hide();
      $("#btn-aceptar-mensaje").show();
    }
  
    $("#mensaje-imagen").attr("src", imagenSrc);
    $("#mensaje-texto").text(mensaje);
    $("#modal-mensaje").show();
  
    $("#btn-aceptar-mensaje").click(accion);
    $("#btn-cancelar-mensaje").hide();
  }
  