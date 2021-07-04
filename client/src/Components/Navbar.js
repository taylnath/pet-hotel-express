import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { ReactComponent as Logo } from './fabicon.svg';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

function CustomNavbar() {
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
      </Navbar>
  );
}

export { CustomNavbar as Navbar };