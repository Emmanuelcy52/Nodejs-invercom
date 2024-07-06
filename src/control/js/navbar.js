$(document).ready(function () {
  var navbarHtml = `
  
    <script src="https://kit.fontawesome.com/b5c7858943.js" crossorigin="anonymous"></script>
    <nav id="nav">
        <ul id="navul">
          <li>
            <a href="/" class="navenlace" title="Pagina de inicio">Inicio</a>
          </li>
          <li>
            <a href="/contacto" class="navenlace" title="Contactanos">Contacto</a>
          </li>
          <li>
            <a href="/elegirinv" class="navenlace" title="Aprende a elegir tu Inversor Electronico">Como elegir inversor</a>
          </li>
          <li>
            <a href="/elegirpan" class="navenlace" title="Aprende a elegir panel para tu inversor invercom">Como elegir panel solar</a>
          </li>
          <li>
            <a href="/elegirbat" class="navenlace" title="Aprende a elegir baterias para tu inversor Invercom">Como elegir baterias</a>
          </li>
          <li id="dropdown">
            <a href="#" class="navenlace perfil-link" title="Ver Perfil">
              <i class="fa-solid fa-user"></i>
            </a>
            <div class="perfil-content">
              <a id="profile-link" href="/perfil" title="Perfil">Perfil</a>
              <a href="/login" class="navenlace" id="login-link" title="Iniciar sesión">Iniciar sesión</a>
              <a href="/register" class="navenlace" id="register-link" title="Registrarse">Registrate</a>
              <a id="panel-link" href="/administrador" title="Panel administrador">Panel administrador</a>
              <a id="cerrarSesion-link" Onclick="CerrarSesion()" title="Cerrar Sesión">Cerrar Sesión</a>
            </div>
          </li>
          <li>
            <a href="/carrito" class="navenlace" id="carrito" title="Ver Carrito">
              <i class="fa-solid fa-shopping-cart"></i>
            </a>
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
