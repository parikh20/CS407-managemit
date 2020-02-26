import React from 'react';

import GridList from '@material-ui/core/GridList';

import Column from './Column.js';

function ColumnGroup(props) {
    const columnRefs = props.columnGroup.columnOrder || [];
    const columns = props.columns.filter(column => columnRefs.includes(column.id));
    columns.sort((a, b) => columnRefs.indexOf(a.id) - columnRefs.indexOf(b.id));

    let allColumnNames = {};
    for (let i = 0; i < props.allCols.length; i++) {
        for (let j = 0; j < props.allCols[i].length; j++) {
            let item = props.allCols[i][j];
            allColumnNames[item.id] = item.label;
        }
    }

    return (
        <div style={{maxWidth: 'calc(100% - 10px - 10px)', height: 100 + '%', padding: '10px 10px 0px 10px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', overflow: 'hidden', float: 'left'}}>
            <GridList style={{flexWrap: 'nowrap'}}>
                {columns.map(column => (
                    <Column
                        key={column.label}
                        column={column}
                        columns={columns}
                        boardRef={props.boardRef}
                        columnGroupRef={props.columnGroupRef}
                        taskRefs={props.taskRefs.hasOwnProperty(column.id) ? props.taskRefs[column.id] : []}
                        allColumnNames={allColumnNames}
                        lockFunctionality={props.lockFunctionality}
                        sortMode={props.sortMode}
                    />
                ))}
            </GridList>
        </div> 
    );
}

export default ColumnGroup;