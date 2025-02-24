import { Transaction } from "../models/transaction.modal.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.modal.js";

export const addTransaction = asyncHandler(async (req, res) => {
  const { price, userId, transactionId } = req.body;
  const checkTransaction = await Transaction.findOne({ transactionId });
  if (checkTransaction) {
    return res .status(400).json(new ApiResponse(400, null, "Transaction ID already exists"));
  }
  try {
    const transaction = new Transaction({
      userId,
      price,
      transactionId,
      status: "pending",
    });

    await transaction.save();
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json(new ApiResponse(404, null, "User not found"));
    }
    user.user_type = "Admin";
    await user.save();

    return res
      .status(201)
      .json(new ApiResponse(201, transaction, "Transaction added successfully"));
  } catch (err) {
    return res.status(500).json(new ApiResponse(500, null, err.message));
  }
});
;


export const updateTransactionStatus = asyncHandler(async (req, res) => {
  const { transactionId, status } = req.body;

  try {
    const transaction = await Transaction.findOne({ transactionId });

    if (!transaction) {
      return res.status(404).json(new ApiResponse(404, null, "Transaction not found"));
    }

    transaction.status = status;
    await transaction.save();

    return res
      .status(200)
      .json(new ApiResponse(200, transaction, "Transaction status updated successfully"));
  } catch (err) {
    return res.status(500).json(new ApiResponse(500, null, err.message));
  }
});


export const getTransactionsByUserId = asyncHandler(async (req, res) => {
  const { userId } = req.params; // Extract userId from URL parameters

  try {
    // Find all transactions for the given userId
    const transactions = await Transaction.find({ userId });

    if (transactions.length === 0) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "No transactions found for this user"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, transactions, "Transactions retrieved successfully"));
  } catch (err) {
    return res.status(500).json(new ApiResponse(500, null, err.message));
  }
});

export const getTransactions = asyncHandler(async (req, res) => {

  try {
    // Find all transactions for the given userId
    const transactions = await Transaction.find();

    if (transactions.length === 0) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "No transactions found for this user"));
    }
    return res
      .status(200)
      .json(new ApiResponse(200, transactions, "Transactions retrieved successfully"));
  } catch (err) {
    return res.status(500).json(new ApiResponse(500, null, err.message));
  }
});

export const deleteTransaction = asyncHandler(async (req, res) => {
  const { transactionId } = req.params; // Extract transactionId from URL parameters

  try {
    // Find and delete the transaction
    const transaction = await Transaction.findByIdAndDelete(transactionId);

    if (!transaction) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Transaction not found"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Transaction deleted successfully"));
  } catch (err) {
    return res.status(500).json(new ApiResponse(500, null, err.message));
  }
});


//   try {
//     const video = await Video.find();
//     return res
//       .status(201)
//       .json(new ApiResponse(200, video, "Get Video Successfully..!"));
//   } catch (error) {
//     return res.status(500).json(new ApiResponse(400, null, error.message));
//   }
// });

// export const deleteVideo = asyncHandler(async (req, res) => {
//   const { id } = req.params;

//   try {
//       const deleteVideo = await Video.findByIdAndDelete(id);

//       if (!deleteVideo) {
//           return res.status(404).json(
//               new ApiResponse(404, null, "Video not found")
//           );
//       }

//       return res.status(200).json(
//           new ApiResponse(200, {}, "Video deleted successfully")
//       );
//   } catch (error) {
//       return res.status(500).json(
//           new ApiResponse(500, null, error.message)
//       );
//   }
// });
