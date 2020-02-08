import React from 'react';

import BoardActions from '../component/BoardActions';
import ColumnGroup from '../component/ColumnGroup';

function Boards(props) {
    return (
        <div>
            <BoardActions/>
            <ColumnGroup />
        </div>
    );
}

export default Boards;