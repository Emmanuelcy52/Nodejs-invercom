import { Router } from "express";
import UserController from '../control/jsDB/usuario/controlUsuario.js'
const Userrouter = Router();
const userController = UserController;
// Middleware para imprimir los datos de la solicitud


Userrouter.post('/login', userController.IniciarSesion);
Userrouter.post('/obtenerDatos',userController.obtenerDatos);
Userrouter.post('/verificarPerfil',userController.verificarPerfil);
Userrouter.post('/llenarperfil',userController.llenarPerfil);
Userrouter.post('/register', userController.RegistroUsuario);
Userrouter.post('/validarCorreo',userController.validarCorreo);
Userrouter.get('/verificarSession',userController.verificarSesion);
Userrouter.get('/cerrarSession',userController.cerrarSesion);

export default Userrouter;