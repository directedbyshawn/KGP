import { Component, Fragment } from "react"
import { ResetPopup } from "../../Popups"
import GardenContext from "../GardenContext"

class Reset extends Component {

  constructor() {
    super()
    this.state = {
      open: false
    }
    
  }

  open() {
    this.setState({
      open: true
    })
  }

  close() {
    this.setState({
      open: false
    })
  }

  callReset() {
    this.context.functions.reset()
    this.setState({
      open: false
    })
  }

  render() {
    return (
      <Fragment>
        <button 
          type="button"
          id="reset-button"
          className="reset-buttons"
          onClick={this.open.bind(this)}
        >
          Reset
        </button>
        <ResetPopup
          open={this.state.open}
          onClose={this.close.bind(this)}
        >  
          <div id="reset-form-wrapper">
            <h1
              className="menu-heading"
              id="reset-menu-heading"
            >
              Reset Garden
            </h1>
            <h3>
              Are you sure you want to clear your garden?
            </h3>
            <button
              type="button"
              className="confirmation-buttons"
              onClick={this.callReset.bind(this)}
            >   
              Confirm
            </button>
            <button
              type="button"
              className="confirmation-buttons"
              onClick={this.close.bind(this)}
            >   
              Cancel
            </button>
          </div>
        </ResetPopup>
      </Fragment>
      
    )
  }

}

Reset.contextType = GardenContext

export default Reset