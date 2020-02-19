import React from 'react';

import GridListTile from '@material-ui/core/GridListTile';
import Typography from '@material-ui/core/Typography';

import TaskListing from './TaskListing'
import EditColumnDialog from './EditColumnDialog';

function Column(props) {
    const columnTaskRefs = props.column.taskRefs || [];
    const taskRefs = props.taskRefs.filter(taskRef => columnTaskRefs.includes(taskRef.id));
    taskRefs.sort((a, b) => columnTaskRefs.indexOf(a.id) - columnTaskRefs.indexOf(b.id));

    return (
        <GridListTile style={{margin: 5, width: 300}}>
            <Typography variant='h6' color='inherit'>
                {props.column.label}
                <EditColumnDialog column={props.column} columns={props.columns} boardRef={props.boardRef} columnGroupRef={props.columnGroupRef} />
            </Typography>
            <div style={{overflow: 'auto', height: '800px'}}> {/*yeah I know, this is very very bad. css is awful to work with, this height definition needs to be fixed*/}
                {taskRefs.map(taskRef => (
                    <TaskListing key={taskRef.id} taskRef={taskRef} task={taskRef.data()} allColumnNames={props.allColumnNames} />
                ))}
            </div>
        </GridListTile>
    );
}

export default Column;