import React from 'react';
import {
    BrowserRouter,
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
import BoardSettings from './pages/BoardSettings';
import BoardHistory from './pages/BoardHistory';
import BoardCalendar from './pages/BoardCalendar';
import UserSettings from './pages/UserSettings';
import BoardDocuments from './pages/BoardDocuments';
import UserNotifications from './pages/UserNotifications';
import BoardApiSettings from './pages/BoardApiSettings';
import BoardApiHistory from './pages/BoardApiHistory';
import RewardsAdmin from './pages/RewardsAdmin';
import RedeemRewards from './pages/RedeemRewards';

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
    return (
        <BrowserRouter forceRefresh={true}>
            <Switch>
                <RedirectRoute path='/login' component={Login} />
                <RedirectRoute path='/register' component={Register} />
                <ProtectedRoute path='/boards' component={Boards} />
                <ProtectedRoute path='/board/:boardId/calendar/:month/:day/:year' component={BoardCalendar} />
                <ProtectedRoute path='/board/:boardId/calendar' component={BoardCalendar} />
                <ProtectedRoute path='/board/:boardId/rewards' component={RedeemRewards} />
                <ProtectedRoute path='/board/:boardId/rewardsadmin' component={RewardsAdmin} />
                <ProtectedRoute path='/board/:boardId/settings' component={BoardSettings} />
                <ProtectedRoute path='/board/:boardId/api/settings' component={BoardApiSettings} />
                <ProtectedRoute path='/board/:boardId/api/history' component={BoardApiHistory} />
                <ProtectedRoute path='/board/:boardId/history' component={BoardHistory} />
                <ProtectedRoute path='/board/:boardId/documents' component={BoardDocuments} />
                <ProtectedRoute path='/board/:boardId/:groupId' component={Board} />
                <ProtectedRoute path='/board/:boardId' component={Board} />
                <ProtectedRoute path='/settings' component={UserSettings} />
                <ProtectedRoute path='/notifications' component={UserNotifications} />
                <Route path='/'>
                    <Redirect to='/login' />
                </Route>
            </Switch>
        </BrowserRouter>
    );
}

export default App;
