import { Router } from "express"
import { searchItem } from "../controller/search.js"


const router = Router()

router.get("/", searchItem)

export default router