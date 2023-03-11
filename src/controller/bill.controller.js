'use strict'


const Usuarios = require('../models/user.model');
const Product = require('../models/product.model');
const Bill = require('../models/bill.model');
const pdfkit = require('pdfkit');
const fs = require('fs');

const addToCart = async (req, res) => {
    try {
      const cartItems = req.body; // Array de objetos con productId y quantity

    const userId = req.user.id;

    const user = await Usuarios.findById(userId);
    
    for (const item of cartItems) {
        const { productId, quantity } = item;

        const product = await Product.findById(productId);

        if (!product) {
        return res.status(404).json({ message: 'Producto no encontrado' });
        }

        if (product.stock < quantity) {
        return res.status(400).json({ message: 'Stock insuficiente' });
        }

         // Agregar el producto al carrito del usuario
        const updatedUser = await Usuarios.findByIdAndUpdate(
        userId,
        { $push: { carrito: { nombre: productId, cantidad: quantity } } },
        { new: true }
        ).populate('carrito.nombre');

        product.stock -= quantity;

        await product.save();
    }

        res.status(200).json(user);

    res.status(200).json(user);
    } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
    }
};

const listCart = async (req, res) => {
    try{
        const user = await Usuarios.findById(req.user._id).populate('carrito.nombre');

        res.status(200).json(user.carrito);
    }catch(error){
        console.log(error);
        res.status(500).json({message: 'Error al obtener el carrito'})
    }
}

const buy = async (req, res) => {
    try {
        // Obtener token del encabezado y decodificarlo
        const userId = req.user.id;
    
        // Buscar el usuario en la base de datos
        const foundUser = await Usuarios.findById(userId);
    
        // Obtener los productos del carrito de compras del usuario
        const products = foundUser.carrito;
    
        // Calcular el total de la factura y crear la factura
        let total = 0;
        const billProducts = [];
        for (const product of products) {
        const foundProduct = await Product.findById(product.nombre);
          const subtotal = foundProduct.price * product.cantidad;
        total += subtotal;
        billProducts.push({ product: foundProduct, quantity: product.cantidad, subtotal });
        }
        const bill = new Bill({ user: foundUser, products: billProducts, total });
        await bill.save();
    
        // Vaciar el carrito de compras del usuario
        foundUser.carrito = [];
        await foundUser.save();
    
        res.status(200).json(bill);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al comprar productos.' });
    }
};

const cancelCart = async (req, res) => {
    const { id } = req.params;

try {
    const bill = await Bill.findById(id).populate('user').populate('products.product');
    if (!bill) {
    return res.status(404).json({ message: 'No se encontró la factura' });
    }

    // Devolver los productos al stock
    for (const item of bill.products) {
    const product = item.product;
    const quantity = item.quantity;
    await Product.findByIdAndUpdate(product._id, { $inc: { stock: quantity } });
    }

    await bill.remove();
    res.json({ message: 'Compra cancelada con éxito' });
} catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ha ocurrido un error al cancelar la compra' });
}
}

const readShop = async (req, res) => {
    try{
        const userId = req.user.id;

        // Buscar las facturas que tenga el usuario 
        const bills = await Bill.find({user: userId}).populate('products.product');

        // Devolver facturas encontradas 
        if (bills.length > 0){
            res.status(200).json(bills);
        }else {
            res.status(404).json({message: 'No se encontraron facturas para este usuario'});
        }
    }catch(error){
        res.status(500).json({message: 'Error en el servidor'})
    }
}

const productsByUser = async(req, res) => {
    if(req.user.rol === 'ADMIN'){
        try{
            const userId = req.body.userId;
            const user = await Usuarios.findById(userId);
            if(!user){
                return res.status(404).json({error: 'Usuario no existe'});
            }

            //Obtener las facturas del usuario pedido
            const bills = await Bill.find({user: userId}).populate({
                path: 'products.product',
                model: 'Products',
                select: 'name price',
            });

            // Enviar las facturas en la respuesta 
            return res.json({bills})
        }catch(error){
            res.status(500).json({message: 'Error en el servidor'})
        }
    }else {
        return res.status(200).send({message: 'Eres Cliente, solo los ADMIN pueden hacer esta accion'})
    }
}


const generatePDF = async(req, res) => {
    // Obtener el token del usuario 
    const userId = req.user.id;

    try {
        // Buscar factura del usuario con el token proporcionado
        const bill = await Bill.findOne({ user: userId }).populate({
        path: 'products.product',
        model: Product,
        });
    
        // Si no se encuentra la factura, enviar una respuesta de error
        if (!bill) {
        return res.status(404).json({ message: 'No se encontró la factura' });
        }
    
        // Crear nuevo documento PDF
        const doc = new pdfkit();
        // Configurar la respuesta HTTP para que sea un archivo PDF descargable
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=${bill._id}.pdf`);
    
        // Crear el contenido del documento PDF
        doc.pipe(res);
        doc.font('Helvetica-Bold').fontSize(18).text('Factura', { align: 'center' });
        doc.moveDown();
        doc.font('Helvetica').fontSize(12).text(`Número de factura: ${bill._id}`);
        doc.font('Helvetica').fontSize(12).text(`Fecha: ${bill.date}`);
        doc.font('Helvetica-Bold').fontSize(14).text('Detalles de la factura');
        doc.moveDown();
        bill.products.forEach((product) => {
            const subtotal = product.quantity * product.product.price;
          doc.font('Helvetica').fontSize(12).text(`${product.product.name} ----- Q.${product.quantity} * Q.${product.product.price} -> Q. ${subtotal} `);
        });
        doc.moveDown();
        doc.font('Helvetica-Bold').fontSize(14).text(`Total: Q. ${bill.total} `);
        doc.end();
    
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Ha ocurrido un error al generar la factura' });
    }
}



module.exports = {addToCart, listCart, buy, cancelCart, readShop, productsByUser, generatePDF};