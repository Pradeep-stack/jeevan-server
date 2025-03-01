import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.modal.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { nanoid } from "nanoid";
// import { generateId } from "../utils/rendomId.js";

const generateReferralCode = () => {
  return `JEE${Math.floor(10000000 + Math.random() * 90000000)}`;
};

const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating referesh and access token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  try {
    const {
      title,
      fullName,
      phone,
      email,
      dob,
      password,
      sponserBy,
      country,
      position,
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User with email already exists" });
    }
    if (!sponserBy || !position) {
      return res
        .status(409)
        .json({ message: "Sponser Code and Postions Compulsory" });
    }
    const user_type = "User";
    const newReferralCode = generateReferralCode();
    const sponserCode = sponserBy || "JEE123456";

    // Find parent user by sponsor code
    const parent = await User.findOne({ sponser_code: sponserCode });

    // Create new user
    const newUser = new User({
      title,
      fullName,
      dob,
      phone,
      email,
      user_type,
      password,
      sponser_code: newReferralCode,
      sponserBy: sponserCode,
      country,
    });

    if (parent) {
      if (position === "left" && !parent.leftChild) {
        parent.leftChild = newUser._id;
        newUser.position = position;
      } else if (position === "right" && !parent.rightChild) {
        parent.rightChild = newUser._id;
        newUser.position = position;
      } else if (position === "right" && parent.rightChild) {
        let childParent = await User.findById(parent.rightChild);
        while (childParent && childParent.rightChild) {
          childParent = await User.findById(childParent.rightChild);
        }
        if (childParent) {
          childParent.rightChild = newUser._id;
          await childParent.save();
        }
      } else if (position === "left" && parent.leftChild) {
        let childParent = await User.findById(parent.leftChild);
        while (childParent && childParent.leftChild) {
          childParent = await User.findById(childParent.leftChild);
        }
        if (childParent) {
          childParent.leftChild = newUser._id;
          await childParent.save();
        }
      }
    }

    // Save user & parent updates
    await newUser.save();
    if (parent) await parent.save();

    return res
      .status(201)
      .json({ user: newUser, message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    return res
      .status(500)
      .json({ message: "Something went wrong while registering the user" });
  }
});

// const registerUser = asyncHandler(async (req, res) => {
//   const {
//     title,
//     fullName,
//     phone,
//     email,
//     dob,
//     password,
//     sponserBy,
//     country,
//     position,
//   } = req.body;

//   try {
//     // Check if user already exists

//     const existingUser = await User.findOne( email );
//     if (existingUser) {
//       return res
//         .status(409)
//         .json(new ApiError(409, "User with email already exists"));
//     }
//     // Generate referral code and set sponsor code
//     const user_type = "User";
//     const newReferralCode = generateReferralCode();
//     const sponserCode = sponserBy ? sponserBy : "JEE123456";

//     // Find the parent user (sponsor)
//     const parent = await User.findOne( sponserCode );
//     // if (!parent) {
//     //   return res
//     //     .status(404)
//     //     .json(new ApiError(404, "Sponsor not found"));
//     // }
// console.log(parent);
// console.log(existingUser);
//     // Create the new user
//     const newUser = new User({
//       title,
//       fullName,
//       dob,
//       phone: Number(phone), // Convert phone to a number if your schema expects it
//       email,
//       user_type:user_type,
//       password,
//       sponser_code: newReferralCode,
//       sponserBy: sponserCode,
//       country,
//       position,
//     });

//     // Save the new user
//     await newUser.save();

//     // Function to find the last child in the hierarchy
//     const findLastChild = async (userId, position) => {
//       let currentUser = await User.findById(userId);
//       if (!currentUser) {
//         throw new Error(`User with ID ${userId} not found`);
//       }
//       while (currentUser[`${position}Child`]) {
//         currentUser = await User.findById(currentUser[`${position}Child`]);
//         if (!currentUser) {
//           throw new Error(`User with ID ${currentUser[`${position}Child`]} not found`);
//         }
//       }
//       return currentUser;
//     };

