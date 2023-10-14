import { Router } from "express"
import { createNode, deleteNode, getAttribute, getChildren, updateNode } from "../controller/item.js"


const router = Router()

router.post("/create", createNode)

router.put("/{nodeId}/update", updateNode)

router.get("/{nodeId}/attr", getAttribute)
router.get("/{nodeId}/children", getChildren)

router.delete("/{nodeId}/delete", deleteNode)

export default router