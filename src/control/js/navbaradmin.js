$(document).ready(function () {
  var navbarHtml = `
    <script
        src="https://kit.fontawesome.com/b5c7858943.js"
        crossorigin="anonymous"
      ></script>
    <nav id="nav">
          <ul id="navul">
          <li>
              <a
                href="/"
                class="navenlace"
                title="Tienda"
              >
                Tienda
              </a>
            </li>
          <li>
              <a
                href="/administrador"
                class="navenlace"
                title="Panel de administrador"
              >
                Inicio
              </a>
            </li>
            <li>
              <a
                href="/productos"
                class="navenlace"
                title="Panel de productos"
              >
                Productos
              </a>
            </li>
            <li>
              <a
                href="/ventas"
                class="navenlace"
                title="Panel de ventas"
              >
                Ventas
              </a>
            </li>
            <li>
              <a
                href="/gestion-usuarios"
                class="navenlace"
                title="Panel de usuarios"
              >
                Usuarios
              </a>
            </li>
            <li>
              <a
                href="/pedidos"
                class="navenlace"
                title="Panel de pedidos"
              >
                Pedidos
              </a>
            </li>
             <li>
              <a
                href="/factura"
                class="navenlace"
                title="Panel de pedidos"
              >
                Facturas
              </a>
            </li>
           <li id="dropdown">
            <a href="#" class="navenlace perfil-link">
              <i class="fa-solid fa-user"></i>
            </a>
            <div class="perfil-content">
              <a id="profile-link" href="/perfil" title="Perfil">Perfil</a>
              <a href="/login" class="navenlace" id="login-link" title="Iniciar sesión">Iniciar sesión</a>
              <a href="/register" class="navenlace" id="register-link" title="Registrarse">Registrate</a>
              <a id="cerrarSesion-link" Onclick="CerrarSesion()" title="Cerrar Sesión">Cerrar Sesión</a>
            </div>
          </li>
            
          </ul>
        </nav>`;
  $("#main-navbar").html(navbarHtml);

  // Agregar lógica para desplegar el dropdown
  $(".perfil-link").click(function (event) {
    event.preventDefault();
    $(".perfil-content").toggle();
  });

  // Cerrar el dropdown si se hace clic fuera de él
  $(document).click(function (event) {
    if (!$(event.target).closest("#dropdown").length) {
      $(".perfil-content").hide();
    }
  });
});
