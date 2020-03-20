import React from 'react';

import GridList from '@material-ui/core/GridList';
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';

import { DragDropContext } from 'react-beautiful-dnd';

import Column from './Column.js';

function Alert(props) {
    return <MuiAlert elevation={6} variant='filled' {...props} />;
}

function ColumnGroup(props) {
    const [warningSnackbar, setWarningSnackbar] = React.useState(false);

    const columnRefs = props.columnGroup && props.columnGroup.columnOrder ? props.columnGroup.columnOrder : [];
    const columns = props.columns.filter(column => columnRefs.includes(column.id));
    columns.sort((a, b) => columnRefs.indexOf(a.id) - columnRefs.indexOf(b.id));

    let allColumnNames = {};
    for (let colGroupId of Object.keys(props.allCols)) {
        for (let i = 0; i < props.allCols[colGroupId].length; i++) {
            let item = props.allCols[colGroupId][i];
            allColumnNames[item.id] = item.data().label;
        }
    }

    let columnsById = {};
    for (const column of columns) {
        columnsById[column.id] = column;
    }

    const handleDragStart = result => {
        if (props.lockFunctionality) {
            setWarningSnackbar(true);
            return;
        }
    }
    
    const handleDragEnd = async (result) => {
        // dropped nowhere
        if (!result.destination) {
            return;
        }

        const source = result.source;
        const destination = result.destination;

        if (source.droppableId === destination.droppableId) {
            let newOrder = Array.from(columnsById[source.droppableId].taskRefs);
            let [removedId] = newOrder.splice(result.source.index, 1);
            newOrder.splice(result.destination.index, 0, removedId);

            await props.columnGroupRef.ref.collection('columns').doc(source.droppableId).update({
                taskRefs: newOrder
            });
        } else {
            // we need to store the new refs in two places
            // first, update the task doc
            let taskRef = await props.boardRef.ref.collection('tasks').doc(result.draggableId).get();
            let data = taskRef.data();
            await props.boardRef.ref.collection('tasks').doc(result.draggableId).update({
                columnRefs: [...data.columnRefs.filter(item => item !== source.droppableId), destination.droppableId]
            });

            // then we can update the column docs as well
            let sourceColRef = await props.columnGroupRef.ref.collection('columns').doc(source.droppableId).get();
            let destinationColRef = await props.columnGroupRef.ref.collection('columns').doc(destination.droppableId).get();

            await props.columnGroupRef.ref.collection('columns').doc(source.droppableId).update({
                taskRefs: [...sourceColRef.data().taskRefs.filter(item => item !== result.draggableId)]
            });
            let newDestinationTasks = Array.from(destinationColRef.data().taskRefs);
            newDestinationTasks.splice(destination.index, 0, result.draggableId);
            await props.columnGroupRef.ref.collection('columns').doc(destination.droppableId).update({
                taskRefs: newDestinationTasks
            });
        }
    };
    
    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setWarningSnackbar(false);
    };

    return (
        <div style={{maxWidth: 'calc(100% - 10px - 10px)', height: 100 + '%', padding: '10px 10px 0px 10px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', overflow: 'hidden', float: 'left'}}>
            <DragDropContext onBeforeCapture={handleDragStart} onDragEnd={handleDragEnd}>
                <GridList style={{flexWrap: 'nowrap'}}>
                    {columns.map(column => (
                        <Column
                            key={column.label}
                            column={column}
                            columns={columns}
                            boardRef={props.boardRef}
                            board={props.board}
                            columnGroupRef={props.columnGroupRef}
                            taskRefs={props.taskRefs.filter((task) => task.data().columnRefs.includes(column.id))}
                            taskCommentRefs={props.taskCommentRefs}
                            allColumnNames={allColumnNames}
                            lockFunctionality={props.lockFunctionality}
                            sortMode={props.sortMode}
                            fileRefs={props.fileRefs}
                            allCols={props.allCols}
                            allColGroups={props.allColGroups}
                            allTaskRefs={props.taskRefs}
                        />
                    ))}
                </GridList>
            </DragDropContext>

            <Snackbar open={warningSnackbar} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} autoHideDuration={6000} severity='warning'>
                    Drag and drop disabled while tasks are sorted. Click the unlock icon in the top bar to return to the normal task ordering.
                </Alert>
            </Snackbar>
        </div> 
    );
}

export default ColumnGroup;