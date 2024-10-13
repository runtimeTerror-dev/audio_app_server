// IUserStore.ts

import { Socket } from "socket.io"
import { User } from "../../models/user"

interface IUserStore {
    setUser(socketId: string, user: User): Promise<void>
    removeUser(socketId: string): Promise<void>
    getUser(socketId: string): Promise<User | undefined>
}


export default IUserStore
