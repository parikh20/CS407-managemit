import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import './App.css';

import NavBar from './NavBar.js';
import ResetPasswordDialog from './ResetPasswordDialog.js';

// test imports - not actually needed on this page. These can be removed later
import ColumnGroup from './ColumnGroup.js';
import BoardsActions from './BoardsActions.js';
import BoardActions from './BoardActions.js';
import BoardCardCollection from './BoardCardCollection.js';
import BoardSettingsBreadcrumbs from './BoardSettingsBreadcrumbs.js';
import BoardSettings from './BoardSettings.js';

// Firebase imports
import firebase, { auth, provider } from './Firebase.js'
import Login from './pages/Login';
import Register from './pages/Register';

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
    loginBody: {
        flexGrow: 1,
        padding: 20,
        paddingRight: 200,
        paddingLeft: 200
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary
    },
    loginPaper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        height: 100 + '%' // Keeps the boxes at the same height
    },
    button: {
        marginRight: 5,
        marginLeft: 5
    },
    textField: {
        width: 80 + '%'
    }
}));

function App() {
    const classes = useStyles();

    return (
        <Router>
            <NavBar onLandingPage='true' />
            <Switch>
                <Route path="/login">
                    <Login></Login>
                </Route>
                <Route path="/register">
                    <Register></Register>
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
