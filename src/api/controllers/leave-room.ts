/* eslint-disable @typescript-eslint/naming-convention */
import { Request, Response } from "express"

import SocketServer, { defaultRooms } from "../../socket"

const leaveRoom = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const { roomId, userId } = req.body
        const user = await SocketServer.socketStore.getUserById(Number(userId))
        if (user) {
            console.log(`${user.id} left room: ${roomId}`)
            if (SocketServer.roomUsersMap[roomId]) {
                SocketServer.roomUsersMap[roomId] = SocketServer.roomUsersMap[roomId].filter(u => u.id !== user.id)
                console.log(`User ID ${user.id} has left room ${roomId}.`)
            } else {
                console.log(`Room ${roomId} does not exist.`)
                return res.status(500).json({
                    success: true,
                    message: "Error leaving room",
                    data: null,
                })
            }

            const roomsUserInfo = Object.keys(SocketServer.roomUsersMap).map((rId) => ({
                roomId,
                name: defaultRooms.find(room => room.id.toString() === rId)?.name || "Unknown Room",
                users: SocketServer.roomUsersMap[Number(rId)].map(reqUser => ({
                    id: reqUser.id,
                    name: reqUser.name,
                })),
            }))

            // Emit all room user info to the newly connected user
            SocketServer.io.emit("roomsUserInfo", roomsUserInfo)
            return res.status(200).json({
                success: true,
                message: "Room Left Successfully",
                data: "",
            })
        }
        return res.status(500).json({
            success: true,
            message: "Error leaving room",
            data: null,
        })
    } catch (error) {
        console.log("Error: ", error)

        return res.status(500).json({
            success: true,
            message: "Error leaving room",
            data: null,
        })
    }
}

export default leaveRoom