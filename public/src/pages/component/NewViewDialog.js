import React from 'react';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';

import { db } from '../../Firebase';
import firebase from '../../Firebase';

function NewViewDialog(props) {
    const [open, setOpen] = React.useState(false);
    const [nameError, setNameError] = React.useState(false);
    const [nameHelperText, setNameHelperText] = React.useState('');
    const [columnError, setColumnError] = React.useState(false);
    const [columnHelperText, setColumnHelperText] = React.useState('');
    const [columnNames, setColumnNames] = React.useState([]);

    const user = JSON.parse(localStorage.getItem('user'));

    let allColGroups = Array.isArray(props.allColGroups) ? props.allColGroups : [];
    let groupNames = allColGroups.map(colGroup => colGroup.data().label);

    const handleClickOpen = () => {
        clearState();
        setColumnNames([]);
        setOpen(true);
    };
    
    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = () => {
        const groupName = document.getElementById('newViewName').value.trim();
        clearState();

        if (groupName === '') {
            setNameError(true);
            setNameHelperText('View name cannot be blank');
        } else if (groupName.length > 50) {
            setNameError(true);
            setNameHelperText('View name must be less than 50 characters');
        } else if (groupNames.includes(groupName)) {
            setNameError(true);
            setNameHelperText('View name is already in use');
        } else {
            db.collection('boards').doc(props.boardRef.id).collection('columnGroups').add({
                label: groupName
            }).then(async (columnGroupRef) => {
                let columnRefs = [];
                for (const title of columnNames) {
                    let colRef = await columnGroupRef.collection('columns').add({
                        label: title,
                        taskRefs: [],        
                    });
                    columnRefs.push(colRef.id);
                }
                await columnGroupRef.set({
                    columnOrder: columnRefs
                }, {merge: true});
            }).then(() => {
                db.collection('boards').doc(props.boardRef.id).collection('history').add(
                    {
                        user: user.email,
                        groupName: groupName,
                        columns: columnNames,
                        action: 15,
                        timestamp: firebase.database.ServerValue
                    }
                ).catch(err => {
                    console.log("Error logging new column: " + err);
                });
                setOpen(false);
            });
        }
    }

    const handleAddColumn = () => {
        const columnName = document.getElementById('newColumnName').value.trim();
        clearColumnState();

        if (columnName === '') {
            setColumnError(true);
            setColumnHelperText('Column name cannot be blank');
        } else if (columnName.length > 50) {
            setColumnError(true);
            setColumnHelperText('Column name must be less than 50 characters');
        } else if (columnNames.includes(columnName)) {
            setColumnError(true);
            setColumnHelperText('Column name is already in use');
        } else {
            setColumnNames([...columnNames, columnName]);
            document.getElementById('newColumnName').value = '';
        }
    };

    const handleDeleteColumn = (columnName) => {
        setColumnNames(columnNames.slice(0).filter(item => item !== columnName));
    }
    
    const clearState = () => {
        setNameError(false);
        setNameHelperText('');
        clearColumnState();
    };

    const clearColumnState = () => {
        setColumnError(false);
        setColumnHelperText('');
    }
    
    return (
        <div>
            <ButtonGroup size='small'>
                <Button onClick={handleClickOpen}>New view</Button>
            </ButtonGroup>
            <Dialog open={open} onClose={handleClose} aria-labelledby='form-dialog-title'>
                <DialogTitle id='form-dialog-title'>New view</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter a name for your new view.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        id='newViewName'
                        label='View name'
                        variant='outlined'
                        fullWidth
                        InputLabelProps={{shrink: true}}
                        error={nameError}
                        helperText={nameHelperText}
                    />
                    <Divider style={{margin: 10}} />
                    <DialogContentText>
                        Optionally, enter a set of columns for your new view. Columns can be added, deleted, renamed, or rearranged later.
                        <br /><br />
                        While not required at this step, at least one column must be added to the board before any tasks can be created.
                    </DialogContentText>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <TextField
                                id='newColumnName'
                                label='Column name'
                                variant='outlined'
                                InputLabelProps={{shrink: true}}
                                error={columnError}
                                helperText={columnHelperText}
                                style={{width: '85%'}}
                            />
                            <Button
                                variant='contained'
                                color='primary'
                                style={{height: '100%', width: '15%'}}
                                onClick={handleAddColumn}
                            >
                                Add
                            </Button>
                        </Grid>
                    </Grid>
                    {columnNames.length > 0 && (<>
                        <Divider style={{margin: 10}} />
                        <DialogContentText>
                            Column names
                        </DialogContentText>
                        <Grid container spacing={1}>
                            <Grid item xs={12}>
                                {columnNames.map(column => (
                                    <Chip label={column} key={column} onDelete={() => handleDeleteColumn(column)} style={{marginLeft: 5, marginRight: 5}} />
                                ))}
                            </Grid>
                        </Grid>
                    </>)}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} color='primary'>
                        Create view
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default NewViewDialog;