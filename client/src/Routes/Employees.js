import {Container, Row, Col, Card, Image} from "react-bootstrap";
import settings from "../appSettings";
import {useEffect, useState} from "react";
import fetchState from "../DataAccess/fetchState";

const serverURL = settings.serverURL;


function Employees(props) {
  const [employees, setEmployees] = useState({});
  
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  
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
          I am an add/update form!
        </Container>
        <Container>
          I am a report!
          <p>
            Here is the data: {JSON.stringify(employees)}.
          </p>
        </Container>

      </div>
  );
}

export default Employees;