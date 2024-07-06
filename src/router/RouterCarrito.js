import { Router } from "express";
import CarritoController from '../control/jsDB/carrito/CarritoControl.js'
const Carritorouter = Router();
const carritoController = CarritoController;
// Middleware para imprimir los datos de la solicitud

Carritorouter.get('/Obtener',carritoController.obtenerCarrito);
Carritorouter.post('/eliminar',carritoController.eliminarCarrito);
Carritorouter.post('/actualizarCantidad',carritoController.ActualizarCantidad);
Carritorouter.post('/eliminarProducto',carritoController.EliminarProducto);


export default Carritorouter;