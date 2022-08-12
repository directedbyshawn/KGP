import { Component } from "react"
import GardenContext from "../GardenContext"
import { GardenEmitter } from "../../../utils/EventEmitter"

class BedResult extends Component {

  constructor(props) {
    super(props)
    this.state = {
      bed: props.bed
    }
  }

  add = () => {
    this.context.functions.addBed(this.state.bed)
    GardenEmitter.emit("closeAdd")
  }

  printAdd = () => {
    return (
      <button
        onClick={this.add.bind(this)}
      >
        Add
      </button>
    )
  }

  printInfo = () => {

    if (this.state.bed.info) {
      return (
        <div className="info">
          <a
            href={this.state.bed.info}
            target={"_blank"}
            rel="noreferrer"
          >
            <svg 
              fill="#000000" 
              xmlns="http://www.w3.org/2000/svg"  
              viewBox="0 0 30 30" 
              width="30px" 
              height="30px"
            >
              <path 
                d="M15,3C8.373,3,3,8.373,3,15c0,6.627,5.373,12,12,12s12-5.373,12-12C27,8.373,21.627,3,15,3z M16,21h-2v-7h2V21z M15,11.5 c-0.828,0-1.5-0.672-1.5-1.5s0.672-1.5,1.5-1.5s1.5,0.672,1.5,1.5S15.828,11.5,15,11.5z"
                fill="var(--green)"
              />
            </svg>
          </a>
        </div>
      )
    }

  }

  render() {
    return (
      <div className="result add">
        <div className="result-left">
          <div className="result-name">
            <p>{this.state.bed.name}</p>
          </div>
          {this.printInfo()}
        </div>
        {this.printAdd()}
      </div>
    )
  }

}

BedResult.contextType = GardenContext

export default BedResult