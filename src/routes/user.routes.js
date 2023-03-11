'use strict'

const {Router} = require('express');
const {check} = require('express-validator');
const {validateParams} = require('../middlewares/validate-params');
const {validateJWT} = require('../middlewares/validate-jwt');
const { createUser, loginUser, editUser, deleteUser } = require('../controller/user.controller');

const api = Router();

api.post('/create-user', createUser);
api.post('/login', loginUser)
api.put('/edit-user/:id', validateJWT, editUser);
api.delete('/delete-client', validateJWT, deleteUser)
module.exports = api;