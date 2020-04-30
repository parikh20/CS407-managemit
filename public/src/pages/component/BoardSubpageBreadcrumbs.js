import React from 'react';
import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';


const primaryDark = "#222831"
const secondaryDark = "#30476E"
const darkTextColor = "#c1a57b"
const black = "#000"
const white = "#fff"

const useStyles = makeStyles(theme => ({
    darkGrid: {
        color: darkTextColor,
        backgroundColor: primaryDark
    },
    whiteGrid: {
        color: black,
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

function BoardSubpageBreadcrumbs(props) {
    const classes = useStyles();
    const mode = localStorage.darkMode
    return (
        <Grid container className={classes[`${mode}Grid`]}>
            <Breadcrumbs aria-label='breadcrumbs' className={classes[`${mode}Breadcrumbs`]} style={{padding: '10px 10px 0px 10px'}}>
                <Link className={classes[`${mode}Link`]} href='/boards'>
                    Boards
                </Link>
                <Link className={classes[`${mode}Link`]} href={'/board/' + props.board.id}>
                    {props.board.label}
                </Link>
                {props.showSettings && (
                    <Link color='inherit' href={'/board/' + props.board.id + '/settings'}>
                        Settings
                    </Link>
                )}
                <Typography className={classes[`${mode}Text`]}>
                    {props.currentPageName}
                </Typography>
            </Breadcrumbs>
        </Grid>
    );
}

export default BoardSubpageBreadcrumbs;