import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MailIcon from '@material-ui/icons/Mail';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    title: {
        flexGrow: 1,
    },
    button: {
        marginRight: 5,
        marginLeft: 5
    }
}));

function NavBar() {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <AppBar position="sticky">
                <Toolbar variant="dense">
                    <Typography variant="h6" color="inherit" className={classes.title}>
                        Managemit
                        <Button color="inherit" className={classes.button}>Boards</Button>
                    </Typography>
                    <IconButton
                        edge="end"
                        aria-label="notifications"
                        color="inherit">
                        <MailIcon />
                    </IconButton>
                    <IconButton
                        edge="end"
                        aria-label="user account"
                        color="inherit">
                        <AccountCircle />
                    </IconButton>
                </Toolbar>
            </AppBar>
        </div>
    );
}

export default NavBar;
