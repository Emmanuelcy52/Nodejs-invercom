import obtenerConexion from "../../conexion.js";

const RegistrarDatos = async (req, res) => {
  const { fullname, email, address, telefono, identificacion } = req.body;

  if (!fullname || !email || !address || !telefono || !identificacion) {
    response.error = true;
    response.mensaje =
      "No se recibieron todos los datos necesarios o algunos están vacíos.";
    return res.json(response);
  }
  let response = {};
  const conn = await obtenerConexion();
  try {
    const sql = "INSERT INTO datosfactura (nombre, Dirección, identificacion, telefono, correo) VALUES (?, ?, ?, ?, ?)";
    await conn.query(sql, [fullname, address, identificacion, telefono, email]);

    response.error = false;
    response.mensaje = "Datos Registrados correctamente";

  } catch (error) {
    response.error = true;
    response.mensaje = "Error en la operación: " + error.message;
    console.error(error);
  } finally {
    conn.end();
    res.json(response);
  }
};

const ObtenerDatos = async (req, res) => {
  let response = {};
  const conn = await obtenerConexion();

  try {
    const sql = "SELECT * FROM datosfactura";
    const [rows] = await conn.query(sql);

    if (rows.length > 0) {
      response.error = false;
      response.datosFactura = rows;
    } else {
      response.error = false;
      response.datosFactura = rows;
    }
  } catch (error) {
    response.error = true;
    response.mensaje = "Error en la operación";
  } finally {
    // Siempre cerrar la conexión en el bloque finally para liberar recursos
    conn.end();
    // Enviar la respuesta una sola vez aquí
    res.json(response);
  }
};

const Obtenernumero = async (req, res) => {
  let response = {};
  const conn = await obtenerConexion();

  try {
    const sql = "SELECT id FROM facturas_Entregadas ORDER BY id DESC LIMIT 1";
    const [rows] = await conn.query(sql);

    if (rows.length > 0) {
      response.error = false;
      response.numeroFactura = rows[0].id; // Obtener el número de factura del primer resultado
    } else {
      response.error = false;
      response.numeroFactura = null; // Opcionalmente, manejar caso sin resultados
    }
  } catch (error) {
    console.error("Error en Obtenernumero:", error);
    response.error = true;
    response.mensaje = "Error en la operación";
  } finally {
    // Siempre cerrar la conexión en el bloque finally para liberar recursos
    conn.end();
    // Enviar la respuesta una sola vez aquí
    res.json(response);
  }
};


const ActualizarDatos = async (req,res) =>{
  const { id, fullname, email, address, telefono, identificacion } = req.body;

  if (!id || !fullname || !email || !address || !telefono || !identificacion) {
    return res.status(400).json({
      error: true,
      mensaje: "No se recibieron todos los datos necesarios o algunos están vacíos.",
    });
  }
  let response = {};
  const conn = await obtenerConexion();
  try {
    const sql = "UPDATE datosfactura SET nombre = ?, Dirección = ?, identificacion = ?, telefono = ?, correo = ?, fecha_creacion = NOW() WHERE id = ?"
    await conn.query(sql, [fullname, address, identificacion, telefono, email, id]);

    response.error = false;
    response.mensaje = "Datos actualizados correctamente";
  } catch (error) {
    response.error = true;
    response.mensaje = "Error en la operación: " + error.message;
  } finally{
    // Siempre cerrar la conexión en el bloque finally para liberar recursos
    conn.end();
    // Enviar la respuesta una sola vez aquí
    res.json(response);
  }
}

const EliminarDatos = async (req, res) => {
  const conn = await obtenerConexion();
  let response = {};
  try {
    const { id } = req.body;

    const sql = "DELETE FROM datosfactura WHERE id = ?";
    const [rows] = await conn.query(sql, [id]);

    if (rows.affectedRows > 0) {
      response.error = false;
      response.mensaje = "Datos eliminados correctamente.";
    } else {
      response.error = true;
      response.mensaje = "No se encontraron los datos.";
    }
  } catch (error) {
    response.error = true;
    response.mensaje = "Error interno del servidor: " + error.message;
  } finally {
    // Siempre cerrar la conexión en el bloque finally para liberar recursos
    conn.end();
    res.json(response); // Enviar la respuesta como JSON al cliente
  }
};


export default {
  RegistrarDatos,
  ObtenerDatos,
  ActualizarDatos,
  EliminarDatos,
  Obtenernumero
};
