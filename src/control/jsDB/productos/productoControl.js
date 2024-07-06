import obtenerConexion from "../../conexion.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

// Obtener la ruta absoluta del directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurar Multer para manejar las subidas de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.resolve(
      __dirname,
      "../../../views/vistas/extras/img/inversoresimg"
    );
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const nombreProducto = req.body.nombre_producto;
    const contador = req.files.length + 1;
    const nombreImagen = `${nombreProducto}_${contador}_${file.originalname}`;
    cb(null, nombreImagen);
  },
});

const upload = multer({ storage: storage }).array("imagen[]");

// Middleware personalizado para manejar la subida de archivos
const uploadMiddleware = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      return res
        .status(500)
        .json({ error: true, mensaje: "Error al subir las imágenes" });
    }
    next();
  });
};

const registroProducto = async (req, res) => {
  const conn = await obtenerConexion();
  try {
    const { nombre_producto, informacion_tipo } = req.body;
    const ESP = JSON.parse(informacion_tipo);
    let response = {};

    if (!nombre_producto || !informacion_tipo) {
      response.error = true;
      response.mensaje = "Faltan datos del formulario";
      return res.json(response);
    }

    const imagenesNombres = req.files.map((file) => file.filename);

    // Convertir los nombres de las imágenes a URLs
    const urlsImagenes = imagenesNombres.map((nombreImagen) => {
      return `/views/vistas/extras/img/inversoresimg/${nombreImagen}`;
    });

    // Convertir las URLs de las imágenes y la información del tipo a JSON
    const imagenesJSON = JSON.stringify(urlsImagenes);
    const informacionTipo = JSON.stringify(ESP);

    // Insertar los datos del producto en la base de datos
    const query =
      "INSERT INTO productos (nombreInversor, informacion_tipo, imagen_url) VALUES (?, ?, ?)";
    const [result] = await conn.query(query, [
      nombre_producto,
      informacionTipo,
      imagenesJSON,
    ]);
    console.log("validacion");
    if (result.affectedRows > 0) {
      response.mensaje = "Producto registrado correctamente";
      res.json(response);
    } else {
      response.error = true;
      response.mensaje = "Error al registrar el producto en la base de datos";
      return res.json(response);
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: true, mensaje: "Error interno del servidor" });
  } finally {
    // Siempre cerrar la conexión en el bloque finally para liberar recursos
    conn.end();
  }
};

const obtenerProducto = async (req, res) => {
  let response = {};
  const conn = await obtenerConexion();
  try {
    const sql = "SELECT * FROM productos";
    const [rows] = await conn.query(sql);

    if (rows.length > 0) {
      const productosFiltrados = rows
        .map((row) => {
          let informacionTipo = JSON.parse(row.informacion_tipo);
          informacionTipo = informacionTipo.filter(
            (producto) => parseInt(producto.cantidad) !== 0
          );
          if (informacionTipo.length > 0) {
            row.informacion_tipo = JSON.stringify(informacionTipo);
            return row;
          }
          return null;
        })
        .filter((row) => row !== null);

      if (productosFiltrados.length > 0) {
        response.error = false;
        response.productos = productosFiltrados;
      } else {
        response.error = true;
        response.mensaje =
          "No se encontraron productos con cantidad mayor a 0.";
      }
    } else {
      response.error = true;
      response.mensaje = "No se encontraron productos.";
    }

    res.json(response);
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    response.error = true;
    response.mensaje =
      "Error al intentar obtener los productos. Por favor, inténtalo de nuevo más tarde.";
    res.json(response);
  } finally {
    // Siempre cerrar la conexión en el bloque finally para liberar recursos
    conn.end();
  }
};

const obtenerProductoscrud = async (req, res) => {
  let response = {};
  const conn = await obtenerConexion();
  try {
    const sql = "SELECT * FROM productos";
    const [rows] = await conn.query(sql);

    if (rows.length > 0) {
      response.error = false;
      response.productos = rows;
    } else {
      response.error = true;
      response.mensaje = "No se encontraron productos.";
    }

    res.json(response);
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    response.error = true;
    response.mensaje =
      "Error al intentar obtener los productos. Por favor, inténtalo de nuevo más tarde.";
    res.json(response);
  } finally {
    // Siempre cerrar la conexión en el bloque finally para liberar recursos
    conn.end();
  }
};

const obtenerProductoid = async (req, res) => {
  let response = {};
  const conn = await obtenerConexion();
  try {
    // Obtener el ID del producto de la solicitud
    const { id } = req.query;

    // Consulta SQL para obtener el producto por su ID
    const sql = "SELECT * FROM productos WHERE id = ?";
    const [rows] = await conn.query(sql, [id]);

    if (rows.length > 0) {
      response.error = false;
      response.producto = rows[0]; // Solo toma el primer producto (debería ser único por ID)
    } else {
      response.error = true;
      response.mensaje = "No se encontró el producto con el ID proporcionado.";
    }

    res.json(response);
  } catch (error) {
    console.error("Error al obtener el producto:", error);
    response.error = true;
    response.mensaje =
      "Error al intentar obtener el producto. Por favor, inténtalo de nuevo más tarde.";
    res.json(response);
  } finally {
    // Siempre cerrar la conexión en el bloque finally para liberar recursos
    conn.end();
  }
};

