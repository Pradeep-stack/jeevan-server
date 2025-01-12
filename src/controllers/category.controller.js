import { Category } from "../models/category.modal.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const addCategory = asyncHandler(async (req, res) => {
  const data = req.body;
  try {
    const category = await Category.create(data);
    return res
      .status(201)
      .json(new ApiResponse(200, category, "Category Addedd Successfully..!"));
  } catch (error) {
    return res.status(500).json(new ApiResponse(400, null, error.message));
  }
});

export const getCategory = asyncHandler(async (req, res) => {
  try {
    const category = await Category.find();
    return res
      .status(201)
      .json(new ApiResponse(200, category, "Get category Successfully..!"));
  } catch (error) {
    return res.status(500).json(new ApiResponse(400, null, error.message));
  }
});

// Get packages by region
export const getCategoryByRegion = async (req, res) => {
  try {
    const { region } = req.params;
    const category = await Category.find({ region });
    if (!category.length) return res.status(404).json({ message: "No Category found in this region" });
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
      const deleteVideo = await Category.findByIdAndDelete(id);

      if (!deleteVideo) {
          return res.status(404).json(
              new ApiResponse(404, null, "Video not found")
          );
      }

      return res.status(200).json(
          new ApiResponse(200, {}, "Category deleted successfully")
      );
  } catch (error) {
      return res.status(500).json(
          new ApiResponse(500, null, error.message)
      );
  }
});

// for the update 

export const editCategory = asyncHandler(async (req, res) => {
  const { id } = req.params; 
  const data = req.body;
  
  try {
    const category = await Category.findByIdAndUpdate(id, data, { new: true }); 
    if (!category) {
      return res.status(404).json(new ApiResponse(404, null, "Category not found"));
    }
    return res
      .status(200)
      .json(new ApiResponse(200, category, "Category Updated Successfully..!"));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, null, error.message));
  }
});
