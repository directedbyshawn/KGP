import { Component } from "react"
import { BedProvider } from "./BedContext"
import { DragDropContext } from "react-beautiful-dnd"
import { BedEmitter } from "../../utils/EventEmitter"
import Carousel from "./Carousel/Carousel"
import Bed from "./Bed/Bed"
import DimensionSelector from "./DimensionSelector/DimensionSelector"
import Reset from "./Reset/Reset"
import Buttons from "./Retrieve/Buttons"
import Save from "./Retrieve/Save"
import Load from "./Retrieve/Load"
import Notes from "./Notes/Notes"
import PlantingGuide from "./PlantingGuide/PlantingGuide"
import Print from "./Print/Print"

class BedPlanner extends Component {

  // crops dnd
  handleOnDragEnd = (result) => {

    const { source, destination } = result

    // do nothing if destination is outside of grid
    if (!destination) { 
      return
    }

    // trigger line of events to place crop in grid
    BedEmitter.emit("cropDropped", {
      sourceIndex: source.index,
      destinationId: destination.droppableId
    })

  }

  render = () => {
    return (
      <BedProvider>
        <div id="interact-container">
          <Reset />
          <DimensionSelector />
          <Buttons />
          <Save />
          <Load />
          <Print />
          <Notes />
          <PlantingGuide />
        </div>
        <div id="carousel-bed-container">
          <DragDropContext onDragEnd={this.handleOnDragEnd}>
            <Carousel />
            <Bed />
          </DragDropContext>
        </div>
      </BedProvider>
    )
  }
  
}

export default BedPlanner;
