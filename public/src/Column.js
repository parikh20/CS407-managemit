import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import GridListTile from '@material-ui/core/GridListTile';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';

import TaskListing from './TaskListing.js'

const placeholderTasks = [
    {
        title: 'My title',
        description: 'My description'
    },
    {
        title: 'Second title',
        description: 'A slightly longer description'
    },
    {
        title: 'Third title',
        description: 'Once descriptions get long enough, we will need to do some truncation. This is fine though.'
    }
];

class Column extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
    }
    render() {
        return (
            <GridListTile style={{margin: 5, width: 250}}>
                <Typography variant="h6" color="inherit">
                    {this.props.columnName}
                    <IconButton
                        edge="end"
                        aria-label="edit column"
                        color="inherit">
                        <EditIcon />
                    </IconButton>
                </Typography>
                {placeholderTasks.map(task => (
                    <TaskListing title={task.title} description={task.description} />
                ))}
            </GridListTile>
        );
    }
}

export default Column;