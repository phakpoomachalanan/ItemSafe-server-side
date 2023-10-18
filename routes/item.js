import { Router } from "express"
import { createFolder, deleteItem, getAllItem, getChildren, getItem, getParent, moveItem, updateItem, uploadItem } from "../controller/item.js"
import { upload } from "../middleware/upload.js"


const router = Router()

router.post("/create", createFolder)
router.post("/upload", upload.single('item'), uploadItem)

router.put("/:itemId/move", moveItem)
router.put("/:itemId/update", updateItem)

router.get("/", getAllItem)
router.get("/:itemId", getItem)
router.get("/:itemId/children", getChildren)
router.get("/:itemId/parent", getParent)

router.delete("/:itemId/delete", deleteItem)

export default router