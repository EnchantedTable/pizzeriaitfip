const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // Servir archivos estáticos

// Conectar a MongoDB (ajusta la URI con tus credenciales)
const mongoURI = "mongodb+srv://faroy2005:YpKAgMDkuUgwRflr@pizzeria.hee9g.mongodb.net/?retryWrites=true&w=majority&appName=pizzeria";

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true , serverSelectionTimeoutMS: 20000})
    .then(() => console.log("Conectado a la base de datos"))
    .catch(err => console.error("Error de conexión a MongoDB:", err)); // Imprimir error de conexión


// Esquema de Pedido
const pedidoSchema = new mongoose.Schema({
    mesa: Number,
    pizza: String,
    cantidad: Number
});

const Pedido = mongoose.model('Pedido', pedidoSchema);

// Ruta para recibir el formulario
app.post('/api/pedido', async (req, res) => {
    const { mesa, pizza, cantidad } = req.body;

    const nuevoPedido = new Pedido({
        mesa,
        pizza,
        cantidad
    });

    try {
        await nuevoPedido.save();
        res.redirect('/success.html');
    } catch (error) {
        console.error("Error al guardar el pedido:", error); // Imprimir error al guardar
        res.status(500).send('Error al guardar el pedido');
    }
});
app.get('/api/pedidos', async (req, res) => {
    try {
        const pedidos = await Pedido.find(); // Obtiene todos los pedidos de la base de datos
        res.status(200).json(pedidos); // Devuelve los pedidos en formato JSON
    } catch (error) {
        console.error('Error al obtener los pedidos:', error);
        res.status(500).send('Error al obtener los pedidos');
    }
});
// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
