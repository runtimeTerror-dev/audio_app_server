import { Router } from "express"
import joinRoom from "../controllers/join-room"


// Controllers

const router = Router()
router.post("/join-room", joinRoom)
export default router
