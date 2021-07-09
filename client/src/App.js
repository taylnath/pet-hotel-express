import { Navbar } from './Components/Navbar';
import { Switch, Route, Link, BrowserRouter as Router } from 'react-router-dom';
import  Admin  from './Routes/Admin';
import  Employees  from './Routes/Employees';
import  Rooms  from './Routes/Rooms';
import  Reports  from './Routes/Reports';
import  Reservations  from './Routes/Reservations';
import Home from './Routes/Home';
import Test from './Routes/Test';
import {useState, useEffect} from "react";
import blankUser from './Models/UserModel';

function App() {
  
  {/* this allows app to know who is logged in (user), with what privileges */}
  const [user, setUser] = useState(blankUser);

  return (
    <div className="App">
      <Router>
      <Navbar user={user} setUser={setUser} />
      <header className="App-header">
        Hello, {user.firstName || "nobody"}. You are a {user.type || "nobody"}.
      </header>
    {/* the route paths match the to="..." attributes from the Links in Navbar */}
    {/* TODO: I think the routes should be lowercase */}
    <Switch>
      <Route path="/Reservations">
        <Reservations user={user} setUser={setUser}/>
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
      <Route path="/Test">
        <Test/>
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
