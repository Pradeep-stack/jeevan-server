import { Router } from "express";
import { 
 registerExpoUser,
 getAllExpoUsers,
 getUserById
} from "../controllers/expouser.controller.js";


const router = Router()

router.route("/register").post(registerExpoUser )
router.route("/allusers").get(getAllExpoUsers)
router.route("/get-user/:phone").get(getUserById)

export default router