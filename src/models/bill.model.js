'use strict'

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BillSchema = Schema({
    user: {
        type: Schema.Types.ObjectId, 
        ref: 'Users'},
        
        //nit: String,
    products: [
        {
            product: {
                type: Schema.Types.ObjectId,
                ref: 'Products',
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }
    ],
    total: {
        type: Number, 
        required: true
    },
    date: {
        type: Date, 
        default: Date.now
    },
});

module.exports = mongoose.model('Bills', BillSchema);






