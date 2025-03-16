const Product = require("../models/productModel");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const productController = {
    addProducts: async (req, res) => {
        try {
            const { name, description, price, category, stock, image, ratings, reviews } = req.body;
            console.log(req.body);
            if (!name || !description || !price || !category) {
                return res.status(400).json({
                    success: false,
                    statusCode: 400,
                    message: 'All fields are required',
                    data: null
                });
            }
            const newProduct = new Product({ name, description, price, category,name, 
                description, 
                price, 
                category, 
                stock, 
                image, // Ensure the image is included
                ratings, 
                reviews  });
            await newProduct.save();
            res.status(201).json({
                success: true,
                statusCode: 201,
                message: 'Product added successfully',
                data: newProduct
            });
        } catch (error) {
            console.log("error", error);
            res.status(500).json({
                success: false,
                statusCode: 500,
                message: 'Server error',
                error: error.message
            });
        }
    },
    getProducts: async (req, res) => {
        try {
            const users = await Product
                .find({})
                .lean();

            res.status(200).json({
                success: true,
                statusCode: 200,
                message: "Products fetched successfully",
                count: users.length,
                data: users,
            });

        } catch (err) {
            res.status(500).json({
                success: false,
                statusCode: 500,
                message: "Internal Server Error"
            });
        }
    },
    updateProducts: async (req, res) => {
        try {
            const { id, ...updateData } = req.body; 
    
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: "Product ID is required",
                });
            }
    
            if (Object.keys(updateData).length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "At least one field must be provided for update",
                });
            }
    
            const updatedProduct = await Product.findByIdAndUpdate(
                id, 
                { $set: updateData }, // Only update provided fields
                { new: true, runValidators: true }
            );
    
            if (!updatedProduct) {
                return res.status(404).json({
                    success: false,
                    message: "Product not found",
                });
            }
    
            res.status(200).json({
                success: true,
                message: "Product updated successfully",
                data: updatedProduct,
            });
    
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Server error",
                error: error.message,
            });
        }

    },
    deleteProducts: async (req, res) => {try {
        const { id } = req.body; 

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Product ID is required",
            });
        }

        

        const deletedProduct = await Product.findByIdAndDelete(
            id,
            { new: true, runValidators: true }
        );

        if (!deletedProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            data: deletedProduct,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    } },
    getProductsByCategories: async (req, res) => {
        try {
            const { category } = req.body;
            const products = await Product.find({category: category});
            res.status(200).json({
                success: true,
                message: "Products fetched successfully",
                data: products,
            });
    }
    catch(error){
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
}
}
module.exports = productController;