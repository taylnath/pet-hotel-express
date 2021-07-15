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

function App() {
  
  {/* this allows app to know who is logged in (user), with what privileges */}
  const [user, setUser] = useState(superUser);

  return (
    <div className="App">
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
