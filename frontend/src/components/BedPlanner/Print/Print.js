import "./Print.css"
import { Component, Fragment } from "react"
import { DragDropContext } from "react-beautiful-dnd"
import { Guide } from "../../../assets/guide"
import { SINGLES, PLANT } from "../../../assets/images"
import BedContext from "../BedContext"
import Bed from "../Bed/Bed"

class Print extends Component {

  callPrint = () => {
    window.print()
  }
  
  getCrops = () => {
    // create an array of all crops that exist in the bed
    let crops = []
		const model = this.context.state.model
    for (let i = 0; i < model.length; i++) {
      for (let j = 0; j < model[0].length; j++) {
        let c1 = model[i][j].contains in Guide
        let c2 = model[i][j].contains !== ""
        let c3 = !crops.includes(model[i][j].contains)
        if (c1 && c2 && c3) {
          crops.push(model[i][j].contains)
        }
      }
    }

    crops.sort()
    
    return crops
  }

  printName() {
    if (this.context.state.name) {
      return (
        <h4 id="print-name">{this.context.state.name}</h4>
      )
    }
  }

  printGrid() {

    // create grid coordinates
    const coordinates = []
		const model = this.context.state.model
    let curY = 0
    let width = model.length
    let height = model[0].length
    let size = width * height
    for (let i = 0; i < size; i++) {
      let curX = (i % (width)) + 1
      if (i % width === 0) {
        curY++;
      }
      coordinates.push({x: curX, y: curY})
    }

    // styling
    let templateCols = ""
    for (let i = 0; i < model.length; i++) {
      templateCols += "auto "
    }

    return (
      <div id="print-model-wrapper">
        <div 
          id="print-model"
          style={{gridTemplateColumns: templateCols}}
        >
          {coordinates.map((plot, index) => {
            try {
              let id = model[plot.x-1][plot.y-1].contains
              let name = PLANT[id].name
              let image = PLANT[id].src
              return (
                <div className="print-crop" key={index}>
                  <img src={image} alt={name}></img>
                  <div className="print-crop-name">
                    <p>
                      {name}
                    </p>
                  </div>
                </div>
              )
            }
            catch {
              return (
                <div className="fill-crop" key={index}>
                </div>
              )
            }
          })}
        </div>
      </div>
      
    )

  }

  printBullets(bullets) {
    // render each tip as a list item in an un ordered list
    let returnBullets = []
    for (let i = 0; i < bullets.length; i++) {
      returnBullets.push(
        <li key={i}>
          {bullets[i]}
        </li>
      )
    }
    return returnBullets
  }

  printGuide() {

    // get list of crops that exist in bed
    let cropGuides = []
    let crops = this.getCrops()

    for (let i = 0; i < crops.length; i++) {

      // crop info
      let name = Guide[crops[i]].name
      let bullets = Guide[crops[i]].bullets
      
      // create a guide for each crop
      cropGuides.push(
        <div className="guide-crop" key={name}>
          <div id="guide-name-container">
            <h3>{name}</h3>
            <img 
              src={SINGLES[crops[i]].src}
              alt={name}
            />
          </div>
          <ul className="bullets">
            {this.printBullets(bullets)}
          </ul>
        </div>
      )

    }
    
     return cropGuides

  }

  printNotes() {
    if (this.context.state.notes) {
      return (
        <p id="print-notes">
          {this.context.state.notes}
        </p>
      )
    }
  }

  print() {
    return (
      <div 
        id="print-container"
        key={this.context.state.model}
      >
        <h1 id="print-title">Kitchen Garden Planner</h1>
        <h3 id="print-sub-title">Bed Planner</h3>
        {this.printName()}
        {this.printGrid()}
        {this.printNotes()}
        {this.printGuide()}
        <DragDropContext>
          <Bed />
        </DragDropContext>
        
      </div>
    )
  }

  printButton() {
    return (
      <div id="print-button-wrapper">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          id="print-svg"
          viewBox="0 0 16 16"
          onClick={this.callPrint.bind(this)}
        >
          <path 
            d="M5 1a2 2 0 0 0-2 2v2H2a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1v1a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1V3a2 2 0 0 0-2-2H5zM4 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2H4V3zm1 5a2 2 0 0 0-2 2v1H2a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v-1a2 2 0 0 0-2-2H5zm7 2v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1z"
            id="print-path"
          />
        </svg>
      </div>
    )
  }

  render() {
    return (
      <Fragment>
        {this.print()}
        {this.printButton()}
      </Fragment>
    )
  }

}

Print.contextType = BedContext

export default Print