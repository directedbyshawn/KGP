import express from "express"
import BedsController from "./beds.controller.js"

const router = express.Router()

// save bed
router.route("/saveBed").post(BedsController.apiSaveBed)

// retrieve beds by email and zip
router.route("/getBeds").get(BedsController.apiGetBed)

// update bed that already exists
router.route("/updateBed").post(BedsController.apiUpdateBed)

// delete bed
router.route("/deleteBed").post(BedsController.apiDeleteBed)

// get public beds
router.route("/getPublicBeds").get(BedsController.apiGetPublicBeds)

export default router