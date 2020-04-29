import React from 'react';
import { createBrowserHistory } from 'history';
import { makeStyles } from '@material-ui/core/styles';

import NavBar from './component/NavBar';
import Boards from './pageBody/Boards';
import firebase from '../Firebase';


const primaryDark = "#222831"
const secondaryDark = "#30476E"
const darkTextColor = "#c1a57b"
const black = "#000"
const white = "#fff"

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        height: '100%',
        backgroundColor: white
    },
    main: {
        backgroundColor: "#000"
    },
    darkBody: {
        flexGrow: 1,
        color: darkTextColor,
        backgroundColor: primaryDark
    },
    whiteBody: {
        flexGrow: 1,
        color: black,
        backgroundColor: white
    }
}));

export default (props) => {
    const history = createBrowserHistory();
    const user = JSON.parse(localStorage.getItem('user'));
    const db = firebase.firestore();
    const classes = useStyles();
    const [mode, setMode] = React.useState('white');
    db.collection('users').doc(user.email).get().then(doc => {
        doc.data().darkMode ? setMode("dark") : setMode("white");
    });

    mode === 'dark' ? document.body.style.backgroundColor = primaryDark : document.body.style.backgroundColor = white;
    console.log(mode)

    // Check if we have the query param for sorting
    let sortMode = null;
    if (history.location.search && history.location.search.startsWith('?sort=')) {
        sortMode = history.location.search.substring(6);
        if (!['nameAsc', 'nameDesc', 'descAsc', 'descDesc', 'owner', 'admin', 'users'].includes(sortMode)) {
            sortMode = null;
        }
    }

    return (
        <div className={classes[`${mode}Body`]}>
            <NavBar location={history.location.pathname} sortMode={sortMode} />
            <Boards sortMode={sortMode} params={props.match.params} mode={mode}/>
        </div>
    );
};