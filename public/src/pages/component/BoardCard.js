import React from 'react';
import { useHistory } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import SettingsIcon from '@material-ui/icons/Settings';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { IconButton } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    paper: {
        padding: theme.spacing(2)
    }
}));

function BoardCard(props) {
    const classes = useStyles();
    const history = useHistory();

    const boardPath = '/board/' + props.board.id;
    const goToBoardPage = () => {
        history.push(boardPath);
    }

    return (
        <Grid item xs={3}>
            <Paper className={classes.paper} style={{cursor: 'pointer'}} onClick={goToBoardPage}>
                <Typography variant='h6' component='h2' style={{textAlign: 'center'}} color='inherit'>
                    {props.board.label}
                </Typography>
                <Typography variant='body2' component='p'>
                    {props.board.description}
                </Typography>
            </Paper>
        </Grid>
    );
}

export default BoardCard;