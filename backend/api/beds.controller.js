import BedsDAO from "../dao/bedsDAO.js"

export default class BedsController {

  static async apiSaveBed(req, res) {

    const name = req.body.name
    const email = req.body.email
    const zip = req.body.zip  
    const model = req.body.model
    const notes = req.body.notes

    console.log(`
      SAVE BED REQ RECEIVED: 
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
    // created a bed with this name
    let duplicates = false
    let beds = await BedsDAO.getBedsDAO(name, zip)
    if (beds.length !== 0) {
      beds.map((bed) => {
        if (bed.name === name) {
          duplicates = true
        }
      })
    }

    // ensure model is not empty
    let containsCrops = false
    for (let i = 0; i < model.length; i++) {
      for (let j = 0; j < model[0].length; j++) {
        if (model[i][j].contains) {
          containsCrops = true
          break
        }
      }
      if (containsCrops) {
        break
      }
    }

    if (!duplicates && goodCreds && containsCrops) {
      await BedsDAO.saveBedDAO(
        name, 
        email,
        zip,
        notes,
        model
      )
    }
    
    let success, message
    if (!duplicates && goodCreds && containsCrops) {
      success = true
      message = "Bed Successfully Saved"
    }
    else if (!goodCreds) {
      success = false,
      message = "ERROR: Bad name, email, or zipcode"
    }
    else if (duplicates) {
      success = false
      message = "ERROR: A bed with this name already exists"
    }
    else if (!containsCrops) {
      success = false
      message = "ERROR: Cannot save an empty bed"
    }
    else {
      success = false
      message = "ERROR: Could not save bed"
    }

    return res.json({
      success: success,
      message: message
    })
    
  }

  static async apiGetBed(req, res) {

    const email = req.query.email
    const zip = req.query.zip

    console.log(`
      GET BEDS REQ RECEIVED: 
      Email: ${email} 
      Zip: ${zip}
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

    let beds
    if (goodCreds) {
      beds = await BedsDAO.getBedsDAO(
        email, 
        zip
      )
    }
    else {
      beds = []
    }
    
    return res.json({
      results: beds
    })

  }

  static async apiGetPublicBeds(req, res) {
    
    const email = "public@gardeners.com"
    const zip = "55555"

    console.log(`
      GET PUBLIC BEDS REQ RECEIVED
    `)

    let beds = await BedsDAO.getBedsDAO(email, zip)

    return res.json({
      results: beds
    })

  }

  static async apiUpdateBed(req, res) {

    const name = req.body.name
    const email = req.body.email
    const zip = req.body.zip
    const notes = req.body.notes
    const model = req.body.model

    console.log(`
      UPDATE BED REQ RECEIVED: 
      Name: ${name} 
      Email: ${email} 
      Zip: ${zip}
    `)

    // ensure model is not empty
    let containsCrops = false
    for (let i = 0; i < model.length; i++) {
      for (let j = 0; j < model[0].length; j++) {
        if (model[i][j].contains) {
          containsCrops = true
          break
        }
      }
      if (containsCrops) {
        break
      }
    }

    let saveSuccess
    if (containsCrops) {
      saveSuccess = await BedsDAO.updateBedDAO(
        name,
        email,
        zip,
        notes,
        model
      )
    }
    else {
      saveSuccess = false
    }
    
    let success, message
    if (saveSuccess) {
      success = true
      message = "Updated bed successfully"
    }
    else if (!containsCrops) {
      success = false
      message = "ERROR: Cannot save empty bed"
    }
    else {
      success = false
      message = "ERROR: Could not update bed"
    }

    return res.json({
      success: success,
      message: message
    })

  }

  static async apiDeleteBed(req, res) {

    const name = req.body.name
    const email = req.body.email
    const zip = req.body.zip

    console.log(`
      DELETE BED REQ RECEIVED: 
      Name: ${name} 
      Email: ${email} 
      Zip: ${zip}
    `)

    let success = await BedsDAO.deleteBedDAO(
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
        message: "ERROR: Failed to delete bed"
      })
    }

  }

}