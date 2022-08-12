import { Component, createContext } from "react"
import { SINGLES } from "../../assets/images"
import { address } from "../../config"

const BedContext = createContext()

export class BedProvider extends Component {

  // initial width and height for bed in feet
  startWidth = 5
  startHeight = 2

  // creates empty bed model
  createEmpty = () => {
    let model = []
    for (let i = 0; i < this.startWidth; i++) {
      model.push([])
      for (let j = 0; j < this.startHeight; j++) {
        model[i].push({contains: ""})
      }
    }
    return model
  }

  state = {

    // address to make api calls to
    address: address,

    // grid dimensions
    minWidth: 2,
    maxWidth: 10,
    width: 5,
    minHeight: 1,
    maxHeight: 4,
    height: 2,

    // current bed
    name: "",
    email: "",
    zip: "",
    model: this.createEmpty(),
    notes: "",

    bedLoaded: false,
    currentOption: "",
    beds: [],

    // allow change in dimension
    cropsPlaced: false

  }

  // set name of bed 
  setName = (name) => {
    this.setState({
      name: name
    })
  }

  // set user email
  setEmail = (email) => {
    this.setState({
      email: email
    })
  }

  // set user zip
  setZip = (zip) => {
    this.setState({
      zip: zip
    })
  }

  // set bed width
  setWidth = (width) => {
    this.setState({
      width: parseInt(width),
      model: this.clearModelNew(width, this.state.height)
    })
  }

  // set bed height
  setHeight = (height) => {
    this.setState({
      height: parseInt(height),
      model: this.clearModelNew(this.state.width, height)
    })
  }

  // set notes about bed
  setNotes = (notes) => {
    this.setState({
      notes: notes
    })
  }

  // set bed model
  setModel = (model) => {
    this.setState({
      model: model,
      cropsPlaced: true
    })
  }

  clearModelNew = (width, height) => {
    let model = []
    for (let i = 0; i < width; i++) {
      model.push([])
      for (let j = 0; j < height; j++) {
        model[i].push({contains: ""})
      }
    }
    return model
  }

  cropDropped = (eventData) => {
    // find the crop with the id from the drop event
    let crop
    for (const [key, value] of Object.entries(SINGLES)) {
      if (value.index === eventData.sourceIndex) {
        crop = key
        break
      }
    }

    if (crop) {
      // extract grid coordinates from droppableId
      let coordsString = eventData.destinationId.slice(9, eventData.destinationId.length)
      const coords = coordsString.split("-")
      let x = parseInt(coords[0]) - 1
      let y = parseInt(coords[1]) - 1

      // copy and update model
      let model = this.state.model
      model[x][y] = {
        contains: crop
      }

      this.setState({
        model: model,
        cropsPlaced: true
      })
    }
  }

  bedLoaded = () => {
    this.setState({
      bedLoaded: true
    })
  }

  setCurrent = (name) => {
    this.setState({
      currentOption: name,
      bedLoaded: true
    })
    let bed = this.state.beds.find(bed => bed.name === name)
    if (bed) {
      this.setState({
        name: bed.name,
        model: bed.model,
        width: bed.model.length,
        height: bed.model[0].length,
        notes: bed.notes
      })
    }
  }

  loadBeds = (beds) => {
    this.setState({
      beds: beds
    })
  }

  // reset model, name, and notes
  reset = () => {
    this.setState({
      name: "",
      model: this.clearModelNew(this.state.width, this.state.height),
      notes: "",
      cropsPlaced: false,
      bedLoaded: false,
      currentOption: ""
    })
  }

  render = () => {

    // export functions
    const { setName, setEmail, setZip, setWidth, 
      setHeight, setModel, setNotes, cropDropped, 
      bedLoaded, loadBeds, setCurrent, reset 
    } = this

    // child conponents use state and functions to modify context
    const BedState = {
      state: this.state,
      functions: {
        setName,
        setEmail,
        setZip,
        setWidth, 
        setHeight,
        setModel,
        setNotes,
        cropDropped,
        bedLoaded,
        loadBeds,
        setCurrent,
        reset
      }
    }

    return (
      <BedContext.Provider value={BedState}>
        {this.props.children}
      </BedContext.Provider>
    )

  }

}

export default BedContext