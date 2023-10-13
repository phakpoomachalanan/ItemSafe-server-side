import { Router } from "express";
import { getTree } from "../controller/tree";

const router = Router()

router.get("/tree", getTree)

export default router