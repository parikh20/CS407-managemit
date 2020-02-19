import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Typography from '@material-ui/core/Typography';

import { db } from '../../Firebase';

const useStyles = makeStyles(theme => ({
    select: {
        marginTop: 2
    }
}));

function EditTaskDialog(props) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [titleError, setTitleError] = React.useState(false);
    const [titleHelperText, setTitleHelperText] = React.useState('');
    const [columnError, setColumnError] = React.useState(false);
    const [columnHelperText, setColumnHelperText] = React.useState('');

    const handleClickOpen = () => {
        clearState();
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = () => {
        let label = document.getElementById('taskTitle').value.trim();
        let desc = document.getElementById('taskDescription').value.trim();
        let date = document.getElementById('taskDueDate').value;

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

        clearState();
        let hasError = false;

        if (!label.length) {
            hasError = true;
            setTitleError(true);
            setTitleHelperText("Please provide a title for the task!");
        }
        if (!Object.keys(columns).length) {
            hasError = true;
            setColumnError(true);
            setColumnHelperText("Please select at least one column");
        }

        if (!hasError) {
            setOpen(false);

            db.runTransaction(async (t) => {
                let taskRef = await props.boardRef.ref.collection("tasks").add({
                    title: label,
                    desc: desc,
                    date: date,
                    users: users,
                    columnRefs: columnIds
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

    const clearState = () => {
        setTitleError(false);
        setTitleHelperText('');
        setColumnError(false);
        setColumnHelperText('');
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
                            <TextField
                                margin='dense'
                                id='taskChecklist'
                                label='Checklist'
                                variant='outlined'
                                fullWidth
                                InputLabelProps={{shrink: true}}
                            />
                        </Grid>
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
                                           {props.allCols && Array.isArray(props.allCols) && props.allCols[index].map((column) => (
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