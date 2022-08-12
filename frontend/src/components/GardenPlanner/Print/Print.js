import "./Print.css"
import "../Garden/Garden.css"
import { Component, Fragment } from "react"
import GardenContext from "../GardenContext"
import { SINGLES, PLANT } from "../../../assets/images"
import { Guide } from "../../../assets/guide"

class Print extends Component {

  callPrint = () => {
    window.print()
  }

  printName = () => {
    if (this.context.state.name) {
      return (
        <h4 id="print-name">{this.context.state.name}</h4>
      )
    }
  }

  printCrops = (bed) => {

    let crops = []
    let contains
    for (let y = 0; y <  bed.model[0].length; y++) {
      for (let x = 0; x < bed.model.length; x++) {
        contains = bed.model[x][y].contains
        try {
          crops.push(
            <div className="print-bed-crop">
              <img 
                src={SINGLES[contains].src}
                alt={bed.name}
              />  
            </div>
          )
        }
        catch {
          crops.push(
            <div className="print-bed-crop-filler" />
          )
        }
      }
    }

    return crops

  }

  printGardenBeds = () => {
    let beds = []
    let templateCols
    this.context.state.beds.map((bed) => {
      templateCols = ""
      bed.model.map((row) => (
        templateCols += "auto "
      ))
      beds.push(
        <div 
          className="print-bed"
          style={{
            gridTemplateColumns: templateCols,
            position: "absolute",
            left: `${4+(bed.position.x*13)}px`,
            top: `${5+(bed.position.y*13)}px`
          }}
        >
          {this.printCrops(bed)}
        </div>
      )
    })
    return (
      <div id="garden-beds">
        {beds}
      </div>
    )
  }

  printGarden = () => {
    let plots = []
    let size = this.context.state.width * this.context.state.height
    for (let i = 0; i < size; i++) {
      plots.push(
        <div 
          className="garden-plot"
        />
      )
    }
    let templateCols = ""
    for (let i = 0; i < this.context.state.width; i++) {
      templateCols += "auto "
    }
    return (
      <div id="garden-wrapper-print">
        {this.printGardenBeds()}
        <div 
          id="garden"
          style={{gridTemplateColumns: templateCols}}
        >
          {plots}
        </div>
      </div>
    )
  }

  printNotes = () => {
    return (
      <div id="print-garden-notes">
        {this.context.state.notes}
      </div>
    )
  }

  printSingleBed = (model) => {
    let plots = []
    let templateCols = ""
    for (let y = 0; y < model[0].length; y++) {
      for (let x = 0; x < model.length; x++) {
        if (y === 0) {
          templateCols += "auto "
        }
        try {
          plots.push(
            <div className="print-plot">
              <img 
                src={PLANT[model[x][y].contains].src}
                alt={PLANT[model[x][y].contains].name}
                draggable={false}
              />
            </div>
          )
        }
        catch {
          plots.push(
            <div className="print-plot">
              <div className="plot-filler"/>
            </div>
          )
        }
        
      }
    }
    return (
      <div className="print-garden-model-wrapper">
        <div 
          className="print-garden-bed-model"
          style={{gridTemplateColumns: templateCols}}
        >
          {plots}
        </div>
      </div>
      
    )
  }

  printSingleBedNotes = (notes) => {
    if (notes) {
      return (
        <div className="print-garden-bed-notes">
          {notes}
        </div>
      )
    }
  }

  printBeds = () => {

    // remove duplicates from beds
    let names = []
    let beds = []
    this.context.state.beds.map((bed) => {
      if (!names.includes(bed.name)) {
        names.push(bed.name)
      }
    })
    names.map((name) => {
      for (let i = 0; i < this.context.state.beds.length; i++) {
        if (this.context.state.beds[i].name === name) {
          beds.push(this.context.state.beds[i])
          break
        }
      }
    })

    let content = []

    beds.map((bed) => {
      content.push(
        <div className="print-single-bed">
          <h2>{bed.name}</h2>
          {this.printSingleBed(bed.model)}
          {this.printSingleBedNotes(bed.notes)}
        </div>
      )
    })

    return (
      <Fragment>
        <h1 id="beds-title">Beds</h1>
        <div id="print-garden-single-beds">
          {content}
        </div>
      </Fragment>
    )
  }

  printBullets = (bullets) => {
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

  printLearnLink = (name, link) => {
    if (link) {
      return (
        <p className="link">
          Learn more about {name} with our
          <a
            href={link}
            target="_blank"
            rel="noreferrer"
          >
            {" Vegetable Encyclopedia"}
          </a>
        </p>
      )
    }
  }

  printBuyLink = (name, link) => {
    if (link) {
      return (
        <p className="link">
          Buy organic
          <a
            href={link}
            target="_blank"
            rel="noreferrer"
          >
            {` ${name} seeds`}
          </a>
        </p>
      )
    }
  }

  getCrops = () => {
    let crops = []

    let bed, c1, c2, c3
    for (let i = 0; i < this.context.state.beds.length; i++) {
      bed = this.context.state.beds[i]
      for (let j = 0; j < bed.model.length; j++) {
        for (let k = 0; k < bed.model[0].length; k++) {
          c1 = bed.model[j][k].contains in Guide
          c2 = bed.model[j][k].contains !== ""
          c3 = !crops.includes(bed.model[j][k].contains)
          if (c1 && c2 && c3) {
            crops.push(bed.model[j][k].contains)
          }
        }
      }
    }

    crops.sort()
    return crops
  }

  printCropGuide = () => {

    let cropGuides = []
    let crops = this.getCrops()
    let name, bullets, learn, buy

    for (let i = 0; i < crops.length; i++) {
      name = Guide[crops[i]].name
      bullets = Guide[crops[i]].bullets
      learn = Guide[crops[i]].learn
      buy = Guide[crops[i]].buy
      cropGuides.push(
        <div
          className="guide-crop" key={name}
        >
          <div className="guide-name-container">
            <h3>{name}</h3>
            <img 
              src={SINGLES[crops[i]].src}
              alt={name}
              draggable={false}
            />
          </div>
          <ul className="bullets">
            {this.printBullets(bullets)}
          </ul>
          {this.printLearnLink(name, learn)}
          {this.printBuyLink(name, buy)}
        </div>
      )
    }

    return (
      <Fragment>
        <h1 id="crops-title">Crops</h1>
        {cropGuides}
      </Fragment>
    )
  }

  print = () => {
    return (
      <div
        id="print-container"
        key={this.context.state.beds}
      >
        <h1 id="print-title">Kitchen Garden Planner</h1>
        <h3 id="print-sub-title">Garden Planner</h3>
        {this.printName()}
        {this.printGarden()}
        {this.printNotes()}
        {this.printBeds()}
        {this.printCropGuide()}
      </div>
    )
  }

  printButton = () => {
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

  render = () => {
    return (
      <Fragment>
        {this.print()}
        {this.printButton()}
      </Fragment>
    )
  }

}

Print.contextType = GardenContext

export default Print