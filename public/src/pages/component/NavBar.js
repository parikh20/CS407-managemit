import React from 'react';
import { useHistory } from 'react-router-dom';

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

function NavBar(props) {
    const showNavigation = !(['/login', '/register'].includes(props.location));
    const showBoardFeatures = props.location.startsWith('/board') && props.location !== '/boards' && !props.location.endsWith('settings') && !props.location.endsWith('history') && !props.location.endsWith('calendar');
    const history = useHistory();

    const [caseSensitiveChecked, setCaseSensitiveChecked] = React.useState(false);
    const [menuAnchorEl, setMenuAnchorEl] = React.useState(null);
    const [searchInput, setSearchInput] = React.useState('');
    const [searchMatches, setSearchMatches] = React.useState(0);

    const handleMenuOpen = event => {
        setMenuAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
    };

    const handleMenuClick = (sortMode) => {
        setMenuAnchorEl(null);
        history.push(props.location + '?sort=' + sortMode);;
    };

    const handleUnlock = () => {
        setMenuAnchorEl(null);
        history.push(props.location);
    };

    const toggleCaseSensitiveChecked = (event, newValue) => {
        setCaseSensitiveChecked(newValue);
    };

    React.useEffect(() => {
        searchTasks();
    }, [caseSensitiveChecked]);

    const logOut = () => {
        localStorage.removeItem('user');
        history.push('/login');
    }

    const searchTasks = () => {
        let searchInputElement = document.getElementById('taskSearchInput');

        setSearchMatches(0);
        setSearchInput('');

        if (!searchInputElement) {
            return;
        }
        let searchInput = searchInputElement.value.trim();
        setSearchInput(searchInput);
        if (!caseSensitiveChecked) {
            searchInput = searchInput.toLowerCase();
        }
        const taskElements = document.getElementsByClassName('taskListing');

        if (searchInput === '') {
            for (let i = 0; i < taskElements.length; i++) {
                taskElements[i].classList.remove('search_matches');
                taskElements[i].classList.remove('search_no_matches');
            }
        } else {
            let matchCount = 0;
            for (let i = 0; i < taskElements.length; i++) {
                let content = taskElements[i].innerText;
                if (!caseSensitiveChecked) {
                    content = content.toLowerCase();
                }
                if (content.includes(searchInput)) {
                    taskElements[i].classList.remove('search_no_matches');
                    taskElements[i].classList.add('search_matches');
                    matchCount++;
                } else {
                    taskElements[i].classList.remove('search_matches');
                    taskElements[i].classList.add('search_no_matches');
                }
            }
            setSearchMatches(matchCount);
        }

    };

    return (
        <div style={{flexGrow: 1}}>
            <AppBar position='sticky'>
                <Toolbar variant='dense'>
                    <Typography variant='h6' color='inherit' style={{flexGrow: 1}}>
                        Managemit
                        {showNavigation &&
                            <Button href='/boards' color='inherit' style={{marginLeft: 5}}>Boards</Button>
                        }
                    </Typography>
                    {showBoardFeatures && <>
                        {searchInput !== '' && (
                            <Typography color='inherit' style={{marginRight: 10 + 'px'}}>
                                {searchMatches} match{searchMatches !== 1 ? 'es': ''}
                            </Typography>
                        )}
                        <TextField placeholder='Search for task' onChange={() => searchTasks()} id='taskSearchInput' style={{width: '25%', borderRadius: 5 + 'px', paddingLeft: 5, paddingRight: 5, color: '#FFFFFF', backgroundColor: fade('#FFFFFF', 0.15), '&:hover': {backgroundColor: fade('#FFFFFF', 0.25)}}}/>
                        <Tooltip title='Case sensitivity' arrow>
                            <ToggleButtonGroup size='small' exclusive value={caseSensitiveChecked} style={{backgroundColor: 'inherit'}} onChange={toggleCaseSensitiveChecked}>
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
                                onClick={handleMenuOpen}
                            >
                                <SortIcon />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            id='sort-menu'
                            anchorEl={menuAnchorEl}
                            keepMounted
                            open={Boolean(menuAnchorEl)}
                            onClose={handleMenuClose}
                        >
                            <MenuItem onClick={() => handleMenuClick('titleAsc')}>Sort by title (ascending)</MenuItem>
                            <MenuItem onClick={() => handleMenuClick('titleDesc')}>Sort by title (descending)</MenuItem>
                            <MenuItem onClick={() => handleMenuClick('date')}>Sort by due date</MenuItem>
                            <MenuItem onClick={() => handleMenuClick('users')}>Sort by assigned to me</MenuItem>
                        </Menu>
                        {props.sortMode !== null && (
                            <Tooltip title='Return to default task display and unlock functionality' arrow>
                                <IconButton
                                    edge='end'
                                    aria-label='unlock'
                                    color='inherit'
                                    onClick={handleUnlock}
                                >
                                    <LockOpenIcon />
                                </IconButton>
                            </Tooltip>
                        )}
                    </>}
                    {showNavigation && <>
                        <Tooltip title='Notifications' arrow>
                            <IconButton
                                edge='end'
                                aria-label='notifications'
                                color='inherit'
                                style={{marginLeft: 30}}>
                                <MailIcon />
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
                                onClick={logOut}>
                                <ExitToAppIcon />
                            </IconButton>
                        </Tooltip>
                    </>}
                </Toolbar>
            </AppBar>
        </div>
    );
}

export default NavBar;
