/* eslint-disable @typescript-eslint/naming-convention */
import { Room, RoomServiceClient } from 'livekit-server-sdk'
import dotenv from 'dotenv'

dotenv.config()

class LiveKitClient {
    private static instance: RoomServiceClient

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() {
    }

    public static getInstance(): RoomServiceClient {
        if (!LiveKitClient.instance) {
            const livekitHost = process.env.LIVEKIT_HOST as string
            LiveKitClient.instance = new RoomServiceClient(
                livekitHost,
                process.env.LIVEKIT_API_KEY as string,
                process.env.LIVEKIT_API_SECRET as string
            )
        }

        return LiveKitClient.instance
    }

    public static listRooms(): Promise<Room[]> {
        return this.getInstance().listRooms()
    }
}

export default LiveKitClient
