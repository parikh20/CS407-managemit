import React from 'react';
import { useHistory } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles(theme => ({
    paper: {
        padding: theme.spacing(2)
    }
}));

function BoardCard(props) {
    const classes = useStyles();
    const history = useHistory();
    const user = JSON.parse(localStorage.getItem('user'));

    const boardPath = '/board/' + props.board.id;
    const goToBoardPage = () => {
        history.push(boardPath);
    }

    return (
        <Grid item xs={3}>
            <Paper className={classes.paper} style={{cursor: 'pointer'}} onClick={goToBoardPage}>
                <Typography variant='h6' component='h2' style={{textAlign: 'center'}}>
                    {props.board.label}
                </Typography>
                <Typography variant='body2' component='p' size='small' style={{textAlign: 'center'}}>
                    {props.board.owner === user.email ? 'Owner - ' : ''}
                    {props.board.userRefs.length} collaborator{props.board.userRefs.length > 1 ? 's' : ''}
                </Typography>
                {props.board.description !== '' && (
                    <Typography variant='body2' component='p'>
                        <br />
                        {props.board.description}
                    </Typography>
                )}
            </Paper>
        </Grid>
    );
}

export default BoardCard;