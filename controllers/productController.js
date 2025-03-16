const Product = require("../models/productModel");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const productController = {
    addProducts: async (req, res) => {
        try {
            const { name, description, price, category, stock, images, ratings, reviews } = req.body;
            console.log(req.body);
            if (!name || !description || !price || !category) {
                return res.status(400).json({
                    success: false,
                    statusCode: 400,
                    message: 'All fields are required',
                    data: null
                });
            }
            const newProduct = new Product({ name, description, price, category });
            await newProduct.save();
            res.status(201).json({
                success: true,
                statusCode: 201,
                message: 'Product added successfully',
                data: newProduct
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                statusCode: 500,
                message: 'Server error',
                error: error.message
            });
        }
    }
}
module.exports = productController;