import GardensDAO from "../dao/gardensDAO.js"

export default class GardensController {

  static async apiSaveGarden(req, res) {

    const name = req.body.name
    const email = req.body.email
    const zip = req.body.zip
    const width = req.body.width
    const height = req.body.height
    const beds = req.body.beds
    const notes = req.body.notes

    console.log(`
      SAVE GARDEN REQ RECEIVED 
      Name: ${name} 
      Email: ${email} 
      Zip: ${zip}
    `)

    // input validation on name, email, and zip
    let goodName = true
    let goodEmail = true
    let goodZip = true

    // name
    if (name.length === 0 || name.length > 30) {
      goodName = false
    }

    // email
    let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    goodEmail = emailRegex.test(email) && email.length > 0 && email.length < 50

    // zip
    goodZip = (zip.length === 5 && /^\d+$/.test(zip))

    let goodCreds = goodName && goodEmail && goodZip

    // check to see if the user already
    // created a garden with this name
    let duplicates = false
    let gardens = await GardensDAO.getGardensDAO(name, zip)
    if (gardens.length !== 0) {
      gardens.map((garden) => {
        if (garden.name === name) {
          duplicates = true
        }
      })
    }

    // ensure garden isnt empty
    let containsBeds = beds.length > 0

    if (!duplicates && goodCreds && containsBeds) {
      await GardensDAO.saveGardenDAO(
        name, 
        email,
        zip,
        width,
        height,
        beds,
        notes
      )
    }
    
    let success, message
    if (!duplicates && goodCreds && containsBeds) {
      success = true
      message = "Garden Successfully Saved"
    }
    else if (!goodCreds) {
      success = false,
      message = "ERROR: Bad name, email, or zipcode"
    }
    else if (duplicates) {
      success = false
      message = "ERROR: A garden with this name already exists"
    }
    else if (!containsBeds) {
      success = false
      message = "ERROR: Cannot save an empty garden"
    }
    else {
      success = false
      message = "ERROR: Could not save garden"
    }

    return res.json({
      success: success,
      message: message
    })

  } 

  static async apiUpdateGarden(req, res) {

    const name = req.body.name
    const email = req.body.email
    const zip = req.body.zip
    const beds = req.body.beds
    const notes = req.body.notes

    console.log(`
      UPDATE GARDEN REQ RECEIVED 
      Name: ${name} 
      Email: ${email} 
      Zip: ${zip}
    `)

    const containsBeds = beds.length > 0

    let saveSuccess
    if (containsBeds) {
      saveSuccess = await GardensDAO.updateGardenDAO(
        name, 
        email,
        zip,
        beds,
        notes
      )
    }
    else {
      saveSuccess = false
    }
    
    let success, message
    if (saveSuccess) {
      success = true
      message = "Updated garden successfully"
    }
    else if (!containsBeds) {
      success = false
      message = "ERROR: Cannot save empty garden"
    }
    else {
      success = false
      message = "ERROR: Could not update garden"
    }

    return res.json({
      success: success,
      message: message
    })

  }

  static async apiGetGardens(req, res) {

    const email = req.query.email
    const zip = req.query.zip

    console.log(`
      GET GARDENS REQ RECEIVED 
      Email: ${req.query.email} 
      Zip: ${req.query.zip}
    `)

    // input validtion on email && zip
    let goodEmail = true
    let goodZip = true

    // email
    let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    goodEmail = emailRegex.test(email) && email.length > 0 && email.length < 50

    // zip
    goodZip = (zip.length === 5 && /^\d+$/.test(zip))

    let goodCreds = goodEmail && goodZip

    let gardens
    if (goodCreds) {
      gardens = await GardensDAO.getGardensDAO(
        req.query.email,
        req.query.zip
      )
    }
    else {
      gardens = []
    }
  
    return res.json({
      results: gardens
    })

  }

  static async apiDeleteGarden(req, res) {

    const name = req.body.name
    const email = req.body.email
    const zip = req.body.zip

    console.log(`
      DELETE GARDEN REQ RECEIVED: 
      Name: ${name} 
      Email: ${email} 
      Zip: ${zip}
    `)

    let success = await GardensDAO.deleteGardenDAO(
      name,
      email,
      zip
    )

    if (success) {
      return res.json({
        success: true,
        message: "Deleted Successfully"
      })
    }
    else {
      return res.json({
        success: false,
        message: "ERROR: Failed to delete garden"
      })
    }

  }

}