const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Utilisateur = require('../model/user.model');
const { Op } = require('sequelize');
const accessTokenSecret = process.env.JWT_SECRET || 'votre_clé_secrète_par_défaut';

const ERROR_MESSAGE = 'L\'authentification a échoué';
const SUCCESS_MESSAGE = 'L\'authentification a réussi';

// Fonction de création d'un nouvel utilisateur
// Fonction de création d'un nouvel utilisateur
exports.createUser = async (req, res) => {
  try {
    const { nom, prenom, email, mot_de_passe, cin, type_utilisateur, id_classe, id_departement} = req.body;

    // Check if user with the same email already exists
    const existingUser = await Utilisateur.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(mot_de_passe, 10);

    // Create the new user
    const newUser = await Utilisateur.create({
      nom,
      prenom,
      email,
      mot_de_passe: hashedPassword,
      cin,
      type_utilisateur,
      id_classe, 
      id_departement,
    });

    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'An error occurred while creating the user' });
  }
};


// Fonction pour obtenir tous les utilisateurs (besoin d'authentification)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await Utilisateur.findAll({ where: { type_utilisateur: 'etudiant' } });
    res.status(200).json(users);
  } catch (error) {
    console.error('Error getting all etudiant users:', error);
    res.status(500).json({ error: 'An error occurred while getting all etudiant users' });
  }
};
exports.getAllUsers = async (req, res) => {
  try {
    const users = await Utilisateur.findAll({ where: { type_utilisateur: 'enseignant' } });
    res.status(200).json(users);
  } catch (error) {
    console.error('Error getting all enseignant users:', error);
    res.status(500).json({ error: 'An error occurred while getting all enseignant users' });
  }
};


// Fonction pour obtenir un utilisateur par ID (besoin d'authentification)
exports.getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await Utilisateur.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error getting user by ID:', error);
    res.status(500).json({ error: 'An error occurred while getting user by ID' });
  }
};

// Fonction pour mettre à jour un utilisateur par ID (besoin d'authentification)
exports.updateUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const { nom, prenom, email, mot_de_passe, cin, type_utilisateur, id_classe, id_departement } = req.body;

    const user = await Utilisateur.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Mise à jour des champs de l'utilisateur
    user.nom = nom;
    user.prenom = prenom;
    user.email = email;
    if (mot_de_passe) {
      const hashedPassword = await bcrypt.hash(mot_de_passe, 10);
      user.mot_de_passe = hashedPassword;
    }
    user.cin = cin;
    user.type_utilisateur = type_utilisateur;
    user.id_classe = type_utilisateur === 'etudiant' ? id_classe : null;
    user.id_departement = type_utilisateur === 'etudiant' ? id_departement : null;

    await user.save();

    res.status(200).json({ message: 'User updated successfully', user });
  } catch (error) {
    console.error('Error updating user by ID:', error);
    res.status(500).json({ error: 'An error occurred while updating user by ID' });
  }
};

// Fonction pour supprimer un utilisateur par ID (besoin d'authentification)
exports.deleteUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await Utilisateur.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.destroy(); // Suppression de l'utilisateur de la base de données

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user by ID:', error);
    res.status(500).json({ error: 'An error occurred while deleting user by ID' });
  }
};

// Fonction de recherche des utilisateurs par nom (besoin d'authentification)
exports.searchUsersByName = async (req, res) => {
  try {
    const { nom } = req.query;

    const users = await Utilisateur.findAll({ where: { nom: { [Op.like]: `%${nom}%` } } });
    res.status(200).json(users);
  } catch (error) {
    console.error('Error searching users by name:', error);
    res.status(500).json({ error: 'An error occurred while searching users by name' });
  }
};



// Fonction de connexion de l'utilisateur
exports.loginUser = async (req, res) => {
  try {
    const { cin, mot_de_passe } = req.body;

    // Vérifie si 'cin' est une chaîne de 8 chiffres
    if (!/^\d{8}$/.test(cin)) {
      return res.status(400).json({ error: 'Le CIN doit être une chaîne de 8 chiffres' });
    }

    // Recherche de l'utilisateur par CIN
    const user = await Utilisateur.findOne({ where: { cin } });
    if (!user) {
      return res.status(401).json({ error: 'CIN ou mot de passe invalide' });
    }

    // Comparaison des mots de passe hachés
    const isPasswordValid = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'CIN ou mot de passe invalide' });
    }

    // Génération du jeton JWT avec le rôle de l'utilisateur inclus
    const token = jwt.sign({ id: user.id, cin: user.cin, type_utilisateur: user.type_utilisateur}, accessTokenSecret, { expiresIn: '1h' });

    res.status(200).json({ token });

  } catch (error) {
    console.error('Erreur de connexion de l\'utilisateur :', error);
    res.status(500).json({ error: 'Une erreur s\'est produite lors de la connexion de l\'utilisateur' });
  }
};

// Middleware d'authentification
// exports.authenticateUser = async (req, res, next) => {
//   try {
//     const token = req.headers.authorization;
//     if (!token) {
//       return res.status(401).json({ error: 'Aucun jeton fourni' });
//     }

//     jwt.verify(token, accessTokenSecret, async (err, decoded) => {
//       if (err) {
//         return res.status(401).json({ error: 'Jeton invalide' });
//       }

//       // Ajout des informations de l'utilisateur au corps de la requête
//       req.userId = decoded.id;
//       req.userType = decoded.type_utilisateur;

//       next(); // Appel du prochain middleware ou de la fonction de routage
//     });
//   } catch (error) {
//     console.error('Erreur d\'authentification de l\'utilisateur :', error);
//     res.status(500).json({ error: 'Une erreur s\'est produite lors de l\'authentification de l\'utilisateur' });
//   }
// };
