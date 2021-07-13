import {Button} from "react-bootstrap";

const Cell = (props) => {

  
  return (
      <>
        { (props.is_header ? <th>{props.cell}</th> : <td> {props.cell}  </td>) }
      </>
  )
}

export default Cell