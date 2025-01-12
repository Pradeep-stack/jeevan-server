import { Router } from "express";
import { addVideo, deleteVideo, getVideo } from "../controllers/vedio.controller.js";

const router = Router()

router.route("/add-video").post(addVideo)
router.route("/get-videos").get(getVideo)
router.route("/delete-video/:id").delete(deleteVideo)

export default router;