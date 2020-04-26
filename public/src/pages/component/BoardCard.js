import React from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';


import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

import { db } from '../../Firebase';


const primaryDark = "#222831"
const secondaryDark = "#30476E"
const darkTextColor = "#c1a57b"
const black = "#000"
const white = "#fff"

const useStyles = makeStyles(theme => ({
    darkGrid: {
        // width: 80 + '%',
        // margin: '10px auto 0px auto',
        backgroundColor: primaryDark
    },
    whiteGrid: {
        // width: 80 + '%',
        // margin: '10px auto 0px auto',
        backgroundColor: white
    },
    darkPaper: {
        padding: '12px',
        cursor: 'pointer',
        backgroundColor: secondaryDark,
        color: darkTextColor
    },
    whitePaper: {
        padding: '12px',
        cursor: 'pointer',
        backgroundColor: white,
        color: black
    }
}));


function BoardCard(props) {
    const history = useHistory();
    const user = JSON.parse(localStorage.getItem('user'));
    const classes = useStyles();

    const boardPath = '/board/' + props.board.id;
    const goToBoardPage = () => {
        history.push(boardPath);
    }
    const mode = props.darkMode

    return (
        <Grid item xs={3} className={classes[`${mode}Grid`]}>
            <Paper onClick={goToBoardPage} className={classes[`${mode}Paper`]}>
                <Typography variant='h6' component='h2' style={{textAlign: 'center'}} className='boardCardLabel'>
                    {props.board.label}
                </Typography>
                <Typography variant='body2' component='p' size='small' style={{textAlign: 'center'}}>
                    {props.board.owner === user.email ? 'Owner - ' : ''}
                    {props.board.userRefs.length} collaborator{props.board.userRefs.length > 1 ? 's' : ''}
                </Typography>
                <Typography variant='body2' component='p' className='boardCardDescription'>
                    <br />
                    {props.board.description === '' ? '(No description provided)' : props.board.description}
                </Typography>
            </Paper>
        </Grid>
    );
}

export default BoardCard;