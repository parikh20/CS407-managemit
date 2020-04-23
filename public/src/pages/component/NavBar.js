import React from 'react';

import { fade } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MailIcon from '@material-ui/icons/Mail';
import SortIcon from '@material-ui/icons/Sort';
import TextField from '@material-ui/core/TextField';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import Tooltip from '@material-ui/core/Tooltip';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import TextFormatIcon from '@material-ui/icons/TextFormat';
import Badge from '@material-ui/core/Badge';

import { db } from '../../Firebase';

class NavBar extends React.Component {

    notificationCountSub;

    constructor(props) {
        super(props);

        try {
            this.user = JSON.parse(localStorage.getItem('user'));

        } catch (e) {
            // Nothing to do here
        }

        const boardSubpages = ['settings', 'history', 'calendar', 'documents'];
        this.showNavigation = !(['/login', '/register'].includes(this.props.location));
        this.showBoardFeatures = this.props.location.startsWith('/board') && this.props.location !== '/boards';
        this.showBoardFeatures = this.showBoardFeatures && boardSubpages.map(subpage => this.props.location.endsWith(subpage)).filter(item => item === true).length === 0;
        this.showSearch = this.props.location.startsWith('/board') && boardSubpages.map(subpage => this.props.location.endsWith(subpage)).filter(item => item === true).length === 0;

        this.state = {
            caseSensitiveChecked: false,
            menuAnchorEl: null,
            searchInput: '',
            searchMatches: 0,
            notificationCount: 0
        }

        this.handleMenuOpen = this.handleMenuOpen.bind(this);
        this.handleMenuClose = this.handleMenuClose.bind(this);
        this.handleMenuClick = this.handleMenuClick.bind(this);
        this.handleUnlock = this.handleUnlock.bind(this);
        this.toggleCaseSensitiveChecked = this.toggleCaseSensitiveChecked.bind(this);
        this.logOut = this.logOut.bind(this);
        this.searchTasks = this.searchTasks.bind(this);

        this.loadNotificationCount();
    }
    
    handleMenuOpen(event) {
        this.setState({menuAnchorEl: event.currentTarget});
    }

    handleMenuClose(event) {
        this.setState({menuAnchorEl: null});
    }

    handleMenuClick(sortMode) {
        this.setState({menuAnchorEl: null});
        window.location.href = this.props.location + '?sort=' + sortMode;
    }

    handleUnlock() {
        this.setState({menuAnchorEl: null});
        window.location.href = this.props.location;
    }

    toggleCaseSensitiveChecked(event, newValue) {
        this.setState({caseSensitiveChecked: newValue}, () => this.searchTasks());
    }

    logOut() {
        localStorage.removeItem('user');
        window.location.href = '/login';
    }

    searchTasks() {
        let searchInputElement = document.getElementById('taskSearchInput');

        this.setState({
            searchMatches: 0,
            searchInput: ''
        });

        if (!searchInputElement) {
            return;
        }
        let searchInput = searchInputElement.value.trim();
        if (!this.state.caseSensitiveChecked) {
            searchInput = searchInput.toLowerCase();
        }
        this.setState({searchInput: searchInput});

        let elements = [];
        if (this.showBoardFeatures) {
            elements = document.getElementsByClassName('taskListing');
        } else {
            elements = document.getElementsByClassName('boardCard');
        }

        if (searchInput === '') {
            for (let i = 0; i < elements.length; i++) {
                elements[i].classList.remove('search_matches');
                elements[i].classList.remove('search_no_matches');
            }
        } else {
            let matchCount = 0;
            for (let i = 0; i < elements.length; i++) {
                let content = elements[i].innerText;
                if (!this.state.caseSensitiveChecked) {
                    content = content.toLowerCase();
                }
                if (content.includes(searchInput)) {
                    elements[i].classList.remove('search_no_matches');
                    elements[i].classList.add('search_matches');
                    matchCount++;
                } else {
                    elements[i].classList.remove('search_matches');
                    elements[i].classList.add('search_no_matches');
                }
            }
            this.setState({searchMatches: matchCount});
        }
    }

    loadNotificationCount() {
        if (this.notificationCountSub) {
            this.notificationCountSub();
        }

        if (!this.user) {
            return;
        }
        
        this.notificationCountSub = db.collection('users').doc(this.user.email).collection('notifications').where('unread', '==', true).onSnapshot(notificationRefs => {
            this.setState({notificationCount: notificationRefs.size});
        });
    }


    componentWillUnmount() {
        this.notificationCountSub && this.notificationCountSub();
    }


