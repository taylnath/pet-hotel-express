// adapted from Traversy Media React Crash Course https://github.com/bradtraversy/react-crash-2021

import {Table} from "react-bootstrap";
import ReportRow from './ReportRow'

const ReportRows = (props) => {
  return (
      <>
        <Table striped bordered={true} hover={true}>
          <thead>
          {props.headers.map((row, index) => (
                  <ReportRow key = {index}
                             index={index}
                             row={row}
                             is_header={true}
                             attributes={props.attributes}
                             onUpdate={props.onUpdate}
                             onDelete={props.onDelete} />
              )
          )}
          </thead>
          <tbody>
            {props.report_rows.map((row, index) => (
                  <ReportRow key = {index}
                             index={index}
                             row={row}
                             is_header={false}
                             attributes={props.attributes}
                             onUpdate={props.onUpdate}
                             onDelete={props.onDelete} />
              )
          )}
          </tbody>
        </Table>
      </>
  )
}

export default ReportRows;