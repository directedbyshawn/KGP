import { Component } from "react"
import { GardenEmitter } from "../../../utils/EventEmitter"

class Buttons extends Component {

  openSaveMenu = () => {
    GardenEmitter.emit("openSave")
  }

  openLoadMenu = () => {
    GardenEmitter.emit("openLoad")
  }

  openAddMenu = () => {
    GardenEmitter.emit("openAdd")
  }

  render() {
    return (
      <div id="retrieval-wrapper">
        <div className="button-wrapper">
          <button
            id="save"
            className="retrieval-buttons"
            onClick={this.openSaveMenu}
          >
            Save
          </button>
        </div>
        <div className="button-wrapper">
          <button
            id="load"
            className="retrieval-buttons"
            onClick={this.openLoadMenu}
          >
            Load
          </button>
        </div>
        <div className="button-wrapper">
          <button
            id="add"
            className="retrieval-buttons"
            onClick={this.openAddMenu}
          >
            Add
          </button>
        </div>
      </div>
    )
  }

}

export default Buttons