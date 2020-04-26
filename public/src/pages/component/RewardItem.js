import React from 'react';
import { Paper, Grid, Typography, IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

class RewardItem extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {}
    }

    delete() {
        this.props.rewardRef.ref.delete()
    }

    render() {
        return (
            <Paper style={{padding: "10px"}} elevation={1}>
                <Grid container>
                    <Grid item xs={9}>
                        <Typography variant="h5">{this.props.rewardRef.data().name} - {this.props.rewardRef.data().pointCost}</Typography>
                        <Typography variant="body1">{this.props.rewardRef.data().description}</Typography>
                    </Grid>
                    <Grid item container justify="flex-end" xs={3}>
                        <IconButton onClick={this.delete.bind(this)}>
                            <DeleteIcon></DeleteIcon>
                        </IconButton>
                    </Grid>
                </Grid>
            </Paper>
        );
    }
};

export default RewardItem;