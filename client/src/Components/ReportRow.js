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
                             index={index}
                             cell={cell} />
              )
          )}
        </tr>
         {/* <Button variant={"danger"}*/}
         {/*          onClick={() => onDelete(row.id)}>Delete*/}
         {/*</Button>*/}
         
        
      </>
  )
}

export default ReportRow