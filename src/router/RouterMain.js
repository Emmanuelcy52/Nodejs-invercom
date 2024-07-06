import { Router } from "express";
import EmailController  from '../control/emailController.js';
const router = Router();


router.post('/verificar-correo', EmailController.verificarCorreo);
router.post('/ticket-pago',EmailController.ticket);

// exportar la función
export default router ;