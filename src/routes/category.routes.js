import { Router } from "express";
import { addCategory, getCategory, deleteCategory,
    getCategoryByRegion,
    editCategory
 } from "../controllers/category.controller.js";

const router = Router()

router.route("/add-category").post(addCategory)
router.route("/get-category").get(getCategory)
router.get("/category/get-by-region/:region", getCategoryByRegion);
router.route("/delete-category/:id").delete(deleteCategory)
router.route("/edit-category/:id").patch(editCategory)

export default router;