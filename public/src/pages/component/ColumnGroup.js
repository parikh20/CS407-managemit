import React from 'react';

import GridList from '@material-ui/core/GridList';

import Column from './Column.js';

function ColumnGroup(props) {
    const columnRefs = props.columnGroup.columnRefs || [];
    props.columns.sort((a, b) => columnRefs.indexOf(a.id) - columnRefs.indexOf(b.id));

    return (
        <div style={{height: 100 + '%', padding: '10px 10px 0px 10px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', overflow: 'hidden', float: 'left'}}>
            <GridList style={{flexWrap: 'nowrap'}}>
                {props.columns.map(column => (
                    <Column board={props.board} column={column} columnName={column.label} />
                ))}
            </GridList>
        </div>
    );
}

export default ColumnGroup;