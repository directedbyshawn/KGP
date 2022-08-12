let beds

export default class BedsDAO {

  static async injectDB(conn) {
    if (beds) {
      return
    }
    try {
      beds = await conn.db(process.env.dbName).collection("beds")
    } 
    catch (err) {
      console.error(`Unable to establish a connection handle in Beds DAO: ${err}`)
    }
  }

  static async saveBedDAO(
    queryName, 
    queryEmail, 
    queryZip, 
    queryNotes, 
    queryModel
  ) {
    let bed = {
      created: Date(),
      lastUpdated: Date(),
      name: queryName,
      email: queryEmail, 
      zip: queryZip,
      notes: queryNotes,
      model: queryModel
    }
    beds.insertOne(bed, (err, res) => {
      if (err) throw err
    })
  }

  static async getBedsDAO(queryEmail, queryZip) {

    // get cursor to documents matching query
    let query = {
      email: { $eq: queryEmail },
      zip: { $eq: queryZip }
    }
    let bedsCursor = beds.find(query)

    // retrieve beds from documents using cursor 
    const returnBeds = await bedsCursor.toArray()
    
    return returnBeds

  }

  static async updateBedDAO(
    queryName, 
    queryEmail, 
    queryZip, 
    queryNotes, 
    queryModel
  ) {

    const filter = {
      name: queryName,
      email: queryEmail,
      zip: queryZip
    }

    const update = {
      $set: { 
        model: queryModel,
        notes: queryNotes,
        lastUpdated: Date()
      }
    }

    let result = await beds.updateOne(filter, update)

    return result.acknowledged

  }

  static async deleteBedDAO(queryName, queryEmail, queryZip) {
    
    let filter = {
      name: queryName,
      email: queryEmail,
      zip: queryZip
    }

    let result = await beds.deleteOne(filter)

    return result.acknowledged

  }

}