// adapted from Traversy Media React Crash Course https://github.com/bradtraversy/react-crash-2021

import {Button, Table} from "react-bootstrap";
import Cell from './Cell'
import {useState} from "react";

const ReportRow = (props) => {

  const [isLoading, setLoading] = useState(false)     // for Button
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
          {props.onUpdate && <Cell is_header={props.is_header}
                                   cell={props.is_header ? "Update" :
                                       (<Button onClick={() =>
                                       {
                                         props.onUpdate(props.row)}}
                                                variant={"success"}
                                                size={"sm"}
                                                disabled={isLoading}>
                                         {isLoading? "Processing ..." : "Update"}
                                       </Button>)}
                                   onUpdate={props.onUpdate}/>}
          {props.onDelete && <Cell is_header={props.is_header}
                                   cell={props.is_header ? "Delete" :
                                       (<Button onClick={() =>
                                       {setLoading(!isLoading)
                                           props.onDelete(props.row)}}
                                                variant={"danger"}
                                                size={"sm"}
                                       disabled={isLoading}>
                                         {isLoading? "Processing ..." : "Delete"}
                                       </Button>)}
                                   onDelelete={props.onDelete}/>}
        </tr>
        
         {/* <Button variant={"danger"}*/}
         {/*          onClick={() => onDelete(row.id)}>Delete*/}
         {/*</Button>*/}
         
        
      </>
  )
}

export default ReportRow