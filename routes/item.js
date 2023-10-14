import { Router } from "express"
import { createItem, deleteItem, getChildren, getItem, updateItem } from "../controller/item.js"


const router = Router()

router.post("/create", createItem)

router.put("/{itemId}/update", updateItem)

router.get("/{itemId}/attr", getItem)
router.get("/{itemId}/children", getChildren)

router.delete("/{itemId}/delete", deleteItem)

export default router