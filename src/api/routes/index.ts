import { Router } from "express"
import RootRouter from "./root"

const router = Router()

router.use("/", RootRouter)

export default router
