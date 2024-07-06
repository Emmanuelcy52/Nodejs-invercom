import obtenerConexion from "../../conexion.js";
import bcrypt from 'bcrypt';

const Registro = async (req, res) => {
    const conn = await obtenerConexion();
    const { fullname, username, password, confirm_password } = req.body;
    const response = {};

    if (!fullname || !username || !password || !confirm_password) {
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
        let sql = "SELECT * FROM administradores WHERE nombre_administrador = ?";
        let [rows] = await conn.query(sql, [username]);

        if (rows.length > 0) {
            response.error = true;
            response.mensaje = "Ese usuario ya existe por favor selecciona otro.";
            return res.json(response);
        }

        sql = "INSERT INTO administradores (nombre_administrador, contrasena, nombre_real) VALUES (?, ?, ?)";
        await conn.query(sql, [username, hashContrasena, fullname]);

        if (rows.length > 0) {
            response.error = false;
            response.mensaje = "Administrador registrado con exito";
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
        const sql = "SELECT * FROM administradores WHERE nombre_administrador = ?";
        const [rows] = await conn.query(sql, [username]);

        if (rows.length > 0) {
            const user = rows[0];

            if (await bcrypt.compare(password, user.contrasena)) {
                req.session.usuario = user.nombre_administrador;
                req.session.id_usuario = user.id;


                response.mensaje = `¡Bienvenido, ${user.nombre_administrador}! Inicio de sesión exitoso.`;
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

const verificarSesion = async (req, res) => {
    const conn = await obtenerConexion();
    const response = {};
    const password = "Admin123";
    const username = "Admin";
    const fullname = "Usuario por defecto";

    try {
        let sql = "SELECT * FROM administradores";
        const [rows] = await conn.query(sql);

        if (rows.length > 0) {
            if (req.session.usuario) {
                const respuesta = {
                    error: false,
                    mensaje: '¡Bienvenido de nuevo!',
                    idUsuario: req.session.id_usuario,
                    usuario: req.session.usuario
                };
                res.json(respuesta);
            } else {
                response.error = true;
                response.mensaje = '¡Hola! Te invitamos a iniciar sesión o registrarte para disfrutar de todas nuestras funciones.';
                res.json(response);
            }
        } else {
            const hashContrasena = await bcrypt.hash(password, 10);
            sql = "INSERT INTO administradores (nombre_administrador, contrasena, nombre_real) VALUES (?, ?, ?)";
            await conn.query(sql, [username, hashContrasena, fullname]);

            // Después de insertar el administrador, obtén los datos insertados
            sql = "SELECT * FROM administradores WHERE nombre_administrador = ?";
            const [newAdminRows] = await conn.query(sql, [username]);

            if (newAdminRows.length > 0) {
                const newAdminData = newAdminRows[0];
                response.error = false;
                response.mensaje = "Se creó un perfil de Administrador para iniciar sesión. Tus datos para iniciar sesión son:";
                response.datos = {
                    username: newAdminData.nombre_administrador,
                    password: password,
                    fullname: newAdminData.nombre_real
                };
                res.json(response);
            } else {
                response.error = true;
                response.mensaje = "Error al obtener los datos del nuevo administrador.";
                res.json(response);
            }
        }
        
    } catch (error) {
        response.error = true;
        response.mensaje = 'Error al intentar iniciar sesión. Por favor, inténtalo de nuevo más tarde.';
        res.json(response);
    } finally {
        // Siempre cerrar la conexión en el bloque finally para liberar recursos
        conn.end();
    }
};



// exportar la función
export default {
    Registro,
    verificarSesion,
    IniciarSesion
};