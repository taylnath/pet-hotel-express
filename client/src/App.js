import { Navbar } from './Components/Navbar';
import { Switch, Route, Link, BrowserRouter as Router } from 'react-router-dom';
import  Admin  from './Routes/Admin';
import  Employees  from './Routes/Employees';
import  Rooms  from './Routes/Rooms';
import  Bookings  from './Routes/Bookings';
import  Reports  from './Routes/Reports';
import  Reservations  from './Routes/Reservations';
import Guests from './Routes/Guests';
import Home from './Routes/Home';
import Test from './Routes/Test';
import {useState, useEffect} from "react";
import superUser from './Models/superUser';
import {Toast} from 'react-bootstrap';
import {ReactComponent as Logo} from './Components/images/fabicon.svg';

function App() {
  
  {/* this allows app to know who is logged in (user), with what privileges */}
  const [user, setUser] = useState(superUser);
  const [showToast, setShowToast] = useState(true);

  return (
    <div className="App">

      {/* toast to remind about titles */}
      <Toast 
      style={{position: "absolute", right: 0, top: 0, margin: "5%", zIndex: 999}}
      show={showToast} onClose={() => setShowToast(false)}>
          <Toast.Header>
            <Logo
            width="30"
            height="30"
            className="d-inline-block align-top"
            alt="Pet Hotel Logo"
          />
            <span className="ml-2 mr-auto"><strong>Pet Hotel</strong> says:</span>
          </Toast.Header>
          <Toast.Body>Hover over the navbar links to see descriptive titles of each page!</Toast.Body>
        </Toast>
      {/* toast to remind about titles */}

      <Router>
      <Navbar user={user} setUser={setUser} />
      <header className="App-header">
      </header>
    {/* the route paths match the to="..." attributes from the Links in Navbar */}
    <Switch>
      <Route path="/Reservations">
        <Reservations user={user} setUser={setUser}/> {/* todo: does user need to be a prop? */}
      </Route>
      <Route path="/Reports">
        <Reports/>
      </Route>
      <Route path="/Admin">
        <Admin/>
      </Route>
      <Route path="/Employees">
        <Employees />
      </Route>
      <Route path="/Rooms">
        <Rooms />
      </Route>
      <Route path="/Bookings">
        <Bookings />
      </Route>
      <Route path="/Test">
        <Test/>
      </Route>
      <Route path="/Guests">
        <Guests/>
      </Route>
      {/* the root route apparently needs to go here so it doesn't eat the other routes */}
      <Route path="/">
        <Home/>
      </Route>
    </Switch>
    </Router>
    </div>
  );
}

export default App;
