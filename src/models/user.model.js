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
        enum: ['ADMIN', 'CLIENT'],
        required: true,
    },
})

module.exports = mongoose.model('Users', UserSchema);