import { Router } from "express"
import { getTree, initTree, updateTree } from "../controller/tree.js"


const router = Router()

router.post("/init/:root/tree", initTree)

router.put("/:root/tree", updateTree)

router.get("/:root/tree", getTree)

export default router