import { Component } from "react"
import { GardenProvider } from "./GardenContext"
import Garden from "./Garden/Garden"
import Reset from "./Reset/Reset"
import DimensionSelector from "./DimensionSelector/DimensionSelector"
import Notes from "./Notes/Notes"
import Buttons from "./Retrieve/Buttons"
import Save from "./Retrieve/Save"
import Load from "./Retrieve/Load"
import Add from "./Retrieve/Add"
import Modifiers from "./Modify/Modifiers"
import PlantingGuide from "./PlantingGuide/PlantingGuide"
import Print from "./Print/Print"

class GardenPlanner extends Component {

  render() {
    return (
      <GardenProvider >
        <div id="interact-container">
          <Reset />
          <DimensionSelector /> 
          <Buttons />
          <Save />
          <Load />
          <Print />
          <Notes />
          <PlantingGuide />          
          <Add />
          <Modifiers />
        </div>
        <Garden />
      </GardenProvider>
    )
  }

}

export default GardenPlanner