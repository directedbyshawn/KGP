import "./Wrapper.css"
import "../../assets/SaveLoad.css"
import { Component, Fragment } from "react"
import { BrowserRouter, Routes, Route, Link } from "react-router-dom"
import Title from "./Title/Title"
import BedPlanner from "../BedPlanner/BedPlanner"
import GardenPlanner from "../GardenPlanner/GardenPlanner"

class Wrapper extends Component {

  constructor() {
    super()
    this.state = {
      onBed: true
    }
  }

  printSelector() {
    return (
      <div id="page-selector-wrapper">
        <div id="page-selector">
          <Link 
            to={"/bed"}
            style={{
              color: this.state.onBed ? "white" : "var(--green)",
              textDecoration: "none"
            }}
          >
            <div 
              id="bed-option"
              className="page-option"
              onClick={() => {this.setState({onBed: true})}}
              style = {{
                backgroundColor: this.state.onBed ? "var(--green)" : "white",
                color: this.state.onBed ? "white" : "var(--green)"
              }}
            >
              Plan a single bed
            </div>
          </Link>
          <Link 
            to={"/garden"}
            style={{
              color: !this.state.onBed ? "white" : "var(--green)",
              textDecoration: "none"
            }}
          >
            <div 
              id="garden-option"
              className="page-option"
              onClick={() => {this.setState({onBed: false})}}
              style = {{
                backgroundColor: this.state.onBed ? "white" : "var(--green)",
                color: this.state.onBed? "var(--green)" : "white"
              }}
            >
              Plan your entire garden
            </div>
          </Link>
        </div>
      </div>
    )
  }

  render() {
    return (
      <Fragment>
        <div id="main-container">
          <BrowserRouter>
            <div id="top">
              <div id="top-wrapper">
                <Title />
                {this.printSelector()}
              </div>
            </div>
            <div id="bottom">
              <Routes>
                <Route path="/" element={<BedPlanner />} />
                <Route path="bed" element={<BedPlanner />} />
                <Route path="garden" element={<GardenPlanner />} />
              </Routes>
            </div>
          </BrowserRouter>
        </div>
      </Fragment>
    )
  }

}

export default Wrapper