import express from "express"
import GardensController from "./gardens.controller.js"

const router = express.Router()

// save garden
router.route("/saveGarden").post(GardensController.apiSaveGarden)

// update garden that already exists
router.route("/updateGarden").post(GardensController.apiUpdateGarden)

// retrieve garden by email & zip
router.route("/getGardens").get(GardensController.apiGetGardens)

// delete garden
router.route("/deleteGarden").post(GardensController.apiDeleteGarden)

export default router