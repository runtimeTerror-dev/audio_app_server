import bodyParser from "body-parser"
import dotenv from "dotenv"
import express, { Application } from "express"
import Router from "./api/routes"
import SocketServer from "./socket"

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
})

SocketServer.initialize(server)
