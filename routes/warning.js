import { Router } from "express"
import { createWarning, getAllWarning, getWarning } from "../controller/warning.js"


const router = Router()

router.post("/create", createWarning)

router.get("/", getAllWarning)
router.get("/:warningId", getWarning)

export default router