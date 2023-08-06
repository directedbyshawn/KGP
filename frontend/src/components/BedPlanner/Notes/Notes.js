import "./Notes.css"
import { NotesPopup } from "../../Popups"
import { Component, Fragment } from "react"
import BedContext from "../BedContext"

class Notes extends Component {

  constructor() {
    super()
    this.state = {
      open: false,
      notes: ""
    }
  }

  open = () => {
    this.setState({
      open: true,
      notes: this.context.state.notes
    })
  }

  close = () => {
    this.setState({
      open: false
    })
    this.context.functions.setNotes(this.state.notes)
  }

  update = (event) => {
    this.setState({
      notes: event.target.value
    })
  }

  render = () => {
    return (
      <Fragment>
        <button
          id="open-notes"
          onClick={this.open.bind(this)}
        >
          Notes
        </button>
        <NotesPopup
          open={this.state.open}
          onClose={this.close.bind(this)}
        >
          <button
            className="close-button"
            onClick={this.close.bind(this)}
          >
            &times;
          </button>
          <h1 className="menu-heading">Notes</h1>
          <div id="text-wrapper">
            <textarea
              value={this.state.notes}
              onChange={this.update.bind(this)}
              maxLength="1500"
              placeholder="Make notes about your bed here!"
            >
            </textarea>
          </div>
        </NotesPopup>
      </Fragment>
    )
  }

}

Notes.contextType = BedContext

export default Notes