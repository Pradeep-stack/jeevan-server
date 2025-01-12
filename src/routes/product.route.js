import { Router } from "express";
import { addProduct,editProduct, getProduct, deleteProduct ,getProductByRegion, buyProduct, getPurchasesByUserId, getAllPurchases, updatePurches} from "../controllers/product.controller.js";

const router = Router()

router.route("/add-product").post(addProduct)
router.route("/get-product").get(getProduct)
router.route("/delete-product/:id").delete(deleteProduct)
router.route("/edit-product/:id").patch(editProduct)
router.get("/product/get-by-region/:region", getProductByRegion);
router.post('/buy', buyProduct);
router.get('/purchases/user/:userId', getPurchasesByUserId);
router.get('/purchases', getAllPurchases);
router.patch('/update/buy/:purchaseId', updatePurches);


export default router;