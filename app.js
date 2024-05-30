const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const cors = require('cors'); 
const { sequelize } = require('./model/user.model'); // Importe la connexion Sequelize
const client = require('prom-client')

const app = express();
const PORT = process.env.PORT || 3010;

// Middleware pour parser le corps des requêtes en JSON
app.use(bodyParser.json());
app.use(cors());

// Routes pour les utilisateurs
app.use('', userRoutes); // Assurez-vous que cette ligne est correcte

// Synchronisation du modèle utilisateur avec la base de données
sequelize.sync().then(() => {
  console.log('User model synced with database');

  // Démarrage du serveur
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch((error) => {
  console.error('Error syncing User model:', error);
});


// Enable Prometheus metrics collection
const register = new client.Registry();
client.collectDefaultMetrics({ register });

// Create a histogram metric for utilisateur-ms service
const utilisateurRequestDurationMicroseconds = new client.Histogram({
  name: 'utilisateur_request_duration_seconds',
  help: 'Duration of utilisateur-ms service HTTP requests in microseconds',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10]
});

// Register the histogram for utilisateur-ms service
register.registerMetric(utilisateurRequestDurationMicroseconds);

// Middleware to measure request duration for utilisateur-ms service
app.use((req, res, next) => {
  const end = utilisateurRequestDurationMicroseconds.startTimer();
  res.on('finish', () => {
    end({ method: req.method, route: req.url, code: res.statusCode });
  });
  next();
});

// Route to expose Prometheus metrics
app.get('/metrics', async (req, res) => {
  try {
    const metrics = await register.metrics();
    res.set('Content-Type', register.contentType);
    res.end(metrics);
  } catch (error) {
    console.error('Error generating metrics:', error);
    res.status(500).send('Error generating metrics');
  }
});