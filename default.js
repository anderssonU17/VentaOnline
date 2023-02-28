'use strict'

const User = require('./src/models/user.model');



const createUser = async () => {
try {
    const user = new User({
        name: 'Andersson',
        lastname: 'Urrea',
        email: 'aurrea-2019284@kinal.edu.gt',
        password: 'ander123',
        rol: 'ADMIN',
    });
    let usuario = await Usuarios.findOne({email}) //
    if(!usuario){
        return res.status(400).send({
            
        })
    }
    await user.save();
    console.log('User created successfully');
} catch (error) {
    console.error(error);
}
};

/*const createUser = async () => {
    const user = new User({
        name: 'Andersson',
        lastname: 'Urrea',
        email: 'aurrea-2019284@kinal.edu.gt',
        password: 'ander123',
        rol: 'ADMIN',
    });
    try{
        let usuario = await Usuarios.findOne({email})
        if(!usuario){
            return res.status(400).send({
                message: 'Ya esta creado el default', 
                ok: false,
                usuario: usuario
            })
        }
    }
}*/

module.exports = {createUser};