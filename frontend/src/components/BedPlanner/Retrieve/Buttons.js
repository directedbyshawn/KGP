import { Component } from "react"
import { BedEmitter } from "../../../utils/EventEmitter"

class RetrieveButtons extends Component {

  openSave = () => {
    BedEmitter.emit("openSave")
  }

  openLoad = () => {
    BedEmitter.emit("openLoad")
  }

  render = () => {

    return (
      <div id="retrieval-wrapper">
        <div className="button-wrapper">
          <button 
            id="save" 
            className="retrieval-buttons" 
            onClick={this.openSave}
          >
            Save
          </button>
        </div>
        <div className="button-wrapper">
          <button 
            id="load" 
            className="retrieval-buttons" 
            onClick={this.openLoad}
          >
            Load
          </button>
        </div>
      </div>
    )

  }

}

export default RetrieveButtons