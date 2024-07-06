import nodemailer from "nodemailer";
import pkg from 'pdfkit';
const { file } = pkg;
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import crypto from 'crypto';
import generateBarcode from './barcodeGenerator.js';
import obtenerConexion from "./conexion.js"; // Asegúrate de que la ruta sea correcta


// Configuración del transporte de Nodemailer
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true para port 465, false para otros puertos
  auth: {
    user: "emmanuelcy52@gmail.com",
    pass: "hbgg pugg amya jorr",
  },
});

const verificarCorreo = async (req, res) => {
  const { nombre, correo, codigo } = req.body;

  if (!nombre || !correo || !codigo) {
    return res.json({
      error: "No se recibieron todos los datos necesarios o algunos están vacíos.",
    });
  }

  const mailOptions = {
    from: '"Emmanuel Canales Yonca"',
    to: correo,
    subject: "Codigo Verificacion",
    html: `
      <html>
      <head>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f0f8ff; /* Azul claro */
                  color: #333; /* Color de texto oscuro */
                  padding: 20px;
              }
              .container {
                  background-color: #f0f8ff; /* Fondo blanco */
                  padding: 20px;
                  border-radius: 10px;
              }
              .signature {
                  margin-top: 20px;
                  font-size: 14px;
                  color: #777; /* Color de texto gris */
              }
          </style>
      </head>
      <body>
          <div class="container">
              <h2>¡Gracias por elegirnos!</h2>
              <p>Estimado/a ${nombre},</p>
              <p>¡Este tu código de confirmación para activar tu cuenta y empezar a comprar con nosotros!</p>
              <p>A continuación, te detallamos la información:</p>
              <ul>
                  <li><strong>código de verificación:</strong> ${codigo}</li>
                  <li><strong>tiempo de expiración:</strong> 10 Minutos</li>
              </ul>
          </div>
          <div class="signature">
              <p>Atentamente,</p>
              <p><strong>Invercom</strong></p>
              <p>La forma inteligente de convertir y ahorrar con el sol</p>
          </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ mensaje: "Correo de verificación enviado con éxito." });
  } catch (error) {
    console.log(error);
    res.json({
      error: `Error al enviar el correo electrónico: ${error.message}`,
    });
  }
};

const ticket = async (req, res) => {
  // Asegúrate de que la sesión esté configurada y no esté vacía
  if (!req.session.id_usuario || !req.session.correo || !req.session.usuario) {
    return res.status(400).json({ error: 'Sesión no válida' });
  }

  const idUser = req.session.id_usuario;
  const correo = req.session.correo;
  const usuario = req.session.usuario;
  let totalCompra = 0;
  const { productosSeleccionados, Factura } = req.body;
  let datosUsuario
  let datosEmpresa
  let numfactura
  let NOfactura
  let facPath = false

  if (!productosSeleccionados || productosSeleccionados.length === 0) {
    return res.status(400).json({ error: 'No se seleccionaron productos' });
  }


  if (Factura == true) {

    const usuario = await obtenerDatosUsuario(idUser)

    // Aquí asignamos solo los campos que necesitamos a variables locales
    const nombreReal = usuario.perfil[0].nombre_real;
    const correo = usuario.perfil[0].correo;
    const telefono = usuario.perfil[0].telefono;
    const direccion = usuario.perfil[0].direccion;
    const identificacion = usuario.perfil[0].identificacion;

    // Puedes hacer cualquier cosa con estas variables (por ejemplo, crear la factura)
    // Ejemplo hipotético:
    datosUsuario = {
      nombreReal: nombreReal,
      correo: correo,
      telefono: telefono,
      direccion: direccion,
      identificacion: identificacion
    };

    const empresa = await obtenerDatosEmpresa()

    // Aquí asignamos solo los campos que necesitamos a variables locales
    const nombreEmpresa = empresa.datosFactura[0].nombre;
    const correoemp = empresa.datosFactura[0].correo;
    const telefonoemp = empresa.datosFactura[0].telefono;
    const direccionemp = empresa.datosFactura[0].Dirección;
    const identificacionemp = empresa.datosFactura[0].identificacion;

    // Puedes hacer cualquier cosa con estas variables (por ejemplo, crear la factura)
    // Ejemplo hipotético:
    datosEmpresa = {
      nombreEmpresa: nombreEmpresa,
      correo: correoemp,
      telefono: telefonoemp,
      direccion: direccionemp,
      identificacion: identificacionemp
    };



    // Llamar a la función obtenernumero
    const factura = await obtenernumero();


    if (factura && factura.id) {
      numfactura = factura.id;
    } else {
      numfactura = 1; // Asignar 1 si no se encontró ninguna factura
    }


    var codigoUnico = generarCodigoUnico();

    NOfactura = "INVER-" + codigoUnico + "-0" + numfactura;
    // Inicializa fechaActual como un objeto Date
    const fechaActual = new Date();

    // Formatea fechaActual según tus necesidades (por ejemplo, para mostrarla o almacenarla)
    const fechaActualFormateada = fechaActual.toLocaleDateString('es-MX', { timeZone: 'America/Mexico_City' });

    // Ahora, si quieres asignar fechafin como fechaActual + 1 mes
    const fechafin = new Date(fechaActual); // Crea una copia de fechaActual

    // Añade un mes a fechafin
    fechafin.setMonth(fechafin.getMonth() + 1);

    // Formatea fechafin según tus necesidades (por ejemplo, para mostrarla o almacenarla)
    const fechafinFormateada = fechafin.toLocaleDateString('es-MX', { timeZone: 'America/Mexico_City' });

    // Ahora fechafin contiene la fecha de fechaActual + 1 mes en el formato deseado


    // Definir la tabla
    const table = {
      headers: ['Concepto', 'Precio', 'Cantidad', 'Total'],
      rows: []
    };

    function drawTableRow(doc, y, row) {
      const cellPadding = 10;
      const cellWidth = (doc.page.width - doc.page.margins.left - doc.page.margins.right) / 4;

      row.forEach((cell, i) => {
        doc.text(cell, doc.page.margins.left + cellWidth * i + cellPadding, y, {
          width: cellWidth - 2 * cellPadding,
          align: 'left'
        });
      });
    }

    // Dibujar la tabla en el documento
    function drawTable(doc, table) {
      const startY = 350; // Y inicial para la tabla
      const rowHeight = 35;

      // Dibujar encabezados
      drawTableRow(doc, startY, table.headers);

      // Dibujar filas de datos
      table.rows.forEach((row, i) => {
        const y = startY + (i + 1) * rowHeight;
        drawTableRow(doc, y, row);
      });
    }
    // Agregar productos a la tabla y calcular totales
    let totalGeneral = 0;
    // Función para agregar línea azul
    function agregarLineaAzul() {
      doc.moveTo(doc.x, doc.y)
        .lineTo(doc.page.width - doc.page.margins.left - doc.page.margins.right, doc.y)
        .strokeColor('#0000FF')
        .lineWidth(1)
        .stroke();
    }

    function agregarCabecera() {
      const fondoPath = 'src/views/vistas/extras/img/back.jpg';
      const logoPath = 'src/views/vistas/extras/img/logotipo.png'; // Ruta del logo complementario

      // Fondo de la cabecera (repetido en todas las páginas)
      doc.image(fondoPath, {
        fit: [doc.page.width, 100], // Ajustar imagen al ancho de la página y altura 100 puntos
        align: 'center',
        valign: 'top'
      });

      // Logo complementario (superpuesto a la izquierda)
      doc.image(logoPath, 75, 85, { width: 100 });
    }
    facPath = path.join(path.dirname(''), "factura.pdf");

    // Crear el PDF
    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(facPath));
    // Agregar cabecera al principio del documento
    agregarCabecera();
    doc.moveDown();
    doc.moveDown();
    doc.moveDown();
    doc.moveDown();
    doc.moveDown();
    doc.moveDown();
    doc.moveDown();
    doc.fontSize(20).text("Factura de compra", { align: "left" });
    // Agregar los datos de la empresa al PDF
    doc.fontSize(10).text(`${datosEmpresa.nombreEmpresa}`, { align: "right" });
    doc.text(` ${datosEmpresa.identificacion}`, { align: "right" });
    doc.text(`${datosEmpresa.direccion}`, { align: "right" });
    doc.text(`${datosEmpresa.correo}`, { align: "right" });
    doc.text(`${datosEmpresa.telefono}`, { align: "right" });

    // Moverse hacia la misma línea para los siguientes textos
    doc.moveUp();
    doc.moveUp();
    doc.moveUp();
    doc.moveUp();
    doc.fontSize(14).text(`FACTURA NO. ${NOfactura}`, { align: "left" });
    doc.fontSize(14).text("Fecha: " + fechaActualFormateada, { align: "left" });
    doc.fontSize(14).text("Vencimiento: " + fechafinFormateada, { align: "left" });

  
    agregarLineaAzul();
    doc.moveDown();

    doc.fontSize(10).text(`${datosUsuario.nombreReal}`);
    doc.text(` ${datosUsuario.identificacion}`);
    doc.text(`${datosUsuario.direccion}`);
    doc.text(`${datosUsuario.correo}`);
    doc.text(`${datosUsuario.telefono}`);
    agregarLineaAzul();
    doc.moveDown();

    // Agregar productos al PDF
    productosSeleccionados.forEach((producto) => {
      const precioNumerico = parseFloat(producto.precio.replace(/,/g, ''));
      const totalProducto = precioNumerico * producto.cantidad;
      totalGeneral += totalProducto;

      table.rows.push([
        producto.nombreProducto,
        `$${producto.precio}`,
        producto.cantidad,
        `$${totalProducto.toFixed(2)}`
      ]);
    });
    // Dibujar la tabla en el documento
    // Llamar a la función para dibujar la tabla
    drawTable(doc, table);

    doc.moveDown();
    const totalCompraFormatted = totalGeneral.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    doc.text(`Total de la Compra: $${totalCompraFormatted}`);

    doc.end();

    const guardaFaturaResult = await GuardaFactura(productosSeleccionados, datosUsuario, NOfactura);
  }

  const uniqueCode = generateUniqueCode();
  const pdfPath = path.join(path.dirname(''), "ticket.pdf");

  // Crear el PDF
  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(pdfPath));
  doc.fontSize(20).text("Ticket de Compra", { align: "center" });
  doc.moveDown();

  // Agregar productos al PDF
  productosSeleccionados.forEach((producto) => {
    const precioNumerico = parseFloat(producto.precio.replace(/,/g, '')); // Eliminar comas y convertir a número
    totalCompra += precioNumerico * producto.cantidad;
    doc.fontSize(12).text(`Producto: ${producto.nombreProducto}`);
    doc.text(`Entrada: ${producto.entrada}`);
    doc.text(`Salida: ${producto.salida}`);
    doc.text(`Cantidad: ${producto.cantidad}`);
    doc.text(`Precio UNI: $${producto.precio}`);
    doc.moveDown();
  });

  // Generar y agregar el código de barras
  const barcodePath = path.join(path.dirname(''), "barcode.png");
  await generateBarcode(uniqueCode, barcodePath);
  const totalCompraFormatted = totalCompra.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  doc.text(`Total de la Compra: $${totalCompraFormatted}`);
  doc.moveDown();
  doc.text(`Código: ${uniqueCode}`);
  doc.image(barcodePath, { fit: [100, 100], align: "center" });

  doc.end();

  const mailOptions = {
    from: '"Emmanuel Canales Yonca"',
    to: correo,
    subject: "Su ticket de compra",
    text: "Adjuntamos su ticket de compra y factura si fue solicitada.",
    attachments: [
      {
        filename: "ticket.pdf",
        path: pdfPath,

      },
      {
        filename: "factura.pdf",
        path: facPath,
      },
    ],
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send(error.toString());
    }
    res.status(200).send("Email sent: " + info.response);
  });
  const guardarCompraResult = await GuardarCompra(productosSeleccionados, idUser, uniqueCode);

};

// Generar código alfanumérico único
function generateUniqueCode() {
  const length = 16; // Aumenta la longitud para mayor seguridad
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789INVERCOMinvercom";
  let code = "";
  const array = crypto.randomBytes(length); // Utiliza una fuente de aleatoriedad criptográficamente segura

  for (let i = 0; i < length; i++) {
    code += chars.charAt(array[i] % chars.length);
  }

  return code;
}

async function GuardarCompra(productosSeleccionados, idUser, uniqueCode) {
  try {
    let response = {};
    const conn = await obtenerConexion();
    const contenido = JSON.stringify(productosSeleccionados); // Corregir la conversión a JSON
    const id_usuario = idUser;
    const codigo = uniqueCode;

    const query = "INSERT INTO compras (id_usuario, contenido, codigobarras) VALUES (?, ?, ?)";
    const [result] = await conn.query(query, [id_usuario, contenido, codigo]);

    if (result.affectedRows > 0) {
    } else {
      response.error = true;
      response.mensaje = "Error al registrar el producto en la base de datos";
    }

    console.log(response);
  } catch (error) {
    throw new Error("Error interno del servidor");
  }
}

async function GuardaFactura(productosSeleccionados, datosUsuario, NOfactura) {
  try {
    let response = {};
    const conn = await obtenerConexion();
    const contenido = JSON.stringify(productosSeleccionados); // Corregir la conversión a JSON
    const DatosUsuario = JSON.stringify(datosUsuario);
    const noFactura = NOfactura;

    const query = "INSERT INTO facturas_Entregadas (numero_factura, comprador_datos, compra_datos) VALUES (?, ?, ?)";
    const [result] = await conn.query(query, [noFactura, DatosUsuario, contenido]);

    if (result.affectedRows > 0) {
    } else {
      response.error = true;
      response.mensaje = "Error al registrar el producto en la base de datos";
    }
    console.log(response);
  } catch (error) {
    throw new Error("Error interno del servidor");
  }
}

async function obtenerDatosUsuario(idUser) {

  const conn = await obtenerConexion(); // Asumo que obtenerConexion() te da una conexión a tu base de datos

  try {
    const sql = "SELECT * FROM perfil WHERE idUsuario = ?";
    const [rows] = await conn.query(sql, [idUser]);

    if (rows.length > 0) {
      return { perfil: rows }
    }

  } catch (error) {
    console.error("Error en verificarPerfil:", error);
  } finally {
    conn.end(); // Cierra la conexión a la base de datos
  }
}

const obtenerDatosEmpresa = async (req, res) => {
  let response = {};
  const conn = await obtenerConexion();

  try {
    const sql = "SELECT * FROM datosfactura";
    const [rows] = await conn.query(sql);

    if (rows.length > 0) {
      return { datosFactura: rows }
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
    console.log(response);
  }
};

const obtenernumero = async (req, res) => {
  let response = {};
  const conn = await obtenerConexion();

  try {
    const sql = "SELECT MAX(id) AS max_id FROM facturas_entregadas";
    const [rows] = await conn.query(sql);

    if (rows.length > 0 && rows[0].max_id !== null) {
      // Si se encontró el máximo ID, retornar ese valor
      return { id: rows[0].max_id+1 };
    } else {
      return null; // Si no se encontraron filas o el máximo ID es null
    }
  } catch (error) {
    console.error("Error en obtenernumero:", error);
    response.error = true;
    response.mensaje = "Error en la operación";
    return null; // Retornar null en caso de error
  } finally {
    // Siempre cerrar la conexión en el bloque finally para liberar recursos
    conn.end();
  }
};



function generarCodigoUnico() {
  var codigoUnico = "";
  var caracteres =
    "INVERCOMinvercom0123456789";
  for (var i = 0; i < 5; i++) {
    codigoUnico += caracteres.charAt(
      Math.floor(Math.random() * caracteres.length)
    );
  }
  return codigoUnico;
}



// Exportar la función
export default { verificarCorreo, ticket };
