import {Button} from "react-bootstrap";

const Cell = (props) => {

  
  return (
      <>
        <td>
          {props.cell}
        </td>
        {/* <Button variant={"danger"}*/}
        {/*          onClick={() => onDelete(row.id)}>Delete*/}
        {/*</Button>*/}
      
      
      </>
  )
}

export default Cell