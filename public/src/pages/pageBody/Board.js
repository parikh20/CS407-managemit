import React, { useEffect } from 'react';

import BoardActions from '../component/BoardActions';
import ColumnGroup from '../component/ColumnGroup';

import {db} from '../../Firebase';


class Board extends React.Component {

    boardSub;
    colGroupSub;
    colSub;

    constructor(props) {
        super(props);
        this.state = {}
        this.loadBoard();
    }

    // Load board based on boardID, then load column group
    loadBoard() {
        this.boardSub = db.collection("boards").doc(this.props.boardId).onSnapshot((boardRef) => {
            this.setState({boardRef: boardRef});
            this.loadColGroup();
        });
    }

    // Load column group, then load columns
    loadColGroup(colGroup=null) {

        // If there is already a subscription, unsubscribe
        if(this.colGroupSub) {
            this.colGroupSub();
        }

        const collection = this.state.boardRef.ref.collection("columnGroups");

        // If a parameter was supplied to the function use it, otherwise use default
        colGroup = colGroup || this.state.boardRef.data().defaultColumnGroup;

        // If a default is set (not ""), then use it
        if(colGroup.length) {
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
        if(this.colSub) {
            this.colSub();
        }

        this.state.colGroupRef.ref.collection("columns").onSnapshot((columnRefs) => {
            this.setState({columnRefs: columnRefs.docs})
        })
    }

    // When the component is destroyed, unsubscribe from all subscriptions
    componentWillUnmount() {
        this.boardSub();
        this.colSub();
        this.colGroupSub();
    }

    render() {
        return (
            <div>
                <BoardActions
                    board={this.state.boardRef ? this.state.boardRef.data() : {}}
                    columnGroup={this.state.columnGroupRef ? this.state.columnGroupRef.data() : {}}
                    columns={this.state.columnRefs ? this.state.columnRefs.map((c) => c.data()) : []}
                />
                <ColumnGroup
                    columns={this.state.columnRefs ? this.state.columnRefs.map((c) => c.data()) : []} /* Map the column references to actual columns */
                />
            </div>
        ); 
    }
}

export default Board;