import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
  } from 'react-router-dom';

import './App.css';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Boards from './pages/Boards';
import Board from './pages/Board';

// Used to ensure users must log in
class ProtectedRoute extends React.Component {
    render() {
        const { component: Component, ...props } = this.props;
        return (
            <Route 
                {...props} 
                render={props => (
                    localStorage.getItem('user') !== null ?
                    <Component {...props} /> :
                    <Redirect to='/login' />
                )} 
            />
        );
    }
}

// Used to keep logged in users off the login/register pages
class RedirectRoute extends React.Component {
    render() {
        const { component: Component, ...props } = this.props;
        return (
            <Route 
                {...props} 
                render={props => (
                    localStorage.getItem('user') === null ?
                    <Component {...props} /> :
                    <Redirect to='/boards' />
                )} 
            />
        );
    }
}


function App() {
    const isLoggedIn = localStorage.getItem('user') !== null;

    return (
        <Router>
            <Switch>
                <RedirectRoute path='/login' component={Login} />
                <RedirectRoute path='/register' component={Register} />
                <ProtectedRoute path='/boards' component={Boards} />
                <ProtectedRoute path='/board/:boardId' component={Board} />
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
