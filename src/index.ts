import bodyParser from "body-parser"
import dotenv from "dotenv"
import express, { Application } from "express"
import { Room } from "livekit-server-sdk"
import Router from "./api/routes"
import SocketServer from "./socket"
import LiveKitClient from "./LiveKitClient"

const cors = require("cors")

dotenv.config()

const PORT = 3000

const app: Application = express()

app.use(bodyParser.json())
app.use(express.static("public"))
app.use(cors())

app.use(Router)


const server = app.listen(PORT, () => {
    console.log("Server is running on port", PORT)
    // List rooms
    LiveKitClient.listRooms().then((rooms: Room[]) => {
        console.log('existing rooms', rooms)
    }).catch(error => {
        console.error('Error listing rooms:', error)
    })
})

SocketServer.initialize(server)
