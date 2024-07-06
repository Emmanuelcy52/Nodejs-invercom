import express from "express";
import crypto from "crypto";
import path from "path";
import indexRoutes from "./router/RouterMain.js";
import Userrouter from "./router/RouterUser.js";
import Adminrouter from "./router/RouterAdministrador.js";
import Facturarouter from "./router/RouterFactura.js";
import ProductRouter from "./router/RouterProductos.js";
import Carritorouter from "./router/RouterCarrito.js";
import Checkoutorouter from "./router/RouterCheckout.js";
import bodyParser from "body-parser";
import session from "express-session";

// Generar un secreto para la sesión
const generarSecreto = () => {
  return crypto.randomBytes(64).toString("hex");
};
const secreto = generarSecreto();

const app = express();

// Configurar sesiones
app.use(
  session({
    secret: secreto,
    resave: false,
    saveUninitialized: true,
  })
);

// Configurar body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Configurar rutas de la API
app.use("/api/productos", ProductRouter);
app.use("/api/email", indexRoutes);
app.use("/api/user", Userrouter);
app.use("/api/admin", Adminrouter);
app.use("/api/carrito", Carritorouter);
app.use("/api/checkout", Checkoutorouter);
app.use("/api/Factura", Facturarouter);

// Configurar archivos estáticos
app.use("/css", express.static(path.resolve("src/views/vistas/css")));
app.use(express.static(path.resolve("src/views")));
app.use(
  "/views/vistas/extras/img/inversoresimg",
  express.static(path.resolve("src/views/vistas/extras/img/inversoresimg"))
);
app.use("views/vistas/extras/img",
  express.static(path.resolve("src/views/vistas/extras/img"))
);

app.use("/control/js", express.static(path.resolve("src/control/js")));

// Ruta para servir vitas usuario
app.get("/", (req, res) => {
  res.sendFile(path.resolve("src/views/index.html"));
});
app.get("/contacto", (req, res) => {
  res.sendFile(path.resolve("src/views/vistas/html/contacto.html"));
});
app.get("/elegirinv", (req, res) => {
  res.sendFile(path.resolve("src/views/vistas/html/elegirInv.html"));
});
app.get("/elegirpan", (req, res) => {
  res.sendFile(path.resolve("src/views/vistas/html/elegirPanel.html"));
});
app.get("/elegirbat", (req, res) => {
  res.sendFile(path.resolve("src/views/vistas/html/elegirBat.html"));
});
app.get("/perfil", (req, res) => {
  res.sendFile(path.resolve("src/views/vistas/html/perfil.html"));
});
app.get("/carrito", (req, res) => {
  res.sendFile(path.resolve("src/views/vistas/html/carrito.html"));
});

// Ruta para servir vitas admin
app.get("/administrador", (req, res) => {
  res.sendFile(path.resolve("src/views/vistas/html/administrador/index.html"));
});
app.get("/productos", (req, res) => {
  res.sendFile(
    path.resolve(
      "src/views/vistas/html/administrador/productos/panelProductos.html"
    )
  );
});
app.get("/ventas", (req, res) => {
  res.sendFile(
    path.resolve("src/views/vistas/html/administrador/ventas/panelVentas.html")
  );
});
app.get("/gestion-usuarios", (req, res) => {
  res.sendFile(
    path.resolve(
      "src/views/vistas/html/administrador/usuarios/panelUsuarios.html"
    )
  );
});
app.get("/pedidos", (req, res) => {
  res.sendFile(
    path.resolve(
      "src/views/vistas/html/administrador/pedidos/panelPedidos.html"
    )
  );
});

app.get("/factura", (req, res) => {
  res.sendFile(
    path.resolve(
      "src/views/vistas/html/administrador/facturas/panelFacturas.html"
    )
  );
});

app.get("/agregarProducto", (req, res) => {
  res.sendFile(
    path.resolve(
      "src/views/vistas/html/administrador/productos/agregarProducto.html"
    )
  );
});

app.get("/llenarPerfil", (req, res) => {
  res.sendFile(path.resolve("src/views/vistas/html/llenarPerfil.html"));
});

app.get("/EditarProducto", (req, res) => {
  res.sendFile(
    path.resolve(
      "src/views/vistas/html/administrador/productos/editar_producto.html"
    )
  );
});

app.get("/generarFactura", (req, res) => {
  res.sendFile(
    path.resolve(
      "src/views/vistas/html/administrador/facturas/registroDatosfact.html"
    )
  );
});

//login
app.get("/login", (req, res) => {
  res.sendFile(path.resolve("src/views/vistas/html/login.html"));
});

app.get("/register", (req, res) => {
  res.sendFile(path.resolve("src/views/vistas/html/registro.html"));
});

//login administrador 
app.get("/loginAdmin", (req, res) => {
  res.sendFile(path.resolve("src/views/vistas/html/administrador/login.html"));
});

//fichas tecnicas
app.get("/fichaTecnica/:archivo", (req, res) => {
  // Obtener el parámetro desde la URL
  const archivo = req.params.archivo;
  // Construir la ruta completa del archivo HTML
  const filePath = path.resolve(`fichasTecnicas/${archivo}.html`);

  // Enviar el archivo HTML al cliente
  res.sendFile(filePath);
});
// Inicia
// Iniciar el servidor
const port = 3000;
app.listen(port, () =>
  console.log(`Servidor escuchando en http://localhost:${port}`)
);
