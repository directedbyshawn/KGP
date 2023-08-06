import { Component, Fragment } from "react"
import { SavePopup } from "../../Popups"
import { BedEmitter } from "../../../utils/EventEmitter"
import BedContext from "../BedContext"
import Spinner from "../../Spinner"

class Save extends Component {

  constructor() {

    super()

    this.state = {

      // component state
      open: false,
      bedLoaded: false,
      loading: false,
      
      // bed name
      name: "",
      email: "",
      zip: "",

      // message returned from request
      message: "",
      
      // flags
      newBedSubmitted: false,
      saveSuccess: false,
      saveFailure: false,
      updateSuccess: false,
      updateFailure: false,

    }

    const open = BedEmitter.addListener("openSave", this.open.bind(this))

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

    // after closing menu for the first time after 
    // saving, user will now be prompted to update bed
    if (this.state.newBedSubmitted) {
      this.context.functions.bedLoaded()
    }
    this.setState({
      open: false,
      newBedSubmitted: false,
      saveSuccess: false,
      saveFailure: false,
      updateSuccess: false,
      updateFailure: false
    })

  }

  resetFlags = () => {
    this.setState({
      saveSuccess: false,
      saveFailure: false,
      updateSuccess: false,
      updateFailure: false
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

  updateName = () => {
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
        message: "ERROR: Invalid name",
      })
    }
  }

  updateEmail = () => {
    // input validation
    if (this.checkEmail()) {
      this.setState({
        saveFailure: false,
        message: "",
      })
      this.context.functions.setEmail(this.state.email)   
    }
    else {
      this.setState({
        saveFailure: true,
        message: "ERROR: Invalid email",
      }) 
    }
  }

  updateZip = () => {
    if (this.checkZip()) {
      this.setState({
        saveFailure: false,
        message: "",
      })
      this.context.functions.setZip(this.state.zip)
    }
    else {
      this.setState({
        saveFailure: true,
        message: "ERROR: Invalid zip",
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

  saveSubmitted = () => {
    this.resetFlags()
    if (!this.disabled()) {
      this.save("save")
    }
    else {
      this.setState({
        saveFailure: true,
        message: "ERROR: Invalid name, email, or zip"
      })
    }
  }

  updateSubmitted = () => {
    this.resetFlags()
    this.save("update")
  }

  save = (type) => {

    const requestParams = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: this.context.state.name,
        email: this.context.state.email,
        zip: this.context.state.zip,
        model: this.context.state.model,
        notes: this.context.state.notes
      })
    }

    // route request
    const DOMAIN = `${this.context.state.address}`
    let endpoint = `api/v1/beds/`
    type === "save" ? endpoint += "saveBed" : endpoint += "updateBed"
    const URL = `${DOMAIN}${endpoint}`

    // send request to save new bed
    this.setState({
      loading: true,
      saveFailure: false,
      updateFailure: false
    }, () => {
      fetch(`${URL}`, requestParams)
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
              newBedSubmitted: true
            })
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
        // error saving/updating bed
        this.setState({
          loading: false,
        })
        if (type === "save") {
          this.setState({
            message: "ERROR: Could not save bed",
            saveFailure: true,
          })
        }
        else {
          this.setState({
            message: "ERROR: Could not update bed",
            updateFailure: true
          })
        }
      })
    })
  }

  printLoading() {
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

  printSaveButton() {
    if (!this.state.saveSuccess) {
      return (
        <Fragment>
          <button 
            className="save-load-button" 
            onClick={this.saveSubmitted.bind(this)}
            disabled={this.disabled()}
            style={{
              background: this.disabled() ? "gray" : "var(--green)",
              cursor: this.disabled() ? "default" : "pointer"
            }}
          >
            Submit
          </button>
        </Fragment>
      )
    }
    else {
      return (
        <Fragment>
          <button 
            className="save-load-button" 
            onClick={this.close.bind(this)}
          >
            Close
          </button>
        </Fragment>
      )
    }
  }

  printUpdateButton() {
    if (!this.state.updateSuccess) {
      return (
        <Fragment>
          <button 
            className="save-load-button" 
            onClick={this.updateSubmitted.bind(this)}
          >
            Submit
          </button>
        </Fragment>
      )
    }
    else {
      return (
        <Fragment>
          <button 
            className="save-load-button" 
            onClick={this.close.bind(this)}
          >
            Close
          </button>
        </Fragment>
      )
    }
  }

  printSaveForm() {

    if (this.context.state.bedLoaded) {
      return (
        <div id="save-form-wrapper">
          <div style={{
            fontSize: "14pt",
            textAlign: "center"
          }}>
            Would you like to update {this.context.state.name}?
          </div>
          {this.printLoading()}
          {this.printMessage("update")}
          {this.printUpdateButton()}
        </div>
      )
    }
    else {
      return (
        <div id="save-form-wrapper">
          <input 
            type="text" 
            placeholder="Name your bed"
            value={this.state.name}
            onChange={(this.setName.bind(this))}
            onBlur={this.updateName.bind(this)}
          >
          </input>
          <input 
            type="text" 
            placeholder="Email" 
            value={this.state.email}
            onChange={this.setEmail.bind(this)}
            onBlur={this.updateEmail.bind(this)}
          >
          </input>
          <input 
            type="zip" 
            placeholder="Zipcode"
            value={this.state.zip}
            onChange={this.setZip.bind(this)}
            onBlur={this.updateZip.bind(this)}
          >
          </input>
          {this.printLoading()}
          {this.printMessage("save")}
          {this.printSaveButton()}
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

  render() {

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
        <h1 className="menu-heading">Save Your Bed</h1>
        {this.printSaveForm()}
      </SavePopup>
    )

  }

}

Save.contextType = BedContext

export default Save