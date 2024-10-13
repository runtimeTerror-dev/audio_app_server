import IUserStore from "."
import { User } from "../../models/user"

class InMemoryUserStore implements IUserStore {
    private users: Map<string, User> = new Map()

    async setUser(socketId: string, user: User): Promise<void> {
        this.users.set(socketId, user)
    }

    async removeUser(socketId: string): Promise<void> {
        this.users.delete(socketId)
    }

    async getUser(socketId: string): Promise<User | undefined> {
        return this.users.get(socketId)
    }

    // Retrieve a user by their userId using Array.prototype.find
    async getUserById(userId: number): Promise<User | undefined> {
        return Array.from(this.users.values()).find(user => user.id === userId)
    }

    async getAllUsers(): Promise<User[]> { // Implement this function
        return Array.from(this.users.values())
    }

    private sockets: Map<string, User> = new Map()
}

export default InMemoryUserStore
