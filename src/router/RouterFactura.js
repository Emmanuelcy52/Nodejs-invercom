import { Router } from "express";
import FacturaController from '../control/jsDB/Facturas/FacturasControl.js'
const Facturarouter = Router();
const facturaController = FacturaController;

Facturarouter.post('/RegistarDatos',facturaController.RegistrarDatos);
Facturarouter.get('/obtenerDatos',facturaController.ObtenerDatos);
Facturarouter.post('/EliminarDatos',facturaController.EliminarDatos);
Facturarouter.post('/ActualizarDatos',facturaController.ActualizarDatos);
Facturarouter.get('/obtenernumero',facturaController.Obtenernumero);

export default Facturarouter;