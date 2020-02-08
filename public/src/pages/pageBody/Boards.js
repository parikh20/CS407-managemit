import React from 'react';

import BoardsActions from '../component/BoardsActions';
import BoardCardCollection from '../component/BoardCardCollection';

function Boards(props) {
    return (
        <div>
            <BoardsActions />
            <BoardCardCollection />
        </div>
    );
}

export default Boards;