import { Component, Fragment } from "react"
import { LoadPopup, DeletePopup } from "../../Popups"
import { BedEmitter } from "../../../utils/EventEmitter"
import BedContext from "../BedContext"
import Result from "./Result"
import Spinner from "../../Spinner"

class Load extends Component {

  constructor() {
    super()
    this.state = {
      open: false,
      beds: [],
      name: "",
      email: "",
      zip: "", 
      currentOption: "",
      loading: false,
      deleteFlag: false,
      deleteName: "",
      deleteLoading: "",
      deleteMessage: {
        type: "",
        text: ""
      }
    }
    const open = BedEmitter.addListener("openLoad", this.open.bind(this))
    const close = BedEmitter.addListener("closeLoad", this.close.bind(this))
    const deleteTrigger = BedEmitter.addListener("delete", this.deletePress.bind(this))
  }

  open = () => {
    this.setState({
      open: true
    })
    this.checkLoad()
  }

  close = () => {
    this.setState({
      open: false
    })
  }

  setEmail = (event) => {
    this.setState({
      email: event.target.value
    })
  }

  setZip = (event) => {
    this.setState({
      zip: event.target.value
    })
  }

  updateEmail = () => {
    this.context.functions.setEmail(this.state.email)
  }

  updateZip = () => {
    this.context.functions.setZip(this.state.zip)
  }

  checkLoad = () => {
    if (this.context.state.email && this.context.state.zip) {
      this.load()
    }
  }

  load = () => {

    // route request
    const DOMAIN = `${this.context.state.address}`
    const ENDPOINT = `api/v1/beds/getBeds/?`
    const QUERY = `email=${this.context.state.email}&zip=${this.context.state.zip}`
    const URL = `${DOMAIN}${ENDPOINT}${QUERY}`
    
    this.setState({loading: true}, () => {
      fetch(`${URL}`)
      .then(response => response.json())
      .then(data => {

        // copy results from request into new array of bed objects
        let newBeds = []
        for (let i = 0; i < data.results.length; i++) {
          newBeds.push({
            name: data.results[i].name,
            model: data.results[i].model,
            notes: data.results[i].notes
          })
        }

        this.context.functions.loadBeds(newBeds)

        this.setState({
          loading: false,
        })

      })
      .catch(error => {
        console.log(`Error loading beds: ${error}`)
        this.setState({
          loading: false
        })
      })
    })

  }

  printLoading = () => {
    if (this.state.loading) {
      return (
        <Spinner
          width={100}
          height={100}
        />
      )
    }
  }

  printResults = () => {
    if (this.state.loading) {
      return (
        <div id="result-load-container">
          <div id="result-load-wrapper">
            {this.printLoading()}
          </div>
        </div>
      )
    }
    else if (this.context.state.beds.length === 0) {
      return (
        <div id="no-results-found">
          <p>No Results Found</p>
        </div>
      )
    }
    else {
      return (
        <div id="result-side">
          <div id="results-wrapper">
            {this.context.state.beds.map((result) => {
              return (
                <Result 
                  id={result.id}
                  name={result.name}
                  currentOption={this.context.state.currentOption}
                  key={`${result.name}${this.context.state.currentOption}`}
                />
              )
            })}
          </div>
        </div>
      )
    }
  }

  deletePress = (eventData) => {
    this.setState({
      deleteFlag: true,
      deleteName: eventData.name
    })
  }

  cancelDelete = () => {
    this.setState({
      deleteFlag: false,
      deleteName: ""
    })
  }

  closeDeleteMenu = () => {

    // if bed has just been deleted, refresh the beds loaded so that it no longer shows
    if (this.state.deleteMessage.type === "success"){
      this.checkLoad()
      // if the bed deleted is the one currently loaded, reset the planner
      if (this.context.state.currentOption === this.state.deleteName) {
        this.context.functions.reset()
      }
      this.setState({
        open: false
      })
    }

    // reset delete data
    this.setState({
      deleteFlag: false,
      deleteName: "",
      deleteMessage: {
        text: "",
        type: ""
      }
    })

  }

