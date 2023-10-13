import { Router } from "express"
import { getTree } from "../controller/tree.js"


const router = Router()

router.get("/tree", getTree)

export default router