'use strict'

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategorysSchema = Schema({
    name: String, 
    description: String, 
    products: [{type: Schema.Types.ObjectId, ref: 'Products'}],
})

module.exports = mongoose.model('Categorys', CategorysSchema);