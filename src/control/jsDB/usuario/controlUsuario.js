import obtenerConexion from "../../conexion.js";
import bcrypt from 'bcrypt';
import EmailController from "../../emailController.js";


const IniciarSesion = async (req, res) => {
    const conn = await obtenerConexion();
    const { username, password } = req.body;
    const response = {};

    if (!username || !password) {
        response.error = true;
        response.mensaje = 'No se recibieron todos los datos necesarios o algunos están vacíos.';
        return res.json(response);
    }

    try {
        const sql = "SELECT * FROM usuarios WHERE nombre_usuario = ?";
        const [rows] = await conn.query(sql, [username]);

        if (rows.length > 0) {
            const user = rows[0];

            if (await bcrypt.compare(password, user.contrasena)) {
                req.session.usuario = user.nombre_usuario;
                req.session.id_usuario = user.id;
                req.session.correo = user.correo;

                
                response.mensaje = `¡Bienvenido, ${user.nombre_usuario}! Inicio de sesión exitoso.`;
                return res.json(response);
            } else {
                response.error = true;
                response.mensaje = 'Contraseña incorrecta. Por favor, inténtalo de nuevo.';
                return res.json(response);
            }
        } else {
            response.error = true;
            response.mensaje = 'Usuario no encontrado. Verifica el nombre de usuario e inténtalo de nuevo.';
            return res.json(response);
        }
    } catch (error) {
        response.error = true;
        response.mensaje = 'Error al intentar iniciar sesión. Por favor, inténtalo de nuevo más tarde.';
        return res.json(response);
    } finally {
        // Siempre cerrar la conexión en el bloque finally para liberar recursos
        conn.end();
    }
};
const RegistroUsuario = async (req, res) => {
    const conn = await obtenerConexion();
    const { fullname, email, username, password, confirm_password } = req.body;
    const cuenta = "Inactiva";
    const codigo = Math.random().toString(36).substr(2, 5); // Generar un código único
    const response = {};

    if (!fullname || !email || !username || !password || !confirm_password) {
        response.error = true;
        response.mensaje = 'No se recibieron todos los datos necesarios o algunos están vacíos.';
        return res.json(response);
    }

    if (password !== confirm_password) {
        response.error = true;
        response.mensaje = 'Las contraseñas no coinciden';
        return res.json(response);
    }

    const hashContrasena = await bcrypt.hash(password, 10);

    try {
        let sql = "SELECT * FROM usuarios WHERE nombre_usuario = ?";
        let [rows] = await conn.query(sql, [username]);

        if (rows.length > 0) {
            response.error = true;
            response.mensaje = "Ese usuario ya existe por favor selecciona otro.";
            return res.json(response);
        }

        sql = "INSERT INTO usuarios (nombre_usuario, contrasena, nombre_real, correo, Cuenta_valida) VALUES (?, ?, ?, ?, ?)";
        await conn.query(sql, [username, hashContrasena, fullname, email, cuenta]);

        sql = "SELECT * FROM usuarios WHERE nombre_usuario = ? AND Cuenta_valida = ?";
        [rows] = await conn.query(sql, [username, cuenta]);

        if (rows.length > 0) {
            const user = rows[0];
            const idUser = user.id;

            // Eliminar registros antiguos de validar_correo
            const delete_sql = "DELETE FROM validar_correo WHERE fecha_creacion < DATE_SUB(NOW(), INTERVAL 10 MINUTE)";
            await conn.query(delete_sql);

            // Insertar en validar_correo
            sql = "INSERT INTO validar_correo (id_usuario, codigo) VALUES (?, ?)";
            await conn.query(sql, [idUser, codigo]);

            // Enviar correo de verificación
            const postData = {
                nombre: fullname,
                correo: email,
                codigo: codigo,
                accion: 'Verificar_Correo'
            };
            await EmailController.verificarCorreo({ body: postData }, { 
                json: (data) => {
                    if (data.error) {
                        res.json({ error: true, mensaje: "Error al enviar el correo de verificación." });
                    } else {
                        res.json({ mensaje: "Usuario registrado y correo de verificación enviado. Por favor revisa tu correo para actualizar tu perfil." });
                    }
                }
            });
        } else {
            response.error = true;
            response.mensaje = "Usuario no encontrado. Verifica el nombre de usuario e inténtalo de nuevo.";
            res.json(response);
        }
    } catch (error) {
        response.error = true;
        response.mensaje = "Error al intentar registrar el usuario. Por favor, inténtalo de nuevo más tarde.";
        res.json(response);
    } finally {
        // Siempre cerrar la conexión en el bloque finally para liberar recursos
        conn.end();
    }
};
const validarCorreo = async (req, res) => {
    const conn = await obtenerConexion();
    try {
        const { codigo } = req.body;
        const sql = "SELECT * FROM validar_correo WHERE codigo = ?";
        const [rows] = await conn.query(sql, [codigo]);
        
        if (rows.length > 0) {
            const id_usuario = rows[0].id_usuario;
            const updateSql = "UPDATE usuarios SET Cuenta_valida = ? WHERE id = ?";
            const [result] = await conn.query(updateSql, ["Valida", id_usuario]);

            if (result.affectedRows > 0) {
                res.json({ mensaje: "La cuenta se ha validado correctamente." });
            } else {
                res.json({ error: true, mensaje: "No se encontró ningún usuario con el ID especificado." });
            }
        } else {
            res.json({ error: true, mensaje: "Código incorrecto." });
        }
    } catch (error) {
        res.json({ error: true, mensaje: "Error al intentar validar el correo: " + error.message });
    } finally {
        // Siempre cerrar la conexión en el bloque finally para liberar recursos
        conn.end();
    }
};
const verificarSesion = (req, res) => {
    if (req.session.usuario) {
        const respuesta = {
            error: false,
            mensaje: '¡Bienvenido de nuevo!',
            idUsuario: req.session.id_usuario,
            usuario: req.session.usuario
        };
        res.json(respuesta);
    } else {
        const respuesta = {
            error: true,
            mensaje: '¡Hola! Te invitamos a iniciar sesión o registrarte para disfrutar de todas nuestras funciones.'
        };
        res.json(respuesta);
    }
};
const cerrarSesion = (req, res) =>{
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ error: true, mensaje: 'Error al cerrar la sesión.' });
        }

        // Eliminar la cookie de la sesión
        res.clearCookie('connect.sid'); // El nombre de la cookie depende de la configuración del middleware de sesión

        // Enviar la respuesta
        // Enviar la respuesta
        res.json({ mensaje: 'Has cerrado la sesión.' });
    });
}

