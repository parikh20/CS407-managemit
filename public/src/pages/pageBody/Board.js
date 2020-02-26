import React from 'react';

import BoardActions from '../component/BoardActions';
import ColumnGroup from '../component/ColumnGroup';

import { db, cache } from '../../Firebase';


class Board extends React.Component {

    boardSub;
    colGroupSub;
    colSub;

    constructor(props) {
        super(props);
        this.state = {
            boardRef: {}
        };
    }

    componentDidMount() {
        this.loadBoard();
    }

    // Load board based on boardID, then load column group
    loadBoard() {
        this.boardSub = cache.loadBoard(this.props.boardId).subscribe((boardRef) => {
            this.setState({boardRef: boardRef});
            this.loadColGroup(boardRef);
        });
    }

    // Load column group, then load columns
    loadColGroup(boardRef, colGroup=null) {
        // If there is already a subscription, unsubscribe
        if(this.colGroupSub) {
            this.colGroupSub();
        }
        const collection = boardRef.ref.collection("columnGroups");

        // If a parameter was supplied to the function use it, otherwise use default
        colGroup = colGroup || boardRef.data().defaultColumnGroup;

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

        this.colSub = this.state.colGroupRef.ref.collection("columns").onSnapshot((columnRefs) => {
            this.setState({columnRefs: columnRefs.docs})
        })
    }

    // When the component is destroyed, unsubscribe from all subscriptions
    componentWillUnmount() {
        this.boardSub && this.boardSub.unsubscribe();
        this.colSub && this.colSub();
        this.colGroupSub && this.colGroupSub();
    }

    render() {
        return (
            <div>
                <BoardActions
                    boardRef={this.state.boardRef ? this.state.boardRef : {}}
                    board={this.state.boardRef.data ? this.state.boardRef.data() : {}}
                    columnGroupRef={this.state.colGroupRef ? this.state.colGroupRef : {}}
                    columns={this.state.columnRefs ? this.state.columnRefs.map((c) => {
                        let data = c.data();
                        data.id = c.id;
                        return data;
                    }) : []} /* Map the column references to actual columns */
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
                />
            </div>
        ); 
    }
}

export default Board;