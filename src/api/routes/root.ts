import { Router } from "express"
import joinRoom from "../controllers/join-room"
import leaveRoom from "../controllers/leave-room"
import addToAllRooms from "../controllers/add-to-all-rooms"


// Controllers

const router = Router()
router.post("/join-room", joinRoom)
router.post("/leave-room", leaveRoom)
router.post("/add-to-all-rooms", addToAllRooms)

export default router