//     // Add the new user to the hierarchy
//     if (position === "left" || position === "right") {
//       if (!parent[`${position}Child`]) {
//         parent[`${position}Child`] = newUser._id;
//       } else {
//         const lastChild = await findLastChild(parent[`${position}Child`], position);
//         lastChild[`${position}Child`] = newUser._id;
//         await lastChild.save();
//       }
//     } else {
//       return res
//         .status(400)
//         .json(new ApiError(400, "Invalid position. Use 'left' or 'right'"));
//     }

//     // Save the parent user
//     await parent.save();

//     return res
//       .status(201)
//       .json(new ApiResponse(201, newUser, "User registered successfully"));
//   } catch (error) {
//     // Handle validation errors (e.g., incorrect data types)
//     return res
//       .status(500)
//       .json(new ApiError(500, error.message));
//   }
// });

const getUserTree = asyncHandler(async (req, res) => {
  const { sponser_code } = req.params;

  async function buildTree(user) {
    if (!user) return null;

    // Fetch child nodes recursively
    const leftChild = user.leftChild
      ? await User.findById(user.leftChild)
      : null;
    const rightChild = user.rightChild
      ? await User.findById(user.rightChild)
      : null;

    return {
      id: user._id,
      name: user.fullName,
      children: [
        await buildTree(leftChild),
        await buildTree(rightChild),
      ].filter(Boolean),
    };
  }

  const rootUser = await User.findOne({ sponser_code });
  if (!rootUser) {
    return res.status(404).json({ message: "User not found" });
  }

  const tree = await buildTree(rootUser);
  res.json(tree);
});

const loginUser = asyncHandler(async (req, res) => {
  // req body -> data
  // username or email
  //find the user
  //password check
  //access and referesh token
  //send cookie

  const { email, password } = req.body;
  console.log(email);

  if (!email) {
    return res.status(400).json(new ApiError(400, null, "Email Is required"));
  }

  // Here is an alternative of above code based on logic discussed in video:
  // if (!(username || email)) {
  //     throw new ApiError(400, "username or email is required")

  // }

  const user = await User.findOne({
    $or: [{ email }],
  });

  if (!user) {
    return res.status(400).json(new ApiError(400, null, "User does not exist"));
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    return res
      .status(401)
      .json(new ApiError(401, null, "Invalid user credentials"));
  }

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged In Successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1, // this removes the field from document
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    return res
      .status(401)
      .json(new ApiError(401, null, "unauthorized request"));
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      return res
        .status(401)
        .json(new ApiError(401, null, "Invalid refresh token"));
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      return res
        .status(401)
        .json(new ApiError(401, null, "Refresh token is expired or used"));
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefereshTokens(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed"
        )
      );
  } catch (error) {
    return res
      .status(401)
      .json(new ApiError(401, null, error?.message || "Invalid refresh token"));
  }
});

export const getUsersReferredByMe = asyncHandler(async (req, res) => {
  const { referral_code } = req.params;

  try {
    const users = await User.find({ referredBy: referral_code });

    if (!users.length) {
      return res
        .status(404)
        .json(
          new ApiResponse(404, null, "No users found referred by this code")
        );
    }

    return res
      .status(200)
      .json(new ApiResponse(200, users, "Users retrieved successfully"));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, null, error.message));
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    return res
      .status(401)
      .json(new ApiError(400, null, "Invalid old password"));
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User fetched successfully"));
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  if (!users || users.length === 0) {
    return res.status(404).json(new ApiResponse(404, null, "No users found"));
  }
  // Return the list of users
  return res
    .status(200)
    .json(new ApiResponse(200, users, "All users fetched successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body;

  if (!fullName || !email) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullName,
        email: email,
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"));
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is missing");
  }

  //TODO: delete old image - assignment

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar.url) {
    throw new ApiError(400, "Error while uploading on avatar");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Avatar image updated successfully"));
});

