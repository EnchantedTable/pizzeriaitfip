const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());  // Para manejar solicitudes JSON
app.use(express.static('public')); // Servir archivos estáticos

// Conectar a MongoDB
const mongoURI = "mongodb+srv://faroy2005:YpKAgMDkuUgwRflr@pizzeria.hee9g.mongodb.net/?retryWrites=true&w=majority&appName=pizzeria";

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true , serverSelectionTimeoutMS: 20000})
    .then(() => console.log("Conectado a la base de datos"))
    .catch(err => console.error("Error de conexión a MongoDB:", err));

// Esquema de Pedido
const pedidoSchema = new mongoose.Schema({
    mesa: Number,
    pizza: String,
    cantidad: Number,
    estado: { type: String, default: 'pendiente' }  // Estado del pedido
});

const Pedido = mongoose.model('Pedido', pedidoSchema);

// Ruta para recibir el formulario y agregar un nuevo pedido
app.post('/api/pedido', async (req, res) => {
    const { mesa, pizza, cantidad } = req.body;

    const nuevoPedido = new Pedido({
        mesa,
        pizza,
        cantidad
    });

    try {
        await nuevoPedido.save();
        res.status(201).json({ message: 'Pedido realizado con éxito' });
    } catch (error) {
        console.error("Error al guardar el pedido:", error);
        res.status(500).send('Error al guardar el pedido');
    }
});

// Ruta para obtener todos los pedidos
app.get('/api/pedidos', async (req, res) => {
    try {
        const pedidos = await Pedido.find();  // Obtener todos los pedidos
        res.status(200).json(pedidos);  // Enviar los pedidos como JSON
    } catch (error) {
        console.error('Error al obtener los pedidos:', error);
        res.status(500).send('Error al obtener los pedidos');
    }
});

// Ruta para despachar un pedido y actualizar su estado
app.put('/api/pedido/:id', async (req, res) => {
    try {
        const pedidoId = req.params.id;

        // Actualizar el estado del pedido a 'finalizado'
        const pedido = await Pedido.findByIdAndUpdate(pedidoId, { estado: 'finalizado' }, { new: true });
        if (!pedido) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }

        res.status(200).json({ message: 'Pedido despachado', pedido });
    } catch (error) {
        console.error('Error al despachar el pedido:', error);
        res.status(500).send('Error al despachar el pedido');
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
