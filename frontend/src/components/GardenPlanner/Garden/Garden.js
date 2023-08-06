import "./Garden.css"
import { Component, Fragment } from "react"
import GardenContext from "../GardenContext"
import Bed from "../Bed/Bed"

class Garden extends Component {

  printGarden = () => {
    const size = this.context.state.width * this.context.state.height
    let plots = []
    for (let i = 0; i < size; i++) {
      plots.push(
        <div 
          className="garden-plot"
          onClick={() => this.context.functions.deselect()}
        />
      )
    }
    return plots
  }

  printBeds = () => {
    return (
      this.context.state.beds.map((bed) => {
        return (
          <Bed 
            key={`${bed.name}-${bed.id}-(${bed.position.x},${bed.position.y})-${bed.orientation}}`}
            id={bed.id}
            name={bed.name}
            notes={bed.notes}
            model={bed.model}
            position={bed.position}
          />
        )
      })
    )
  }

  getTemplateCols = () => {
    const width = this.context.state.width
    let value = ""
    for (let i = 0; i < width; i++) {
      value += "auto "
    }
    return value
  }

  render = () => {

    return (
      <Fragment>
        <div id="garden-container">
          <div
            id="garden-wrapper"
          >
            {this.printBeds()}
            <div 
              id="garden"
              style={{gridTemplateColumns: this.getTemplateCols()}}
            >
              {this.printGarden()}
            </div>
          </div>
        </div>
      </Fragment>
    )
  }

}

Garden.contextType = GardenContext

export default Garden