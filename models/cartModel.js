const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    products: [
      {
        name: {
          type: String,
          required: [true, "Product name is required"],
          trim: true,
          minlength: [3, "Product name must be at least 3 characters long"],
        },
        description: {
          type: String,
          required: [true, "Product description is required"],
          trim: true,
        },
        price: {
          type: Number,
          required: [true, "Product price is required"],
          min: [0, "Price cannot be negative"],
        },
        category: {
          type: String,
          required: [true, "Product category is required"],
        },
        stock: {
          type: Number,
          required: [true, "Stock quantity is required"],
          min: [0, "Stock cannot be negative"],
          default: 0,
        },
        image: {
          type: String,
        },
        ratings: {
          type: Number,
          default: 0,
          min: [0, "Rating cannot be negative"],
          max: [5, "Rating cannot exceed 5"],
        },
        reviews: [
          {
            user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            rating: { type: Number, required: true, min: 1, max: 5 },
            comment: { type: String, required: true },
            createdAt: { type: Date, default: Date.now },
          },
        ],
        quantity: {
          type: Number,
        //   required: [true, "Quantity is required"],
          min: [1, "Quantity must be at least 1"],
        },
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
