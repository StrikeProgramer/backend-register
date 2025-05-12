const express = require('express');
const router = express.Router();
const { query } = require('./db');

// Crear persona
router.post('/crear', async (req, res) => {
  try {
    const { nombre, apellido, telefono, direccion, correo, nota } = req.body;
    const result = await query(
      'INSERT INTO personas(nombre, apellido, telefono, direccion, correo, nota) VALUES($1, $2, $3, $4, $5, $6) RETURNING *',
      [nombre, apellido, telefono, direccion, correo, nota]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear persona:', error);
    res.status(500).json({ error: 'Error al crear el registro' });
  }
});

// Consultar personas
router.get('/personas', async (req, res) => {
  try {
    const result = await query('SELECT * FROM personas ORDER BY id DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al consultar personas:', error);
    res.status(500).json({ error: 'Error al obtener los registros' });
  }
});

// Actualizar persona
router.put('/actualizar/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, telefono, direccion, correo, nota } = req.body;
    
    const result = await query(
      'UPDATE personas SET nombre = $1, apellido = $2, telefono = $3, direccion = $4, correo = $5, nota = $6, updated_at = CURRENT_TIMESTAMP WHERE id = $7 RETURNING *',
      [nombre, apellido, telefono, direccion, correo, nota, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Registro no encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al actualizar persona:', error);
    res.status(500).json({ error: 'Error al actualizar el registro' });
  }
});

// Eliminar persona
router.delete('/eliminar/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await query(
      'DELETE FROM personas WHERE id = $1 RETURNING *',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Registro no encontrado' });
    }
    
    res.json({ message: 'Registro eliminado correctamente', id });
  } catch (error) {
    console.error('Error al eliminar persona:', error);
    res.status(500).json({ error: 'Error al eliminar el registro' });
  }
});

// Obtener persona por ID
router.get('/personas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await query(
      'SELECT * FROM personas WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Registro no encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener persona:', error);
    res.status(500).json({ error: 'Error al obtener el registro' });
  }
});

module.exports = router;
