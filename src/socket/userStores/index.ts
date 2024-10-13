// IUserStore.ts
import { User } from "../../models/user"

interface IUserStore {
    setUser(socketId: string, user: User): Promise<void>
    removeUser(socketId: string): Promise<void>
    getUser(socketId: string): Promise<User | undefined>
    getUserById(userId: number): Promise<User | undefined>
    getAllUsers(): Promise<User[]>
}


export default IUserStore
