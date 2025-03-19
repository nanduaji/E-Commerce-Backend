const Cart = require("../models/cartModel");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { default: mongoose } = require("mongoose");
const User = require("../models/userModel");

const cartController = {
    addProductsToCart : async (req, res) => {
        try {
            const { user, _id, name, description, price, category, stock, image, quantity } = req.body;
            console.log("Received Data:", req.body);
            // console.log("User ID Type:", typeof user);
    
            // **Extract User ID from the stringified object**
            let parsedUser;
            try {
                parsedUser = JSON.parse(user);
            } catch (error) {
                return res.status(400).json({
                    success: false,
                    statusCode: 400,
                    message: 'Invalid user data format',
                    data: null
                });
            }
                console.log("Parsed User:", parsedUser);
                console.log("Product ID:", _id);
                console.log("Product Name:", name);
                console.log("Product Description:", description);
                console.log("Product Price:", price);
                console.log("Product Category:", category);
                console.log("Product Stock:", stock);
                console.log("Product Image:", image);
                console.log("Product Quantity:", quantity);
            if (!parsedUser?.id || !_id || !name || !description || !price || !category) {
                return res.status(400).json({
                    success: false,
                    statusCode: 400,
                    message: 'User ID and all product fields are required',
                    data: null
                });
            }
    
            const userId = new mongoose.Types.ObjectId(parsedUser.id);
            const productId = new mongoose.Types.ObjectId(_id);
    
            // **Check if user exists**
            const userExists = await User.findById(userId);
            if (!userExists) {
                return res.status(400).json({
                    success: false,
                    statusCode: 400,
                    message: 'Invalid user ID',
                    data: null
                });
            }
    
            // **Find or Create Cart**
            let cart = await Cart.findOne({ user: userId });
    
            if (!cart) {
                cart = new Cart({
                    user: userId,
                    products: [
                        {
                            productId,
                            name,
                            description,
                            price,
                            category,
                            stock,
                            image,
                            quantity
                        }
                    ]
                });
            } else {
                // **Check if product already exists in the cart**
                const productIndex = cart.products.findIndex(p => p._id.toString() === productId.toString());
    
                console.log("Product Index:", productIndex);
                if (productIndex > -1) {
                    cart.products[productIndex].quantity += quantity;
                } else {
                    cart.products.push({
                        productId,
                        name,
                        description,
                        price,
                        category,
                        stock,
                        image,
                        quantity
                    });
                }
            }
    
            await cart.save();
    
            res.status(201).json({
                success: true,
                statusCode: 201,
                message: 'Product added to cart successfully',
                data: cart
            });
        } catch (error) {
            console.log("Error:", error);
            res.status(500).json({
                success: false,
                statusCode: 500,
                message: 'Server error',
                error: error.message
            });
        }
    },
    updateProductsInCart: async (req, res) => {
        try {
            const { id, ...updateData } = req.body;

            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: "Cart ID is required",
                });
            }

            if (Object.keys(updateData).length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "At least one field must be provided for update",
                });
            }

            const updatedProduct = await Cart.findByIdAndUpdate(
                id,
                { $set: updateData }, // Only update provided fields
                { new: true, runValidators: true }
            );

            if (!updatedProduct) {
                return res.status(404).json({
                    success: false,
                    message: "Cart not found",
                });
            }

            res.status(200).json({
                success: true,
                message: "Cart updated successfully",
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
    deleteProductsFromCart: async (req, res) => {
        try {
            const { productId,cartId } = req.body;
console.log("productToBeRemoved", cartId)
            if (!productId) {
                return res.status(400).json({
                    success: false,
                    message: "Cart ID is required",
                });
            }



            const deletedProduct = await Cart.findByIdAndUpdate(
                cartId, // Find the Cart document by its _id
                {
                  $pull: {
                    products: { _id: new mongoose.Types.ObjectId(productId) }, // Use $pull to remove the product
                  },
                },
                { new: true, runValidators: true }
              );

            if (!deletedProduct) {
                return res.status(404).json({
                    success: false,
                    message: "Cart not found",
                });
            }

            res.status(200).json({
                success: true,
                message: "Cart updated successfully",
                data: deletedProduct,
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Server error",
                error: error.message,
            });
        }
    },
    getCartItems: async (req, res) => {
        try {
            console.log("Get Cart Items Request Body:", req.body);
            
            const { user } = req.body;
            // Ensure user exists
            if (!user) {
                return res.status(400).json({ success: false, message: "User data is required" });
            }
    
            // Parse user data safely
            let userId;
            if (typeof user === "string") {
                try {
                    userId = JSON.parse(user).id;
                } catch (error) {
                    console.error("Error parsing user data:", error);
                    return res.status(400).json({ success: false, message: "Invalid user data format" });
                }
            } else {
                userId = user.id;
            }
    
            console.log("Extracted User ID:", userId);
    
            if (!userId) {
                return res.status(400).json({ success: false, message: "User ID is required" });
            }
    
            // Fetch cart items from DB (dummy response)
            const cartItems =  await Cart.findOne({ user: userId }); // Replace with actual DB query
            return res.status(200).json({ success: true, cartItems });
    
        } catch (error) {
            console.error("Error fetching cart items:", error);
            return res.status(500).json({ success: false, message: "Internal Server Error" });
        }
    }
    

}
module.exports = cartController;