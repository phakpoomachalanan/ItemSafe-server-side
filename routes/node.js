import { Router } from "express";
import { getChildren } from "../controller/node";

const router = Router()

router.get("/children", getChildren)

export default router