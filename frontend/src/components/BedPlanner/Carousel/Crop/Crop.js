import './Crop.css'
import { Component, Fragment } from "react"
import { Draggable, Droppable } from "react-beautiful-dnd"
import { BedEmitter } from '../../../../utils/EventEmitter'

class Crop extends Component {

  constructor(props) {
    super(props)
    this.state = {
      id: props.id,
      name: props.name,
      src: props.src,
      index: props.index,
      hover: false
    }
  }

  hoverOn = () => {
    BedEmitter.emit("carouselHoverOn", {
      name: this.state.name
    })
  }

  hoverOff = () => {
    BedEmitter.emit("carouselHoverOff")
  }

  render = () => {

    return (
      <div
        className="crop-container"
        id={`${this.state.name}-container`}
        onMouseEnter={this.hoverOn.bind(this)}
        onMouseLeave={this.hoverOff.bind(this)}
      >
        <Droppable
          droppableId={this.state.id}
          isDropDisabled={true}
        >
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              <Draggable
                key={this.state.id}
                draggableId={this.state.id}
                index={this.state.index}
              >
                {(provided, snapshot) => (
                  <Fragment>
                    <img
                      className="carousel-crop-img"
                      src={this.state.src}
                      alt={this.state.name}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                    </img>
                    {snapshot.isDragging && (
                      <img
                        src={this.state.src}
                        alt={this.state.name}
                      >
                      </img>
                    )}
                  </Fragment>
                )}
              </Draggable>
            </div>
          )}
        </Droppable>
      </div>
    )
    
  }

}

export default Crop