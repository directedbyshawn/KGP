import "./DimensionSelector.css"
import { Component } from "react"
import BedContext from "../BedContext"

class DimensionSelector extends Component {

  widthChanged = (event) => {
    this.context.functions.setWidth(event.target.value)
  }

  heightChanged = (event) => {
    this.context.functions.setHeight(event.target.value)
  }

  printWidthOptions = () => {
    let options = []
    const minWidth = this.context.state.minWidth
    const maxWidth = this.context.state.maxWidth
    for (let i = minWidth; i <= maxWidth; i++) {
      options.push(
        <option value={i}>{i}</option>
      )
    }
    return options
  }

  printHeightOptions = () => {
    let options = []
    const minHeight = this.context.state.minHeight
    const maxHeight = this.context.state.maxHeight
    for (let i = minHeight; i <= maxHeight; i++) {
      options.push(
        <option value={i}>{i}</option>
      )
    }
    return options
  }

  disabled = () => {
    if (this.context.state.cropsPlaced || this.context.state.bedLoaded) {
      return true
    }
    else {
      return false
    }
  }

  render = () => {
    return (
      <div id="dim-select-wrapper">
        <div>Width</div>
        <select 
          id="select-width" 
          onChange={this.widthChanged.bind(this)} 
          value={this.context.state.width}
          disabled={this.disabled()}
        >
          {this.printWidthOptions()}
        </select>
        <div>Height</div>
        <select 
          id="select-height" 
          onChange={this.heightChanged.bind(this)} 
          value={this.context.state.height}
          disabled={this.disabled()}
        >
          {this.printHeightOptions()}
        </select>
      </div>
    )
  }

}

DimensionSelector.contextType = BedContext

export default DimensionSelector