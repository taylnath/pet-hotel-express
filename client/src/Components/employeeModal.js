import { useState, useEffect } from 'react';
import settings from '../appSettings';
import fetchState from '../DataAccess/fetchState';
import postState from '../DataAccess/postState';
import {
  Button, Modal, Container, Row, Col,
  Form
} from 'react-bootstrap';
import blankUser from '../Models/UserModel';
import { propTypes } from 'react-bootstrap/esm/Image';
const serverURL = settings.serverURL;
console.log(serverURL);

// adapted from https://reactjs.org/docs/faq-ajax.html
function EmployeeModal(props) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  
  async function addEmployee(e) {
    e.preventDefault();
    props.setShowModal(false);
    
    const url = serverURL + `/api/addEmployee`;
    console.log("Loaded?", loaded);
    console.log("Error?", error);
    console.log("new employee", firstName, lastName);
    
    let response = await postState(url, {
      firstName: firstName,
      lastName: lastName,
      jobTitle: jobTitle
    });
    let body = await response.json();
    console.log(body);
    console.log(props.switch);
    props.setSwitch(!props.switch);
  }
  
  return (
      <Modal animation={false} show={props.showModal} onHide={() => props.setShowModal(false)}>
        
        <Modal.Header closeButton>
          <Modal.Title>
            Add a New Employee
          </Modal.Title>
        </Modal.Header>
  
        <Modal.Body>
          <form onSubmit={addEmployee}>
            <Container fluid>
              
              <span>
                <label className={"col-form-label"}>
                  E-mail:
                </label>
                <input type={"text"} className={"form-control"}
                  id={"add-employee-first-name"} value={"chico"}
                  onChange={(e) => setFirstName(e.target.value)}/>
                </span>
        
            </Container>
            <Container className={"p-3"}>
              <Row>
                <Col>
                  <Button variant="primary" md={4} type={"submit"}>
                    Submit
                  </Button>
                </Col>
                <Col>
                  <Button variant="secondary" md={4} onClick={() => props.setShowModal(false)}>
                    Cancel
                  </Button>
                </Col>
              </Row>
            </Container>
          </form>
        </Modal.Body>
        <Modal.Footer>
        </Modal.Footer>
      </Modal>
  );
}

export default EmployeeModal;