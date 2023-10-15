import { Router } from "express"
import { createTag, getAllTag, getTag } from "../controller/tag.js"


const router = Router()

router.post("/create", createTag)

router.get("/", getAllTag)
router.get("/:tagId", getTag)

export default router