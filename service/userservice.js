// userService.js

const bcrypt = require('bcrypt');
// userService.js

const { Utilisateur, Departement, Classe } = require('../model'); // Import your models

async function createEnseignant(userData) {
  const {
    nom,
    prenom,
    email,
    mot_de_passe,
    cin,
    type_utilisateur,
    departements, // Array of department IDs
    classes, // Array of class IDs
  } = userData;

  // Check if the user already exists
  const existingUser = await Utilisateur.findOne({ where: { email } });
  if (existingUser) {
    throw new Error('Utilisateur avec ce courriel existe déjà');
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
  });

  // Associate the user with multiple departments and classes
  if (departements && departements.length > 0) {
    await newUser.addDepartements(departements);
  }

  if (classes && classes.length > 0) {
    await newUser.addClasses(classes);
  }

  return newUser;
}

module.exports = {
  createEnseignant,
};
