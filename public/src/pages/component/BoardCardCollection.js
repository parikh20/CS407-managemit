import React from 'react';

import Grid from '@material-ui/core/Grid';

import BoardCard from './BoardCard'


function BoardCardCollection(props) {
    const user = JSON.parse(localStorage.getItem('user'));

    const boards = [...props.boardRefs];
    if (props.sortMode === 'nameAsc' || props.sortMode === null) {
        boards.sort((a, b) => a.label.localeCompare(b.label));
    } else if (props.sortMode === 'nameDesc') {
        boards.sort((a, b) => b.label.localeCompare(a.label));
    } else if (props.sortMode === 'descAsc') {
        boards.sort((a, b) => a.description.localeCompare(b.description));
    } else if (props.sortMode === 'descDesc') {
        boards.sort((a, b) => b.description.localeCompare(a.description));
    } else if (props.sortMode === 'owner') {
        boards.sort((a, b) => {
            const isOwnerOfA = a.owner === user.email;
            const isOwnerOfB = b.owner === user.email;
            if (isOwnerOfA && !isOwnerOfB) {
                return -1;
            }
            if (isOwnerOfB && !isOwnerOfA) {
                return 1;
            }
            return a.label.localeCompare(b.label);
        });
    } else if (props.sortMode === 'admin') {
        boards.sort((a, b) => {
            const isAdminOfA = a.permissions[user.email] && a.permissions[user.email].isAdmin;
            const isAdminOfB = b.permissions[user.email] && b.permissions[user.email].isAdmin;
            if (isAdminOfA && !isAdminOfB) {
                return -1;
            }
            if (isAdminOfB && !isAdminOfA) {
                return 1;
            }
            return a.label.localeCompare(b.label);
        });
    } else if (props.sortMode === 'users') {
        boards.sort((a, b) => {
            const numUsersA = a.userRefs.length;
            const numUsersB = b.userRefs.length;
            if (numUsersA > numUsersB) {
                return -1;
            }
            if (numUsersB > numUsersA) {
                return 1;
            }
            return a.label.localeCompare(b.label);
        }); 
    }

    return (
        <div style={{width: 80 + '%', margin: '10px auto 0px auto'}}>
            <Grid container spacing={3}>
                {boards.map(board => (
                    <BoardCard key={board.id} board={board} />
                ))}
            </Grid>
        </div>
    );
}

export default BoardCardCollection;