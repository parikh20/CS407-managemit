import React from 'react';

import BoardActions from '../component/BoardActions';
import ColumnGroup from '../component/ColumnGroup';

import { db } from '../../Firebase';


class Board extends React.Component {

    boardSub;
    colGroupSub;
    colSub;
    allColGroupsSub;
    taskSubs = {};

    constructor(props) {
        super(props);
        this.state = {
            taskRefs: {}
        };
        this.loadBoard();
    }

    // Load board based on boardID, then load column group
    loadBoard() {
        this.boardSub = db.collection("boards").doc(this.props.boardId).onSnapshot((boardRef) => {
            this.setState({boardRef: boardRef});
            this.loadColGroup();
            this.loadAllColGroups();
        });
    }

    // Load column group, then load columns
    loadColGroup(colGroup = null) {

        // If there is already a subscription, unsubscribe
        if (this.colGroupSub) {
            this.colGroupSub();
        }
        const collection = this.state.boardRef.ref.collection("columnGroups");

        // If a parameter was supplied to the function use it, otherwise use default
        colGroup = colGroup || this.state.boardRef.data().defaultColumnGroup;

        // If a default is set (not ""), then use it
        if (colGroup.length) {
            this.colGroupSub = collection.doc(colGroup).onSnapshot((colGroupRef) => {
                this.setState({colGroupRef: colGroupRef});
                this.loadColumns();
            });
        // Otherwise just grab the first colGroup
        } else {
            this.colGroupSub = collection.limit(1).onSnapshot((colGroupRef) => {
                this.setState({colGroupRef: colGroupRef.docs[0]});
                this.loadColumns();
            });
        }
    }

    loadColumns() {
        if (this.colSub) {
            this.colSub();
        }

        this.colSub = this.state.colGroupRef.ref.collection("columns").onSnapshot((columnRefs) => {
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

            for (let i = 0; i < this.state.allColGroups.length; i++) {
                this.state.allColGroups[i].ref.collection('columns').get().then(colRefs => {
                    let allCols = colRefs.docs.map(colRef => {
                        let data = colRef.data();
                        data.id = colRef.id;
                        return data;
                    });

                    const columnRefs = this.state.allColGroups[i].columnOrder || [];
                    allCols.sort((a, b) => columnRefs.indexOf(a.id) - columnRefs.indexOf(b.id));

                    this.setState({allCols: [...(this.state.allCols || []), allCols]});
                });
            }
        });
    }

    // When the component is destroyed, unsubscribe from all subscriptions
    componentWillUnmount() {
        this.boardSub && this.boardSub();
        this.colSub && this.colSub();
        this.colGroupSub && this.colGroupSub();
        this.allColGroupsSub && this.allColGroupsSub();
        Object.keys(this.taskSubs).forEach(columnId => {
            this.taskSubs[columnId]();
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