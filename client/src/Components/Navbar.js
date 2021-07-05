import {
  Navbar, Nav, NavDropdown, Button, Modal, DropdownButton, Container,
  Row, Col
} from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { ReactComponent as Logo } from './fabicon.svg';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import DropdownItem from "react-bootstrap/DropdownItem";

function CustomNavbar() {
  
  {/* modal magic - appear! - disappear!   */}

  const[showOwnerLogin, setShowOwnerLogin] = useState(false);
  const[showEmpLogin, setShowEmpLogin] = useState(false);
  
  const handleCloseOwn = () => setShowOwnerLogin(false);
  const handleOpenOwn = () => setShowOwnerLogin(true);
  const handleCloseEmp = () => setShowEmpLogin(false);
  const handleOpenEmp = () => setShowEmpLogin(true);
  
  {/* not sure if we want to make this a separate component (module to import) */}
  {/* TODO: do login as a fetch to verify Owner / Employee & return if Manager */}
  const logInOwner = (e) => {
    e.preventDefault()
    handleCloseOwn()
    console.log("Owner has logged in");    {/* TODO */}
  }
  
  return (
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand as={Link} to="/">
          <Logo
            width="30"
            height="30"
            className="d-inline-block align-top"
            alt="Pet Hotel Logo"
          />{' '}
          Pet Hotel
        </Navbar.Brand>
        <Nav>
          <Nav.Link as={Link} to="/Reservations">Reservations</Nav.Link>
          <Nav.Link as={Link} to="/Reports">Reports</Nav.Link>
          <Nav.Link as={Link} to="/Admin">Admin</Nav.Link>
          <Nav.Link as={Link} to="/Test">Test</Nav.Link>
          <NavDropdown title="Dropdown" id="basic-nav-dropdown">
          <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
          <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
          <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
        </NavDropdown>
        </Nav>
        <DropdownButton variant={"dark"} title={"Log in"}>
          <DropdownItem onClick={handleOpenOwn}>Customer Login</DropdownItem>
          <DropdownItem href={"/"}>Employee Login</DropdownItem>
        </DropdownButton>
  
        {/* Modal for customer to log in; another modal will be for employees. */}
        {/* Upon login, button will change to show user name, and navbar menus will */}
        {/* be tailored to the user. TODO */}
        
        <Modal show={showOwnerLogin} onHide={handleCloseOwn}>
          <Modal.Header closeButton>
            <Modal.Title>Owner Login</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={logInOwner}>
              <label className={"col-form-label"}>
                E-mail:
              </label>
      
              <input type={"email"} className={"form-control"} id={"owner-email"}/>
              <Container className={"p-3"}>
                <Row>
                  <Col>
                  <Button variant="primary" md={4} type={"submit"}>
                    Log in
                  </Button>
                  </Col>
                  <Col>
                  <Button variant="secondary" md={4} onClick={handleCloseOwn}>
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
        
      </Navbar>
      
      
  );
}

export { CustomNavbar as Navbar };