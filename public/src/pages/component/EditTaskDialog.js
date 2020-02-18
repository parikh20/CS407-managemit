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

const useStyles = makeStyles(theme => ({
    select: {
        marginTop: 2
    }
}));

function EditTaskDialog(props) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [title, setTitle] = React.useState("");
    const [desc, setDesc] = React.useState("");
    const [columns, setColumns] = React.useState([]);
    const [date, setDate] = React.useState("");
    const [users, setUsers] = React.useState([]);

    const errors = {
        title: null,
        columns: null
    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = () => {
        if(!title.length) {
            errors.title = "Please provide a title for the task!";
        }
        if(!columns.length) {
            errors.columns = "Please select a column"
        }

        if(!errors.title && !errors.columns) {
            props.boardRef.ref.collection("tasks").add({
                title: title,
                desc: desc,
                columns: columns.map((c) => c.id),
                date: date,
                users: users
            }).catch((err) => {
                throw err;
            });
            setOpen(false);
        } else {
            console.log(errors);
        }
    }

    const handleTitleChange = (event) => {
        errors.title = null;
        setTitle(event.target.value)
    }

    const handleDescChange = (event) => {
        setDesc(event.target.value)
    }

    const handleColumnsChange = (event) => {
        errors.columns = null;
        setColumns(event.target.value);
    }

    const handleDateChange = (event) => {
        setDate(event.target.value);
    }

    const handleUsersChange = (event) => {
        setUsers(event.target.value);
    }

    return (
        <div>
            <ButtonGroup size='small'>
                <Button onClick={handleClickOpen}>New task</Button>
            </ButtonGroup>
            <Dialog open={open} onClose={handleClose} aria-labelledby='form-dialog-title'>
                <DialogTitle id='form-dialog-title'>New task</DialogTitle>
                <DialogContent>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <TextField
                                autoFocus
                                margin='dense'
                                id='taskTitle'
                                label='Title'
                                variant='outlined'
                                onChange={handleTitleChange}
                                value={title}
                                fullWidth
                                InputLabelProps={{shrink: true}}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                margin='dense'
                                id='taskDescription'
                                label='Description'
                                rows='5'
                                variant='outlined'
                                onChange={handleDescChange}
                                value={desc}
                                multiline
                                fullWidth
                                InputLabelProps={{shrink: true}}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Select
                                id="taskColumns"
                                label="Columns"
                                multiple
                                fullWidth
                                value={columns}
                                onChange={handleColumnsChange}
                                input={<Input/>}
                                style={{marginTop: 12}}
                            >
                               {props.columns.map((column) => (
                                   <MenuItem key={column.id} value={column}>
                                       {column.label}
                                   </MenuItem>
                               ))} 
                            </Select>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                margin='dense'
                                id='taskDueDate'
                                label='Due date'
                                type='date'
                                variant='outlined'
                                fullWidth
                                value={date}
                                onChange={handleDateChange}
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
                        <Grid item xs={6}>
                            <Select
                                id="taskUsers"
                                label="Users"
                                multiple
                                fullWidth
                                value={users}
                                onChange={handleUsersChange}
                                input={<Input/>}
                                style={{marginTop: 12}}
                            >
                               {props.board.userRefs && props.board.userRefs.map((user) => (
                                   <MenuItem key={user} value={user}>
                                       {user}
                                   </MenuItem>
                               ))} 
                            </Select>
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