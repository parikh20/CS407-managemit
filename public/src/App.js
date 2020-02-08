import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
  } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { Provider } from 'react-redux';

import store from './store/store';

import './App.css';

// Pages and components
import NavBar from './NavBar';
import Login from './pages/Login';
import Register from './pages/Register';
import Boards from './pages/Boards';
import Board from './pages/Board';

function App() {
    const history = createBrowserHistory();

    return (
        <Provider store={store}>
            <Router>
                <NavBar location={history.location.pathname}  />
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
        </Provider>


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