    render() {
        return (
            <div style={{flexGrow: 1}}>
                <AppBar position='sticky'>
                    <Toolbar variant='dense'>
                        <Typography variant='h6' color='inherit' style={{flexGrow: 1}}>
                            Managemit
                            {this.showNavigation &&
                                <Button href='/boards' color='inherit' style={{marginLeft: 5}}>Boards</Button>
                            }
                        </Typography>
                        {this.showSearch && <React.Fragment>
                            {this.state.searchInput !== '' && (
                                <Typography color='inherit' style={{marginRight: 10 + 'px'}}>
                                    {this.state.searchMatches} match{this.state.searchMatches !== 1 ? 'es': ''}
                                </Typography>
                            )}
                            <TextField placeholder={'Search for ' + (this.showBoardFeatures ? 'task' : 'board')} onChange={() => this.searchTasks()} id='taskSearchInput' style={{width: '25%', borderRadius: 5 + 'px', paddingLeft: 5, paddingRight: 5, color: '#FFFFFF', backgroundColor: fade('#FFFFFF', 0.15), '&:hover': {backgroundColor: fade('#FFFFFF', 0.25)}}}/>
                            <Tooltip title='Case sensitivity' arrow>
                                <ToggleButtonGroup size='small' exclusive value={this.state.caseSensitiveChecked} style={{backgroundColor: 'inherit'}} onChange={this.toggleCaseSensitiveChecked}>
                                    <ToggleButton value={true} style={{border: 0, color: 'white'}}>
                                        <TextFormatIcon />
                                    </ToggleButton>
                                </ToggleButtonGroup>
                            </Tooltip>
                            <Tooltip title='Sort tasks' arrow>
                                <IconButton
                                    edge='end'
                                    aria-label='sort'
                                    color='inherit'
                                    aria-controls='sort-menu'
                                    aria-haspopup='true'
                                    onClick={this.handleMenuOpen}
                                >
                                    <SortIcon />
                                </IconButton>
                            </Tooltip>
                            <Menu
                                id='sort-menu'
                                anchorEl={this.state.menuAnchorEl}
                                keepMounted
                                open={Boolean(this.state.menuAnchorEl)}
                                onClose={this.handleMenuClose}
                            >
                                {this.showBoardFeatures && <React.Fragment>
                                    <MenuItem onClick={() => this.handleMenuClick('titleAsc')}>Sort by title (ascending)</MenuItem>
                                    <MenuItem onClick={() => this.handleMenuClick('titleDesc')}>Sort by title (descending)</MenuItem>
                                    <MenuItem onClick={() => this.handleMenuClick('date')}>Sort by due date</MenuItem>
                                    <MenuItem onClick={() => this.handleMenuClick('users')}>Sort by assigned to me</MenuItem>
                                </React.Fragment>}
                                {!this.showBoardFeatures && <React.Fragment>
                                    <MenuItem onClick={() => this.handleMenuClick('nameAsc')}>Sort by name (ascending)</MenuItem>
                                    <MenuItem onClick={() => this.handleMenuClick('nameDesc')}>Sort by name (descending)</MenuItem>
                                    <MenuItem onClick={() => this.handleMenuClick('descAsc')}>Sort by description (ascending)</MenuItem>
                                    <MenuItem onClick={() => this.handleMenuClick('descDesc')}>Sort by description (descending)</MenuItem>
                                    <MenuItem onClick={() => this.handleMenuClick('owner')}>Sort by owned by me</MenuItem>
                                    <MenuItem onClick={() => this.handleMenuClick('admin')}>Sort by administered by me</MenuItem>
                                    <MenuItem onClick={() => this.handleMenuClick('users')}>Sort by number of collaborators</MenuItem>
                                </React.Fragment>}
                            </Menu>
                            {this.props.sortMode !== null && this.showBoardFeatures && (
                                <Tooltip title='Return to default task display and unlock functionality' arrow>
                                    <IconButton
                                        edge='end'
                                        aria-label='unlock'
                                        color='inherit'
                                        onClick={this.handleUnlock}
                                    >
                                        <LockOpenIcon />
                                    </IconButton>
                                </Tooltip>
                            )}
                        </React.Fragment>}
                        {this.showNavigation && <React.Fragment>
                            <Tooltip title='Notifications' arrow>
                                <IconButton
                                    edge='end'
                                    aria-label='notifications'
                                    color='inherit'
                                    href='/notifications'
                                    style={{marginLeft: 30}}>
                                    <Badge badgeContent={this.state.notificationCount} color='secondary'>
                                        <MailIcon />
                                    </Badge>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title='Account Settings' arrow>
                                <IconButton
                                    edge='end'
                                    aria-label='user account'
                                    color='inherit'
                                    href='/settings' >
                                    <AccountCircle />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title='Log out' arrow>
                                <IconButton
                                    edge='end'
                                    aria-label='log out'
                                    color='inherit'
                                    onClick={this.logOut}>
                                    <ExitToAppIcon />
                                </IconButton>
                            </Tooltip>
                        </React.Fragment>}
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}

export default NavBar;
