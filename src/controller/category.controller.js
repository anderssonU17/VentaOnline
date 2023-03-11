'use strict'

const Categorys = require('../models/category.model');
const Product = require('../models/product.model');

const createCategory = async (req, res) => {
    if(req.user.rol === 'ADMIN'){
        const {name, description} = req.body;
    try{
        let category = await Categorys.findOne({name});
        if(category){
            return res.status(400).send({
                message: 'La categoria ya esta creada', 
                ok: false, 
                category: category,
            });
        }
        category = new Categorys({name, description});
        category = await category.save();

        res.status(200).send({
            message: 'Categoria creada correctamente', 
            ok: true, 
            category: category,
        });


    }catch(err){
        console.log(err);
        res.status(500).json({
            ok: false, 
            message: 'No se ha creado la categoria', 
            error: err,
        });
    }
    }else {
        return res.status(200).send({message: 'Eres Cliente, no tienes permisos para agregar una categoria'})
    }
}

const readCategory = async(req, res) => {
    if(req.user.rol === 'ADMIN'){
        try{
            const categorys = await Categorys.find();
    
            if(!categorys){
                res.status(404).send({message: 'No hay categorias disponibles'});
        }else {
            res.status(200).json({'Categorias encontradas': categorys})
        }
        }catch(err){
            throw new Error(err);
        }
    }else{
        res.status(401).send({message: 'Eres Cliente, no tienes permiso para listar Categorias'});
    }
}

const categoryByName = async(req, res) => {
    if(req.user.rol ===  'ADMIN'){
        const {name} = req.body;
        try{
            const category = await Categorys.findOne({name});

            if(!category){
                res.status(404).json({message: 'No existe esta categoria'});
            }
            res.status(200).json(category)
        }catch(err){
            console.log(err);
        }
    }else{
        return res.status(200).send({message: 'Eres cliente, no puedes ver estas categorias'});
    }
}

const editCategory = async(req, res) => {
    if(req.user.rol === 'ADMIN'){
        try{
            const {id} = req.params;
            const category = await Categorys.findByIdAndUpdate(id, req.body, {new: true});

            if (!category) {
                return res.status(404).json({message: 'Categoria no existe'})
            }

            return res.status(200).send({
                message: 'Categoria actualizada correctamente', 
                category: category
            });
        }catch(error){
            console.error(error);
            res.status(500).json({message: 'Error en el servidor'})
        }
    }else{
        return res.status(200).send({message: 'Eres cliente, no tienes permisos para editar esta categoria'})
    }
}

const deleteCategory = async (req, res) => {
    if(req.user.rol ===  'ADMIN'){   
        try{
            const categoryId = req.params.id;

            //Buscar la categoria por su Id y obtener los productos que estan en esta categoria 
            const category = await Categorys.findById(categoryId).populate('products');
            const products = category.products;

            // Si hay productos en la categoria, los pasara a la categoria default
            if (products.length > 0){
                // Buscar la categoria default 
                let defaultCategory = await Categorys.findOne({name: 'default'});


            // Si no existe la categoria default, vamos a crearla 
            if (!defaultCategory){
                const newDefault = new Categorys({
                    name: 'default', 
                    description: 'Aqui estaran los productos sin categoria',
                    products: products.map((product) => product._id),
                });

                defaultCategory = await newDefault.save();
            }else {
                //Agregar productos de la categoria eliminada a la default 
                defaultCategory.products.push(...products.map((product) => product._id));
                // Se agregan los id de productos a la categoria default y utilizamos ...
                //Asi se agregan los id directamente como elemento de un array
                await defaultCategory.save();
            }
            // Actualizar los productos que estaban en la categoria eliminada
            const promises = products.map(async (product) => {
                product.category = defaultCategory._id;
                await product.save();
            });
                await Promise.all(promises);
            }

            // Eliminar la categoria 
            await Categorys.findByIdAndDelete(categoryId);

            res.json({ message: 'Categoría eliminada correctamente' });
        }catch(error){
            console.log(error);
            res.status(500).json({message: 'Error al eliminar la categoria'})
        }
    }else{
        return res.status(200).send({message: 'Eres cliente, no puedes ver estos productos'});
    }
}

module.exports = {createCategory, readCategory, categoryByName, editCategory, deleteCategory};