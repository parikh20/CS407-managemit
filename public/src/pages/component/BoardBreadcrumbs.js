import React from 'react';
import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

import { db } from '../../Firebase';


// import Link from '@material-ui/core/Link';

const primaryDark = "#222831"
const secondaryDark = "#30476E"
const darkTextColor = "#c1a57b"
const black = "#000"
const white = "#fff"

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: white
    },
    darkBreadcrumbs: {
        color: darkTextColor,
        backgroundColor: primaryDark
    },
    whiteBreadcrumbs: {
        color: black,
        backgroundColor: white
    },
    darkText: {
        color: darkTextColor,
        backgroundColor: primaryDark
    },
    whiteText: {
        color: black,
        backgroundColor: white
    },
    darkLink: {
        color: darkTextColor,
        backgroundColor: primaryDark
    },
    whiteLink: {
        color: black,
        backgroundColor: white
    }
}));


function BoardBreadcrumbs(props) {
    const user = JSON.parse(localStorage.getItem('user'));
    const classes = useStyles();
    const mode = props.darkMode
    return (
        <Breadcrumbs aria-label='breadcrumbs' className={classes[`${mode}Breadcrumbs`]}>
            <Link to="/boards" className={classes[`${mode}Link`]}>
                Boards
            </Link>
            <Typography className={classes[`${mode}Text`]}>
                {props.board ? props.board.label : ''}
            </Typography>
            <Typography className={classes[`${mode}Text`]}>
                {props.columnGroupRef && props.columnGroupRef.data && props.columnGroupRef.data() ? props.columnGroupRef.data().label : ''}
            </Typography>
        </Breadcrumbs>
    );
}

export default BoardBreadcrumbs;