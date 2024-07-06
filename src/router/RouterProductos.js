import { Router } from "express";
import ProducController from '../control/jsDB/productos/productoControl.js'
const Producrouter = Router();
const producController = ProducController;
// Middleware para imprimir los datos de la solicitud

Producrouter.post('/Registar',producController.uploadMiddleware, producController.registroProducto);
Producrouter.get('/obtenerProducto',producController.obtenerProducto);
Producrouter.post('/AgregarCarrito',producController.AgregarCarrito);
Producrouter.get('/obtenerProductos',producController.obtenerProductoscrud);
Producrouter.get('/ObtenerPorId',producController.obtenerProductoid);
Producrouter.post('/Editar',producController.uploadMiddleware,producController.EditarProducto);
Producrouter.post('/eliminarProducto',producController.eliminarProducto);

export default Producrouter;