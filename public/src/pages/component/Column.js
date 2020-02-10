import React from 'react';

import GridListTile from '@material-ui/core/GridListTile';
import Typography from '@material-ui/core/Typography';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import IconButton from '@material-ui/core/IconButton';

import TaskListing from './TaskListing.js'
import EditColumnDialog from './EditColumnDialog.js';

const placeholderTasks = [];

class Column extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
    }
    render() {
        return (
            <GridListTile style={{margin: 5, width: 250}}>
                <Typography variant='h6' color='inherit'>
                    {this.props.columnName}
                    <EditColumnDialog />
                    <div style={{float: 'right'}}>
                        <IconButton
                            edge='end'
                            aria-label='move column left'
                            color='inherit'>
                            <ChevronLeftIcon />
                        </IconButton>
                        <IconButton
                            edge='end'
                            aria-label='move column right'
                            color='inherit'>
                            <ChevronRightIcon />
                        </IconButton>
                    </div>
                </Typography>
                <div style={{overflow: 'auto', height: '800px'}}> {/*yeah I know, this is very very bad. css is awful to work with, this height definition needs to be fixed*/}
                    {placeholderTasks.map(task => (
                        <TaskListing title={task.title} description={task.description} />
                    ))}
                </div>
            </GridListTile>
        );
    }
}

export default Column;