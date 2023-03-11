'use strict'

const {Router} = require('express');
const { addToCart, listCart, buy, cancelCart, readShop, productsByUser, generatePDF, BestProducts } = require('../controller/bill.controller');

const {validateJWT} = require('../middlewares/validate-jwt');

const api = Router();

api.post('/addCart', validateJWT, addToCart);
api.get('/listCart', validateJWT, listCart);
api.post('/buy', validateJWT, buy);
api.delete('/cancelCart/:id', validateJWT, cancelCart);
api.get('/readShop', validateJWT, readShop)
api.get('/productUser', validateJWT, productsByUser);
api.post('/generatePDF', validateJWT, generatePDF);

module.exports = api;