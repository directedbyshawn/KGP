import './Plot.css'
import { Component } from "react"
import { BedEmitter } from '../../../../utils/EventEmitter'
import { PLANT } from "../../../../assets/images"

class Plot extends Component {

  constructor(props) {
    super(props)
    this.state = {
      x: props.x,
      y: props.y,
      id: ("dropNode-" + props.x + "-" + props.y),
      index: props.index,
      contains: props.contains,
      hover: props.isHover
    }
  }

  printCrop = () => {
    if (this.state.contains === "") {
      return (
        <p></p>
      )
    }
    else {
      return (
        <img
          className="bed-img"
          src={PLANT[this.state.contains].src}
          alt={PLANT[this.state.contains].name}
          draggable={false}
        />
      )
    }
  }

  delete = () => {
    BedEmitter.emit("cropDelete", {
      x: this.state.x,
      y: this.state.y
    })
  }

  printOverlay = () => {

    if (this.state.hover && this.state.contains) {
      return (
        <div className="plot-overlay">
          <button
            className="delete-crop"
            onClick={this.delete.bind(this)}
          >
            &times;
          </button>
        </div>
      )
    }

  }

  hoverStart = () => {
    if (this.state.contains !== "") {
      BedEmitter.emit("gridHoverStart", {
        name: PLANT[this.state.contains].name
      })
    }
    this.setState({
      hover: true
    })
  }

  hoverEnd = () => {
    BedEmitter.emit("gridHoverEnd")
    this.setState({
      hover: false
    })
  }

  render = () => {
    return (
      <div
        className="node" 
        id={`node-${this.state.x}-${this.state.y}`}
        style={{backgroundColor: this.state.hover ? "#7E5564" : "white"}}  
        onMouseEnter={this.hoverStart.bind(this)}
        onMouseLeave={this.hoverEnd.bind(this)}
      >
        {this.printOverlay()}
        {this.printCrop()}
      </div>
    )
  }

}

export default Plot