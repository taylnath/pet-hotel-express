import {
  Navbar, Nav, NavDropdown, Button, Modal, DropdownButton, Container,
  Row, Col
} from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { ReactComponent as Logo } from './fabicon.svg';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import DropdownItem from "react-bootstrap/DropdownItem";
import settings from "../appSettings";
import Login  from './Login'
import blankUser from '../Models/UserModel';
const serverURL = settings.serverURL;

function CustomNavbar(props) {
  
  {/* modal magic - appear! - disappear!   */}

  const[loginVisible, setLoginVisible] = useState(false);
  
  const logOut = () => props.setUser(blankUser);
  const ownerLogin = () => {
    props.setUser({...props.user, type: "owner"});
    setLoginVisible(true);
  };
  const employeeLogin = () => {
    props.setUser({...props.user, type: "employee"});
    setLoginVisible(true);
  };
  
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
          <NavDropdown hidden={props.user.type === "owner"}
                       id={"admin-nav-dropdown"}
                       title={"Admin"}>
            <NavDropdown.Item href="/Employees">Employees</NavDropdown.Item>
            <NavDropdown.Item href="/Rooms">Rooms</NavDropdown.Item>
          </NavDropdown>
          <Nav.Link as={Link} to="/Test">Test</Nav.Link>
          <NavDropdown title="Dropdown" id="basic-nav-dropdown">
          <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
          <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
          <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
        </NavDropdown>
        </Nav>
        <DropdownButton variant={props.user.logged_in ? "success" : "dark"}
                        title={props.user.logged_in ? props.user.firstName + " logged in" : "Log in"}>
          {props.user.logged_in ?
              <DropdownItem onClick={logOut}>Log Out</DropdownItem> :
              <DropdownItem onClick={employeeLogin}>Employee Login</DropdownItem>}
          {!props.user.logged_in && <DropdownItem onClick={ownerLogin}>Customer Login</DropdownItem>}
        </DropdownButton>
  
        {/* Modal for customer to log in; another modal will be for employees. */}
        {/* Upon login, button will change to show props.user name, and navbar menus will */}
        {/* be tailored to the props.user. TODO */}

        {/* TODO: how to move login to right of screen */}
        <Login
         user={props.user} 
         setUser={props.setUser} 
         loginVisible={loginVisible} 
         setLoginVisible={setLoginVisible}
        />
      </Navbar>
      
      
  );
}

export { CustomNavbar as Navbar };