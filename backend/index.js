import app from "./server.js"
import dotenv from "dotenv"
import mongodb from "mongodb"
import BedsDAO from "./dao/bedsDAO.js"
import GardensDAO from "./dao/gardensDAO.js"

const MongoClient = mongodb.MongoClient

dotenv.config()

// retrieve port or default to 3001
const port = process.env.PORT || 3001

// start server if db connection successful
MongoClient.connect(
  process.env.dbConnection,
  {
    maxPoolSize: 100,
    wtimeout: 2500
  }
).catch(err => {
  console.error(err.stack)
  process.exit(1)
}).then(async client => {
  await BedsDAO.injectDB(client)
  await GardensDAO.injectDB(client)
  app.listen(port, () => {
    console.log(`KGP server listening on port ${port}`)
  })
})
