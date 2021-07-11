// adapted from Traversy Media React Crash Course https://github.com/bradtraversy/react-crash-2021

import {Button, Table} from "react-bootstrap";
import Cell from './Cell'

const ReportRow = (props) => {

  let cells =[]
  for (let attribute of props.attributes) {
    cells = [...cells, props.row[attribute]]
  }

  return (
      <>
        <tr>
          {cells.map((cell, index) => (
                  <Cell key = {index}
                        row_index={props.index}
                        is_header={props.is_header}
                        cell={cell} />
              )
          )}
          {props.onDelete && <Cell is_header={props.is_header}
                                   cell={"delete me"}
                                   onDelelete={props.onDelete}/>}
        </tr>
        
         {/* <Button variant={"danger"}*/}
         {/*          onClick={() => onDelete(row.id)}>Delete*/}
         {/*</Button>*/}
         
        
      </>
  )
}

export default ReportRow