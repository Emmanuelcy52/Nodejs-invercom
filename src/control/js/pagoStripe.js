import Stripe from "stripe";
import { AxiosHeaders } from "axios";
import stripeKeys from './stripe-keys.js'
const stripe = new Stripe(stripeKeys.secret);
const Pagar = async (req, res) => {
    var factura
    var procedencia = "carrito";
    const body = await req.body;

    // Filtrar el body para excluir objetos con factura: true
    const filteredBody = body.filter(producto => {
        if (producto.factura !== undefined) {
            // Guardar el valor de factura en una variable
            factura = producto.factura;
            return false; // No incluir este producto en filteredBody
        }
        return true; // Incluir todos los otros productos
    });

    // Construir los line_items dinámicamente a partir de filteredBody
    const lineItems = filteredBody.map(producto => ({
        price_data: {
            currency: 'mxn',
            product_data: {
                name: producto.nombreProducto,
            },
            unit_amount: parseFloat(producto.precioProducto.replace(',', '')) * 100,
        },
        quantity: producto.cantidad,
    }));

    const cantidadProductosURL = filteredBody.map(producto => producto.cantidad).join('&cantidad=');

    var successUrl = "http://localhost:3000/vistas/html/compras.html?cantidad=" + cantidadProductosURL + "&procedencia=" + procedencia;

    if (factura !== undefined) {
        successUrl += "&factura=" + factura; // Agregar factura a la URL si está definida
    }

    const session = await stripe.checkout.sessions.create({
        success_url: successUrl,
        line_items: lineItems,
        mode: "payment",
    });

    res.json(session);
}


const pagoDirecto = async (req, res) => {
    var procedencia = "PagoDirecto";
    const body = await req.body;

    // Construir los line_items dinámicamente a partir de body
    const lineItems = body.map(producto => ({
        price_data: {
            currency: 'mxn',
            product_data: {
                name: producto.nombreProducto,
            },
            unit_amount: parseFloat(producto.precioProducto.replace(',', '')) * 100,
        },
        quantity: producto.cantidad,
    }));

    // Convertir body a JSON y luego a cadena URL codificada
    const datosJSON = encodeURIComponent(JSON.stringify(body));

    var successUrl = "http://localhost:3000/vistas/html/compras.html?procedencia=" + procedencia + "&datos=" + datosJSON ;

    const session = await stripe.checkout.sessions.create({
        success_url: successUrl,
        line_items: lineItems,
        mode: "payment",
    });
    res.json(session);
}


export default {
    Pagar,
    pagoDirecto,
};