import "./Bed.css"
import { Component } from "react"
import GardenContext from "../GardenContext"
import { SINGLES } from "../../../assets/images"

class Bed extends Component {

  constructor(props) {
    super(props)
    this.state = {
      id: props.id,
      name: props.name,
      notes: props.notes,
      model: props.model,
      width: props.model.length,
      height: props.model[0].length,
      dragging: false,
      hover: false,
      startDrag: {
        x: 0,
        y: 0
      },
      position: {
        x: props.position.x,
        y: props.position.y
      }
    }
  }

  printBed = () => {

    // create coordinates for bed
    const coordinates = []
    const size = this.state.width * this.state.height
    let curY = 0
    for (let i = 0; i < size; i++) {
      let curX = (i % this.state.width) + 1
      if (i % this.state.width === 0) {
        curY++
      }
      coordinates.push({x: curX, y: curY})
    }

    let templateCols = ""
    for (let i = 0; i < this.state.model.length; i++) {
      templateCols += "auto "
    }

    return (
      <div 
        className="bed"
        style={{gridTemplateColumns: templateCols}}
      >
        {coordinates.map((node, index) => {
          let contains = this.state.model[node.x-1][node.y-1].contains
          try {
            return (
              <div className="crop">
                <img
                  src={SINGLES[contains].src}
                  alt={SINGLES[contains].name}
                >
                </img>
              </div>
            )
          }
          catch {
            return (
              <div className="crop" />
            )
          }
        })}
      </div>
    )
    
  }

  printRotate = () => {
    return (
      <svg 
        version="1.1" 
        id="Capa_1" 
        xmlns="http://www.w3.org/2000/svg" 
        x="0px" 
        y="0px"
        viewBox="0 0 214.367 214.367"
        className="rotate"
      > 
        <defs></defs>
        <title>Rotate this bed</title>
        <path 
          d="M202.403,95.22c0,46.312-33.237,85.002-77.109,93.484v25.663l-69.76-40l69.76-40v23.494
          c27.176-7.87,47.109-32.964,47.109-62.642c0-35.962-29.258-65.22-65.22-65.22s-65.22,29.258-65.22,65.22
          c0,9.686,2.068,19.001,6.148,27.688l-27.154,12.754c-5.968-12.707-8.994-26.313-8.994-40.441C11.964,42.716,54.68,0,107.184,0
          S202.403,42.716,202.403,95.22z"
          className="rotate-path"
        />
      </svg>
    )
  }

  printDelete = () => {
    return (
      <svg
        className="delete" 
        data-name="delete-bed-container" 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 105.16 122.88"
      >
        <defs></defs>
        <title>Delete this bed</title>
        <path 
          className="delete-path"
          d="M11.17,37.16H94.65a8.4,8.4,0,0,1,2,.16,5.93,5.93,0,0,1,2.88,1.56,5.43,5.43,0,0,1,1.64,3.34,7.65,7.65,0,0,1-.06,1.44L94,117.31v0l0,.13,0,.28v0a7.06,7.06,0,0,1-.2.9v0l0,.06v0a5.89,5.89,0,0,1-5.47,4.07H17.32a6.17,6.17,0,0,1-1.25-.19,6.17,6.17,0,0,1-1.16-.48h0a6.18,6.18,0,0,1-3.08-4.88l-7-73.49a7.69,7.69,0,0,1-.06-1.66,5.37,5.37,0,0,1,1.63-3.29,6,6,0,0,1,3-1.58,8.94,8.94,0,0,1,1.79-.13ZM5.65,8.8H37.12V6h0a2.44,2.44,0,0,1,0-.27,6,6,0,0,1,1.76-4h0A6,6,0,0,1,43.09,0H62.46l.3,0a6,6,0,0,1,5.7,6V6h0V8.8h32l.39,0a4.7,4.7,0,0,1,4.31,4.43c0,.18,0,.32,0,.5v9.86a2.59,2.59,0,0,1-2.59,2.59H2.59A2.59,2.59,0,0,1,0,23.62V13.53H0a1.56,1.56,0,0,1,0-.31v0A4.72,4.72,0,0,1,3.88,8.88,10.4,10.4,0,0,1,5.65,8.8Zm42.1,52.7a4.77,4.77,0,0,1,9.49,0v37a4.77,4.77,0,0,1-9.49,0v-37Zm23.73-.2a4.58,4.58,0,0,1,5-4.06,4.47,4.47,0,0,1,4.51,4.46l-2,37a4.57,4.57,0,0,1-5,4.06,4.47,4.47,0,0,1-4.51-4.46l2-37ZM25,61.7a4.46,4.46,0,0,1,4.5-4.46,4.58,4.58,0,0,1,5,4.06l2,37a4.47,4.47,0,0,1-4.51,4.46,4.57,4.57,0,0,1-5-4.06l-2-37Z"
        />
      </svg>
    )
  }

  select = () => {
    this.context.functions.setBed(this.state.id)
  }

  move = (event) => {

    // change in cursor from drag start to drag end
    const changeInCursorX = event.clientX - this.state.startDrag.x
    const changeInCursorY = event.clientY - this.state.startDrag.y

    // current position of bed in garden
    let curX = this.state.position.x
    let curY = this.state.position.y
    const oldX = curX
    const oldY = curY

    // new position after drag has completed, with input validation for:
    //   -  boundaries of the grid
    //   -  ensuring that two beds do not overlap
    let good = true
    let newX = curX += Math.round(changeInCursorX / 21)
    let newY = curY += Math.round(changeInCursorY / 21)
    let maxX = this.context.state.width - this.state.width
    let maxY = this.context.state.height - this.state.height
    if (newX < 0) {
      newX = 0
    }
    if (newX > maxX) {
      newX = maxX
    }
    if (newY < 0) {
      newY = 0
    }
    if (newY > maxY) {
      newY = maxY
    }
    maxX = newX + this.state.width
    maxY = newY + this.state.height
    let curr
    for (let x = newX; x < maxX; x++) {
      for (let y = newY; y < maxY; y++) {
        curr = parseInt(this.context.state.grid[x][y])
        if (curr !== -1 && curr !== this.state.id) {
          good = false
        }
      }
    }
    
    if (good) {
      this.setState({
        dragging: false,
        startDrag: {
          x: 0,
          y: 0
        },
        position: {
          x: newX,
          y: newY
        }
      })
      this.context.functions.setPosition(this.state.id, newX, newY)
    }
    else {
      this.setState({
        dragging: false,
        startDrag: {
          x: 0,
          y: 0
        },
        position: {
          x: oldX,
          y: oldY
        }
      })
    }
    
  }

  render() {
    return (
      <div 
        className="bed-wrapper"
        draggable="true"
        onClick={this.select.bind(this)}
        onDragStart={(event) => {
          this.setState({
            startDrag: {
              x: event.clientX,
              y: event.clientY
            },
            dragging: true
          })
        }}
        onDragEnd={(event => {
          this.move(event)
        })}
        onMouseEnter={() => {
          this.setState({
            hover: true
          })
        }}
        onMouseLeave={() => {
          this.setState({
            hover: false,
          })
        }}
        style={{
          border: (this.context.state.bedSelected.id === this.state.id) ? "2px solid #4D7335" : "1px solid #4D7335",
          cursor: this.state.dragging ? "grabbing" : "grab",
          scrollSnapType: this.state.dragging ? "y-mandatory" : "none",
          left: `${3+(this.state.position.x * 21)}px`,
          top: `${3+(this.state.position.y * 21)}px`
        }}
      >
        {this.printBed()}
      </div>
    )
  }

}

Bed.contextType = GardenContext

export default Bed