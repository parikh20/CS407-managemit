import React from 'react';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import IconButton from '@material-ui/core/IconButton';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import { db } from '../../Firebase';

function EditTaskDialog(props) {
    const [open, setOpen] = React.useState(false);
    const [titleError, setTitleError] = React.useState(false);
    const [titleHelperText, setTitleHelperText] = React.useState('');
    const [descError, setDescError] = React.useState(false);
    const [descHelperText, setDescHelperText] = React.useState('');
    const [dateError, setDateError] = React.useState(false);
    const [dateHelperText, setDateHelperText] = React.useState('');
    const [columnError, setColumnError] = React.useState(false);
    const [columnHelperText, setColumnHelperText] = React.useState('');
    const [checklistError, setChecklistError] = React.useState(false);
    const [checklistHelperText, setChecklistHelperText] = React.useState('');
    const [checklistItems, setChecklistItems] = React.useState([]);

    const handleClickOpen = () => {
        clearState();
        clearChecklistErrors();
        setChecklistItems([]);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = () => {
        let label = document.getElementById('taskTitle').value.trim();
        let desc = document.getElementById('taskDescription').value.trim();
        let date = document.getElementById('taskDueDate').valueAsDate;

        let columnElements = document.querySelectorAll('[name="taskColumnGroup"]');
        let columns = {};
        let columnIds = [];
        for (let columnElement of columnElements) {
            if (columnElement.value !== '') {
                columns[columnElement.previousSibling.id] = columnElement.value;
                columnIds.push(columnElement.value);
            }
        }

        let usersElement = document.getElementById('taskUsers');
        let users = usersElement.textContent.split(', '); // temporary solution - this is unpleasant
        users = users.filter(user => user.trim().length > 1);

        clearState();
        let hasError = false;

        if (!label.length) {
            hasError = true;
            setTitleError(true);
            setTitleHelperText('Title is required');
        }
        if (label.length > 500) {
            hasError = true;
            setTitleError(true);
            setTitleHelperText('Title must be less than 500 characters');
        }
        if (desc.length > 5000) {
            hasError = true;
            setDescError(true);
            setDescHelperText('Description must be less than 5000 characters');
        }
        if (!Object.keys(columns).length) {
            hasError = true;
            setColumnError(true);
            setColumnHelperText('At least one column is required');
        }
        const today = new Date();
        today.setHours(0, 0, 0, 0); // We want to check for the current day at midnight
        if (date !== null && date < today) {
            hasError = true;
            setDateError(true);
            setDateHelperText('Date cannot be in the past');
        }

        if (!hasError) {
            setOpen(false);

            db.runTransaction(async (t) => {
                let taskRef = await props.boardRef.ref.collection("tasks").add({
                    title: label,
                    desc: desc,
                    date: date,
                    users: users,
                    columnRefs: columnIds,
                    checklist: checklistItems
                });
                Object.keys(columns).forEach(async (colGroupId) => {
                    let colRef = await props.boardRef.ref.collection('columnGroups').doc(colGroupId).collection('columns').doc(columns[colGroupId]);
                    let taskRefs = (await colRef.get()).data().taskRefs;
                    await colRef.update({
                        taskRefs: [...taskRefs, taskRef.id]
                    });
                });
            });
        }
    }

    const handleAddChecklistItem = () => {
        let checklistItem = document.getElementById('taskChecklist').value.trim();

        clearChecklistErrors();

        if (checklistItem === '') {
            setChecklistError(true);
            setChecklistHelperText('Checklist item cannot be blank');
        } else if (checklistItem.length > 500) {
            setChecklistError(true);
            setChecklistHelperText('Checklist item must be less than 500 characters');
        } else {
            setChecklistItems([...checklistItems, {text: checklistItem, completed: false}]);
            document.getElementById('taskChecklist').value = '';
        }
    };

    const handleChecklistItemStatusChange = (event, index) => {
        let checklistItemsCopy = checklistItems.slice(0);
        checklistItemsCopy[index].completed = event.target.checked;
        setChecklistItems(checklistItemsCopy);
    };

    const handleChecklistItemDelete = (index) => {
        let checklistItemsCopy = checklistItems.slice(0);
        checklistItemsCopy.splice(index, 1);
        setChecklistItems(checklistItemsCopy);
    };

    const clearState = () => {
        setTitleError(false);
        setTitleHelperText('');
        setColumnError(false);
        setColumnHelperText('');
        setDescError(false);
        setDescHelperText('');
        setDateError(false);
        setDateHelperText('');
    };

    const clearChecklistErrors = () => {
        setChecklistError(false);
        setChecklistHelperText('');
    };

    return (
        <div>
            <ButtonGroup size='small'>
                <Button onClick={handleClickOpen}>New task</Button>
            </ButtonGroup>
            <Dialog open={open} onClose={handleClose} aria-labelledby='form-dialog-title'>
                <DialogContent>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <Typography variant='h6' component='h2'>
                                Basic details
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                autoFocus
                                margin='dense'
                                id='taskTitle'
                                label='Title'
                                variant='outlined'
                                fullWidth
                                InputLabelProps={{shrink: true}}
                                error={titleError}
                                helperText={titleHelperText}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                margin='dense'
                                id='taskDescription'
                                label='Description'
                                rows='5'
                                variant='outlined'
                                multiline
                                fullWidth
                                InputLabelProps={{shrink: true}}
                                error={descError}
                                helperText={descHelperText}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                margin='dense'
                                id='taskDueDate'
                                label='Due date'
                                type='date'
                                variant='outlined'
                                fullWidth
                                InputLabelProps={{shrink: true}}
                                error={dateError}
                                helperText={dateHelperText}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                margin='dense'
                                id='taskFile'
                                label='Files'
                                type='file'
                                variant='outlined'
                                fullWidth
                                InputLabelProps={{shrink: true}}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant='h6' component='h2'>
                                Checklist
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                margin='dense'
                                id='taskChecklist'
                                label='New checklist item'
                                variant='outlined'
                                fullWidth
                                InputLabelProps={{shrink: true}}
                                style={{width: '90%'}}
                                error={checklistError}
                                helperText={checklistHelperText}
                            />
                            <IconButton onClick={handleAddChecklistItem} aria-label='add checklist item' style={{float: 'right'}}>
                                <AddIcon />
                            </IconButton>
                        </Grid>
                        {checklistItems.length > 0 && (
                            <Grid item xs={12}>
                                <FormControl component='fieldset'>
                                    <FormGroup>
                                        {checklistItems.map((checklistItem, index) => (
                                            <Grid item xs={12} key={index}>
                                                <FormControlLabel
                                                    control={<Checkbox defaultValue={checklistItem.completed} onClick={(event) => handleChecklistItemStatusChange(event, index)} />}
                                                    label={checklistItem.text}
                                                />
                                                <IconButton onClick={() => handleChecklistItemDelete(index)}>
                                                    <RemoveCircleOutlineIcon />
                                                </IconButton>
                                            </Grid>
                                        ))}
                                    </FormGroup>
                                </FormControl>
                            </Grid>
                        )}
                        <Grid item xs={12}>
                            <Typography variant='h6' component='h2'>
                                Columns and collaborators
                            </Typography>
                        </Grid>
                        {props.allColGroups && Array.isArray(props.allColGroups) && props.allColGroups.map((colGroup, index) => (
                            <div key={colGroup.id} style={{width: '100%'}}>
                                {columnHelperText && (
                                    <Grid item xs={12}>
                                        <Typography variant='caption' color='secondary'>
                                            {columnHelperText}
                                        </Typography>
                                    </Grid>
                                )}
                                <Grid item xs={12}>
                                    <FormControl key={colGroup.id} style={{width: '100%'}}>
                                        <InputLabel id={'group-input-label-' + colGroup.id}>Column for {colGroup.label}</InputLabel>
                                        <Select
                                            id={colGroup.id}
                                            fullWidth
                                            defaultValue=''
                                            margin='dense'
                                            labelId={'group-input-label-' + colGroup.id}
                                            error={columnError}
                                            name='taskColumnGroup'
                                        >
                                            <MenuItem value=''>
                                                (None)
                                            </MenuItem>
                                           {props.allCols && Array.isArray(props.allCols) && props.allCols[index] && props.allCols[index].map((column) => (
                                               <MenuItem key={column.id} value={column.id}>
                                                   {column.label}
                                               </MenuItem>
                                           ))} 
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </div>
                        ))}
                        <Grid item xs={12}>
                            <FormControl style={{width: '100%'}}>
                                <InputLabel id='users-input-label'>Users</InputLabel>
                                <Select
                                    id="taskUsers"
                                    label="Users"
                                    multiple
                                    margin='dense'
                                    fullWidth
                                    defaultValue={[]}
                                    style={{marginTop: 12}}
                                    labelId='users-input-label'
                                >
                                   {props.board.userRefs && props.board.userRefs.map((user) => (
                                       <MenuItem key={user} value={user}>
                                           {user}
                                       </MenuItem>
                                   ))} 
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant='h6' component='h2'>
                                Task relations
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                margin='dense'
                                id='taskDependencies'
                                label='Dependencies'
                                variant='outlined'
                                fullWidth
                                InputLabelProps={{shrink: true}}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                margin='dense'
                                id='taskDependents'
                                label='Dependents'
                                variant='outlined'
                                fullWidth
                                InputLabelProps={{shrink: true}}
                            />
                        </Grid>
                     </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} color='primary'>
                        Create task
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default EditTaskDialog;