'use strict'

const Usuarios = require('../models/user.model');
const bcrypt = require('bcrypt');
const { generateJWT } = require("../helpers/create-jwt");

const createUser = async(req, res) => {
    const {name, email, password} = req.body;
    try{
        let usuario = await Usuarios.findOne({email}); // Usuario viene del modelo
        if(usuario){
            return res.status(400).send({
                message: 'Un usuario ya existe con este correo', 
                ok: false, 
                usuario: usuario, 
            });
        }
        usuario = new Usuarios(req.body);

        //Encriptacion de contrasenia
        const saltos = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, saltos);

        // Guardar usuarios
        usuario = await usuario.save();


        res.status(200).send({
            message: `Usuario ${name} creado correctamente`, 
            ok: true, 
            usuario: usuario,
        })

    }catch(err){
        console.log(err)
        res.status(500).json({
            ok: false, 
            message: `No se ha creado el usuario: ${name}`, 
            error: err,
        });
    }
}

module.exports = {createUser};