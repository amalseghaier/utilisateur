const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('examen', 'root', 'mysqlserver', {
  dialect: 'mysql',
  host: 'localhost',
});

const Departement = require('./departementModel');
const Classe = require('./classeModel');

const Utilisateur = sequelize.define('utilisateurs', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      is: {
        args: /^[a-zA-Z]+$/,
        msg: 'Le nom doit contenir uniquement des lettres.',
      },
    },
  },
  prenom: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      is: {
        args: /^[a-zA-Z]+$/,
        msg: 'Le prénom doit contenir uniquement des lettres.',
      },
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      args: true,
      msg: 'Un utilisateur avec cette adresse e-mail existe déjà.',
    },
    validate: {
      isEmail: {
        args: true,
        msg: 'L\'adresse e-mail doit être valide.',
      },
    },
  },

  mot_de_passe: {
    type: DataTypes.STRING,
    allowNull: false,
    
  },
  cin: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      is: {
        args: /^\d{8}$/,
        msg: 'Le CIN doit être composé de 8 chiffres.',
      },
    },
  },
  type_utilisateur: {
    type: DataTypes.ENUM('admin', 'enseignant', 'etudiant'),
    allowNull: false,
  },
  id_classe: {
    type: DataTypes.INTEGER, // Change to INTEGER for compatibility with the Classes table
    allowNull: false,
  },
  id_departement: {
    type: DataTypes.INTEGER, // Change to INTEGER for compatibility with the Departements table
    allowNull: false,
  },
});

Utilisateur.belongsTo(Classe, { foreignKey: 'id_classe', as: 'Classes' });
Utilisateur.belongsTo(Departement, { foreignKey: 'id_departement', as: 'departement' });


module.exports = Utilisateur;
