import React from 'react';

import BoardsActions from '../BoardsActions';
import BoardCardCollection from '../BoardCardCollection';

function Boards(props) {
    return (
        <div>
            <BoardsActions />
            <BoardCardCollection />
        </div>
    );
}

export default Boards;