let gardens

export default class GardensDAO {

  static async injectDB(conn) {
    if (gardens) {
      return
    }
    try {
      gardens = await conn.db(process.env.dbName).collection("gardens")
    }
    catch (err) { 
      console.error(
        `Unable to establish a connection handle in Gardens DAO: ${err}`
      )
    }
  }

  static async saveGardenDAO(queryName, 
    queryEmail, 
    queryZip,
    queryWidth,
    queryHeight, 
    queryBeds, 
    queryNotes
  ) {

    const garden = {
      created: Date(),
      lastUpdated: Date(),
      name: queryName,
      email: queryEmail,
      zip: queryZip,
      width: queryWidth,
      height: queryHeight,
      beds: queryBeds,
      notes: queryNotes
    }

    gardens.insertOne(garden, (err, res) => {
      if (err) throw err
    })
    
  }

  static async updateGardenDAO(
    queryName, 
    queryEmail, 
    queryZip,
    queryBeds, 
    queryNotes
  ) {

    const filter = {
      name: queryName,
      email: queryEmail,
      zip: queryZip
    }

    const update = {
      $set: {
        beds: queryBeds,
        notes: queryNotes,
        lastUpdated: Date()
      }
    }

    let result = await gardens.updateOne(filter, update)
    
    return result.acknowledged

  }

  static async getGardensDAO(queryEmail, queryZip) {
    
    const query = {
      email: { $eq: queryEmail },
      zip: { $eq: queryZip }
    }

    let gardensCursor = gardens.find(query)
    const returnGardens = await gardensCursor.toArray()
    return returnGardens

  }

  static async deleteGardenDAO(
    queryName, 
    queryEmail, 
    queryZip
  ) {
    
    const filter = {
      name: queryName,
      email: queryEmail,
      zip: queryZip
    }

    let result = await gardens.deleteOne(filter)

    return result.acknowledged

  }

}