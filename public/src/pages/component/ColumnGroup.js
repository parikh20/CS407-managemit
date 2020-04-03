import React from 'react';

import GridList from '@material-ui/core/GridList';
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';

import { DragDropContext } from 'react-beautiful-dnd';

import Column from './Column.js';

function Alert(props) {
    return <MuiAlert elevation={6} variant='filled' {...props} />;
}

class ColumnGroup extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            warningSnackbar: false,
            columns: [],
            allColumnNames: {},
            columnsById: {},
            columnIdToIndex: {}
        };

        this.handleDragStart = this.handleDragStart.bind(this);
        this.handleDragEnd = this.handleDragEnd.bind(this);
        this.handleSnackbarClose = this.handleSnackbarClose.bind(this);
    }

    componentWillReceiveProps(next) {
        const columnRefs = next.columnGroup && next.columnGroup.columnOrder ? next.columnGroup.columnOrder : [];
        const columns = next.columns.filter(column => columnRefs.includes(column.id));
        columns.sort((a, b) => columnRefs.indexOf(a.id) - columnRefs.indexOf(b.id));
        this.setState({columns: columns});

        let allColumnNames = {};
        for (let colGroupId of Object.keys(next.allCols)) {
            for (let i = 0; i < next.allCols[colGroupId].length; i++) {
                let item = next.allCols[colGroupId][i];
                allColumnNames[item.id] = item.data().label;
            }
        }
        this.setState({allColumnNames: allColumnNames});

        let columnsById = {};
        for (const column of columns) {
            columnsById[column.id] = column;
        }
        this.setState({columnsById: columnsById});

        let columnIdToIndex = {};
        for (let i = 0; i < columns.length; i++) {
            columnIdToIndex[columns[i].id] = i;
        }
        this.setState({columnIdToIndex: columnIdToIndex});
    }

    handleDragStart(result) {
        if (this.props.lockFunctionality) {
            this.setState({warningSnackbar: true});
            return;
        }
    }
    
    handleDragEnd = async (result) => {
        // dropped nowhere
        if (!result.destination) {
            return;
        }

        const source = result.source;
        const destination = result.destination;

        if (source.droppableId === destination.droppableId) {
            let newOrder = Array.from(this.state.columnsById[source.droppableId].taskRefs);
            let [removedId] = newOrder.splice(result.source.index, 1);
            newOrder.splice(result.destination.index, 0, removedId);

            /*let columnCopy = Array.from(this.state.columns[this.state.columnIdToIndex[source.droppableId]]);
            let [removedItem] = columnCopy.splice(result.source.index, 1);
            columnCopy.splice(result.destination.index, 0, removedItem);

            let columnsCopy = Array.from(this.state.columns);
            columnsCopy[this.state.columnIdToIndex[source.droppableId]] = columnCopy;
            this.setState({columns: columnsCopy});*/

            await this.props.columnGroupRef.ref.collection('columns').doc(source.droppableId).update({
                taskRefs: newOrder
            });
        } else {

            /*let sourceCopy = Array.from(this.state.columns[this.state.columnIdToIndex[source.droppableId]]);
            let [removedItem] = sourceCopy.splice(result.source.index, 1);

            let destinationCopy = Array.from(this.state.columns[this.state.columnIdToIndex[destination.droppableId]]);
            destinationCopy.splice(result.destination.index, 0, removedItem);

            let columnsCopy = Array.from(this.state.columns);
            columnsCopy[this.state.columnIdToIndex[source.droppableId]] = sourceCopy;
            columnsCopy[this.state.columnIdToIndex[destination.droppableId]] = destinationCopy;
            this.setState({columns: columnsCopy});*/

            // we need to store the new refs in two places
            // first, update the task doc
            let taskRef = await this.props.boardRef.ref.collection('tasks').doc(result.draggableId).get();
            let data = taskRef.data();
            await this.props.boardRef.ref.collection('tasks').doc(result.draggableId).update({
                columnRefs: [...data.columnRefs.filter(item => item !== source.droppableId), destination.droppableId]
            });

            // then we can update the column docs as well
            let sourceColRef = await this.props.columnGroupRef.ref.collection('columns').doc(source.droppableId).get();
            let destinationColRef = await this.props.columnGroupRef.ref.collection('columns').doc(destination.droppableId).get();

            await this.props.columnGroupRef.ref.collection('columns').doc(source.droppableId).update({
                taskRefs: [...sourceColRef.data().taskRefs.filter(item => item !== result.draggableId)]
            });
            let newDestinationTasks = Array.from(destinationColRef.data().taskRefs);
            newDestinationTasks.splice(destination.index, 0, result.draggableId);
            await this.props.columnGroupRef.ref.collection('columns').doc(destination.droppableId).update({
                taskRefs: newDestinationTasks
            });
        }
    };
    
    handleSnackbarClose(event, reason) {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({warningSnackbar: false});
    }

    render() {
        return (
            <div style={{maxWidth: 'calc(100% - 10px - 10px)', height: 100 + '%', padding: '10px 10px 0px 10px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', overflow: 'hidden', float: 'left'}}>
                <DragDropContext onBeforeCapture={this.handleDragStart} onDragEnd={this.handleDragEnd}>
                    <GridList style={{flexWrap: 'nowrap'}}>
                        {this.state.columns.map((column, index) => (
                            <Column
                                key={column.label}
                                column={column}
                                columnIndex={index}
                                columnCount={this.state.columns.length}
                                columns={this.state.columns}
                                boardRef={this.props.boardRef}
                                board={this.props.board}
                                columnGroupRef={this.props.columnGroupRef}
                                taskRefs={this.props.taskRefs.filter((task) => task.data().columnRefs.includes(column.id))}
                                taskCommentRefs={this.props.taskCommentRefs}
                                allColumnNames={this.state.allColumnNames}
                                lockFunctionality={this.props.lockFunctionality}
                                sortMode={this.props.sortMode}
                                fileRefs={this.props.fileRefs}
                                allCols={this.props.allCols}
                                allColGroups={this.props.allColGroups}
                                allTaskRefs={this.props.taskRefs}
                            />
                        ))}
                    </GridList>
                </DragDropContext>

                <Snackbar open={this.state.warningSnackbar} onClose={this.handleSnackbarClose}>
                    <Alert onClose={this.handleSnackbarClose} autoHideDuration={6000} severity='warning'>
                        Drag and drop disabled while tasks are sorted. Click the unlock icon in the top bar to return to the normal task ordering.
                    </Alert>
                </Snackbar>
            </div> 
        );
    }
}

export default ColumnGroup;