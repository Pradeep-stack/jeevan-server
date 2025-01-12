import { Video } from "../models/vedio.modal.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const addVideo = asyncHandler(async (req, res) => {
  const data = req.body;
  try {
    const video = await Video.create(data);
    return res
      .status(201)
      .json(new ApiResponse(200, video, "Video Addedd Successfully..!"));
  } catch (error) {
    return res.status(500).json(new ApiResponse(400, null, error.message));
  }
});

export const getVideo = asyncHandler(async (req, res) => {
  try {
    const video = await Video.find();
    return res
      .status(201)
      .json(new ApiResponse(200, video, "Get Video Successfully..!"));
  } catch (error) {
    return res.status(500).json(new ApiResponse(400, null, error.message));
  }
});

export const deleteVideo = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
      const deleteVideo = await Video.findByIdAndDelete(id);

      if (!deleteVideo) {
          return res.status(404).json(
              new ApiResponse(404, null, "Video not found")
          );
      }

      return res.status(200).json(
          new ApiResponse(200, {}, "Video deleted successfully")
      );
  } catch (error) {
      return res.status(500).json(
          new ApiResponse(500, null, error.message)
      );
  }
});