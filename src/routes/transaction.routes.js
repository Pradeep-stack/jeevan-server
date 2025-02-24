import { Router } from "express";
import { addTransaction, updateTransactionStatus, getTransactionsByUserId, getTransactions, deleteTransaction } from "../controllers/transaction.controller.js";

const router = Router()

router.route("/buy-package").post(addTransaction)
router.route("/update-status").post(updateTransactionStatus)
router.route("/get-transactions/:userId").get(getTransactionsByUserId)
router.route("/get-transactions").get(getTransactions)
router.route("/delete-transactions/:transactionId").delete(deleteTransaction)


export default router;