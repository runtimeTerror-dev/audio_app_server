import IUserStore from "."
import { User } from "../../models/user"

class InMemoryUserStore implements IUserStore {
    setUser(socketId: string, user: User): Promise<void> {
        throw new Error("Method not implemented.")
    }
    removeUser(socketId: string): Promise<void> {
        throw new Error("Method not implemented.")
    }
    getUser(socketId: string): Promise<User | undefined> {
        throw new Error("Method not implemented.")
    }
    private sockets: Map<string, User> = new Map()
}

export default InMemoryUserStore
