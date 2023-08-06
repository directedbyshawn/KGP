import { Component, Fragment } from "react"
import { GardenEmitter } from "../../../utils/EventEmitter"
import { LoadPopup, DeletePopup } from "../../Popups"
import GardenContext from "../GardenContext"
import Spinner from "../../Spinner"
import Result from "./Result"

class Load extends Component {

  constructor() {
    super()
    this.state = {
      open: false,
      email: "",
      zip: "",
      gardens: [],
      loading: false,
      delete: false,
      deleteName: "",
      deleteMessage: "",
      deleteLoading: false,
      deleteSuccess: false,
      deleteFailure: false,
    }
    const open = GardenEmitter.addListener("openLoad", this.open.bind(this))
    const del = GardenEmitter.addListener("openDelete",this.deletePress.bind(this))
  }

  open = () => {
    this.setState({
      open: true,
      email: this.context.state.email,
      zip: this.context.state.zip
    })
    if (this.context.state.email && this.context.state.zip) {
      this.search()
    }
  }

  close = () => {
    this.setState({
      open: false
    })
  }

  deletePress = (eventData) => {
    this.setState({
      delete: true,
      deleteName: eventData.name
    })
  }

  closeDeleteMenu = () => {
    if (this.state.deleteSuccess) {
      this.search()
      if (this.context.state.currentOption === this.state.deleteName) {
        this.context.functions.reset()
      }
    }
    this.setState({
      delete: false,
      deleteName: "",
      deleteMessage: "",
      deleteSuccess: "",
      deleteFailure: ""
    })
  }

  cancelDelete = () => {
    this.setState({
      delete: false,
      deleteName: "",
      deleteSuccess: false,
      deleteFailure: false,
      deleteMessage: ""
    })
  }

  printDeleteMessage = () => {
    if (this.state.deleteSuccess || this.state.deleteFailure) {
      let type
      let className = "delete "
      if (this.state.deleteSuccess) {
        type="success"
      }
      else {
        type="failure"
        className += "failure"
      }
      return (
        <div
          className={className}
          id={`delete-${type}`}
        >
          {this.state.deleteMessage}
        </div>
      )
    }
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

  printDeleteButtons = () => {
    if (this.state.deleteSuccess) {
      return (
        <button
          type="button"
          className="confirmation-buttons"
          onClick={this.closeDeleteMenu.bind(this)}
        >
          Close
        </button>
      )
    }
    else {
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
            onClick={this.closeDeleteMenu.bind(this)}
          >
            Cancel
          </button>
        </Fragment>
      )
    }
  }

  delete = () => {
    const params = {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        name: this.state.deleteName,
        email: this.context.state.email,
        zip: this.context.state.zip
      })
    }
    const ENDPOINT = "api/v1/gardens/deleteGarden"
    const URL = `${this.context.state.address}${ENDPOINT}`
    this.setState({deleteLoading: true}, () => {
      fetch(`${URL}`, params)
      .then(response => response.json())
      .then(data => {
        this.setState({
          deleteLoading: false,
          deleteMessage: data.message
        })
        if (data.success) {
          this.setState({
            deleteSuccess: true,
            deleteFailure: false
          })
        }
        else {
          this.setState({
            deleteFailure: true,
            deleteSuccess: false
          })
        }
        this.search()
      })
      .catch(error => {
        console.log(error)
        this.setState({
          deleteMessage: "ERROR: Could not delete garden",
          deleteLoading: false,
          deleteFailure: true,
          deleteSuccess: false
        })
      })
    })
  }

  search = () => {
    this.setState({ loading: true }, () => {
      const query = `email=${this.context.state.email}&zip=${this.context.state.zip}`
      fetch(`${this.context.state.address}api/v1/gardens/getGardens?${query}`)
      .then(response => response.json())
      .then(data => {
        let newGardens = []
        for (let i = 0; i < data.results.length; i++) {
          newGardens.push({
            name: data.results[i].name,
            width: data.results[i].width,
            height: data.results[i].height,
            beds: data.results[i].beds,
            notes: data.results[i].notes
          })
        }
        this.setState({
          gardens: newGardens,
          loading: false
        })
      })
      .catch(error => {
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

  setEmail = (event) => {
    this.setState({
      email: event.target.value
    })
  }

  sendEmail = () => {
    this.context.functions.setEmail(this.state.email)
  }

  setZip = (event) => {
    this.setState({
      zip: event.target.value
    })
  }

  sendZip = () => {
    this.context.functions.setZip(this.state.zip)
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
    else if (this.state.gardens.length === 0) {
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
            {this.state.gardens.map((result) => {
              return (
                <Result garden={result}/>
              )
            })}
          </div>
        </div>
      )
    }
  }

  render = () => {
    if (this.state.delete) {
      return (
        <DeletePopup
          open={this.state.delete}
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
              Delete Garden
            </h1>
            <h3>
              Are you sure you want to delete {this.state.deleteName}?
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
        <h1 className="menu-heading">Load Your Garden</h1>
        <div id="load-menu-wrapper">
          <div id="search-side" style={{height: "100%"}}>
            <div id="load-form-wrapper">
              <h2>Information</h2>
              <input 
                type="text"
                placeholder="Email"
                value={this.state.email}
                onChange={this.setEmail.bind(this)}
                onBlur={this.sendEmail.bind(this)}
              />
              <input 
                type="text"
                placeholder="Zip"
                value={this.state.zip}
                onChange={this.setZip.bind(this)}
                onBlur={this.sendZip.bind(this)}
              />
              <button
                className="save-load-button"
                onClick={this.search.bind(this)}
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

Load.contextType = GardenContext

export default Load