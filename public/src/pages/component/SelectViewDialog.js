import React from 'react';
import { useHistory } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { db } from '../../Firebase';

const primaryDark = "#222831"
const secondaryDark = "#30476E"
const darkTextColor = "#c1a57b"
const black = "#000"
const white = "#fff"

const useStyles = makeStyles(theme => ({
    list: {
        backgroundColor: theme.palette.background.paper
    },
    darkButton: {
        color: darkTextColor,
        backgroundColor: secondaryDark
    },
    whiteButton: {
        color: black,
        backgroundColor: white
    }
}));

function SelectViewDialog(props) {
    const classes = useStyles();
    const history = useHistory();
    const user = JSON.parse(localStorage.getItem('user'));
    const [mode, setMode] = React.useState('dark')
    db.collection('users').doc(user.email).get().then(doc => {
        doc.data().darkMode ? setMode("dark") : setMode("white");
    })

    const [open, setOpen] = React.useState(false);

    let colGroups = Array.isArray(props.allColGroups) ? props.allColGroups : [];
    let allCols = props.allCols || {};
    let colGroupDisplay = colGroups.map((colGroup, index) => {
        if (!(colGroup.id in allCols)) {
            return {
                label: colGroup.data().label,
                id: colGroup.id,
                columnNames: []
            };
        }
        let columnNames = allCols[colGroup.id].map(column => column.data().label);
        return {
            label: colGroup.data().label,
            id: colGroup.id,
            columnNames: columnNames
        };
    });
    colGroupDisplay.sort((a, b) => a.label.localeCompare(b.label));

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleViewSelect = (colGroup) => {
        history.push('/board/' + props.boardRef.id + '/' + colGroup.id);
        setOpen(false);
    };

    return (
        <div>
            <ButtonGroup size='small'>
                <Button onClick={handleClickOpen} className={classes[`${mode}Button`]}>Select view</Button>
            </ButtonGroup>
            <Dialog open={open} onClose={handleClose} aria-labelledby='form-dialog-title'>
                <DialogTitle id='form-dialog-title'>Select view</DialogTitle>
                <DialogContent>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <List className={classes.list}>
                                {colGroupDisplay.map((colGroup, index) => (
                                    <ListItem key={colGroup.id} button onClick={() => handleViewSelect(colGroup)}>
                                        <ListItemText primary={colGroup.label} secondary={colGroup.columnNames.join(', ')} />
                                    </ListItem>
                                ))}
                            </List>
                        </Grid>
                     </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default SelectViewDialog;