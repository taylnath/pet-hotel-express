import {Button} from "react-bootstrap";

const Cell = (props) => {

  
  return (
      <>
        { props.row_index === 0 ? <th>{props.cell}</th> : <td> {props.cell}  </td> }
      </>
  )
}

export default Cell