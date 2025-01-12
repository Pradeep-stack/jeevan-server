import { Cart } from "../models/cart.modal.js";
import { Product } from "../models/product.modal.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const addToCart = asyncHandler(async (req, res) => {
    const { userId, productId, quantity } = req.body;
  
    try {
      const product = await Product.findById(productId);
  
      if (!product) {
        return res.status(404).json({ success: false, message: "Product not found" });
      }
  
      let cart = await Cart.findOne({ userId });
  
      if (!cart) {
        // If no cart exists, create one
        cart = await Cart.create({
          userId,
          items: [{ productId, quantity }],
          totalPrice: product.service_price * quantity,
        });
      } else {
        // If cart exists, update it
        const productIndex = cart.items.findIndex(item => item.productId.toString() === productId);
  
        if (productIndex > -1) {
          // Product exists in the cart, update quantity
          cart.items[productIndex].quantity += quantity;
        } else {
          // Add new product to the cart
          cart.items.push({ productId, quantity });
        }
  
        // Update total price
        cart.totalPrice += product.service_price * quantity;
      }
  
      await cart.save();
  
      res.status(200).json({ success: true, data: cart, message: "Product added to cart" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  export const removeFromCart = asyncHandler(async (req, res) => {
    const { userId, productId } = req.body;
  
    try {
      const cart = await Cart.findOne({ userId });
  
      if (!cart) {
        return res.status(404).json({ success: false, message: "Cart not found" });
      }
  
      const productIndex = cart.items.findIndex(item => item.productId.toString() === productId);
  
      if (productIndex > -1) {
        // Update total price
        cart.totalPrice -= cart.items[productIndex].quantity * (await Product.findById(productId)).service_price;
  
        // Remove the product
        cart.items.splice(productIndex, 1);
        await cart.save();
  
        return res.status(200).json({ success: true, data: cart, message: "Product removed from cart" });
      } else {
        return res.status(404).json({ success: false, message: "Product not found in cart" });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  export const getCart = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    try {
      const cart = await Cart.findOne({ userId }).populate('items.productId');
  
      if (!cart) {
        return res.status(404).json({ success: false, message: "Cart not found" });
      }
  
      res.status(200).json({ success: true, data: cart });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });
    
  export const clearCart = asyncHandler(async (req, res) => {
    const { userId } = req.body;
  
    try {
      await Cart.findOneAndDelete({ userId });
      res.status(200).json({ success: true, message: "Cart cleared" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });
  