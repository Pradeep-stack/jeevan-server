import { Router } from "express";
import { 
    loginUser, 
    logoutUser, 
    registerUser, 
    refreshAccessToken, 
    changeCurrentPassword, 
    getCurrentUser, 
    updateUserAvatar, 
    updateUserCoverImage, 
    getUserChannelProfile, 
    getWatchHistory, 
    updateAccountDetails,
    getAllUsers,
    getAllCenter,
    getAllParent,
    deleteUser,
    updateUser,
    getUserById,
    getUsersReferredByMe,
    getUserTree
} from "../controllers/user.controller.js";
import { uploadSingle, uploadMultiple } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()

router.route("/register").post(registerUser )
router.route("/login").post(loginUser)
router.route("/get-all-user").get(getAllUsers)// modify this api for the get associat for the associat
router.route("/get-referral/:referral_code").get(getUsersReferredByMe)
router.route("/get-admin").get(getAllCenter)
router.route("/get-user").get(getAllParent)
router.route("/delete-user/:id").delete(deleteUser)
router.route("/update-user/:id").patch(updateUser)
router.route("/user-by-id/:id").get(getUserById)


//secured routes
router.route("/logout").post(verifyJWT,  logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT, changeCurrentPassword)
router.route("/current-user").get(verifyJWT, getCurrentUser)
router.route("/update-account").patch(verifyJWT, updateAccountDetails)
// router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar)
// router.route("/cover-image").patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage)
router.route("/c/:username").get(verifyJWT, getUserChannelProfile)
router.route("/history").get(verifyJWT, getWatchHistory)
router.route("/user-tree/:sponser_code").get(getUserTree);

export default router