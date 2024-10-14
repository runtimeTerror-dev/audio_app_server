/* eslint-disable @typescript-eslint/naming-convention */
import { Request, Response } from "express"

import { AccessToken } from 'livekit-server-sdk'
import SocketServer, { defaultRooms } from "../../socket"

const joinRoom = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const { roomId, userId } = req.body
        const user = await SocketServer.socketStore.getUserById(Number(userId))
        if (user) {
            // if this room doesn't exist, it'll be automatically created when the first
            // client joins
            const roomName = roomId
            // identifier to be used for participant.
            // it's available as LocalParticipant.identity with livekit-client SDK
            const participantName = user.name

            const at = new AccessToken(process.env.LIVEKIT_API_KEY, process.env.LIVEKIT_API_SECRET, {
                identity: participantName, ttl: '1h'
            })
            at.addGrant({ roomJoin: true, room: roomName, canPublish: true, canSubscribe: true })

            const token = at.toJwt()
            console.log('access token', token)

            SocketServer.roomUsersMap[roomId].push(user)

            const roomsUserInfo = Object.keys(SocketServer.roomUsersMap).map((rId) => ({
                roomId: rId,
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
                message: "Room Joined Successfully",
                data: token,
            })
        }
        return res.status(500).json({
            success: true,
            message: "Error joining room",
            data: null,
        })
    } catch (error) {
        console.log("Error: ", error)

        return res.status(500).json({
            success: true,
            message: "Error joining room",
            data: null,
        })
    }
}

export default joinRoom