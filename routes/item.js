import { Router } from "express"
import { createItem, deleteItem, getChildren, getItem, updateItem } from "../controller/item.js"


const router = Router()

router.post("/create", createItem)

router.put("/{nodeId}/update", updateItem)

router.get("/{nodeId}/attr", getItem)
router.get("/{nodeId}/children", getChildren)

router.delete("/{nodeId}/delete", deleteItem)

export default router