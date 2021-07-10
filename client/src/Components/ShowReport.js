import ReportRows from "./ReportRows";

function Reports(props) {

  return (
      <div>
        <ReportRows report_rows={props.report_rows} attributes={props.attributes} />
      </div>
  );
}

export default Reports;