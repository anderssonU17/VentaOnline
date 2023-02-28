'use strict'

const {Router} = require('express');
const {check} = require('express-validator');
const {validateParams} = require('../middlewares/validate-params');
const {validateJWT} = require('../middlewares/validate-jwt');
const { createUser } = require('../controller/user.controller');

const api = Router();

api.post('/create-user', createUser)

module.exports = api;