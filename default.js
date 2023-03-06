'use strict'

const User = require('./src/models/user.model');
const bcrypt = require('bcrypt');
const {generateJWT} = require('./src/helpers/create-jwt');

const defaultUser = async () => {
    try{
        const user = new User();
        user.name = 'Andersson';
        user.lastname = 'Urrea';
        user.email ='aurrea-2019284@kinal.edu.gt';
        user.password = 'ander123';
        user.rol = 'ADMIN';

        const userEncontrado = await User.findOne({email: user.email});
        if(userEncontrado) return console.log('El ADMIN esta listo');

        // Encriptar la contrasenia 
        user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync());
        
        // Guardar Usuario
        user = await user.save();

        if(!user) return console.log('El administrador no esta listo'); 
        return console.log('El administrador esta listo');

    }catch (err) {
        console.log(err);
    }
}

module.exports = {defaultUser};