import { e } from "mathjs"
import { Component } from "react"
import { GardenEmitter } from "../../../utils/EventEmitter"
import { SavePopup } from "../../Popups"
import Spinner from "../../Spinner"
import GardenContext from "../GardenContext"

class Save extends Component {

  constructor() {
    super()
    this.state = {
      open: false,
      loading: false,
      message: "",
      name: "",
      email: "",
      zip: "",
      newGardenSubmitted: false,
      saveSuccess: false,
      saveFailure: false,
      updateSuccess: false,
      updateFailure: false
    }
    const open = GardenEmitter.addListener("openSave", this.open.bind(this))
  }

  open = () => {
    this.setState({
      open: true,
      name: this.context.state.name,
      email: this.context.state.email,
      zip: this.context.state.zip
    })
  }

  close = () => {
    if (this.state.newGardenSubmitted) {
      this.context.functions.newGardenLoaded(true)
    }
    this.setState({
      message: "",
      open: false,
      newGardenSubmitted: false
    })
    this.resetFlags()
  }

  resetFlags = () => {
    this.setState({
      saveSuccess: false,
      saveFailure: false,
      updateSuccess: false,
      updateFailure: false
    })
  }

  saveSubmitted = (type) => {
    this.resetFlags()
    if (!this.disabled()) {
      this.save(type)
    }
    else {
      if (type === "save") {
        this.setState({
          saveFailure: true,
          message: "ERROR: Invalid name, email, or zip"
        })
      }
      else {
        this.save(type)
      }
    }
  }

  save = (type) => {

    const requestParams = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: this.context.state.name,
        email: this.context.state.email,
        zip: this.context.state.zip,
        width: this.context.state.width,
        height: this.context.state.height,
        beds: this.context.state.beds,
        notes: this.context.state.notes
      })
    }

    // route request
    const DOMAIN = `${this.context.state.address}`
    let endpoint = `api/v1/gardens/`
    type === "save" ? endpoint += "saveGarden" : endpoint += "updateGarden"
    const URL = `${DOMAIN}${endpoint}`
    
    this.resetFlags()
    this.setState({loading: true}, () => {
      fetch(URL, requestParams)
      .then(response => response.json())
      .then(data => {
        this.setState({
          loading: false,
          message: data.message
        })
        if (data.success) {
          if (type === "save") {
            this.setState({
              saveSuccess: true,
              newGardenSubmitted: true
            })
            this.context.functions.setCurrentOption(this.state.name)
          }
          else {
            this.setState({
              updateSuccess: true
            })
          }
        }
        else {
          if (type === "save") {
            this.setState({
              saveFailure: true
            })
          }
          else {
            this.setState({
              updateFailure: true
            })
          }
        }
      })
      .catch(error => {
        this.setState({
          loading: false
        })
        if (type === "save") {
          this.setState({
            message: "ERROR: Could not save garden",
            saveFailure: true
          })
        }
        else {
          this.setState({
            message: "ERROR: Could not update garden",
            updateFailure: true
          })
        }
      })
    })

  }

  setName = (event) => {
    this.setState({
      name: event.target.value
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

  sendName = () => {
    if (this.checkName()) {
      this.setState({
        saveFailure: false,
        message: "",
      })
      this.context.functions.setName(this.state.name)
    }
    else {
      this.setState({
        saveFailure: true,
        message: "ERROR: Invalid name"
      })
    }
  }

  sendEmail = () => {
    if (this.checkEmail()) {
      this.setState({
        saveFailure: false,
        message: ""
      })
      this.context.functions.setEmail(this.state.email)
    }
    else {
      this.setState({
        saveFailure: true,
        message: "ERROR: Invalid email"
      })
    }
  }

  sendZip = () => {
    if (this.checkZip()) {
      this.setState({
        saveFailure: false,
        message: ""
      })
      this.context.functions.setZip(this.state.zip)
    }
    else {
      this.setState({
        saveFailure: true,
        message: "ERROR: Invalid email"
      })
    }
  }

  checkName = () => {
    if (this.state.name.length > 0 && this.state.name.length < 50) {
      return true
    }
    else {
      return false
    }
  }

  checkEmail = () => {
    let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    if (emailRegex.test(this.state.email) && this.state.email.length < 50) {
      return true
    }
    else {
      return false
    }
  }

  checkZip = () => {
    return this.state.zip.length === 5 && /^\d+$/.test(this.state.zip)
  }

  disabled = () => {
    if (this.checkName() && this.checkEmail() && this.checkZip()) {
      return false
    }
    else {
      return true
    }
  }

  printLoading = () => {
    if (this.state.loading) {
      return (
        <div id="save-spinner">
          <Spinner
            height={60}
            width={40}
          />
        </div>
      )
    }
  }

  printMessage = (type) => {
    if (this.state.saveSuccess || this.state.saveFailure || this.state.updateSuccess || this.state.updateFailure) {
      let class_name
      if (type === "save") {
        class_name = "save"
        this.state.saveSuccess ? class_name += " success" : class_name += " failure"
      }
      else {
        class_name = "update"
        this.state.updateSuccess ? class_name += " success" : class_name += " failure"
      }
      return (
        <div
          className={class_name}
        >
          {this.state.message}
        </div>
      )
    }
  }

  printSaveForm = () => {
    let saveButton, updateButton
    if (this.state.saveSuccess || this.state.updateSuccess) {
      saveButton = updateButton = (
        <button
          className="save-load-button"
          onClick={() => this.close()}
        >
          Close
        </button>
      )
    }
    else {
      saveButton = (
        <button
          className="save-load-button"
          disabled={this.disabled()}
          style={{
            background: this.disabled() ? "gray" : "var(--green)",
            cursor: this.disabled() ? "default" : "pointer"
          }}
          onClick={() => this.saveSubmitted("save")}
        >
          Submit
        </button>
      )
      updateButton = (
        <button
          className="save-load-button"
          onClick={() => this.saveSubmitted("update")}
        >
          Submit
        </button>
      )
    }

    if (this.context.state.gardenLoaded) {
      return (
        <div id="save-form-wrapper">
          <div 
            style={{fontSize: "14pt"}}
          >
            Would you like to update {this.context.state.name}?
          </div>
          {this.printLoading()}
          {this.printMessage("update")}
          {updateButton}
        </div>
      )
    }
    else {
      return (
        <div id="save-form-wrapper">
          <input 
            type="text" 
            placeholder="Name your garden"
            value={this.state.name}
            onChange={this.setName.bind(this)}
            onBlur={this.sendName.bind(this)}
          >
          </input>
          <input 
            type="text" 
            placeholder="Email" 
            value={this.state.email}
            onChange={this.setEmail.bind(this)}
            onBlur={this.sendEmail.bind(this)}
          >
          </input>
          <input 
            type="zip" 
            placeholder="Zipcode"
            value={this.state.zip}
            onChange={this.setZip.bind(this)}
            onBlur={this.sendZip.bind(this)}
          >
          </input>
          {this.printLoading()}
          {this.printMessage("save")}
          {saveButton}
        </div>
      )
    }
  }

  render = () => {
    return (
      <SavePopup
        open={this.state.open}
        onClose={this.close.bind(this)}
      >
        <button
          className="close-button"
          onClick={this.close.bind(this)}
        >
          &times;
        </button>
        <h1 className="menu-heading">Save Your Garden</h1>
        {this.printSaveForm()}
      </SavePopup>
    )
  }

}

Save.contextType = GardenContext

export default Save