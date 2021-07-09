import {Container, Row, Col, Card, Image} from "react-bootstrap";
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
    employeeID: "ID",
    firstName: "First Name",
    lastName: "Last Name",
    jobTitle: "Job Title"
  }
  const attributes = ["employeeID", "firstName", "lastName", "jobTitle"]
  
  useEffect(() => {
    fetchState(`${serverURL}/api/getReport`, setIsLoaded, setEmployees, setError);
  }, []);
  
  if (error) return <div>Error: {error.message}</div>;
  else if (!isLoaded) return <div>Loading...</div>;
  else return (
      <div>
        <Container>
        <h1>Employees</h1>
        </Container>
        <Container>
          <h2>
          I am an add/update form!
          </h2>
        </Container>
        <Container>
          I am a report!
          <ShowReport title="Employee List"
                      headers={headers}
                      attributes={attributes}
                      employees={employees}/>
          <p>
            Here is the data: {JSON.stringify(employees)}.
          </p>
        </Container>

      </div>
  );
}

export default Employees;