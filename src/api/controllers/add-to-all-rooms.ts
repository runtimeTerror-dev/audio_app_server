/* eslint-disable @typescript-eslint/naming-convention */
import { Request, Response } from "express"

import { AccessToken } from 'livekit-server-sdk'
import SocketServer, { defaultRooms } from "../../socket"

const addToAllRooms = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const { userId } = req.body
        const user = await SocketServer.socketStore.getUserById(Number(userId))
        if (user) {
            const tokens: string[] = []
            defaultRooms.forEach((room) => {
                const at = new AccessToken(process.env.LIVEKIT_API_KEY, process.env.LIVEKIT_API_SECRET, {
                    identity: user.id.toString(), ttl: '2h'
                })
                at.addGrant({ roomJoin: true, room: room.id.toString(), canSubscribe: true, canPublish: false, hidden: true })
                const token = at.toJwt()
                tokens.push(token)
            })

            return res.status(200).json({
                success: true,
                message: "Room Joined Successfully",
                data: tokens,
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

export default addToAllRooms