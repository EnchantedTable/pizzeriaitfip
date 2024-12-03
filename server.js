const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));  // Servir archivos estáticos (CSS, JS, HTML)

// Conectar a MongoDB
const mongoURI = process.env.MONGO_URI || "mongodb+srv://faroy2005:YpKAgMDkuUgwRflr@pizzeria.hee9g.mongodb.net/?retryWrites=true&w=majority&appName=pizzeria";
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.error('Error al conectar a MongoDB:', err));

// Esquema de Pizza
const pizzaSchema = new mongoose.Schema({
    nombre: String,
    ingredientes: [String],
    precio: Number,
    imagen: String,  // URL o path de la imagen
});

const Pizza = mongoose.model('Pizza', pizzaSchema);

// Esquema de Pedido
const pedidoSchema = new mongoose.Schema({
    mesa: Number,
    pizza: String,
    cantidad: Number,
    estado: { type: String, default: 'pendiente' }  // Estado del pedido
});

const Pedido = mongoose.model('Pedido', pedidoSchema);

// Ruta para obtener todas las pizzas
app.get('/api/pizzas', async (req, res) => {
    try {
        const pizzas = await Pizza.find();  // Obtener todas las pizzas
        res.status(200).json(pizzas);  // Enviar las pizzas como JSON
    } catch (error) {
        console.error('Error al obtener las pizzas:', error);
        res.status(500).send('Error al obtener las pizzas');
    }
});

// Ruta para agregar una nueva pizza
app.post('/api/pizza', async (req, res) => {
    const { nombre, ingredientes, precio, imagen } = req.body;

    const nuevaPizza = new Pizza({
        nombre,
        ingredientes,
        precio,
        imagen
    });

    try {
        await nuevaPizza.save();
        res.status(201).json({ message: 'Pizza creada con éxito' });
    } catch (error) {
        console.error("Error al guardar la pizza:", error);
        res.status(500).send('Error al guardar la pizza');
    }
});

// Ruta para editar una pizza existente
app.put('/api/pizza/:id', async (req, res) => {
    const pizzaId = req.params.id;
    const { nombre, ingredientes, precio, imagen } = req.body;

    try {
        const pizza = await Pizza.findByIdAndUpdate(pizzaId, {
            nombre,
            ingredientes,
            precio,
            imagen
        }, { new: true });

        if (!pizza) {
            return res.status(404).json({ message: 'Pizza no encontrada' });
        }

        res.status(200).json({ message: 'Pizza actualizada con éxito', pizza });
    } catch (error) {
        console.error('Error al actualizar la pizza:', error);
        res.status(500).send('Error al actualizar la pizza');
    }
});

// Ruta para eliminar una pizza
app.delete('/api/pizza/:id', async (req, res) => {
    const pizzaId = req.params.id;

    try {
        const pizza = await Pizza.findByIdAndDelete(pizzaId);

        if (!pizza) {
            return res.status(404).json({ message: 'Pizza no encontrada' });
        }

        res.status(200).json({ message: 'Pizza eliminada con éxito' });
    } catch (error) {
        console.error('Error al eliminar la pizza:', error);
        res.status(500).send('Error al eliminar la pizza');
    }
});

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

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
