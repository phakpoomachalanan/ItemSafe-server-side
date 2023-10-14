import { Router } from "express"
import { homePage } from "../controller/home.js"


const router = Router()

router.get("/", homePage)

export default router