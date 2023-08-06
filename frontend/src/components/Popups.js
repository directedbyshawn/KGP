import "reactjs-popup/dist/index.css"
import Popup from "reactjs-popup"
import styled from "styled-components"

const SavePopup = styled(Popup)`
  &-content {
    width: 50%;
  }
`

const LoadPopup = styled(Popup)`
  &-content {
    width: 90%;
    height: 50%;
    max-height: 50%;
  }
`

const DeletePopup = styled(Popup)`
  &-content {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 55%;
    height: 27%;
  }
`

const ResetPopup = styled(Popup)`
  &-content {
    width: 55%;
    height: 23%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`

const NotesPopup = styled(Popup)`
  &-content {
      width: 90%;
      height: 80%;
  }
`

const PlantingGuidePopup = styled(Popup)`
  &-content {
    width: 90%;
    height: 80%;
  }
`

export { 
  SavePopup, LoadPopup, DeletePopup, 
  ResetPopup, NotesPopup, PlantingGuidePopup 
}
