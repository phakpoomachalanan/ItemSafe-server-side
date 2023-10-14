import { Router } from "express"
import { createItem, deleteItem, getAllItem, getChildren, getItem, getParent, updateItem } from "../controller/item.js"


const router = Router()

router.post("/create", createItem)

router.put("/:itemId/update", updateItem)

router.get("/", getAllItem)
router.get("/:itemId", getItem)
router.get("/:itemId/children", getChildren)
router.get("/:itemId/parent", getParent)

router.delete("/:itemId/delete", deleteItem)

export default router