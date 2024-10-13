import { Router } from "express"
import joinRoom from "../controllers/join-room"
import leaveRoom from "../controllers/leave-room"


// Controllers

const router = Router()
router.post("/join-room", joinRoom)
router.post("/leave-room", leaveRoom)

export default router
