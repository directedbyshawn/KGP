import './Bed.css'
import { Component } from "react"
import { BedEmitter } from "../../../utils/EventEmitter"
import { Droppable } from "react-beautiful-dnd"
import BedContext from "../BedContext"
import Plot from "./Plot/Plot"

class Bed extends Component {

  constructor() {
    super()
    this.state = {
      hover: false,
      hoverName: ""
    }
    const cropDropped = BedEmitter.addListener("cropDropped", this.cropDropped.bind(this))
    const gridHoverStart = BedEmitter.addListener("gridHoverStart", this.hoverStart.bind(this))
    const gridHoverEnd = BedEmitter.addListener("gridHoverEnd", this.hoverEnd.bind(this))
    const cropDelete = BedEmitter.addListener("cropDelete", this.delete.bind(this))
  }

  delete = (eventData) => {

    const x = eventData.x
    const y = eventData.y

    let copy = this.context.state.model
    copy[x-1][y-1] = {
      contains: ""
    }

    this.context.functions.setModel(copy)
    
  }

  cropDropped = (eventData) => {
    this.context.functions.cropDropped(eventData)
  }

  hoverStart = (eventData) => {
    this.setState({
      hover: true,
      hoverName: eventData.name
    })
  }

  hoverEnd = () => {
    this.setState({
      hover: false,
      hoverName: ""
    })
  }

  printHoverName = () => {
    if (this.state.hover && this.state.hoverName !== "") {
      return (
        <p id="grid-crop-name">{this.state.hoverName}</p>
      )
    }
  }

  templateCols = () => {

    let cols = ""
    const bed = this.context.state.model
    for (let i = 0; i < bed.length; i++) {
      cols += "auto "
    }
    return cols

  }

  render = () => {

    // create grid coordinates
    const coordinates = []
    let curY = 0
    const width = this.context.state.width
    const height = this.context.state.height
    const size = width * height
    for (let i = 0; i < size; i++) {
      let curX = (i % (width)) + 1
      if (i % width === 0) {
        curY++;
      }
      coordinates.push({x: curX, y: curY})
    }

    return (
      <div id="grid-wrapper">
        <div 
          id="grid" 
          style={{gridTemplateColumns: this.templateCols()}}
        >
          {coordinates.map((plot, index) => {
            const model = this.context.state.model
            let containsCrop = model[plot.x-1][plot.y-1].contains
            return (
              <Droppable 
                droppableId={"dropNode-" + plot.x + "-" + plot.y}
                key={"dropNode-" + plot.x + "-" + plot.y}
              >
                {(provided, snapshot) => (
                  <div 
                    className="nodeWrapper"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    <Plot 
                      key={containsCrop + "-" + plot.x + "-" + plot.y + String(snapshot.isDraggingOver)}
                      x={plot.x}
                      y={plot.y}
                      index={index}
                      contains={containsCrop}
                      isHover={snapshot.isDraggingOver}
                    />
                  </div>
                )}
              </Droppable>
            )
          })}
        </div>
        <div id="grid-crop-name-wrapper">
          {this.printHoverName()}
        </div>
      </div>
    
    )

  }

}

Bed.contextType = BedContext

export default Bed