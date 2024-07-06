import mysql from 'mysql2';
import obtenerConexion from './conexion.js';

async function crearTablas() {
  try {
    const conn = await obtenerConexion();

    const sqlQueries = [
        `CREATE TABLE IF NOT EXISTS Usuarios (
            id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            nombre_usuario VARCHAR(30) NOT NULL,
            contrasena VARCHAR(70) NOT NULL,
            nombre_real VARCHAR(30) NOT NULL,
            correo VARCHAR(30) NOT NULL,
            Cuenta_valida VARCHAR(30) NOT NULL,
            fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8;`,

           `CREATE TABLE IF NOT EXISTS administradores (
            id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            nombre_administrador VARCHAR(30) NOT NULL,
            contrasena VARCHAR(70) NOT NULL,
            nombre_real VARCHAR(30) NOT NULL,
            creador VARCHAR(30) NOT NULL,
            fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8;`,
    
          `CREATE TABLE IF NOT EXISTS validar_correo (
            id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            id_usuario VARCHAR(30) NOT NULL,
            codigo VARCHAR(10) NOT NULL,
            fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8;`,
    
          `CREATE TABLE IF NOT EXISTS Perfil (
            id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            idUsuario INT(6) NOT NULL,
            nombre_usuario VARCHAR(30) NOT NULL,
            nombre_real VARCHAR(30),
            correo VARCHAR(50) NOT NULL,
            telefono VARCHAR(15) NOT NULL,
            direccion VARCHAR(100) NOT NULL,
            identificacion  VARCHAR(100) NOT NULL,
            fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            fech_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8;`,
    
          `CREATE TABLE IF NOT EXISTS productos (
            id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            nombreInversor VARCHAR(100) NOT NULL,
            informacion_tipo JSON NOT NULL,
            imagen_url JSON NOT NULL,
            fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8;`,
    
          `CREATE TABLE IF NOT EXISTS carrito (
            id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            id_usuario VARCHAR(100) NOT NULL,
            contenido JSON NOT NULL,
            fecha_ultima_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8;`,

          `CREATE TABLE IF NOT EXISTS compras (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            id_usuario VARCHAR(100) NOT NULL,
            contenido JSON NOT NULL,
            codigobarras VARCHAR(100) NOT NULL,
            fecha_compra TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8;`,

           `CREATE TABLE IF NOT EXISTS DatosFactura (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            nombre  VARCHAR(100) NOT NULL,
            Dirección  VARCHAR(100) NOT NULL,
            identificacion  VARCHAR(100) NOT NULL,
            telefono VARCHAR(15) NOT NULL,
            correo VARCHAR(50) NOT NULL,
            fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8;`,

          `CREATE TABLE IF NOT EXISTS facturas_Entregadas (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            numero_factura VARCHAR(100) NOT NULL,
            comprador_datos JSON NOT NULL,
            compra_datos JSON NOT NULL,
            fecha_factura TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )`
    ];

    for (const query of sqlQueries) {
      await conn.query(query);
      console.log(`Tabla creada correctamente: ${query}`);
    }

    await conn.end(); // Aquí es conn, no connection
    console.log('Conexión cerrada.');
  } catch (error) {
    console.error('Error al crear tablas:', error);
  }
}

// Ejecutar la función para crear las tablas
crearTablas();
