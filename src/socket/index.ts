/* eslint-disable import/no-cycle */
/* eslint-disable no-await-in-loop */
import { Server as HttpServer } from "http"
import { Server as IOServer, Socket } from "socket.io"
import IUserStore from "./userStores"
import InMemoryUserStore from "./userStores/inMemoryStore"
import { User } from "../models/user"

export const defaultRooms = [
    { id: 0, name: "The Sassy Sandwich" },
    { id: 1, name: "Giggle Factory" },
    { id: 2, name: "Banana Bunker" },
]
export default class SocketServer {
    static userIdCounter = 0

    static availableNames = [
        "Enchanted Pineapple", "Radiant Peach", "Charming Coconut", "Dreamy Lychee",
        "Whimsical Kiwi", "Celestial Plum", "Luminous Papaya", "Serene Raspberry",
        "Vibrant Blueberry", "Majestic Pomegranate", "Alluring Apricot",
        "Ethereal Dragonfruit", "Glowing Tangerine", "Captivating Blackberry",
        "Mysterious Guava", "Delightful Fig", "Elegant Watermelon", "Dazzling Citrus",
        "Heavenly Persimmon", "Colorful Starfruit", "Joyful Cantaloupe",
        "Shimmering Nectarine", "Sweet Cinnamon", "Blissful Coconut",
        "Bountiful Berry", "Gentle Coconut", "Radiant Banana", "Stunning Grapefruit",
        "Playful Mango", "Sweet Almond", "Lovely Mulberry", "Graceful Honeydew",
        "Vibrant Dragonfruit", "Refreshing Lemonade", "Joyful Lychee",
        "Unique Tangerine", "Beautiful Kumquat", "Captivating Pear",
        "Sparkling Blueberry", "Marvelous Coconut", "Exotic Papaya",
        "Magical Raspberry", "Lush Apricot", "Flawless Passionfruit",
        "Tranquil Strawberry", "Dazzling Nectarine", "Delicious Grape",
        "Serendipitous Kiwi", "Vibrant Persimmon", "Gorgeous Melon",
        "Flawless Peach", "Delightful Raspberry", "Whimsical Watermelon",
        "Exquisite Berry", "Blissful Cherry", "Radiant Lime",
        "Glorious Lemon", "Charming Blackberry", "Mellow Mango",
        "Dashing Avocado", "Dreamy Grapefruit", "Heavenly Cherry",
        "Sweet Fig", "Bountiful Papaya", "Glimmering Plum",
        "Romantic Nectarine", "Vibrant Pineapple", "Enchanted Cantaloupe",
        "Lush Blueberry", "Refreshing Strawberry", "Serene Banana",
        "Beautiful Cranberry", "Colorful Guava", "Sparkling Kiwi",
        "Lovely Passionfruit", "Enchanting Watermelon", "Cheerful Lemon",
        "Joyful Peach", "Radiant Blackberry", "Magical Mango",
        "Stunning Papaya", "Blissful Fig", "Exotic Grapefruit",
        "Luminous Tangerine", "Vibrant Coconut", "Sweet Lychee",
        "Gentle Apricot", "Glorious Raspberry", "Dazzling Peach",
        "Charming Strawberry", "Delightful Cherry", "Unique Persimmon",
        "Enchanting Pineapple", "Gorgeous Kiwi", "Mystical Cantaloupe",
        "Colorful Pomegranate", "Whimsical Blueberry", "Refreshing Honeydew",
        "Dashing Watermelon", "Heavenly Coconut"
    ]

    static instance: SocketServer

    static io: IOServer

    static socketStore: IUserStore

    static roomUsersMap: Record<number, User[]> =
        {
            [defaultRooms[0].id]: [], // Users in "The Sassy Sandwich"
            [defaultRooms[1].id]: [], // Users in "Giggle Factory"
            [defaultRooms[2].id]: [], // Users in "Banana Bunker"
        }

    static socketEvents = {
        SET_USER: "setUser",
        JOIN_ROOM: "joinRoom",
        CREATE_ROOM: "createRoom",
        LEAVE_ROOM: "leaveRoom",
        DELETE_ROOM: "deleteRoom",


        UPDATE_CURRENT_USER_ROOM: "updateCurrentUserRoom",
        SEND_INVITE_ALERT: "sendInviteAlert",

        SEND_CONNECTION_REQUEST: 'sendConnection',

        DISCONNECT: "disconnect",

        PING_SOCKET: "pingSocket",
    }

