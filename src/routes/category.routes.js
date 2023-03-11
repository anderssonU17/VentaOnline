'use strict'

const {Router} = require('express');
const { createCategory, readCategory, categoryByName, editCategory, deleteCategory } = require('../controller/category.controller');

const {validateJWT} = require('../middlewares/validate-jwt');

const api = Router();

api.post('/create-category', validateJWT, createCategory);
api.get('/read-category',validateJWT, readCategory);
api.get('/category-byname', validateJWT, categoryByName);
api.put('/edit-category/:id', validateJWT, editCategory);
api.delete('/delete-category/:id', validateJWT, deleteCategory)
module.exports = api;
