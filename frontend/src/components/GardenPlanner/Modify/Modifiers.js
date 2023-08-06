import "./Modifiers.css"
import { Component, Fragment } from "react"
import { DeletePopup } from "../../Popups"
import GardenContext from "../GardenContext"

class Modifiers extends Component {

  constructor() {
    super()
    this.state = {
      delete: false
    }
  }

  open = () => {
    if (this.allowDelete()) {
      this.setState({
        delete: true
      })
    }
  }

  close = () => {
    this.setState({
      delete: false
    })
  }

  allowRotate = () => {
    if (this.context.state.bedSelected.status) {
      const id = this.context.state.bedSelected.id
      const bed = this.context.state.beds[id]
      const grid = this.context.state.grid
      const newWidth = bed.model[0].length
      const newHeight = bed.model.length
      let good = true
      let contains
      for (let x = bed.position.x; x < bed.position.x + newWidth; x++) {
        for (let y = bed.position.y; y < bed.position.y + newHeight; y++) {
          contains = parseInt(grid[x][y])
          if (contains !== -1 && contains !== id) {
            good = false
          }
        }
      }
      if (good) {
        return true
      }
      else {
        return false
      }
    }
    else {
      return false
    }
  }

  allowDelete = () => {
    if (this.context.state.bedSelected.status) {
      return true
    }
    else {
      return false
    }
  }

  rotate = () => {
    if (this.allowRotate()) {
      this.context.functions.rotate()
    }
  }

  delete = () => {
    this.setState({
      delete: false
    })
    if (this.allowDelete()) {
      this.context.functions.deleteBed()
    }
  }

  printDelete = () => {
    return (
      <svg
        className="delete" 
        data-name="delete-bed-container" 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 105.16 122.88"
      >
        <defs></defs>
        <title>Delete this bed</title>
        <path 
          d="M11.17,37.16H94.65a8.4,8.4,0,0,1,2,.16,5.93,5.93,0,0,1,2.88,1.56,5.43,5.43,0,0,1,1.64,3.34,7.65,7.65,0,0,1-.06,1.44L94,117.31v0l0,.13,0,.28v0a7.06,7.06,0,0,1-.2.9v0l0,.06v0a5.89,5.89,0,0,1-5.47,4.07H17.32a6.17,6.17,0,0,1-1.25-.19,6.17,6.17,0,0,1-1.16-.48h0a6.18,6.18,0,0,1-3.08-4.88l-7-73.49a7.69,7.69,0,0,1-.06-1.66,5.37,5.37,0,0,1,1.63-3.29,6,6,0,0,1,3-1.58,8.94,8.94,0,0,1,1.79-.13ZM5.65,8.8H37.12V6h0a2.44,2.44,0,0,1,0-.27,6,6,0,0,1,1.76-4h0A6,6,0,0,1,43.09,0H62.46l.3,0a6,6,0,0,1,5.7,6V6h0V8.8h32l.39,0a4.7,4.7,0,0,1,4.31,4.43c0,.18,0,.32,0,.5v9.86a2.59,2.59,0,0,1-2.59,2.59H2.59A2.59,2.59,0,0,1,0,23.62V13.53H0a1.56,1.56,0,0,1,0-.31v0A4.72,4.72,0,0,1,3.88,8.88,10.4,10.4,0,0,1,5.65,8.8Zm42.1,52.7a4.77,4.77,0,0,1,9.49,0v37a4.77,4.77,0,0,1-9.49,0v-37Zm23.73-.2a4.58,4.58,0,0,1,5-4.06,4.47,4.47,0,0,1,4.51,4.46l-2,37a4.57,4.57,0,0,1-5,4.06,4.47,4.47,0,0,1-4.51-4.46l2-37ZM25,61.7a4.46,4.46,0,0,1,4.5-4.46,4.58,4.58,0,0,1,5,4.06l2,37a4.47,4.47,0,0,1-4.51,4.46,4.57,4.57,0,0,1-5-4.06l-2-37Z"
          style={{
            fill: this.allowDelete() ? "#4D7335" : "grey"
          }}
        />
      </svg>
    )
  }

  printRotate = () => {
    return (
      <svg 
        version="1.1" 
        id="Capa_1" 
        xmlns="http://www.w3.org/2000/svg" 
        x="0px" 
        y="0px"
        viewBox="0 0 214.367 214.367"
        className="rotate"
      > 
        <defs></defs>
        <title>Rotate this bed</title>
        <path 
          d="M202.403,95.22c0,46.312-33.237,85.002-77.109,93.484v25.663l-69.76-40l69.76-40v23.494
          c27.176-7.87,47.109-32.964,47.109-62.642c0-35.962-29.258-65.22-65.22-65.22s-65.22,29.258-65.22,65.22
          c0,9.686,2.068,19.001,6.148,27.688l-27.154,12.754c-5.968-12.707-8.994-26.313-8.994-40.441C11.964,42.716,54.68,0,107.184,0
          S202.403,42.716,202.403,95.22z"
          style={{
            fill: this.allowRotate() ? "#4D7335" : "grey"
          }}
        />
      </svg>
    )
  }

  render = () => {
    return (
      <Fragment>
        <DeletePopup
          open={this.state.delete}
          onClose={this.close.bind(this)}
        >
          <button
            className="close-button"
            onClick={this.close.bind(this)}
          >
            &times;
          </button>
          <div id="delete-form-wrapper">
            <h1
              className="menu-heading"
              id="delete-menu-heading"
            >
              Delete Bed From Garden
            </h1>
            <h3 id="delete-bed-from-garden-message">
              Are you sure ?
            </h3>
            <button
              type="button"
              className="confirmation-buttons"
              onClick={this.delete.bind(this)}
            >
              Delete
            </button>
            <button
              type="button"
              className="confirmation-buttons"
              onClick={this.close.bind(this)}
            >
              Cancel
            </button>
          </div>
        </DeletePopup>
        <div id="modifiers-container">
          <div 
            id="rotate-bed-container"
            onClick={this.rotate.bind(this)}
            style={{
              cursor: this.allowRotate() ? "pointer" : "default"
            }}
          >
            {this.printRotate()}
          </div>
          <div 
            id="delete-bed-container"
            onClick={this.open.bind(this)}
            style={{
              cursor: this.allowDelete() ? "pointer" : "default"
            }}
          >
            {this.printDelete()}
          </div>
        </div>
      </Fragment>
    )
  }

}

Modifiers.contextType = GardenContext

export default Modifiers