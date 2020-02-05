import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles(theme => ({
    paper: {
        padding: theme.spacing(2),
        color: theme.palette.text.secondary
    }
}));

function BoardCard(props) {
    const classes = useStyles();
    return (
        <Grid item xs={3}>
            <Paper className={classes.paper}>
                <Typography variant='h6' component='h2' style={{textAlign: 'center'}}>
                    {props.title}
                </Typography>
                <Typography variant='body2' component='p'>
                    {props.description}
                </Typography>
            </Paper>
        </Grid>
    );
}

export default BoardCard;