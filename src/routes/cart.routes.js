import { Router } from "express";
import { addToCart, removeFromCart, getCart, clearCart } from "../controllers/cart.controller.js";

const router = Router();

router.route("/add-to-cart").post(addToCart);
router.route("/remove-from-cart").post(removeFromCart);
router.route("/get-cart/:userId").get(getCart);
router.route("/clear-cart").post(clearCart);    

export default router;