const updateUserCoverImage = asyncHandler(async (req, res) => {
  const coverImageLocalPath = req.file?.path;

  if (!coverImageLocalPath) {
    throw new ApiError(400, "Cover image file is missing");
  }

  //TODO: delete old image - assignment

  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!coverImage.url) {
    throw new ApiError(400, "Error while uploading on avatar");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        coverImage: coverImage.url,
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Cover image updated successfully"));
});

const getUserChannelProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;

  if (!username?.trim()) {
    throw new ApiError(400, "username is missing");
  }

  const channel = await User.aggregate([
    {
      $match: {
        username: username?.toLowerCase(),
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedTo",
      },
    },
    {
      $addFields: {
        subscribersCount: {
          $size: "$subscribers",
        },
        channelsSubscribedToCount: {
          $size: "$subscribedTo",
        },
        isSubscribed: {
          $cond: {
            if: { $in: [req.user?._id, "$subscribers.subscriber"] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        fullName: 1,
        username: 1,
        subscribersCount: 1,
        channelsSubscribedToCount: 1,
        isSubscribed: 1,
        avatar: 1,
        coverImage: 1,
        email: 1,
      },
    },
  ]);

  if (!channel?.length) {
    throw new ApiError(404, "channel does not exists");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, channel[0], "User channel fetched successfully")
    );
});

const getWatchHistory = asyncHandler(async (req, res) => {
  const user = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "watchHistory",
        foreignField: "_id",
        as: "watchHistory",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    fullName: 1,
                    username: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              owner: {
                $first: "$owner",
              },
            },
          },
        ],
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        user[0].watchHistory,
        "Watch history fetched successfully"
      )
    );
});

const getAllCenter = asyncHandler(async (req, res) => {
  const users = await User.find({ user_type: "center" });

  if (!users || users.length === 0) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "No center users found"));
  }
  return res
    .status(200)
    .json(new ApiResponse(200, users, "All center users fetched successfully"));
});

const getAllParent = asyncHandler(async (req, res) => {
  const users = await User.find({ user_type: "user" });

  if (!users || users.length === 0) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "No parent users found"));
  }
  return res
    .status(200)
    .json(new ApiResponse(200, users, "All parent users fetched successfully"));
});

const deleteUser = asyncHandler(async (req, res) => {
  const userId = req.params.id; // Assuming you pass the user id in the request parameters

  const deletedUser = await User.findByIdAndDelete(userId);

  if (!deletedUser) {
    throw new ApiError(404, "User not found");
  }

  return res.json(new ApiResponse(200, null, "User deleted successfully"));
});

const updateUser = asyncHandler(async (req, res, next) => {
  const userId = req.params.id; // Assuming you pass the user ID in the URL params
  const {
    fullName,
    email,
    phone,
    password,
    username,
    referredBy,
    age,
    sex,
    image,
    education,
    city,
    state,
    country,
    region,
  } = req.body;

  try {
    let user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Check if email exists for another user
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        throw new ApiError(409, "Email already exists");
      }
    }

    // Check if phone exists for another user
    if (phone && phone !== user.phone) {
      const phoneExists = await User.findOne({ phone });
      if (phoneExists) {
        throw new ApiError(409, "Phone number already exists");
      }
    }

    // Update user fields
    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.password = password || user.password;
    user.username = username || user.username;
    user.referredBy = referredBy || user.referredBy;
    user.age = age || user.age;
    user.sex = sex || user.sex;
    user.image = image || user.image;
    user.education = education || user.education;
    user.city = city || user.city;
    user.state = state || user.state;
    user.country = country || user.country;
    user.region = region || user.region;

    // Save updated user
    user = await user.save();

    // Return updated user
    return res
      .status(200)
      .json(new ApiResponse(200, user, "User updated successfully"));
  } catch (error) {
    // Handle errors
    return next(error);
  }
});

const getUserById = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res.json(new ApiResponse(200, user, "User retrieved successfully"));
});
export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
  getWatchHistory,
  getAllUsers,
  getAllCenter,
  getAllParent,
  deleteUser,
  updateUser,
  getUserById,
  getUserTree,
};
