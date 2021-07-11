import {Container, Row, Col, Card, Image, Button} from "react-bootstrap";
import settings from "../appSettings";
import {useEffect, useState} from "react";
import fetchState from "../DataAccess/fetchState";
import ShowReport from "../Components/ShowReport";

const serverURL = settings.serverURL;


function Employees(props) {
  const [employees, setEmployees] = useState([]);
  
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const headers = {
    employeeId: "Id",
    firstName: "First Name",
    lastName: "Last Name",
    jobTitle: "Job Title"
  }
  const attributes = ["employeeId", "firstName", "lastName", "jobTitle"]
  
  const onDelete = (row) => {
    // const employee_id =
    console.log("deleting Employee with ID# ", row.employeeId)
  }
  
  const onUpdate = (row) => {
    console.log("updateing Employee with ID # ", row.employeeId)
  }
  
  useEffect(() => {
    fetchState(`${serverURL}/api/getReport?tables=Employees`, setIsLoaded, setEmployees, setError);
  }, []);
  
  if (error) return <div>Error: {error.message}</div>;
  else if (!isLoaded) return <div>Loading...</div>;
  else return (
      <div>
        <Container>
        <h1 className={"mt-5 mb-3"}>Employees</h1>
        </Container>
        <Container>
          <h4>Add New Employee:</h4>
          <Button variant={"success"}>Add Employee</Button>
          <h4 className={"mt-4"}>Update Employee:</h4>
          <label className={"mr-3"}>Employee Id:</label>
          <input/>
        <Button className={"ml-3"}>Update</Button>
          <Button variant={"danger"} className={"ml-3"}>Delete</Button>
        </Container>
        <Container>
  
          <h4 className={"mt-5"}>Employee List:</h4>
          <ShowReport title="Employee List"
                      headers={headers}
                      attributes={attributes}
                      report_rows={employees}
                      onUpdate={onUpdate}
                      onDelete={onDelete}/>

        </Container>

      </div>
  );
}

export default Employees;