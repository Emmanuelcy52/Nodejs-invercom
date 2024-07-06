import obtenerConexion from "../../conexion.js";

const obtenerCarrito = async (req, res) => {
  let response = {};
  const conn = await obtenerConexion(); // Suponiendo que esta función retorna una conexión válida

  try {
    const idUser = req.session.id_usuario;

    if (idUser) {
      const [rows] = await conn.query(
        "SELECT * FROM carrito WHERE id_usuario = ?",
        [idUser]
      );

      if (rows.length > 0) {
        response.error = false;
        response.productos = rows;
      } else {
        response.error = true;
        response.mensaje = "No se encontraron productos.";
      }
    } else {
      response.error = true;
      response.mensaje = "Inicia sesión para acceder a tu carrito";
    }
  } catch (error) {
    response.error = true;
    response.mensaje = "Error en la operación";
  } finally {
    res.json(response);
    conn.end();
  }
};
const eliminarCarrito = async (req, res) => {
  const productos = req.body.productos; // Asegúrate de que estos datos estén en el cuerpo de la solicitud
  console.log(productos);
  let response = {};
  const conn = await obtenerConexion(); // Suponiendo que esta función retorna una conexión válida
  try {
    // Selecciona todos los productos para verificar y actualizar
    const [rows] = await conn.query(
      "SELECT id, informacion_tipo FROM productos"
    );

    if (rows.length === 0) {
      response.error = true;
      response.mensaje = "No se encontraron productos.";
    } else {
      // Crea un mapa de productos para facilitar la búsqueda por 'codigoUnico'
      const productosMap = new Map();
      for (let row of rows) {
        let informacionTipo = JSON.parse(row.informacion_tipo);
        informacionTipo.forEach((producto) => {
          productosMap.set(producto.codigoUnico, {
            informacionTipo,
            rowId: row.id,
          });
        });
      }

      // Itera sobre los productos recibidos en el request
      for (let producto of productos) {
        let productoData = productosMap.get(producto.codigoUnico);
        if (productoData) {
          let informacionTipo = productoData.informacionTipo;

          // Actualiza la cantidad del producto
          for (let info of informacionTipo) {
            if (info.codigoUnico === producto.codigoUnico) {
              info.cantidad =
                parseInt(info.cantidad) - parseInt(producto.cantidad);
              break;
            }
          }

          // Guarda los cambios en la base de datos
          let informacionTipoActualizado = JSON.stringify(informacionTipo);
          await conn.query(
            "UPDATE productos SET informacion_tipo = ? WHERE id = ?",
            [informacionTipoActualizado, productoData.rowId]
          );
        } else {
          response.error = true;
          response.mensaje = `Producto con codigoUnico ${producto.codigoUnico} no encontrado.`;
          break;
        }
      }

      if (!response.error) {
        const idUser = req.session.id_usuario;
        const [deleteRows] = await conn.query(
          "DELETE FROM carrito WHERE id_usuario = ?",
          [idUser]
        );
        if (deleteRows.affectedRows > 0) {
          response.error = false;
          response.mensaje =
            "Se eliminaron los elementos del carrito exitosamente.";
        } else {
          response.error = true;
          response.mensaje =
            "Error al eliminar elementos del carrito. Por favor, inténtalo de nuevo.";
        }
      }
    }
  } catch (error) {
    response.error = true;
    response.mensaje = "Error en la operación";
  } finally {
    res.json(response);
    conn.end();
  }
};

const ActualizarCantidad = async (req, res) => {
  const productos = req.body.productos; // Asegúrate de que estos datos estén en el cuerpo de la solicitud
  console.log(productos);
  let response = {};
  const conn = await obtenerConexion(); // Suponiendo que esta función retorna una conexión válida
  try {
    // Selecciona todos los productos para verificar y actualizar
    const [rows] = await conn.query(
      "SELECT id, informacion_tipo FROM productos"
    );

    if (rows.length === 0) {
      response.error = true;
      response.mensaje = "No se encontraron productos.";
    } else {
      // Crea un mapa de productos para facilitar la búsqueda por 'codigoUnico'
      const productosMap = new Map();
      for (let row of rows) {
        let informacionTipo = JSON.parse(row.informacion_tipo);
        informacionTipo.forEach((producto) => {
          productosMap.set(producto.codigoUnico, {
            informacionTipo,
            rowId: row.id,
          });
        });
      }

      // Itera sobre los productos recibidos en el request
      for (let producto of productos) {
        let productoData = productosMap.get(producto.codigoUnico);
        if (productoData) {
          let informacionTipo = productoData.informacionTipo;

          // Actualiza la cantidad del producto
          for (let info of informacionTipo) {
            if (info.codigoUnico === producto.codigoUnico) {
              info.cantidad =
                parseInt(info.cantidad) - parseInt(producto.cantidad);
              break;
            }
          }

          // Guarda los cambios en la base de datos
          let informacionTipoActualizado = JSON.stringify(informacionTipo);
          await conn.query(
            "UPDATE productos SET informacion_tipo = ? WHERE id = ?",
            [informacionTipoActualizado, productoData.rowId]
          );
        } else {
          response.error = true;
          response.mensaje = `Producto con codigoUnico ${producto.codigoUnico} no encontrado.`;
          break;
        }
      }

    }
  } catch (error) {
    response.error = true;
    response.mensaje = "Error en la operación";
  } finally {
    res.json(response);
    conn.end();
  }
};

const EliminarProducto = async (req, res) => {
  let response = {};
  const conn = await obtenerConexion();
  try {
    if (req.body.codigoUnico) {
      const CodigoUnico = req.body.codigoUnico;
      const idUser = req.session.id_usuario;

      if (idUser) {
        // Consulta para obtener los registros
        const [rows] = await conn.query(
          "SELECT id, contenido FROM carrito WHERE id_usuario = ?",
          [idUser]
        );

        if (rows.length > 0) {
          for (const row of rows) {
            // Decodificar el JSON
            let contenido = JSON.parse(row.contenido);

            // Filtrar el contenido para eliminar elementos con "codigoUnico" igual a "AxVCE"
            const contenido_filtrado = contenido.filter(
              (item) => item.codigoUnico !== CodigoUnico
            );

            // Codificar el contenido filtrado de nuevo a JSON
            const contenido_actualizado = JSON.stringify(contenido_filtrado);

            // Actualizar la fila en la base de datos
            const update_sql = "UPDATE carrito SET contenido = ? WHERE id = ?";
            await conn.query(update_sql, [contenido_actualizado, row.id]);

            response.mensaje = "Registro actualizado exitosamente.";
          }
        } else {
          response.error = true;
          response.mensaje = "No se encontraron resultados.";
        }
      } else {
        response.error = true;
        response.mensaje = "Inicia sesión para acceder a tu carrito";
      }
    } else {
      response.error = true;
      response.mensaje = "Faltan datos del formulario";
    }
  } catch (error) {
    response.error = true;
    response.mensaje = "Error en la operación";
  } finally {
    res.json(response);
    conn.end();
  }
};

export default {
  obtenerCarrito,
  eliminarCarrito,
  EliminarProducto,
  ActualizarCantidad
};
