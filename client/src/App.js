import { useContext } from 'react';
import Home from './pages/home/Home'
import Profile from './pages/profile/Profile';
import Login from './pages/login/Login';
import Register from './pages/register/Register'
import Messenger from './pages/messenger/Messenger';
import {
  BrowserRouter as Router,
  Switch,
  Route,
Redirect
  
} from "react-router-dom";
import {AuthContext} from './components/context/AuthContext'

function App() {

const {user} =useContext(AuthContext);


  return (
    <Router>
      <Switch>

        <Route exact path="/">
          {user ? <Home /> : <Register/>}
        </Route>

        <Route path="/login">
          {user ? <Redirect to="/" />: <Login />}
        </Route>
        <Route path="/register">
          
          {user ? <Redirect to="/" />: <Register />}

        </Route>
        <Route path="/messenger">
          
        {!user ? <Redirect to="/" /> : <Messenger />}

        </Route>
        <Route path="/profile/:username">
          <Profile />
        </Route>


      </Switch>

    </Router>
  );
}

export default App;