const obtenerDatos = async(req, res) =>{

    const idUser = req.body.idusuario; // Aquí deberías capturar el idusuario desde el body
  
    const conn = await obtenerConexion(); // Asumo que obtenerConexion() te da una conexión a tu base de datos
  
    let response = {};
    
    try {
      const sql = "SELECT * FROM usuarios WHERE id = ?";
      const [rows] = await conn.query(sql, [idUser]);
  
      if (rows.length > 0) {
        response.usuario = rows[0];
      } else {
        response.error = true;
        response.mensaje = 'el usuario no existe';
      }
  
    } catch (error) {
      console.error("Error al obtener los datos", error);
      response.error = true;
      response.mensaje = 'Error en el servidor';
    } finally {
      conn.end(); // Cierra la conexión a la base de datos
  
      // Asegúrate de enviar la respuesta como JSON
      res.json(response);
    }
}

const llenarPerfil = async (req, res) => {
    const { idusuario, fullname, email, username, telefono, direccion, identificacion } = req.body;

    let response = {};

    if (!idusuario || !fullname || !email || !username || !telefono || !direccion || !identificacion) {
        response.error = true;
        response.mensaje = "No se recibieron todos los datos necesarios o algunos están vacíos.";
        return res.json(response);
    }

    const conn = await obtenerConexion(); // Función para obtener la conexión a la base de datos

    try {
        const sql = "INSERT INTO perfil (idUsuario, nombre_real, correo, nombre_usuario, telefono, direccion, identificacion) VALUES (?, ?, ?, ?, ?, ?, ?)";
        await conn.query(sql, [idusuario, fullname, email, username, telefono, direccion, identificacion]);

        response.error = false;
        response.mensaje = "Datos registrados correctamente";

    } catch (error) {
        response.error = true;
        response.mensaje = "Error en la operación: " + error.message;
        console.error(error);
    } finally {
        if (conn) conn.end(); // Cerrar la conexión después de ejecutar la consulta

        res.json(response);
    }
};

const verificarPerfil = async (req, res) => {
    const idUser = req.body.idusuario; // Aquí deberías capturar el idusuario desde el body
  
    const conn = await obtenerConexion(); // Asumo que obtenerConexion() te da una conexión a tu base de datos
  
    let response = {};
    
    try {
      const sql = "SELECT * FROM perfil WHERE idUsuario = ?";
      const [rows] = await conn.query(sql, [idUser]);
  
      if (rows.length > 0) {
        response.error = false;
        response.mensaje = 'Perfil llenado';
        response.encontrado = true
        response.perfil = rows
      } else {
        response.error = true;
        response.mensaje = 'Redirijiendo a llenar perfil para comprar';
      }
  
    } catch (error) {
      console.error("Error en verificarPerfil:", error);
      response.error = true;
      response.mensaje = 'Error en el servidor';
    } finally {
      conn.end(); // Cierra la conexión a la base de datos
  
      // Asegúrate de enviar la respuesta como JSON
      res.json(response);
    }
  };
  



// exportar la función
export default { 
    IniciarSesion,
    RegistroUsuario,
    validarCorreo,
    verificarSesion,
    cerrarSesion,
    llenarPerfil,
    verificarPerfil,
    obtenerDatos
};