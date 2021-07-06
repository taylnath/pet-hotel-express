import { Navbar } from './Components/Navbar';
import { Switch, Route, Link, BrowserRouter as Router } from 'react-router-dom';
import  Admin  from './Routes/Admin';
import  Reports  from './Routes/Reports';
import  Reservations  from './Routes/Reservations';
import Home from './Routes/Home';
import Test from './Routes/Test';
import {useState} from "react";

function App() {
  
  {/* this allows app to know who is logged in (user), with what privileges */}
  const[user, setUser] = useState({
    type: "",
    firstName: "",
    email: "",
    employeeID: null
  });
  
  return (
    <div className="App">
      <Router>
      <Navbar user = { user } setUser = { setUser } />
      <header className="App-header">
        Hello
      </header>
    {/* the route paths match the to="..." attributes from the Links in Navbar */}
    {/* TODO: I think the routes should be lowercase */}
    <Switch>
      <Route path="/Reservations">
        <Reservations/>
      </Route>
      <Route path="/Reports">
        <Reports/>
      </Route>
      <Route path="/Admin">
        <Admin/>
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
