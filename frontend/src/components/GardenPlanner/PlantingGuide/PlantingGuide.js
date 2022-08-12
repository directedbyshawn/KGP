import "./PlantingGuide.css"
import { Component, Fragment } from "react"
import { PlantingGuidePopup } from "../../Popups"
import { Guide } from "../../../assets/guide"
import { SINGLES, PLANT } from "../../../assets/images"
import GardenContext from "../GardenContext"

class PlantingGuide extends Component {

  constructor() {
    super()
    this.state = {
      open: false
    }
  }

  open = () => {
    this.setState({
      open: true
    })
  }

  close = () => {
    this.setState({
      open: false
    })
  }

  printBed = (model) => {
    let plots = []
    let templateCols = ""
    for (let y = 0; y < model[0].length; y++) {
      for (let x = 0; x < model.length; x++) {
        if (y === 0) {
          templateCols += "auto "
        }
        try {
          plots.push(
            <div className="guide-plot">
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
            <div className="guide-plot">
              <div className="guide-plot-filler" />
            </div>
          )
        }
      }
    }
    return (
      <div className="guide-model-wrapper">
        <div 
          className="guide-model"
          style={{gridTemplateColumns: templateCols}}
        >
          {plots}
        </div>
      </div>
      
    )
  }

  printNotes = (notes) => {
    if (notes) {
      return (
        <div className="guide-notes">
          {notes}
        </div>
      )
    }
  }

  renderBeds = () => {

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
        <div className="guide-bed">
          <h2>{bed.name}</h2>
          {this.printBed(bed.model)}
          {this.printNotes(bed.notes)}
        </div>
      )
    })

    return (content)

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

  renderCropGuide = () => {

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
          <div id="guide-name-container">
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

    return cropGuides

  }

  renderGuide = () => {
    if (this.context.state.beds.length > 0) {
      return (
        <Fragment>
          <h1>Beds</h1>
          {this.renderBeds()}
          <h1>Crops</h1>
          {this.renderCropGuide()}
        </Fragment>
      )
    }
  }

  render = () => {
    return (
      <Fragment>
        <button
          id="openPlantingGuide"
          onClick={this.open.bind(this)}
        >
          Guide
        </button>
        <PlantingGuidePopup
          open={this.state.open}
          onClose={this.close.bind(this)}
        >
          <button
            className="close-button"
            onClick={this.close.bind(this)}
          >
            &times;
          </button>
          <h1 className="menu-heading">Planting Guide</h1>
          <div id="guide-wrapper">
            {this.renderGuide()}
          </div>
        </PlantingGuidePopup>
      </Fragment>
    )
  }

}

PlantingGuide.contextType = GardenContext

export default PlantingGuide