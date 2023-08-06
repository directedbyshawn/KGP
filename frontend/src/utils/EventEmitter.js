import { EventEmitter } from "fbemitter"

// separate event emitters for bed planner and garden planner
var BedEmitter = new EventEmitter()
var GardenEmitter = new EventEmitter()

export { BedEmitter, GardenEmitter }