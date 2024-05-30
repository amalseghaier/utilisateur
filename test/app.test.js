const request = require('supertest');
const express = require('express');
const SequelizeMock = require('sequelize-mock');

const bodyParser = require('body-parser');
const userRoutes = require('../routes/userRoutes');
const User = require('../model/user.model');

const app = express();

// Middleware pour parser le corps des requêtes en JSON
app.use(bodyParser.json());

// Routes pour les utilisateurs
app.use('', userRoutes);

// Valid and invalid tokens for testing
const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTMsImVtYWlsIjoiYW1hbHNlZ0BnbWFpbC5jb20iLCJ0eXBlX3V0aWxpc2F0ZXVyIjoiZW5zZWlnbmFudCIsImlhdCI6MTcxNjA1NzM3MiwiZXhwIjoxNzE2MDY0NTcyfQ.3H1FKl_ufyPhLkJHdJGtJYdD7ePi9T6I7l1Fn-U4Rf4';
const invalidToken = 'invalid.token';

describe('user controller Tests', () => {
  let createdUserId;

  afterEach(async () => {
    if (createdUserId) {
      await User.destroy({ where: { id: createdUserId } });
      createdUserId = null;
    }
  });

  // Test for GET /etudiant endpoint with valid token
  it('should get all etudiant users with valid token', async () => {
    const response = await request(app)
      .get('/etudiant')
      .set('Authorization', `Bearer ${validToken}`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  // Test for GET /enseignant endpoint with valid token
  it('should get all enseignant users with valid token', async () => {
    const response = await request(app)
      .get('/enseignant')
      .set('Authorization', `Bearer ${validToken}`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  // Test for POST /create endpoint
  it('should create a new user', async () => {
    const response = await request(app)
      .post('/create')
      .send({
        nom: 'amal',
        prenom: 'seghaier',
        email: 'segh@gmail.com',
        mot_de_passe: '00000000',
        cin: '12345998',
        type_utilisateur: 'etudiant',
        id_classe: 23,
        id_departement: 2
      });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    createdUserId = response.body.id;
  });

  // Test for POST /login endpoint
  it('should login with correct credentials', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        email: 'amalseg@gmail.com',
        mot_de_passe: '00000000'
      });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  // Test for POST /loginAdmin endpoint
  it('should login admin with correct credentials', async () => {
    const response = await request(app)
      .post('/loginAdmin')
      .send({
        email: 'amal@gmail.com',
        mot_de_passe: '96385274'
      });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  // Add more tests for other auth routes here
});
