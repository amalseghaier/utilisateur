const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const { sequelize } = require('./model/user.model'); // Importe la connexion Sequelize

const app = express();
const PORT = process.env.PORT || 3010;

// Middleware pour parser le corps des requêtes en JSON
app.use(bodyParser.json());

// Routes pour les utilisateurs
app.use('/api/users', userRoutes); // Assurez-vous que cette ligne est correcte

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

