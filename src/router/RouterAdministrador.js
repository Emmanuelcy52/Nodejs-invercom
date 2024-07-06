import { Router } from "express";
import AdminController from '../control/jsDB/administrador/administradorcontrol.js'
const Adminrouter = Router();
const adminController = AdminController;


Adminrouter.post('/register', adminController.Registro);
Adminrouter.get('/verificarSession', adminController.verificarSesion);
Adminrouter.post('/iniciarSession', adminController.IniciarSesion);

export default Adminrouter;