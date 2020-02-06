import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
    Link
  } from 'react-router-dom';
  import { createBrowserHistory } from 'history';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import './App.css';

import NavBar from './NavBar.js';
import ResetPasswordDialog from './ResetPasswordDialog.js';

// Firebase imports
import firebase, { auth, provider } from './Firebase.js'
import Login from './pages/Login';
import Register from './pages/Register';
import Boards from './pages/Boards';
import Board from './pages/Board';

function loginWithGoogle() {
    auth.signInWithPopup(provider).then(function(result) {
        var user = result.user;
        console.log(user);
        // ...
      }).catch(function(error) {
        console.log(error);
      });
      
}

const useStyles = makeStyles(theme => ({
}));

function App() {
    const classes = useStyles();
    const history = createBrowserHistory();

    return (
        <Router>
            <NavBar location={history.location.pathname} />
            <Switch>
                <Route path='/login'>
                    <Login />
                </Route>
                <Route path='/register'>
                    <Register />
                </Route>
                <Route path='/boards'>
                    <Boards />
                </Route>
                <Route path='/board'>
                    <Board />
                </Route>
                <Route path='/'>
                    <Redirect to='/login' />
                </Route>
            </Switch>
        </Router>


        //     <div>
        //         <br /><br /><br /><br />everything below is a testing area<br /><br /><br /><br />
        //         <p>Boards page WIP:</p>
        //         <NavBar />
        //         <BoardsActions />
        //         <BoardCardCollection />
        //         <p>Board page WIP:</p>
        //         <NavBar onBoardPage='true' />
        //         <BoardActions/>
        //         <ColumnGroup />
        //         <p>Board settings page WIP:</p>
        //         <NavBar />
        //         <BoardSettingsBreadcrumbs boardName='Placeholder name' />
        //         <BoardSettings />
        //     </div>
        // </div>
    );
}

export default App;