    constructor(httpServer: HttpServer, socketStore: IUserStore) {
        SocketServer.io = new IOServer(httpServer)
        SocketServer.socketStore = socketStore
        this.listen()
    }


    private listen(): void {
        SocketServer.io.on("connection", async (socket: Socket) => {
            console.log(`Client connected: ${socket.id}`)

            const randomName = SocketServer.availableNames[
                Math.floor(Math.random() * SocketServer.availableNames.length)
            ]
            const user: User = { id: SocketServer.userIdCounter++, name: randomName }
            await SocketServer.socketStore.setUser(socket.id, user)

            socket.emit("userInfo", {
                id: user.id,
                name: user.name,
            })

            // Prepare room user info
            const roomsUserInfo = Object.keys(SocketServer.roomUsersMap).map((roomId) => ({
                roomId,
                name: defaultRooms.find(room => room.id.toString() === roomId)?.name || "Unknown Room",
                users: SocketServer.roomUsersMap[Number(roomId)].map(reqUser => ({
                    id: reqUser.id,
                    name: reqUser.name,
                })),
            }))

            // Emit all room user info to the newly connected user
            socket.emit("roomsUserInfo", roomsUserInfo)

            socket.on(SocketServer.socketEvents.PING_SOCKET, async (_, ack) => {
                try {
                    ack({ status: 'success' })
                } catch (error) {
                    console.error("Error in updating read receipts:", error)
                }
            })

            socket.on(
                SocketServer.socketEvents.JOIN_ROOM,
                async ({ roomId }: { roomId: number }) => {
                    try {
                        const reqUser = await SocketServer.socketStore.getUser(socket.id)

                        if (reqUser !== undefined && SocketServer.roomUsersMap[roomId]) {
                            console.log(`${reqUser.id} joined room: ${roomId}`)

                            SocketServer.roomUsersMap[roomId].push(reqUser)
                            console.log(`User ID ${user.id} has joined room ${roomId}.`)

                            SocketServer.io.emit("userJoined", {
                                roomId,
                                userId: reqUser.id,
                            })

                            socket.join(roomId.toString())
                        } else {
                            console.log(`User not found for socket ID: ${socket.id}`)
                        }
                    } catch (error) {
                        console.error("Error: ", error)
                    }
                }
            )

            // socket.on(
            //     SocketServer.socketEvents.LEAVE_ROOM,
            //     async ({
            //         roomId,
            //     }: {
            //         roomId: number
            //     }) => {
            //         try {
            //             const user = await SocketServer.socketStore.getUser(socket.id)

            //             if (user !== undefined) {
            //                 console.log(`${user.id} left room: ${roomId}`)
            //                 if (SocketServer.roomUsersMap[roomId]) {
            //                     SocketServer.roomUsersMap[roomId] = SocketServer.roomUsersMap[roomId].filter(user => user.id !== user.id)
            //                     console.log(`User ID ${user.id} has left room ${roomId}.`)
            //                     SocketServer.io.emit("roomLeft", {
            //                         roomId,
            //                         userId: user.id,
            //                     })
            //                 } else {
            //                     console.log(`Room ${roomId} does not exist.`)
            //                 }
            //             }
            //             socket.leave(roomId.toString())
            //         } catch (error) {
            //             console.error("Error: ", error)
            //         }
            //     }
            // )

            socket.on(SocketServer.socketEvents.DISCONNECT, async () => {
                try {
                    const reqUser = await SocketServer.socketStore.getUser(socket.id)
                    if (reqUser !== undefined) {
                        // eslint-disable-next-line no-restricted-syntax
                        for (const roomId of Object.keys(SocketServer.roomUsersMap)) {
                            SocketServer.roomUsersMap[Number(roomId)] = SocketServer.roomUsersMap[Number(roomId)].filter(u => u.id !== reqUser.id)
                        }
                        SocketServer.io.emit("userDisconnected", {
                            'userId': reqUser.id,
                        })
                    }
                    await SocketServer.socketStore.removeUser(socket.id)
                    console.log(`Client disconnected: ${socket.id}`)
                } catch (error) {
                    console.error("Error: ", error)
                }
            })
        })
    }

    public static initialize(httpServer: HttpServer): SocketServer {
        if (!this.instance) {
            this.instance = new SocketServer(
                httpServer,
                new InMemoryUserStore()
            )
        }
        return this.instance
    }
}