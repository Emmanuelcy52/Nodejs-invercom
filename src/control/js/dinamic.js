document.addEventListener("DOMContentLoaded", function () {
  const dropdownMenu = document.getElementById("dropdownMenu");

  dropdownMenu.addEventListener("change", function () {
    const selectedOption = dropdownMenu.value;

    // Aquí puedes agregar la lógica para manejar la opción seleccionada
    switch (selectedOption) {
      case "user":
        window.location.href = "#";
        break;
      case "login":
        window.location.href = "vistas/html/login.html";
        break;
      case "register":
        window.location.href = "vistas/html/registro.html";
        break;
      case "profile":
        window.location.href = "vistas/html/perfil.html";
        break;
      case "productos":
        window.location.href = "vistas/html/administrador/agregarProducto.html";
        break;
      case "cerrarSesion":
        CerrarSesion();
        break;
      default:
        // Código por defecto si no se selecciona ninguna opción
        break;
    }
  });
});
