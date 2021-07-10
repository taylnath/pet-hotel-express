import ReportRows from "./ReportRows";

function Reports(props) {

  return (
      <>
        <ReportRows report_rows={props.report_rows} attributes={props.attributes} />
      </>
  );
}

export default Reports;