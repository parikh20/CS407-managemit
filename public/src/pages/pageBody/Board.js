import React from 'react';

import BoardActions from '../component/BoardActions';
import ColumnGroup from '../component/ColumnGroup';

import { cache } from '../../Firebase';


class Board extends React.Component {

    boardSub;
    colGroupSub;
    colGroupsSub;
    colSub;
    columnsSub = [];
    taskSub;

    constructor(props) {
        super(props);
        this.state = {
            taskRefs: {},
            allColumns: {}
        };
    }

    componentDidMount() {
        this.loadBoard();
    }

    // Load board based on boardID, then load column group
    loadBoard() {
        this.boardSub = cache.loadBoard(this.props.boardId).subscribe((boardRef) => {
            if (!boardRef.exists) {
                this.props.history.push('/boards');
            } else {
                this.setState({boardRef: boardRef});
                this.loadColGroup(boardRef);
                this.loadTasks(boardRef);
                this.loadAllColGroups(boardRef);
            }
        });
    }

    // Load column group, then load columns
    loadColGroup(boardRef, colGroup=null) {
        // If there is already a subscription, unsubscribe
        if(this.colGroupSub) {
            this.colGroupSub.unsubscribe();
        }
        const collection = boardRef.ref.collection("columnGroups");

        // If a parameter was supplied to the function use it, otherwise use default
        colGroup = colGroup || boardRef.data().defaultColumnGroup;

        // If a default is set (not ""), then use it
        if(colGroup.length) {
            this.colGroupSub = cache.loadColumnGroup(boardRef, colGroup).subscribe((colGroupRef) => {
                this.setState({colGroupRef: colGroupRef});
                this.loadColumns(colGroupRef);
            });
        // Otherwise just grab the first colGroup
        } else {
            this.colGroupSub = collection.limit(1).onSnapshot((colGroupRef) => {
                this.setState({colGroupRef: colGroupRef.docs[0]});
                this.loadColumns(colGroupRef.docs[0]);
            });
        }
    }

    loadAllColGroups(boardRef) {
        this.colGroupsSub = boardRef.ref.collection("columnGroups").onSnapshot((colGroupRefs) => {
            this.setState({colGroups: colGroupRefs.docs});
            this.loadAllColumns(colGroupRefs);
        });
    }

    loadAllColumns(colGroupRefs) {
        colGroupRefs.forEach((colGroupRef) => {
            this.columnsSub.push(colGroupRef.ref.collection("columns").onSnapshot((columnRefs) => {
                let copy = Object.assign({}, this.state.allColumns);

                const columnOrder = colGroupRef.data().columnOrder;
                let docs = columnRefs.docs.map(doc => doc);
                docs.sort((a, b) => columnOrder.indexOf(a.id) - columnOrder.indexOf(b.id));

                copy[colGroupRef.id] = docs;
                this.setState({allColumns: copy});
            }));
        });
    }

    loadColumns(colGroupRef=null) {
        if (this.colSub) {
            this.colSub.unsubscribe();
        }

        this.colSub = cache.loadColumns(colGroupRef || this.state.colGroupRef).subscribe((columnRefs) => {
            this.setState({columnRefs: columnRefs.docs})
        });
    }

    loadTasks(boardRef) {
        if (this.taskSub) {
            this.taskSub.unsubscribe();
        }

        this.taskSub = cache.loadTasks(boardRef).subscribe((taskRefs) => {
            this.setState({taskRefs: taskRefs.docs})
        });
    }

    // When the component is destroyed, unsubscribe from all subscriptions
    componentWillUnmount() {
        this.boardSub && this.boardSub.unsubscribe();
        this.colSub && this.colSub.unsubscribe();
        this.taskSub && this.taskSub.unsubscribe();
        this.colGroupsSub && this.colGroupsSub();
        this.columnsSub.forEach(sub => sub());
        if(this.colGroupSub) {
            if(this.colGroupSub.unsubscribe) {
                this.colGroupSub.unsubscribe();
            } else {
                this.colGroupSub();
            }
        }
    }

    render() {
        return (
            <div>
                <BoardActions
                    boardRef={this.state.boardRef ? this.state.boardRef : {}}
                    board={this.state.boardRef ? this.state.boardRef.data() : {}}
                    columnGroupRef={this.state.colGroupRef ? this.state.colGroupRef : {}}
                    columns={this.state.columnRefs ? this.state.columnRefs.map((c) => {
                        let data = c.data();
                        data.id = c.id;
                        return data;
                    }) : []} /* Map the column references to actual columns */
                    allColGroups={this.state.colGroups ? this.state.colGroups : []}
                    allCols={this.state.allColumns ? this.state.allColumns : {}}
                    lockFunctionality={this.props.lockFunctionality}
                />
                <ColumnGroup
                    boardRef={this.state.boardRef ? this.state.boardRef : {}}
                    columnGroupRef={this.state.colGroupRef ? this.state.colGroupRef : {}}
                    columns={this.state.columnRefs ? this.state.columnRefs.map((c) => {
                        let data = c.data();
                        data.id = c.id;
                        return data;
                    }) : []} /* Map the column references to actual columns */
                    columnGroup={this.state.colGroupRef ? this.state.colGroupRef.data() : {}} 
                    taskRefs={this.state.taskRefs}
                    allCols={this.state.allColumns ? this.state.allColumns : {}}
                    lockFunctionality={this.props.lockFunctionality}
                    sortMode={this.props.sortMode}
                />
            </div>
        ); 
    }
}

export default Board;