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

class NavBar extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;

        this.showNavigation = !(['/login', '/register'].includes(props.location));
        this.showBoardFeatures = props.location.startsWith('/board') && props.location !== '/boards';
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
                        {this.showBoardFeatures && <>
                            <TextField placeholder='Search for task' style={{borderRadius: 5 + 'px', paddingLeft: 5, paddingRight: 5, color: '#FFFFFF', backgroundColor: fade('#FFFFFF', 0.15), '&:hover': {backgroundColor: fade('#FFFFFF', 0.25)}}}/>
                            <IconButton
                                edge='end'
                                aria-label='sort'
                                color='inherit'>
                                <SortIcon />
                            </IconButton>
                        </>}
                        {this.showNavigation && <>
                            <IconButton
                                edge='end'
                                aria-label='notifications'
                                color='inherit'
                                style={{marginLeft: 30}}>
                                <MailIcon />
                            </IconButton>
                            <IconButton
                                edge='end'
                                aria-label='user account'
                                color='inherit'>
                                <AccountCircle />
                            </IconButton>
                        </>}
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}

export default NavBar;
