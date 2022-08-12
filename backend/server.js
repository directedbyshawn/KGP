import express from "express"
import cors from "cors"
import beds from "./api/beds.route.js"
import gardens from "./api/gardens.route.js"

// create server
const app = express()

// server config
app.use(express.json())
app.use(cors())
app.use(express.static("./build"))

// beds
app.use("/api/v1/beds", beds)

// gardens
app.use("/api/v1/gardens", gardens)

// serve react app
app.use("*", (req, res) => {
  res.sendFile("./build/index.html")
})

export default app
