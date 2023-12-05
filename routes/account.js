import { Router } from "express"
import { createAccount, getAllAccount, getAccount } from "../controller/account.js"


const router = Router()

router.post("/create", createAccount)

router.get("/", getAllAccount)
router.get("/:accountId", getAccount)

export default router