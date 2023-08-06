import { Component } from "react"
import { BedEmitter } from "../../../utils/EventEmitter"

class LeftButton extends Component {

  scroll() {
    BedEmitter.emit("scroll", {
      right: false
    })
  }

  render() {
    return (
      <button
        className = "scroll-button"
        onClick={this.scroll.bind(this)}
      >
        {"<"}
      </button>
    )
  }

}

class RightButton extends Component {

  scroll() {
    BedEmitter.emit("scroll", {
      right: true
    })
  }

  render() {
    return (
      <button
        className = "scroll-button"
        onClick={this.scroll.bind(this)}
      >
        {">"}
      </button>
    )
  }

}

export { LeftButton, RightButton }