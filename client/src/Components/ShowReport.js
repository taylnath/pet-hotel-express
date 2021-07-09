function Reports(props) {
  console.log("props = ", props, props.title)
  return (
      <div>
        <p>And not just any report...</p>
        <h1>I am a {props.title} report!!</h1>
        <p>headers = {JSON.stringify(props.headers)}</p>
        <p>attributes = {JSON.stringify(props.attributes)}</p>
        <p>employees = {JSON.stringify(props.employees)}</p>
        
      </div>

  );
}

export default Reports;