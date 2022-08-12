import './Carousel.css'
import { Component, Fragment, createRef } from "react"
import { BedEmitter } from "../../../utils/EventEmitter"
import { SINGLES } from "../../../assets/images"
import { LeftButton, RightButton } from "./Scroll"
import BedContext from '../BedContext'
import Crop from "./Crop/Crop"

class Carousel extends Component {

  constructor(props) {
    super(props)
    this.state =  {
      scrollRef: null,
      hover: "",
      position: 0
    }
    const visible = 7
    this.offset = (visible * 80) + (visible * 4)
    this.width = (visible * 80) + ((visible-1) * 4) - 2
    const scroll = BedEmitter.addListener("scroll", this.scroll.bind(this))
    const hoverOn = BedEmitter.addListener("carouselHoverOn", this.hoverOn.bind(this))
    const hoverOff = BedEmitter.addListener("carouselHoverOff", this.hoverOff.bind(this))
  }

  scroll = eventData => {

    // hook to component
    let ref = this.state.scrollRef

    // current scroll position
    let position = this.state.position

    // max scroll
    let max = ref.scrollWidth - this.offset

    // scroll right of left
    if (eventData.right) {
      if (this.state.position + this.offset >= max) {
        position = max+4
      }
      else {
        position += this.offset
      }
    }
    else {
      if (this.state.position - this.offset > 0) {
        position -= this.offset
      }
      else {
        position = 0
      }
    }

    // update model & view position
    this.setState({
      position: position
    })
    ref.scrollLeft = position
    
  }

  hoverOn = eventData => {
    this.setState({
      hover: eventData.name
    })
  }
  
  hoverOff = () => {
    this.setState({
      hover: ""
    })
  }

  setRef = (ref) => {
    this.setState({
      scrollRef: ref
    })
  }

  render = () => {

    return (
      <Fragment>
        <div id="carousel-crop-name-container">
          <p id="carousel-crop-name">{this.state.hover}</p>
        </div>
        <div id="carousel-container">
          <div id="carousel-wrapper">
            <LeftButton />
            <div 
              id="carousel"
              ref={this.setRef}
              style={{
                width: this.width
              }}
            >
              {Object.keys(SINGLES).map((crop, index) => {
                let name = SINGLES[crop].name
                let src = SINGLES[crop].src
                return (
                  <Crop
                    id={name}
                    index={index}
                    name={name}
                    src={src}
                    key={crop}
                  />
                )
              })}
            </div>
            <RightButton />
          </div>
        </div>
      </Fragment>
    )

  }

}

Carousel.contextType = BedContext

export default Carousel