import { Component, createContext } from "react"
import { address } from "../../config"
import { matrix, transpose } from "mathjs"

const GardenContext = createContext()

export class GardenProvider extends Component {

  // initial width and height of garden in feet
  startWidth = 25
  startHeight = 15

  // create empty grid of size startWidth * startHeight, this is 
  // used to determine where beds lie within the garden. Helpful
  // when trying to move them (keep them from overlapping).
  createEmpty = () => {
    let grid = []
    for (let i = 0; i < this.startWidth; i++) {
      grid.push([])
      for (let j = 0; j < this.startHeight; j++) {
        grid[i].push(-1)
      }
    }
    return grid
  }

  // used to store all of garden state
  state = {

    // address to make backend calls to
    address: address,

    // dimensions of garden + control
    minWidth: 5,
    maxWidth: 40,
    width: this.startWidth,
    minHeight: 5,
    maxHeight: 20,
    height: this.startHeight,

    // user info
    gardenLoaded: false,
    authenticated: false,
    currentOption: "",
    name: "",
    email: "",
    zip: "",

    // beds loaded from storage
    beds: [],
    // grid to represent where beds lie within garden
    grid: this.createEmpty(),
    // determines if a user has selected a bed to either
    // rotate or delete it
    bedSelected: {
      status: false,
      id: -1
    },

    // notes about garden
    notes: ""

  }

  // used to change position of a bed within the garden, bed
  // is selected by id and then given a new x and y coordinate
  setPosition = (id, x, y) => {
    let beds = this.state.beds
    beds[parseInt(id)].position = {x: x, y: y}
    this.setState({
      beds: beds
    })
    this.setGrid(beds)
  }

  // set name of garden loaded
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

  // set garden width
  setWidth = (width) => {
    this.setState({
      width: parseInt(width)
    })
  }

  // set garden height
  setHeight = (height) => {
    this.setState({
      height: parseInt(height)
    })
  }

  // set notes about garden
  setNotes = (notes) => {
    this.setState({
      notes: notes
    })
  }

  // triggered if user loads garden from storage
  newGardenLoaded = (status) => {
    this.setState({
      gardenLoaded: true
    })
  }

  // updates grid when a bed is moved or modified, or
  // when a new garden is loaded from storage
  setGrid = (beds) => {

    // create empty grid
    let grid = []
    for (let i = 0; i < this.state.width; i++) {
      grid.push([])
      for (let j = 0; j < this.state.height; j++) {
        grid[i].push(-1)
      }
    }

    // mark off entries where a bed exists
    beds.map((bed) => {
      let minX = bed.position.x 
      let minY = bed.position.y
      let maxX = bed.position.x + bed.model.length
      let maxY = bed.position.y + bed.model[0].length
      for (let x = minX; x < maxX; x++) {
        for (let y = minY; y < maxY; y++) {
          grid[x][y] = `${bed.id}`
        }
      }
    })

    this.setState({
      grid: grid
    })

  }

  // load in a new garden from save
  loadGarden = (garden) => {
    this.setState({
      gardenLoaded: true,
      name: garden.name,
      currentOption: garden.name,
      width: garden.width,
      height: garden.height,
      notes: garden.notes,
      beds: garden.beds
    })
    // create grid from beds in garden save
    this.setGrid(garden.beds)
  }

  // add bed into garden
  addBed = (bed) => {

    let newBed = {
      id: this.state.beds.length,
      name: bed.name,
      model: bed.model,
      notes: bed.notes,
      orientation: 0
    }

    // searches grid to find first available position
    // in the garden for a new bed
    const bedWidth = bed.model.length
    const bedHeight = bed.model[0].length
    let xPos, yPos, xSearch, ySearch, xMax, yMax
    let found = false, good = true
    for (xPos = 0; xPos < this.state.width - bedWidth; xPos++) {
      for (yPos = 0; yPos < this.state.height - bedHeight; yPos++) {
        xMax = xPos + bedWidth
        yMax = yPos + bedHeight
        good = true
        for (xSearch = xPos; xSearch < xMax; xSearch++) {
          for (ySearch = yPos; ySearch < yMax; ySearch++) {
            if (this.state.grid[xSearch][ySearch] !== -1) {
              good = false
            }
          }
        }
        if (good) {
          found = true
          break
        }
      }
      if (good) {
        break
      }
    }
    // if a spot exists in the grid, then the bed is added
    if (found) {
      newBed.position = {
        x: xPos,
        y: yPos
      }
      // add bed to beds and modify grid
      let beds = this.state.beds
      beds.push(newBed)
      this.setState({
        beds: beds
      })
      this.setGrid(beds)
    }
  }

  // set id of bed
  setBed = (id) => {
    this.setState({
      bedSelected: {
        status: true,
        id: id
      }
    })
  }

  setCurrentOption = (name) => {
    this.setState({
      currentOption: name
    })
  }

  // triggered when user clicks off of bed, either
  // onto another bed or onto anything else
  deselect = () => {
    this.setState({
      bedSelected: {
        status: false,
        id: -1
      }
    })
  }

  // delete bed from garden
  deleteBed = () => {
    const index = this.state.bedSelected.id
    let newBeds = this.state.beds
    newBeds.splice(index, 1)
    newBeds.map((bed, index) => {
      bed.id = index
    })
    this.setState({
      beds: newBeds,
      bedSelected: {
        status: false,
        id: -1
      }
    })
  }

  // flips columns of a matrix
  flip = (model) => {
    let newModel = []
    for (let i = model.length-1; i >= 0; i--) {
      newModel.push(model[i])
    }
    return newModel
  }

  // the process for rotating a bed 90° counter 
  // clockwise is to take the transpose of the 
  // model matrix, and then flip the columns.
  rotate = () => {

    // get info
    let beds = this.state.beds
    const id = this.state.bedSelected.id
    const model = beds[id].model

    // rotate bed and retrieve new array
    let rotated = transpose(matrix(model))
    let newModel = this.flip(rotated._data)

    // create new bed with new model
    let bed = beds[id]
    bed.model = newModel
    bed.orientation = (beds[id].orientation + 1) % 4
    beds[id] = bed

    // update
    this.setState({
      beds: beds
    })
    
  }

  // reset garden, create empty grid, unselect
  // beds, and remove notes
  reset = () => {
    this.setState({
      gardenLoaded: false,
      name: "",
      grid: this.createEmpty(),
      beds: [],
      bedSelected: {
        status: false,
        id: -1
      },
      notes: ""
    })
  }

  render = () => {

    // export functions
    const { setName, setEmail, setZip, setWidth, setHeight,
      setPosition, setNotes, loadGarden, addBed, reset,
      setBed, deselect, deleteBed, rotate, newGardenLoaded,
      setCurrentOption
    } = this

    // child components use state and functions to modify context
    const GardenState = {
      state: this.state,
      functions: {
        setName,
        setEmail,
        setZip,
        setWidth, 
        setHeight,
        setPosition,
        setNotes,
        loadGarden,
        newGardenLoaded,
        setCurrentOption,
        addBed,
        setBed,
        deselect,
        deleteBed,
        rotate,
        reset
      }
    }

    return (
      <GardenContext.Provider value={GardenState}>
        {this.props.children}
      </GardenContext.Provider>
    )
    
  }

}

export default GardenContext