const EditarProducto = async (req, res) => {
  const conn = await obtenerConexion();
  try {
    const {
      nombre_producto,
      informacion_tipo,
      inputs_no_modificados,
      idProducto,
    } = req.body;
    const ESP = JSON.parse(informacion_tipo);
    const imagenesNombres = req.files.map((file) => file.filename);

    // Convertir los nombres de las imágenes a URLs
    const urlsImagenes = imagenesNombres.map((nombreImagen) => {
      return `/views/vistas/extras/img/inversoresimg/${nombreImagen}`;
    });

    // Obtener la imagen_url actual del producto
    const selectQuery = "SELECT imagen_url FROM productos WHERE id = ?";
    const [selectResult] = await conn.query(selectQuery, [idProducto]);
    const imagenUrlActual = selectResult[0].imagen_url;

    // Convertir la imagen_url actual a un array de URLs
    const imagenesUrlsActuales = JSON.parse(imagenUrlActual);

    // Verificar si inputs_no_modificados es un arreglo antes de usarlo con forEach
    if (Array.isArray(inputs_no_modificados)) {
      inputs_no_modificados.forEach((indice) => {
        if (!inputs_no_modificados.includes(indice)) {
          imagenesUrlsActuales[indice] = urlsImagenes.shift();
        }
      });
    } else {
      console.error("Error: inputs_no_modificados no es un arreglo.");
      // Manejar el error de acuerdo a tu lógica de aplicación
    }

    // Concatenar las nuevas imágenes al final del arreglo si las hay
    imagenesUrlsActuales.push(...urlsImagenes);

    // Convertir las URLs actualizadas a JSON
    const imagenesActualizadasJSON = JSON.stringify(imagenesUrlsActuales);
    const informacionTipo = JSON.stringify(ESP);

    console.log(imagenesActualizadasJSON);

    // Actualizar la fila en la base de datos con las imágenes actualizadas
    const updateQuery =
      "UPDATE productos SET nombreInversor = ?, informacion_tipo = ?, imagen_url = ?, fecha_actualizacion = NOW() WHERE id = ?";
    const [updateResult] = await conn.query(updateQuery, [
      nombre_producto,
      informacionTipo,
      imagenesActualizadasJSON,
      idProducto,
    ]);

    // Verificar si la actualización fue exitosa
    if (updateResult.affectedRows > 0) {
      res.json({ error: false, mensaje: "Producto actualizado correctamente" });
    } else {
      res.json({
        error: true,
        mensaje: "Error al actualizar el producto en la base de datos",
      });
    }
  } catch (error) {
    console.error("Error interno del servidor:", error);
    res.status(500).json({
      error: true,
      mensaje: "Error interno del servidor: " + error.message,
    });
  } finally {
    // Siempre cerrar la conexión en el bloque finally para liberar recursos
    conn.end();
  }
};

const AgregarCarrito = async (req, res) => {
  let response = {};
  const conn = await obtenerConexion(); // Suponiendo que esta función retorna una conexión válida

  try {
    const { DetallesCarrito, idUsuario } = req.body;
    const Carrito = JSON.parse(DetallesCarrito);

    // Obtener el contenido actual del carrito del usuario
    const [rows] = await conn.query(
      "SELECT contenido FROM carrito WHERE id_usuario = ?",
      [idUsuario]
    );

    if (rows.length > 0) {
      // El usuario ya tiene un carrito, actualizar o agregar productos
      const carritoActual = JSON.parse(rows[0].contenido);

      // Iterar sobre los detalles del carrito que el usuario intenta agregar
      for (const productoNuevo of Carrito) {
        let encontrado = false;

        // Iterar sobre los productos existentes en el carrito
        for (const productoExistente of carritoActual) {
          if (
            productoExistente.codigoUnico === productoNuevo.codigoUnico &&
            productoExistente.id === productoNuevo.id
          ) {
            // Verificar si hay suficiente stock para agregar
            if (
              productoExistente.stock >=
              productoExistente.cantidad + productoNuevo.cantidad
            ) {
              productoExistente.cantidad += productoNuevo.cantidad;
            } else {
              // Si no hay suficiente stock, añadir la máxima posible
              productoNuevo.cantidad = productoExistente.stock;
              productoExistente.cantidad = productoExistente.stock;
            }
            // El producto ya existe en el carrito, actualizar la cantidad

            encontrado = true;
            break;
          }
        }

        // Si el producto no se encontró en el carrito, agregarlo
        if (!encontrado) {
          carritoActual.push(productoNuevo);
        }
      }

      // Actualizar el contenido del carrito en la base de datos
      const carritoActualString = JSON.stringify(carritoActual);
      await conn.query(
        "UPDATE carrito SET contenido = ? WHERE id_usuario = ?",
        [carritoActualString, idUsuario]
      );

      response.mensaje = "Carrito actualizado correctamente";
    } else {
      // El usuario no tiene un carrito, crear uno nuevo
      const CarritoInfoString = JSON.stringify(Carrito);
      await conn.query(
        "INSERT INTO carrito (contenido, id_usuario) VALUES (?, ?)",
        [CarritoInfoString, idUsuario]
      );
      response.mensaje = "Producto agregado al carrito";
    }

    response.error = false;
  } catch (error) {
    response.error = true;
    response.mensaje = "Error en la operación";
  } finally {
    conn.end();
    res.json(response);
  }
};

const eliminarProducto = async (req, res) => {
  const conn = await obtenerConexion();
  let response = {};
  try {
    const { id } = req.body;

    const sql = "DELETE FROM productos WHERE id = ?";
    const [rows] = await conn.query(sql, [id]);

    if (rows.affectedRows > 0) {
      response.error = false;
      response.mensaje = "Producto eliminado correctamente.";
    } else {
      response.error = true;
      response.mensaje = "No se encontró el producto.";
    }
  } catch (error) {
    response.error = true;
    response.mensaje = "Error interno del servidor: " + error.message;
  } finally {
    conn.end();
    res.json(response);
  }
};


// Exportar la función y el middleware
export default {
  registroProducto,
  uploadMiddleware,
  obtenerProducto,
  AgregarCarrito,
  obtenerProductoscrud,
  obtenerProductoid,
  EditarProducto,
  eliminarProducto,
};
