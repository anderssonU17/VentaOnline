'use strict'

const {Router} = require('express');
const { createProduct, readProduct, productByName, editProduct, deleteProduct, soldOut } = require('../controller/product.controller');

const {validateJWT} = require('../middlewares/validate-jwt');

const api = Router();

api.post('/create-product',validateJWT, createProduct);
api.get('/list-products', validateJWT, readProduct);
api.get('/list-byname', validateJWT, productByName);
api.put('/edit-product/:id', validateJWT, editProduct);
api.delete('/delete-product/:id', validateJWT, deleteProduct);
api.get('/sold-out', validateJWT, soldOut);

module.exports = api;