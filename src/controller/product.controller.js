'use strict'

const Product = require('../models/product.model');
const Categorys = require('../models/category.model');

const createProduct = async (req, res) => {
    if(req.user.rol === 'ADMIN'){
        const {name, description, price, stock, categoryName} = req.body;
        try{
            // Que no se repita el producto 
            let productoR = await Product.findOne({name});
            if(productoR){
                return res.status(400).send({
                    message: 'Un producto ya existe con este nombre', 
                    ok: false, 
                    product: productoR,
                })
            }
            //Buscamos la categoria por su nombre y obtenemos su ID
            const category = await Categorys.findOne({name: categoryName});
            const categoryId = category ? category._id : null;

            // Creamos el nuevo producto 
            const newProduct = new Product({
                name, 
                description, 
                price, 
                stock, 
                category: categoryId,
            });

            // Si se encontro la categoria, agregamos el producto a la lista de productos
            if (categoryId){
                await Categorys.findByIdAndUpdate(
                    categoryId,
                    {$push: {products: newProduct._id}},
                    {new: true, useFindAndModify: false}
                )
            }

            // Guardamos el nuevo producto 
            await newProduct.save();

            return res.status(201).json({
                message: 'Producto creada correctamente', 
                ok: true, 
                product: newProduct
            });

        }catch(error){
            console.error(error);
            return res.status(500).json({message: 'Error al agregar producto'});
        }
    }else{
        res.status(401).send({message: 'Eres cliente, no puedes agregar productos'})
    }
}

const readProduct = async(req, res) => {
    if(req.user.rol ===  'ADMIN'){
        try{
            const products = await Product.find();

            if(!products){
                res.status(404).send({message: 'No hay productos disponibles'});
            }else {
                res.status(200).json({'Productos encontrados': products})
            }
        }catch(err){
            throw new Error(err);
        }
    }else{
        return res.status(200).send({message: 'Eres cliente, no puedes ver estos productos'});
    }
}

const productByName = async(req, res) => {
    if(req.user.rol ===  'ADMIN'){
        const {name} = req.body;
        try{
            const products = await Product.findOne({name});

            if(!products){
                res.status(404).json({message: 'No existe este producto'});
            }

            res.status(200).json(products)
        }catch(err){
            console.log(err);
        }
    }else{
        return res.status(200).send({message: 'Eres cliente, no puedes ver estos productos'});
    }
}

const editProduct = async(req, res) => {
    if(req.user.rol === 'ADMIN'){
        try{
            const {id} = req.params;
            const product = await Product.findByIdAndUpdate(id, req.body, {new: true});

            if (!product) {
                return res.status(404).json({message: 'Producto no existe'})
            }
            return res.status(200).send({
                message: 'Producto actualizado correctamente', 
                category: product
            });
        }catch(error){
            console.error(error);
            res.status(500).json({message: 'Error en el servidor'})
        }
    }else{
        return res.status(200).send({message: 'Eres cliente, no tienes permisos para editar este producto'})
    }
}

const deleteProduct = async(req, res) => {
    if (req.user.rol === 'ADMIN'){
        try{
            const productId = req.params.id;
            const deleteProduct = await Product.findByIdAndDelete(productId);

            if (!deleteProduct){
                return res.status(404).json({message: 'Producto no encontrado'});
            }

            const categoryId = deleteProduct.category;

            const category = await Categorys.findById(categoryId);

            if(!category){
                return res.status(404).json({message: 'La categoria de este producto no existe'});
            }

            category.products.pull(productId);
            await category.save();

            res.json({message: 'Producto eliminado correctamente'});

        }catch(err){
            console.error(err);
            res.status(500).json({message: 'Error al eliminar este producto'})
        }
    }else {
        return res.status(200).send({message: 'Eres cliente, no tienes permisos para eliminar este producto'})
    }
}

const soldOut = async(req, res) => {
    if (req.user.rol === 'ADMIN'){
        try{
            //Buscar un producto donde el stock sea igual a 0
            const products = await Product.find({stock: 0});

            // Si se encontraron productos, se mostraran los productos
            if (products.length > 0) {
                return res.json({
                    ok: true, 
                    message: 'Productos agotados encontrados', 
                    product: products
                })
                
            }else {
                // Si no se encontro ningun producto, enviara una respuesta
                return res.json({
                    ok: false, 
                    message: 'No se encontraron productos agotados'
                });
            }
        }catch(error){
            return res.status(500).json({
                message: 'Error al buscar los productos agotados'
            })
        }
    }else {
        return res.status(200).send({message: 'Eres cliente, no tienes permisos para eliminar este producto'})
    }
}

module.exports = {createProduct, readProduct, productByName, editProduct, deleteProduct, soldOut};