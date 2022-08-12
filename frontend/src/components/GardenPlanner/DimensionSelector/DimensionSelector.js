import { Component } from "react"
import GardenContext from "../GardenContext"

class DimensionSelector extends Component {

  printWidthOptions = () => {
    let content = []
    const minWidth = this.context.state.minWidth
    const maxWidth = this.context.state.maxWidth
    for (let i = minWidth; i <= maxWidth; i++) {
      content.push(
        <option value={i} >{i}</option>
      )
    }
    return content
  }

  printHeightOptions = () => {
    let content = []
    const minHeight = this.context.state.minHeight
    const maxHeight = this.context.state.maxHeight
    for (let i = minHeight; i <= maxHeight; i++) {
      content.push(
        <option value={i}>{i}</option>
      )
    }
    return content
  }

  widthChanged = (event) => {
    this.context.functions.setWidth(event.target.value)
  }

  heightChanged = (event) => {
    this.context.functions.setHeight(event.target.value)
  }

  disabled = () => {
    const beds = this.context.state.beds
    if (beds.length === 0) {
      return false
    }
    else {
      return true
    }
  }

  render = () => {
    return (
      <div id="dim-select-wrapper">
        <div>Width</div>
        <select 
          id="select-width" 
          value={this.context.state.width}
          onChange={this.widthChanged.bind(this)}
          disabled={this.disabled()}
        >
          {this.printWidthOptions()}
        </select>
        <div>Height</div>
        <select 
          id="select-height" 
          value={this.context.state.height}
          onChange={this.heightChanged.bind(this)}
          disabled={this.disabled()}
        >
          {this.printHeightOptions()}
        </select>
      </div>
    )
  } 

}

DimensionSelector.contextType = GardenContext

export default DimensionSelector