  printDeleteLoading = () => {
    if (this.state.deleteLoading) {
      return (
        <div id="delete-loading-wrapper">
          <Spinner
            width={60}
            height={40}
          />
        </div>
      )
    }
  }

  printDeleteMessage = () => {
    if (this.state.deleteMessage.type === "success") {
      return (
        <div className="delete success">
          {this.state.deleteMessage.text}
        </div>
      )
    }
    else if (this.state.deleteMessage.type === "failure") {
      return (
        <div className="delete failure">
          {this.state.deleteMessage.text}
        </div>
      )
    }
    
  }

  printDeleteButtons = () => {
    if (this.state.deleteMessage.type === "") {
      return (
        <Fragment>
          <button
            type="button"
            className="confirmation-buttons"
            onClick={this.delete.bind(this)}
          >
            Delete
          </button>
          <button
            type="button"
            className="confirmation-buttons"
            onClick={this.cancelDelete.bind(this)}
          >
            Cancel
          </button>
        </Fragment>
        
      )
    }
    else {
      return (
        <Fragment>
          <button
            type="button"
            className="confirmation-buttons"
            onClick={this.closeDeleteMenu.bind(this)}
          >
            Close
          </button>
        </Fragment>
      )
    }
  }

  delete = () => {
    this.setState({
      deleteMessage: {
        text: "",
        type: ""
      }
    })
    const requestParams = {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        name: this.state.deleteName,
        email: this.context.state.email,
        zip: this.context.state.zip
      })
    }
    const DOMAIN = this.context.state.address
    const ENDPOINT = `api/v1/beds/deleteBed`
    const URL = `${DOMAIN}${ENDPOINT}`
    this.setState({deleteLoading: true}, () => {
      fetch(`${URL}`, requestParams)
      .then(response => response.json())
      .then(data => {
        this.setState({
          deleteMessage: {
            text: data.message,
            type: "success"
          },
          deleteLoading: false
        })
      })
      .catch(error => {
        this.setState({
          deleteLoading: false,
          deleteMessage: {
            text: "ERROR: Could not delete bed",
            type: "failure"
          }
        })
      })
    })
  }

  render = () => {

    if (this.state.deleteFlag) {
      return (
        <DeletePopup
          open={this.state.deleteFlag}
          onClose={this.closeDeleteMenu.bind(this)}
        >
          <button 
            className="close-button" 
            onClick={this.closeDeleteMenu.bind(this)}
          >
            &times;
          </button>
          <div id="delete-form-wrapper">
            <h1 
              className="menu-heading"
              id="delete-menu-heading"  
            >
              Delete Bed
            </h1>
            <h3>
              Are you sure you want to delete <br></br><span>{this.state.deleteName}</span>?
            </h3>
            {this.printDeleteLoading()}
            {this.printDeleteMessage()}
            {this.printDeleteButtons()}
          </div>
        </DeletePopup>
      )
    }

    return (
      <LoadPopup 
        open={this.state.open} 
        onClose={this.close.bind(this)}
      >
        <button 
          className="close-button" 
          onClick={this.close.bind(this)}
        >
          &times;
        </button>
        <h1 className="menu-heading">Load Your Bed</h1>
        <div id="load-menu-wrapper">
          <div id="search-side" style={{height: "100%"}}>
            <div id="load-form-wrapper">
              <h2>Information</h2>
              <input 
                type="text" 
                placeholder="Email"
                onChange={this.setEmail.bind(this)}
                onBlur={this.updateEmail.bind(this)}
                value={this.state.email}
              />
              <input 
                type="zip" 
                placeholder="Zipcode" 
                onChange={this.setZip.bind(this)}
                onBlur={this.updateZip.bind(this)}
                value={this.state.zip}
              />
              <button 
                className="save-load-button" 
                onClick={this.load.bind(this)}
              >
                Search
              </button>
            </div>
          </div>
          {this.printResults()}
        </div>
      </LoadPopup>
    )
  }

}

Load.contextType = BedContext

export default Load