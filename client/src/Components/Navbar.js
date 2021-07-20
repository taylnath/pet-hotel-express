import {
  Navbar, Nav, NavDropdown, Button, Modal, DropdownButton, Container,
  Row, Col
} from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { ReactComponent as Logo } from './images/fabicon.svg';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import DropdownItem from "react-bootstrap/DropdownItem";
import Login  from './Login'
import superUser from '../Models/superUser';

function CustomNavbar(props) {
  
  {/* modal magic - appear! - disappear!   */}

  const[loginVisible, setLoginVisible] = useState(false);
  
  const logOut = () => props.setUser(superUser);
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
        <Navbar.Brand as={Link} to="/"
          title="Our Homepage"
        >
          <Logo
            width="30"
            height="30"
            className="d-inline-block align-top"
            alt="Pet Hotel Logo"
          />{' '}
          Pet Hotel
        </Navbar.Brand>
        <Nav>
          <Nav.Link as={Link} to="/Reservations" 
            title="Reservations page for owners--create, read, update and delete reservations for one specific Owner."
          >Reservations</Nav.Link>
          <Nav.Link as={Link} to="/Reports"
            title="Make reports, of course!"
          >Reports</Nav.Link>
          {/* <NavDropdown hidden={props.user.type === "owner"}
                       id={"admin-nav-dropdown"}
                       title={"Admin"}>
            <NavDropdown.Item href="/Bookings">Bookings</NavDropdown.Item>
            <NavDropdown.Item href="/Employees">Employees</NavDropdown.Item>
            <NavDropdown.Item href="/Rooms">Rooms</NavDropdown.Item>
          </NavDropdown> */}
          <Nav.Link as={Link} to="/Bookings" 
            title="Create, read, update, and delete Bookings for the Hotel"
          >Bookings</Nav.Link>
          <Nav.Link as={Link} to="/Employees"
            title="Create, read, update, and delete Employees of the Hotel"
          >Employees</Nav.Link>
          <Nav.Link as={Link} to="/Rooms"
            title="Create, read, update, and delete Rooms of the Hotel"
          >Rooms</Nav.Link>
          <Nav.Link as={Link} to="/Owners"
            title="Create, read, update, and delete Owners of the Hotel"
          >Owners</Nav.Link>
          <Nav.Link as={Link} to="/Pets"
            title="Create, read, update, and delete Pets of the Hotel"
          >Pets</Nav.Link>
          <Nav.Link as={Link} to="/Guests"
            title="Create, read, update, and delete relationships (i.e. the Guests table) between Pets and Owners (without affecting the Pets or Owners tables)."
          >Guests</Nav.Link>

          <Nav.Link as={Link} to="/Test"
            title="This page is for testing new features. Nothing to see here..."
          >Test</Nav.Link>
        </Nav>

        {/* login button */}
        <DropdownButton 
          variant={props.user.logged_in ? "success" : "dark"}
          title={props.user.logged_in ? props.user.firstName + " logged in" : "Log in"}
          className="ml-auto"
        >
          {props.user.logged_in ?
              <DropdownItem onClick={logOut}>Log Out</DropdownItem> :
              <DropdownItem onClick={employeeLogin}>Employee Login</DropdownItem>}
          {!props.user.logged_in && <DropdownItem onClick={ownerLogin}>Customer Login</DropdownItem>}
        </DropdownButton>
  
        {/* Modal for customer to log in; another modal will be for employees. */}
        {/* Upon login, button will change to show props.user name, and navbar menus will */}
        {/* be tailored to the props.user. TODO */}

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