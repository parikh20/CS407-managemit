import React from 'react';
import { useHistory } from 'react-router-dom';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';


function BoardCard(props) {
    const history = useHistory();
    const user = JSON.parse(localStorage.getItem('user'));

    const boardPath = '/board/' + props.board.id;
    const goToBoardPage = () => {
        history.push(boardPath);
    }

    return (
        <Grid item xs={3}>
            <Paper onClick={goToBoardPage} style={{padding: '12px', cursor: 'pointer'}} className='boardCard'>
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