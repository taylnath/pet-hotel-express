// adapted from Traversy Media React Crash Course https://github.com/bradtraversy/react-crash-2021

import {Table} from "react-bootstrap";
import ReportRow from './ReportRow'

const ReportRows = (props) => {
  return (
      <>
        <Table striped bordered={true} hover={true}>
          <tbody>
            {props.report_rows.map((row, index) => (
                  <ReportRow key = {index}
                             index={index}
                             row={row}
                             attributes={props.attributes} />
              )
          )}
          </tbody>
        </Table>
      </>
  )
}

export default ReportRows;