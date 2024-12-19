const express = require('express');
const fs = require('fs');
const path = require('path');
const cors=require('cors');
const app = express();
const PORT = 3000;

// Ruta del archivo JSON
const CONTEXTOS_FILE = path.join(__dirname, 'contextos.json');

// Middleware para manejar JSON
app.use(cors());
app.use(express.json());

// Función para leer contextos del archivo
function leerContextos() {
    if (!fs.existsSync(CONTEXTOS_FILE)) {
        fs.writeFileSync(CONTEXTOS_FILE, JSON.stringify([]));
    }
    const data = fs.readFileSync(CONTEXTOS_FILE);
    return JSON.parse(data);
}

// Función para guardar contextos en el archivo
function guardarContextos(contextos) {
    fs.writeFileSync(CONTEXTOS_FILE, JSON.stringify(contextos, null, 2));
}

// Obtener todos los contextos
app.get('/contextos', (req, res) => {
    const contextos = leerContextos();
    res.json(contextos);
});

// Agregar un nuevo contexto
app.post('/contextos', (req, res) => {
    const nombre = req.body.nombre;
    const tipo_control = req.body.tipo_control;
    const opciones = req.body.opciones;
    const texto_contexto = req.body.texto_contexto;

    if (!nombre || !tipo_control || !opciones || !texto_contexto) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const contextos = leerContextos();
    let maxId = 0;
    for (let i = 0; i < contextos.length; i++) {
        if (contextos[i].id > maxId) {
            maxId = contextos[i].id;
        }
    }

    const nuevoContexto = {
        id: maxId + 1,
        nombre: nombre,
        tipo_control: tipo_control,
        opciones: opciones,
        texto_contexto: texto_contexto
    };

    contextos.push(nuevoContexto);
    guardarContextos(contextos);
    res.status(201).json(nuevoContexto);
});

// Editar un contexto existente
app.put('/contextos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const nombre = req.body.nombre;
    const tipo_control = req.body.tipo_control;
    const opciones = req.body.opciones;
    const texto_contexto = req.body.texto_contexto;

    const contextos = leerContextos();
    let contextoEncontrado = false;

    for (let i = 0; i < contextos.length; i++) {
        if (contextos[i].id === id) {
            contextos[i].nombre = nombre || contextos[i].nombre;
            contextos[i].tipo_control = tipo_control || contextos[i].tipo_control;
            contextos[i].opciones = opciones || contextos[i].opciones;
            contextos[i].texto_contexto = texto_contexto || contextos[i].texto_contexto;
            contextoEncontrado = true;
            break;
        }
    }

    if (!contextoEncontrado) {
        return res.status(404).json({ error: 'Contexto no encontrado' });
    }

    guardarContextos(contextos);
    res.json({ id: id, nombre: nombre, tipo_control: tipo_control, opciones: opciones, texto_contexto: texto_contexto });
});

// Eliminar un contexto
app.delete('/contextos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const contextos = leerContextos();

    let index = -1;
    for (let i = 0; i < contextos.length; i++) {
        if (contextos[i].id === id) {
            index = i;
            break;
        }
    }

    if (index === -1) {
        return res.status(404).json({ error: 'Contexto no encontrado' });
    }

    const contextoEliminado = contextos.splice(index, 1);
    guardarContextos(contextos);
    res.json(contextoEliminado[0]);
});

// Servidor
app.listen(PORT, () => {
    console.log(`Servidor API escuchando en http://localhost:${PORT}`);
});
