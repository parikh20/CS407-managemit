import React from 'react';

import GridList from '@material-ui/core/GridList';

import Column from './Column.js';

function ColumnGroup(props) {
    const columnRefs = props.columnGroup.columnOrder || [];
    const columns = props.columns.filter(column => columnRefs.includes(column.id));
    columns.sort((a, b) => columnRefs.indexOf(a.id) - columnRefs.indexOf(b.id));

    return (
        <div style={{maxWidth: 'calc(100% - 10px - 10px)', height: 100 + '%', padding: '10px 10px 0px 10px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', overflow: 'hidden', float: 'left'}}>
            <GridList style={{flexWrap: 'nowrap'}}>
                {columns.map(column => (
                    <Column key={column.label} column={column}/>
                ))}
            </GridList>
        </div> 
    );
}

export default ColumnGroup;