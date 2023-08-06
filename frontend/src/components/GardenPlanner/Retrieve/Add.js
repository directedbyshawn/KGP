import { Component } from "react"
import { LoadPopup } from "../../Popups"
import { GardenEmitter } from "../../../utils/EventEmitter"
import GardenContext from "../GardenContext"
import BedResult from "./BedResult"
import Spinner from "../../Spinner"

class Add extends Component {

  constructor() {
    super()
    this.state = {
      open: false,
      loading: false,
      email: "",
      zip: "",
      beds: [],
      public: false,
      publicBeds: []
    }
    const open = GardenEmitter.addListener(
      "openAdd", 
      this.open.bind(this)
    )
    const close = GardenEmitter.addListener(
      "closeAdd",
      this.close.bind(this)
    )
  }

  open = () => {
    this.setState({
      open: true,
      email: this.context.state.email,
      zip: this.context.state.zip
    })
  }

  close = () => {
    this.setState({
      open: false
    })
  }

  updateEmail = (event) => {
    this.setState({
      email: event.target.value
    })
  }

  updateZip = (event) => {
    this.setState({
      zip: event.target.value
    })
  }

  sendEmail = () => {
    this.context.functions.setEmail(this.state.email)
  }

  sendZip = () => {
    this.context.functions.setZip(this.state.zip)
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
    return (
      <div 
        id="results-side"
        className="add-results-side"
      >
        <div id="add-page-selector">
          <div
            className="page-option add"
            onClick={() => {this.setState({public: false})}}
            style={{
              backgroundColor: this.state.public ? "white" : "var(--green)",
              color: this.state.public ? "var(--green)" : "white"
            }}
          >
            Personal
          </div>
          <div
            onClick={() => {
              this.setState({public: true})
              this.getPublic()
            }}
            className="page-option add"
            
            style={{
              backgroundColor: this.state.public ? "var(--green)" : "white",
              color: this.state.public ? "white" : "var(--green)"
            }}
          >
            Public
          </div>
        </div>
        {this.state.public ? this.printPublic() : this.printPersonal()}
      </div>
    )
  }

  getPublic = () => {
    if (this.state.publicBeds.length === 0) {
      const URL = `${this.context.state.address}api/v1/beds/getPublicBeds`
      this.setState({loading: true}, () => {
        fetch(URL)
        .then(response => response.json())
        .then(data => {
          let publicBeds = []
          for (let i = 0; i < data.results.length; i++) {
            let curr = data.results[i]
            publicBeds.push({
              name: curr.name,
              model: curr.model,
              notes: curr.notes,
              info: curr.info ? curr.info : null
            })
          }
          this.setState({
            loading: false,
            publicBeds: publicBeds
          })
        })
        .catch(error => {
          this.setState({
            loading: false
          })
        })
      })  
    }
  }

  printPublic = () => {
    
    if (this.state.loading) {
      return (
        <div id="personal-results">
          <div id="result-load-container">
            <div id="result-load-wrapper">
              {this.printLoading()}
            </div>
          </div>  
        </div>
      )
    }
    else if (this.state.publicBeds.length === 0) {
      return (
        <div id="personal-results">
          <div id="no-results-found">
            <p>No Results Found</p>
          </div>  
        </div>
      )
    }
    else {
      return (
        <div id="results-found-add">
          <div id="result-side-add">
            <div id="results-wrapper-add">
              {this.state.publicBeds.map((result) => {
                return (
                  <BedResult 
                    bed={result}
                    key={result.name}
                  />
                )
              })}
            </div>
          </div>
        </div>
      )
    }
  }

  printPersonal = () => {
    if (this.state.loading) {
      return (
        <div id="personal-results">
          <div id="result-load-container">
            <div id="result-load-wrapper">
              {this.printLoading()}
            </div>
          </div>  
        </div>
      )
    }
    else if (this.state.beds.length === 0) {
      return (
        <div id="personal-results">
          <div id="no-results-found">
            <p>No Results Found</p>
          </div>  
        </div>
      )
    }
    else {
      return (
        <div id="results-found-add">
          <div id="result-side-add">
            <div id="results-wrapper-add">
              {this.state.beds.map((result) => {
                return (
                  <BedResult 
                    bed={result}
                    key={result.name}
                  />
                )
              })}
            </div>
          </div>
        </div>
      )
    }
  }

  search = () => {
    const query = `email=${this.state.email}&zip=${this.state.zip}`
    this.setState({loading: true}, () => {
      fetch(`${this.context.state.address}api/v1/beds/getBeds?${query}`)
      .then(response => response.json())
      .then(data => {
        let newBeds = []
        for (let i = 0; i < data.results.length; i++) {
          let curr = data.results[i]
          newBeds.push({
            name: curr.name,
            model: curr.model,
            notes: curr.notes
          })
        }
        this.setState({
          loading: false,
          beds: newBeds
        })
      })
      .catch(error => {
        this.setState({
          loading: false
        })
      })
    })
  }

  render = () => {
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
        <h1 className="menu-heading">
          Add a Bed
        </h1>
        <div id="load-menu-wrapper">
          <div
            id="search-side"
            style={{height: "100%"}}
          >
            <div id="load-form-wrapper">
              <h2>Information</h2>
              <input 
                type="text"
                placeholder="Email"
                onChange={this.updateEmail.bind(this)}
                onBlur={this.sendEmail.bind(this)}
                value={this.state.email}
              />
              <input 
                type="text"
                placeholder="Zip"
                onChange={this.updateZip.bind(this)}
                onBlur={this.sendZip.bind(this)}
                value={this.state.zip}
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

Add.contextType = GardenContext

export default Add
