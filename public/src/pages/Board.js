import React from 'react';

import BoardActions from '../BoardActions';
import ColumnGroup from '../ColumnGroup';

function Boards(props) {
    return (
        <div>
            <BoardActions/>
            <ColumnGroup />
        </div>
    );
}

export default Boards;