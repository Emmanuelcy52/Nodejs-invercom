import { Router } from "express";
import pagoStripe from '../control/js/pagoStripe.js';

const Checkoutorouter = Router();
const PagoStripe = pagoStripe;



// Ruta de pago
Checkoutorouter.post('/pagar', PagoStripe.Pagar);
Checkoutorouter.post('/pagoDirecto',pagoStripe.pagoDirecto);

export default Checkoutorouter;
