import ReportRows from "./ReportRows";

function Reports(props) {

  return (
      <>
        <ReportRows report_rows={props.report_rows}
                    headers={[props.headers]}
                    attributes={props.attributes}
                    onUpdate={props.onUpdate}
                    onDelete={props.onDelete} />
      </>
  );
}

export default Reports;