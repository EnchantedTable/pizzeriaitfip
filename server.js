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

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Conectado a la base de datos"))
    .catch(err => console.log(err));


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
        res.status(201).send('Pedido guardado');
    } catch (error) {
        res.status(500).send('Error al guardar el pedido');
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});