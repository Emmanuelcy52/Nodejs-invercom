import mysql from 'mysql2/promise'; // Importa la versión promisificada de mysql2

async function obtenerConexion() {
    try {
        const conn = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'invertshop'
        });
        return conn;
    } catch (err) {
        console.error('Conexión fallida: ' + err.message);
        throw err;
    }
}

export default obtenerConexion;
