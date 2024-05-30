const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const jwt = require('jsonwebtoken');
var jwtSecret = process.env.JWT_SECRET;

// verifyToken = (req, res, next) => {
//     let token = req.headers.authorization; // Utilisation correcte de req.headers.authorization
//     if (!token) {
//         res.status(400).json({ msg: 'Accès refusé' });
//     }
//     try {
//         jwt.verify(token, process.env.JWT_SECRET);
//         next();
//     } catch (e) {
//         res.status(400).json({ msg: e });
//     }
// };

router.get('/etudiant', UserController.getAllEtudiantUsers);

router.get('/enseignant',  UserController.getAllEnseignantUsers);
router.post('/create', UserController.createUser);


router.get('/users/:userId', UserController.getUserById);
router.put('/users/:userId', UserController.updateUserById);

router.delete('/users/:userId', UserController.deleteUserById);
router.get('/recherche', UserController.searchUsersByName);


router.post('/login', UserController.loginUser);
router.post('/loginAdmin', UserController.loginAdmin);


module.exports = router;

