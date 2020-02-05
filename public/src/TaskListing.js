import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import ViewTaskDialog from './ViewTaskDialog.js';

class TaskListing extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
    }
    render() {
        return (
            <Card variant='outlined' style={{marginBottom: 5}}>
                <CardContent>
                    <Typography variant='h6' component='h2'>
                        {this.props.title}
                    </Typography>
                    <Typography variant='body2' component='p'>
                        {this.props.description}
                    </Typography>
                    <ViewTaskDialog taskDetails={this.props} />
                </CardContent>
            </Card>
        );
    }
}

export default TaskListing;