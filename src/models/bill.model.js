'use strict'

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BillSchema = Schema({
    user: {type: Schema.Types.ObjectId, ref: 'Users'},
    nit: String,
    products: [{type: Schema.Types.ObjectId, ref: 'Products'}],
    fecha: {type: Date, default: Date.now},
    total: Number,
});

module.exports = mongoose.model('Bills', BillSchema);






