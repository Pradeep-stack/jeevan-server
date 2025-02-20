import { Router } from "express";
import { getBalance, sendTRX } from "../controllers/cripto.controller.js";

const router = Router()

router.route("/get-balance").post(getBalance)
router.route("/send-trx").post(sendTRX)


export default router;