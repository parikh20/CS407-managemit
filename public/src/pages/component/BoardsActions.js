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
    },
    darkDiv: {
        flexGrow: 1,
        backgroundColor: primaryDark
    },
    whiteDiv: {
        flexGrow: 1,
        backgroundColor: white
    }
}));


function BoardsActions(props) {
    const classes = useStyles()
    const mode = props.darkMode
    return (
        <Grid container className={classes[`${mode}Grid`]}>
            <div className={classes[`${mode}Div`]}>
                <Breadcrumbs aria-label='breadcrumbs' >
                    <Typography className={classes[`${mode}Text`]}>
                        Boards
                    </Typography>
                </Breadcrumbs>
            </div>
            <NewBoardDialog darkMode={mode}/>
        </Grid>
    );
}

export default BoardsActions;