import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import { TailSpin } from "react-loader-spinner"
import { Component } from "react"

class Spinner extends Component {

  render = () => {
    return (
      <TailSpin 
        color="var(--green)"
        width={this.props.width}
        height={this.props.height}
      />
    )
  }

}

export default Spinner