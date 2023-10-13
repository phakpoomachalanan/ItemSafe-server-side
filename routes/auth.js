import { Router } from "express"
import { login } from "../controller/auth"


const router = Router()

router.get("/auth", login)

export default router