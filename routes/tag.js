import { Router } from "express"
import { createTag } from "../controller/tag.js"


const router = Router()

router.post("/create", createTag)

export default router