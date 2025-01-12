import { Packages } from "../models/packages.modal.js";
import { User } from "../models/user.modal.js";
// Create a new package
export const createPackage = async (req, res) => {
  try {
    const {
      userId,
      plan,
      benefits,
      subscription,
      lifetime,
      renewable,
      workingArea,
      overseas,
      region,
      packagePlan,
      referredBy,
    } = req.body;

    const newPackage = new Packages({
      userId: userId,
      plan: plan,
      benefits: benefits,
      subscription: subscription,
      lifetime: lifetime,
      renewable: renewable,
      workingArea: workingArea,
      overseas: overseas,
      region: region,
      packagePlan: packagePlan,
      referredBy: referredBy,
    });
    await newPackage.save();

    const userType = "Admin";

    const user = await User.findById(userId);
    if (user) {
      user.user_type = userType;
      await user.save();
    }

    if (referredBy) {
      const referringUser = await User.findOne({
        referral_code: referredBy,
      });
      if (referringUser) {
        if (packagePlan == "package-1") {
          referringUser.points += parseInt(workingArea) * 0.1;
          await referringUser.save();
        } else if (packagePlan == "package-2") {
          referringUser.points += parseInt(workingArea) * 0.2;
          await referringUser.save();
        } else if (packagePlan == "package-3") {
          referringUser.points += parseInt(workingArea) * 0.4;
          await referringUser.save();
        }
      } else {
        console.log(`Referral code ${referredBy} not found.`);
      }
    }
    res.status(201).json(newPackage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all packages
export const getAllPackages = async (req, res) => {
  try {
    const packages = await Packages.find();
    res.status(200).json(packages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a package by ID
export const getPackageById = async (req, res) => {
  try {
    const plan = await Packages.findById(req.params.id);
    const response = await plan.populate("userId");
    if (!plan) return res.status(404).json({ message: "Package not found" });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//Get package by user id

export const getPlanByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const plan = await Packages.findOne({ userId });
    const response = await plan.populate("userId");
    if (!plan) return res.status(404).json({ message: "Package not found" });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Get packages by region
export const getPackagesByRegion = async (req, res) => {
  try {
    const { region } = req.params;
    const packages = await Packages.find({ region });
    if (!packages.length)
      return res
        .status(404)
        .json({ message: "No packages found in this region" });
    res.status(200).json(packages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a package
export const updatePackage = async (req, res) => {
  try {
    const plan = await Packages.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!plan) return res.status(404).json({ message: "Package not found" });
    res.status(200).json(plan);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a package
export const deletePackage = async (req, res) => {
  try {
    const plan = await Packages.findByIdAndDelete(req.params.id);
    if (!plan) return res.status(404).json({ message: "Package not found" });
    res.status(200).json({ message: "Package deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
