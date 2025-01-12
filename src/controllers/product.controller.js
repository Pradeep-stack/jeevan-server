import { Product } from "../models/product.modal.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Purchase } from "../models/purchase.model.js";
import { User } from "../models/user.modal.js";
import { Packages } from "../models/packages.modal.js";

export const addProduct = asyncHandler(async (req, res) => {
  const data = req.body;
  try {
    const product = await Product.create(data);
    return res
      .status(201)
      .json(new ApiResponse(200, product, "product Addedd Successfully..!"));
  } catch (error) {
    return res.status(500).json(new ApiResponse(400, null, error.message));
  }
});

// update product
export const editProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    const product = await Product.findByIdAndUpdate(id, data, { new: true });
    if (!product) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Product not found"));
    }
    return res
      .status(200)
      .json(new ApiResponse(200, product, "Product Updated Successfully..!"));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, null, error.message));
  }
});

export const getProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.find();
    return res
      .status(201)
      .json(new ApiResponse(200, product, "Get product Successfully..!"));
  } catch (error) {
    return res.status(500).json(new ApiResponse(400, null, error.message));
  }
});

// Get packages by region
export const getProductByRegion = async (req, res) => {
  try {
    const { region } = req.params;
    const product = await Product.find({ region });
    if (!product.length)
      return res
        .status(404)
        .json({ message: "No Product found in this region" });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// deleteProduct
export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const deleteVideo = await Product.findByIdAndDelete(id);

    if (!deleteVideo) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "product not found"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "product deleted successfully"));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, null, error.message));
  }
});

// Buy Product Function
export const buyProduct = asyncHandler(async (req, res) => {
  const { 
    productId,
    quantity,
    userId,
    name,
    email,
    mobile,
    address,
    serviceName,
    serviceFor,
    requiredDocuments,
    comment } = req.body;

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json(new ApiResponse(404, null, "Product not found"));
    }

    // Create the purchase record
    const purchase = await Purchase.create({ 
      productId, 
      quantity,
      userId,
      name,
      email,
      mobile,
      address,
      serviceName,
      serviceFor,
      requiredDocuments,
      comment });

    return res.status(200).json(new ApiResponse(200, purchase, "Product purchased successfully"));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, null, error.message));
  }
});

// new api with payment gatway integration
// export const buyProduct = asyncHandler(async (req, res) => {
//   const { 
//     productId,
//     quantity,
//     userId,
//     name,
//     email,
//     mobile,
//     address,
//     serviceName,
//     serviceFor,
//     requiredDocuments,
//     comment 
//   } = req.body;

//   try {
//     // Check if the product exists
//     const product = await Product.findById(productId);
//     if (!product) {
//       return res.status(404).json(new ApiResponse(404, null, "Product not found"));
//     }

//     // Create the purchase record
//     const purchase = await Purchase.create({ 
//       productId, 
//       quantity,
//       userId,
//       name,
//       email,
//       mobile,
//       address,
//       serviceName,
//       serviceFor,
//       requiredDocuments,
//       comment 
//     });

//     // Initiate payment with PhonePe or other gateway
//     // const paymentPayload = {
//     //   purchaseId: purchase._id,
//     //   amount: product.price * quantity, // Calculate total amount
//     //   userId,
//     //   name,
//     //   email,
//     //   mobile,
//     // };

//     // const paymentResponse = await initiatePayment(paymentPayload);

//     if (!paymentResponse.success) {
//       return res
//         .status(500)
//         .json(new ApiResponse(500, null, "Payment initiation failed"));
//     }

//     return res.status(200).json(
//       new ApiResponse(200, { 
//         purchase, 
//         paymentUrl: paymentResponse.paymentUrl 
//       }, "Product purchased successfully. Proceed to payment.")
//     );
//   } catch (error) {
//     return res.status(500).json(new ApiResponse(500, null, error.message));
//   }
// });

// export const buyProduct = asyncHandler(async (req, res) => {
//   const { productId, quantity, userId } = req.body;

//   try {
//     const product = await Packages.findById(productId);

//     if (!product) {
//       return res
//         .status(404)
//         .json(new ApiResponse(404, null, "Product not found"));
//     }

//     // Create the purchase record
//     const purchase = await Purchase.create({
//       productId: productId,
//       quantity: quantity,
//       userId: userId,
//     });

//     console.log("purchase", purchase);
//     // Fetch the user who made the purchase
//     const user = await User.findById(userId);

//     if (user.referredBy) {
//       // Find the referring user
//       const referringUser = await User.findOne({
//         referral_code: user.referredBy,
//       });

//       if (referringUser) {
//         // Add commission to the referring user
//         let commission;
//         if (product.workingArea == 15) {
//           commission =parseInt(product.workingArea)  * 0.1;
//         } else if (product.workingArea == 50) {
//           commission = parseInt(product.workingArea) * 0.2;
//         } else if (product.workingArea == 150) {
//           commission = parseInt(product.workingArea) * 0.4;
//         }
//         // Assuming 10% commission
//         referringUser.points += commission; // Assuming points are being used for commission
//         await referringUser.save();
//       }
//     }

//     return res
//       .status(200)
//       .json(new ApiResponse(200, purchase, "Product purchased successfully"));
//   } catch (error) {
//     return res.status(500).json(new ApiResponse(500, null, error.message));
//   }
// });

// Get Purchased Products by User ID
export const getPurchasesByUserId = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  try {
    const purchases = await Purchase.find({ userId: userId }).populate(
      "productId"
    );

    if (!purchases.length) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "No purchases found for this user"));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, purchases, "Purchases retrieved successfully")
      );
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, null, error.message));
  }
});

// Get All Purchased Products
export const getAllPurchases = asyncHandler(async (req, res) => {
  try {
    const purchases = await Purchase.find()
      .populate("productId")
      .populate("userId");

    return res
      .status(200)
      .json(
        new ApiResponse(200, purchases, "All purchases retrieved successfully")
      );
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, null, error.message));
  }
});

// Update Purchase by Purchase ID
export const updatePurches = asyncHandler(async (req, res) => {
  const { purchaseId } = req.params;
  const updateData = req.body;

  try {
    const purchase = await Purchase.findByIdAndUpdate(purchaseId, updateData, {
      new: true,
    }).populate("productId");

    if (!purchase) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Purchase not found"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, purchase, "Purchase updated successfully"));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, null, error.message));
  }
});
