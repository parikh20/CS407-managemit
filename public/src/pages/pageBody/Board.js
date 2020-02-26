import React from 'react';

import BoardActions from '../component/BoardActions';
import ColumnGroup from '../component/ColumnGroup';

import { cache } from '../../Firebase';


class Board extends React.Component {

    boardSub;
    colGroupSub;
    colSub;
    allColGroupsSub;
    allColsSubs = [];
    taskSubs = {};

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.state = {
            taskRefs: {},
            allCols: []
        };
        this.loadBoard();
    }

    // Load board based on boardID, then load column group
    loadBoard() {
        this.boardSub = cache.loadBoard(this.props.boardId).subscribe((boardRef) => {
            this.setState({boardRef: boardRef});
            this.loadColGroup(boardRef);
            this.loadAllColGroups();
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

    loadColumns(colGroupRef=null) {
        if (this.colSub) {
            this.colSub.unsubscribe();
        }

        this.colSub = cache.loadColumns(colGroupRef || this.state.colGroupRef).subscribe((columnRefs) => {
            this.setState({columnRefs: columnRefs.docs})
            columnRefs.docs.forEach(columnRef => {
                this.loadTasks(columnRef);
            })
        })
    }

    loadTasks(columnRef) {
        if (this.taskSubs.hasOwnProperty(columnRef.id)) {
            this.taskSubs[columnRef.id]();
        }

        this.taskSubs[columnRef.id] = this.state.boardRef.ref.collection('tasks').where('columnRefs', 'array-contains', columnRef.id).onSnapshot(newTaskRefs => {
            this.setState(prevState => {
                let taskRefs = {...prevState.taskRefs};
                taskRefs[columnRef.id] = newTaskRefs.docs;
                return {taskRefs};
            });
        });
    }

    loadAllColGroups() {
        if (this.allColGroupsSub) {
            this.allColGroupsSub();
        }

        const collection = this.state.boardRef.ref.collection('columnGroups');
        this.allColGroupsSub = collection.orderBy('label', 'asc').onSnapshot(colGroupRefs => {
            let allColGroups = colGroupRefs.docs.map(colGroupRef => {
                let data = colGroupRef.data();
                data.id = colGroupRef.id;
                data.ref = colGroupRef.ref;
                return data;
            });

            this.setState({allColGroups: allColGroups});

            this.loadAllCols();
        });
    }

    loadAllCols() {
        for (let i = 0; i < this.state.allColGroups.length; i++) {
            if (i < this.allColsSubs.length && this.allColsSubs[i]) {
                this.allColsSubs[i]();
            }
            this.allColsSubs = this.state.allColGroups[i].ref.collection('columns').onSnapshot(colRefs => {
                let newAllCols = colRefs.docs.map(colRef => {
                    let data = colRef.data();
                    data.id = colRef.id;
                    return data;
                });

                const columnRefs = this.state.allColGroups[i].columnOrder || [];
                newAllCols.sort((a, b) => columnRefs.indexOf(a.id) - columnRefs.indexOf(b.id));

                let prevAllCols = [...this.state.allCols];
                prevAllCols[i] = newAllCols;
                this.setState({allCols: prevAllCols});
            });
        }
    }

    // When the component is destroyed, unsubscribe from all subscriptions
    componentWillUnmount() {
        this.boardSub && this.boardSub.unsubscribe();
        this.colSub && this.colSub.unsubscribe();
        this.colGroupSub && this.colGroupSub.unsubscribe();
        this.allColGroupsSub && this.allColGroupsSub();
        Object.keys(this.taskSubs).forEach(columnId => {
            this.taskSubs[columnId]();
        });
        this.allColsSubs.forEach(colSub => {
            colSub && colSub();
        });
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
                    allColGroups={this.state.allColGroups ? this.state.allColGroups : {}}
                    allCols={this.state.allCols ? this.state.allCols : {}}
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
                    allCols={this.state.allCols ? this.state.allCols : {}}
                />
            </div>
        ); 
    }
}

export default Board;