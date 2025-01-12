import express from "express";
import {
  createPackage,
  getAllPackages,
  getPackageById,
  updatePackage,
  deletePackage,
  getPackagesByRegion,
  getPlanByUserId
} from "../controllers/packages.controller.js";

const router = express.Router();

router.post("/add", createPackage);
router.get("/get-all", getAllPackages);
router.get("/get-by-region/:region", getPackagesByRegion);
router.get("/get-by-id/:id", getPackageById);
router.patch("/update/:id", updatePackage);
router.delete("/delete/:id", deletePackage);
router.get('/get/:userId', getPlanByUserId);

export default router;
