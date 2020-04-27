import React from 'react';

import GridListTile from '@material-ui/core/GridListTile';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import { Droppable, Draggable } from 'react-beautiful-dnd';

import TaskListing from './TaskListing'
import EditColumnDialog from './EditColumnDialog';

function Column(props) {
    const user = JSON.parse(localStorage.getItem('user'));

    const columnTaskRefs = props.column.taskRefs || [];
    const taskRefs = props.taskRefs.filter(taskRef => columnTaskRefs.includes(taskRef.id));

    if (props.sortMode === 'titleAsc') {
        taskRefs.sort((a, b) => a.data().title.localeCompare(b.data().title));
    } else if (props.sortMode === 'titleDesc') {
        taskRefs.sort((a, b) => b.data().title.localeCompare(a.data().title));
    } else if (props.sortMode === 'date') {
        taskRefs.sort((a, b) => {
            const dateA = a.data().date;
            const dateB = b.data().date;
            if (dateA === null && dateB === null) {
                return a.data().title.localeCompare(b.data().title);
            }
            if (dateA === null) {
                return 1;
            }
            if (dateB === null) {
                return -1;
            }
            if (dateA.toDate().getTime() === dateB.toDate().getTime()) {
                return a.data().title.localeCompare(b.data().title);
            }
            return dateA.toDate().getTime() - dateB.toDate().getTime();
        });
    } else if (props.sortMode === 'users') {
        taskRefs.sort((a, b) => {
            const userInA = a.data().users.includes(user.email);
            const userInB = b.data().users.includes(user.email);
            if (userInA === userInB) {
                return a.data().title.localeCompare(b.data().title);
            }
            return userInA ? -1 : 1;
        });
    } else {
        taskRefs.sort((a, b) => columnTaskRefs.indexOf(a.id) - columnTaskRefs.indexOf(b.id));
    }

    const handleColumnMove = diff => {
        let columnOrder = [...props.columnGroupRef.data().columnOrder];
        let swap  = columnOrder[props.columnIndex];
        let swap2 = columnOrder[props.columnIndex + diff];
        columnOrder[props.columnIndex] = swap2;
        columnOrder[props.columnIndex + diff] = swap;

        props.columnGroupRef.ref.update({
            columnOrder: columnOrder
        });
    };

    return (
        <GridListTile style={{margin: 5, width: 300}}>
            <Typography variant='h6' color='inherit'>
                {props.column.label}
                <EditColumnDialog column={props.column} columns={props.columns} boardRef={props.boardRef} columnGroupRef={props.columnGroupRef} />
                <div style={{float: 'right'}}>
                    <IconButton
                        edge='end'
                        aria-label='move column left'
                        color='inherit'
                        disabled={props.columnIndex === 0}
                        onClick={() => handleColumnMove(-1)}>
                        <ChevronLeftIcon />
                    </IconButton>
                    <IconButton
                        edge='end'
                        aria-label='move column right'
                        color='inherit'
                        disabled={props.columnIndex + 1 === props.columnCount}
                        onClick={() => handleColumnMove(1)}>
                        <ChevronRightIcon />
                    </IconButton>
                </div>
            </Typography>
            <div style={{overflow: 'auto', height: '800px'}}> {/*yeah I know, this is very very bad. css is awful to work with, this height definition needs to be fixed*/}
                <Droppable droppableId={props.column.id}>
                    {(droppableProvided, droppableSnapshot) => (
                        <div ref={droppableProvided.innerRef} style={{minHeight: 200 + 'px'}}>
                            {taskRefs.map((taskRef, index) => (
                                <Draggable key={taskRef.id} draggableId={taskRef.id} index={index}>
                                    {(draggableProvided, draggableSnapshot) => (
                                        <div
                                            ref={draggableProvided.innerRef}
                                            {...draggableProvided.draggableProps}
                                            {...draggableProvided.dragHandleProps}
                                        >
                                            <TaskListing
                                                boardRef={props.boardRef}
                                                board={props.board}
                                                key={taskRef.id}
                                                taskRef={taskRef}
                                                task={taskRef.data()}
                                                taskCommentRefs={props.taskCommentRefs}
                                                allColumnNames={props.allColumnNames}
                                                lockFunctionality={props.lockFunctionality}
                                                fileRefs={props.fileRefs}
                                                allCols={props.allCols}
                                                allColGroups={props.allColGroups}
                                                taskRefs={props.allTaskRefs}
                                                darkMode={props.darkMode}
                                            />
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {droppableProvided.placeholder}
                        </div>
                    )}
                </Droppable>
            </div>
        </GridListTile>
    );
}

export default Column;