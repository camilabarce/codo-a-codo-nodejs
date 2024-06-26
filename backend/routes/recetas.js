const express = require('express');
const router = express.Router();

const multer = require('multer')

const upload = multer({ dest: 'uploads/' })

const connection = require("./../db-connection")

const fs = require('fs')

router.get('/', function (req, res, next) {
    connection.query('SELECT * FROM recetas', function (error, results, fields) {
        if (error) {
            console.error('Error al obtener las recetas:', error);
            return res.status(500).json({ error: 'Error al obtener las recetas' });
        }
        res.json(results);
    });
});

router.get('/:id', function (req, res, next) {
    const idreceta = req.params.id;

    connection.query('SELECT * FROM recetas WHERE idreceta = ?', [idreceta], function (error, results, fields) {
        if (error) {
            console.error('Error al obtener la receta:', error);
            return res.status(500).json({ error: 'Error al obtener la receta' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Receta no encontrada' });
        }

        res.json(results[0]);
    });
});

router.post('/', function (req, res, next) {
    const { titulo, subtitulo, imagen, pasos, ingredientes, idusuario } = req.body;

    if (!titulo || !subtitulo || !imagen || !pasos || !ingredientes || !idusuario) {
        return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    let query = 'INSERT INTO recetas (titulo, subtitulo, imagen, pasos, ingredientes, idusuario) VALUES (?, ?, ?, ?, ?, ?)';
    let values = [titulo, subtitulo, imagen, pasos, ingredientes, idusuario];

    connection.query(query, values, function (error, results, fields) {
        if (error) {
            console.error('Error al insertar la receta:', error);
            return res.status(500).json({ error: 'Error al insertar la receta' });
        }
        res.json({ message: 'Receta agregada exitosamente', id: results.insertId });
    });
});

router.put('/:id', function (req, res, next) {
    const { idreceta, titulo, subtitulo, imagen, pasos, ingredientes, idusuario } = req.body;

    if (!idreceta || !titulo || !subtitulo || !imagen || !pasos || !ingredientes || !idusuario) {
        return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    let query = 'UPDATE recetas SET titulo = ?, subtitulo = ?, imagen = ?, pasos = ?, ingredientes = ?, idusuario = ? WHERE idreceta = ?';
    let values = [titulo, subtitulo, imagen, pasos, ingredientes, idusuario, idreceta];

    connection.query(query, values, function (error, results, fields) {
        if (error) {
            console.error('Error al actualizar la receta:', error);
            return res.status(500).json({ error: 'Error al actualizar la receta' });
        }
        res.json({ message: 'Receta actualizada exitosamente', affectedRows: results.affectedRows });
    });
});

router.delete('/:id', function (req, res, next) {
    connection.query('DELETE FROM recetas WHERE idreceta = ' + req.params.id, function (error, results, fields) {
        if (error) {
            console.error('Error al eliminar la receta:', error);
            return res.status(500).json({ error: 'Error al eliminar la receta' });
        }
        res.json({ message: 'Receta eliminada exitosamente', affectedRows: results.affectedRows });
    });
});

module.exports = router;