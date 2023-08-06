import "./PlantingGuide.css"
import { Component, Fragment } from "react"
import { PlantingGuidePopup } from "../../Popups"
import { Guide } from "../../../assets/guide"
import { SINGLES} from "../../../assets/images"
import BedContext from "../BedContext"

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

  getCrops = () => {

    // create an array of all crops that exist in the bed
    let crops = []
    const bed = this.context.state.model
    for (let i = 0; i < bed.length; i++) {
      for (let j = 0; j < bed[0].length; j++) {
        let c1 = bed[i][j].contains in Guide
        let c2 = bed[i][j].contains !== ""
        let c3 = !crops.includes(bed[i][j].contains)
        if (c1 && c2 && c3) {
          crops.push(bed[i][j].contains)
        }
      }
    }

    crops.sort()
    
    return crops

  }
  
  printBullets = (bullets) => {
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

  printLearnLink = (name, link) => {
    if (link !== "") {
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
    if (link !== "") {
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

  renderCrops = () => {

    // get list of crops that exist in bed
    let cropGuides = []
    let crops = this.getCrops()

    for (let i = 0; i < crops.length; i++) {

      // crop info
      let name = Guide[crops[i]].name
      let bullets = Guide[crops[i]].bullets
      let learn = Guide[crops[i]].learn
      let buy = Guide[crops[i]].buy
      
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
          {this.printLearnLink(name, learn)}
          {this.printBuyLink(name, buy)}
        </div>
      )

    }
    
     return cropGuides
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
            {this.renderCrops()}
          </div>
        </PlantingGuidePopup>
      </Fragment>
    )
  }

}

PlantingGuide.contextType = BedContext

export default PlantingGuide