const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const { pool } = require('./db');

const app = express();

// Middleware
app.use(cors({
  origin: [
    'https://frontend-register-gryn.onrender.com', // URL de tu frontend en Render
    'http://localhost:3000',                        // Para desarrollo local
    'http://localhost:5000'                         // Alternativa local
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const client = await pool.connect();
    await client.query('SELECT NOW()');
    client.release();
    res.status(200).json({ status: 'ok', message: 'Conexión a la base de datos establecida' });
  } catch (error) {
    console.error('Error en health check:', error);
    res.status(500).json({ status: 'error', message: 'Error de conexión a la base de datos' });
  }
});

// Routes
app.use('/api', routes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error no controlado:', err.stack);
  res.status(500).json({
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Application specific logging, throwing an error, or other logic here
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // Application specific logging, throwing an error, or other logic here
  
  // For critical errors, it's often better to exit and let the process manager restart
  // process.exit(1);
});
