const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public')); // Servir archivos estáticos

// Conectar a MongoDB
const mongoURI = "mongodb+srv://faroy2005:YpKAgMDkuUgwRflr@pizzeria.hee9g.mongodb.net/?retryWrites=true&w=majority&appName=pizzeria";
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true, serverSelectionTimeoutMS: 20000 })
    .then(() => console.log("Conectado a la base de datos"))
    .catch(err => console.error("Error de conexión a MongoDB:", err));

// Esquema de Pizza
const pizzaSchema = new mongoose.Schema({
    nombre: String,
    descripcion: String,
    precio: Number,
    imagen: String
});

const Pizza = mongoose.model('Pizza', pizzaSchema);

// Ruta para obtener todas las pizzas
app.get('/api/pizzas', async (req, res) => {
    try {
        const pizzas = await Pizza.find(); // Obtener todas las pizzas
        res.status(200).json(pizzas);  // Enviar las pizzas como JSON
    } catch (error) {
        console.error('Error al obtener las pizzas:', error);
        res.status(500).send('Error al obtener las pizzas');
    }
});

// Ruta para crear una nueva pizza
app.post('/api/pizza', async (req, res) => {
    const { nombre } = req.body;

    const nuevaPizza = new Pizza({ nombre });

    try {
        await nuevaPizza.save();
        res.status(201).json({ message: 'Pizza creada con éxito' });
    } catch (error) {
        console.error('Error al guardar la pizza:', error);
        res.status(500).send('Error al guardar la pizza');
    }
});

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

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
