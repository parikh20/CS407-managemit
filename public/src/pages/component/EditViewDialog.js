import React from 'react';
import { useHistory } from 'react-router-dom';

import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Divider from '@material-ui/core/Divider';
import CheckIcon from '@material-ui/icons/Check';
import IconButton from '@material-ui/core/IconButton';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import { db } from '../../Firebase';
import { dispatchUserNotifications } from '../../Notifications';

import { makeStyles } from '@material-ui/core/styles';


const primaryDark = "#222831"
const secondaryDark = "#30476E"
const darkTextColor = "#c1a57b"
const black = "#000"
const white = "#fff"

const useStyles = makeStyles(theme => ({
    darkButton: {
        color: darkTextColor,
        backgroundColor: secondaryDark
    },
    whiteButton: {
        color: black,
        backgroundColor: white
    }
}));

function EditViewDialog(props) {
    const [open, setOpen] = React.useState(false);
    const [errors, setErrors] = React.useState({});
    const [errorText, setErrorText] = React.useState({});
    const [deleteDisable, setDeleteDisable] = React.useState({});

    const user = JSON.parse(localStorage.getItem('user'));
    const history = useHistory();
    const classes = useStyles();
    const [mode, setMode] = React.useState('dark')
    db.collection('users').doc(user.email).get().then(doc => {
        doc.data().darkMode ? setMode("dark") : setMode("white");
    })

    let colGroups = Array.isArray(props.allColGroups) ? props.allColGroups : [];
    let allCols = props.allCols || {};
    let defaultDeleteDisable = {};
    let colGroupDisplay = colGroups.map((colGroup, index) => {
        if (!(colGroup.id in allCols)) {
            return {
                label: colGroup.data().label,
                id: colGroup.id,
                columnNames: []
            };
        }
        let columnNames = allCols[colGroup.id].map(column => column.data().label);
        defaultDeleteDisable[colGroup.id] = true;
        return {
            label: colGroup.data().label,
            id: colGroup.id,
            columnNames: columnNames
        };
    });
    colGroupDisplay.sort((a, b) => a.label.localeCompare(b.label));

    let allGroupNames = colGroupDisplay.map(colGroup => colGroup.label);


    const handleClickOpen = () => {
        clearAllState();
        setDeleteDisable(defaultDeleteDisable);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const clearAllState = () => {
        setErrors({});
        setErrorText({});
    };

    const clearState = groupId => {
        let errorsCopy = Object.assign({}, errors);
        errorsCopy[groupId] = false;
        setErrors(errorsCopy);

        let errorTextCopy = Object.assign({}, errorText);
        errorTextCopy[groupId] = '';
        setErrorText(errorTextCopy);
    }

    const addError = (groupId, message) => {
        let errorsCopy = Object.assign({}, errors);
        errorsCopy[groupId] = true;
        setErrors(errorsCopy);

        let errorTextCopy = Object.assign({}, errorText);
        errorTextCopy[groupId] = message;
        setErrorText(errorTextCopy);
    };

    const setDisableStatus = (groupId, status) => {
        let deleteDisableCopy = Object.assign({}, deleteDisable);
        deleteDisableCopy[groupId] = status;
        setDeleteDisable(deleteDisableCopy);
    };

    const handleRename = colGroup => {
        const newValue = document.getElementById('groupName-' + colGroup.id).value.trim();
        const oldValue = colGroup.label;

        clearState(colGroup.id);

        if (newValue === colGroup.label) {
            addError(colGroup.id, 'View name is unchanged');
        } else if (allGroupNames.includes(newValue)) {
            addError(colGroup.id, 'View name is already in use');
        } else if (newValue === '') {
            addError(colGroup.id, 'View name cannot be blank');
        } else if (newValue.length > 50) {
            addError(colGroup.id, 'View name must be less than 50 characters');
        } else {
            props.boardRef.ref.collection('columnGroups').doc(colGroup.id).update({
                label: newValue
            }).then(() => {
                const emailText = 'View "' + oldValue + '" renamed to "' + newValue + '"';
                props.boardRef.ref.collection('history').add(
                    {
                        user: user.email,
                        groupName: newValue,
                        groupName2: oldValue,
                        action: 16,
                        timestamp: new Date(),
                        actionText: emailText
                    }
                ).catch(err => {
                    console.log("Error logging rename view: " + err);
                });
                dispatchUserNotifications(props.boardRef.data(), user, emailText, {
                    user: user.email,
                    userIsOwner: props.boardRef.data().owner === user.email,
                    action: 16,
                    timestamp: new Date(),
                    board: props.boardRef.data().label,
                    boardId: props.boardRef.id,
                    groupName: newValue,
                    groupName2: oldValue,
                    unread: true
                });
            })
        }
    };

    const handleDelete = colGroup => {
        const verifyName = document.getElementById('groupNameConfirmation-' + colGroup.id).value;
        if (verifyName === colGroup.label) {
            setOpen(false);

            db.runTransaction(async (t) => {
                const colGroupRef = await db.collection('boards').doc(props.boardRef.id).collection('columnGroups').doc(colGroup.id);
                let columnRefs = await colGroupRef.collection('columns').get();
                let columnIds = [];
                for (const columnRef of columnRefs.docs) {
                    columnIds.push(columnRef.id);
                }

                props.taskRefs.forEach(async (taskRef) => {
                    let columnRefs = taskRef.data().columnRefs;

                    // If this task is only in this column, delete it. Otherwise, just remove this column from its list.
                    if (columnRefs.length === 1 && columnIds.includes(columnRefs[0])) {
                        taskRef.ref.delete();
                    } else {
                        taskRef.ref.update({
                            columnRefs: columnRefs.filter(columnRef => !columnIds.includes(columnRef))
                        });
                    }
                });
                
                await colGroupRef.delete();

                const emailText = 'View "' + colGroup.label + '" deleted';
                await db.collection('boards').doc(props.boardRef.id).collection('history').add(
                    {
                        user: user.email,
                        groupName: colGroup.label,
                        action: 17,
                        timestamp: new Date(),
                        actionText: emailText
                    }
                );

                dispatchUserNotifications(props.boardRef.data(), user, emailText, {
                    user: user.email,
                    userIsOwner: props.boardRef.data().owner === user.email,
                    action: 17,
                    timestamp: new Date(),
                    board: props.boardRef.data().label,
                    boardId: props.boardRef.id,
                    groupName: colGroup.label,
                    unread: true
                });

                if (props.currentGroupId === colGroup.id) {
                    history.push('/board/' + props.boardRef.id);
                }
            });
        }
    };

    const handleSetDefault = colGroup => {
        props.boardRef.ref.update({
            defaultColumnGroup: colGroup.id
        }).then(result => {
            const emailText = 'View "' + colGroup.label + '" set to default view';
            db.collection('boards').doc(props.boardRef.id).collection('history').add(
                {
                    user: user.email,
                    groupName: colGroup.label,
                    action: 18,
                    timestamp: new Date(),
                    actionText: emailText
                }
            ).catch(err => {
                console.log("Error logging change default view: " + err);
            });

            dispatchUserNotifications(props.boardRef.data(), user, emailText, {
                user: user.email,
                userIsOwner: props.boardRef.data().owner === user.email,
                action: 18,
                timestamp: new Date(),
                board: props.boardRef.data().label,
                boardId: props.boardRef.id,
                groupName: colGroup.label,
                unread: true
            });
        });
    };

    const inputListener = (event, colGroup) => {
        if (event.target.value === colGroup.label) {
            setDisableStatus(colGroup.id, false);
        } else {
            setDisableStatus(colGroup.id, true);
        }
    };

    return (
        <>
            <ButtonGroup size='small'>
                <Button {...props} onClick={handleClickOpen}className={classes[`${mode}Button`]}>Edit views</Button>
            </ButtonGroup>
            <Dialog open={open} onClose={handleClose} aria-labelledby='form-dialog-title'>
                <DialogTitle id='form-dialog-title'>Edit views</DialogTitle>
                <DialogContent>
                    {colGroupDisplay && colGroupDisplay.map((colGroup, index) => (
                        <ExpansionPanel key={colGroup.id}>
                            <ExpansionPanelSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls={'panel' + index + 'content'}
                                id={'panel' + index + 'header'}
                            >
                                <Typography>{colGroup.label}</Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                                <Grid container>
                                    <Grid item xs={12}>
                                        <TextField
                                            autoFocus
                                            margin='dense'
                                            id={'groupName-' + colGroup.id}
                                            label='Rename view'
                                            variant='outlined'
                                            fullWidth
                                            InputLabelProps={{shrink: true}} 
                                            error={errors[colGroup.id] === true}
                                            helperText={errorText[colGroup.id] || ''}
                                            defaultValue={colGroup.label}
                                            style={{width: 90 + '%'}}
                                        />
                                        <IconButton aria-label='rename view' style={{float: 'right'}} onClick={() => handleRename(colGroup)}>
                                            <CheckIcon />
                                        </IconButton>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Divider style={{margin: 10}} />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography component='p'>
                                            Type the view name to confirm deletion.<br /><br />Warning: this cannot be undone. Any tasks associated with only this view will be lost.
                                        </Typography>
                                        {colGroupDisplay.length === 1 && (
                                            <Typography component='p' color='secondary'>
                                                At least one view is required. To delete this view, create another one first.
                                            </Typography>
                                        )}
                                        {props.boardRef.data().defaultColumnGroup === colGroup.id && (
                                            <Typography component='p' color='secondary'>
                                                The default view cannot be deleted. To delete this view, set another view as default first.
                                            </Typography>
                                        )}
                                        <TextField
                                            margin='dense'
                                            id={'groupNameConfirmation-' + colGroup.id}
                                            label='View name confirmation'
                                            variant='outlined'
                                            fullWidth
                                            color='secondary'
                                            InputLabelProps={{shrink: true}}
                                            style={{width: 90 + '%'}}
                                            onChange={(e) => inputListener(e, colGroup)}
                                            disabled={colGroupDisplay.length === 1 || props.boardRef.data().defaultColumnGroup === colGroup.id}
                                        />
                                        <IconButton aria-label='delete view' style={{float: 'right'}} disabled={colGroupDisplay.length === 1  || props.boardRef.data().defaultColumnGroup === colGroup.id || deleteDisable[colGroup.id] || false} onClick={() => handleDelete(colGroup)}>
                                            <CheckIcon />
                                        </IconButton>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Divider style={{margin: 10}} />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormControlLabel control={
                                            <Checkbox
                                                color='primary'
                                                checked={props.boardRef.data().defaultColumnGroup === colGroup.id}
                                                disabled={props.boardRef.data().defaultColumnGroup === colGroup.id}
                                                onChange={() => handleSetDefault(colGroup)}
                                            />
                                        } label='Make this the default view' />
                                    </Grid>
                                </Grid>
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                    ))}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default EditViewDialog;