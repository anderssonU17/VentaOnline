'use strict'

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = Schema({
    name: String, 
    lastname: String, 
    email: String, 
    password: String, 
    rol: {
        type: String, 
        enum: ['ADMIN', 'CLIENT'], default: 'CLIENT',
    },
    carrito: [
        {
            nombre: {type: Schema.Types.ObjectId, ref: 'Products'},
            cantidad: {type: Number},
            fecha: {type: Date, default: Date.now}
        }
    ]
})

module.exports = mongoose.model('Users', UserSchema);