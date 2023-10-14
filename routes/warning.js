import { Router } from "express"
import { createWarning } from "../controller/warning.js"


const router = Router()

router.post("/create", createWarning)

export default router