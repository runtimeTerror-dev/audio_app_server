/* eslint-disable @typescript-eslint/naming-convention */
import { Request, Response } from "express"

import { AccessToken } from 'livekit-server-sdk'

const joinRoom = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const { roomId, userId } = req.body
        // if this room doesn't exist, it'll be automatically created when the first
        // client joins
        const roomName = roomId
        // identifier to be used for participant.
        // it's available as LocalParticipant.identity with livekit-client SDK
        const participantName = userId

        const at = new AccessToken(process.env.LIVEKIT_API_KEY, process.env.LIVEKIT_API_SECRET, {
            identity: participantName,
        })
        at.addGrant({ roomJoin: true, room: roomName })

        const token = at.toJwt()
        console.log('access token', token)

        return res.status(200).json({
            success: true,
            message: "Room Joined Successfully",
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