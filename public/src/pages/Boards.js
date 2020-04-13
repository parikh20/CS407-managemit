import React from 'react';
import { createBrowserHistory } from 'history';

import NavBar from './component/NavBar';
import Boards from './pageBody/Boards';

export default (props) => {
    const history = createBrowserHistory();

    // Check if we have the query param for sorting
    let sortMode = null;
    if (history.location.search && history.location.search.startsWith('?sort=')) {
        sortMode = history.location.search.substring(6);
        if (!['nameAsc', 'nameDesc', 'descAsc', 'descDesc', 'owner', 'admin', 'users'].includes(sortMode)) {
            sortMode = null;
        }
    }

    return (
        <div>
            <NavBar location={history.location.pathname} sortMode={sortMode} />
            <Boards sortMode={sortMode} params={props.match.params} />
        </div>
    );
};