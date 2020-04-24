import React from 'react';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import { makeStyles } from '@material-ui/core/styles';


import NewBoardDialog from './NewBoardDialog.js';

import { db } from '../../Firebase';


const primaryDark = "#222831"
const secondaryDark = "#30476E"
const darkTextColor = "#c1a57b"
const black = "#000"
const white = "#fff"

const useStyles = makeStyles(theme => ({
    darkGrid: {
        padding: '10px 10px 0px 10px',
        backgroundColor: primaryDark
    },
    whiteGrid: {
        padding: '10px 10px 0px 10px',
        backgroundColor: white
    },
    darkText: {
        backgroundColor: primaryDark,
        color: darkTextColor
    },
    whiteText: {
        backgroundColor: white,
        color: black
    }
}));


function BoardsActions(props) {
    const classes = useStyles()
    const user = JSON.parse(localStorage.getItem('user'));
    const [mode, setMode] = React.useState('dark')
    db.collection('users').doc(user.email).get().then(doc => {
        doc.data().darkMode ? setMode("dark") : setMode("white");
    })
    return (
        <Grid container className={classes[`${mode}Grid`]}>
            <div style={{flexGrow: 1}}>
                <Breadcrumbs aria-label='breadcrumbs' >
                    <Typography className={classes[`${mode}Text`]}>
                        Boards
                    </Typography>
                </Breadcrumbs>
            </div>
            <NewBoardDialog />
        </Grid>
    );
}

export default BoardsActions;