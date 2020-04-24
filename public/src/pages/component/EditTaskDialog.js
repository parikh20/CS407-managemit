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
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Chip from '@material-ui/core/Chip';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import Link from '@material-ui/core/Link';

import dateFormat from 'dateformat';

import { db } from '../../Firebase';
import firebase from '../../Firebase';
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


function Alert(props) {
    return <MuiAlert elevation={6} variant='filled' {...props} />;
}

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
    const [fileAttachments, setFileAttachments] = React.useState({});
    const [successSnackbar, setSuccessSnackbar] = React.useState(false);
    const [warningSnackbar, setWarningSnackbar] = React.useState(false);
    let [selectedUsers, setSelectedUsers] = React.useState([]);
    let [selectedDependencies, setSelectedDependencies] = React.useState([]); // using let here is not good practice, but is 'required' - 
    let [selectedDependents, setSelectedDependents] = React.useState([]);     // in other words, I didn't want to rewrite a bunch of stuff
    const [hasModifiedDependencies, setHasModifiedDependencies] = React.useState(false);
    const [hasModifiedDependents, setHasModifiedDependents] = React.useState(false);
    const [hasModifiedUsers, setHasModifiedUsers] = React.useState(false);

    const user = JSON.parse(localStorage.getItem('user'));
    const classes = useStyles();
    const [mode, setMode] = React.useState('dark')
    db.collection('users').doc(user.email).get().then(doc => {
        doc.data().darkMode ? setMode("dark") : setMode("white");
    })

    let allTasks = [];
    if (props.taskRefs && Array.isArray(props.taskRefs)) {
        allTasks = props.taskRefs.map(taskRef => {
            return {
                id: taskRef.id,
                title: taskRef.data().title
            };
        });
        allTasks.sort((a, b) => a.title.localeCompare(b.title));
    }

    let allTasksById = {};
    if (props.taskRefs && Array.isArray(props.taskRefs)) {
        for (const taskRef of props.taskRefs) {
            allTasksById[taskRef.id] = taskRef;
        }
    }

    let allTasksNameDisplay = {};
    if (props.taskRefs && Array.isArray(props.taskRefs)) {
        for (const task of allTasks) {
            allTasksNameDisplay[task.id] = task.title;
        }
    }

    // Pre-fill file attachments, if possible
    let defaultFileAttachments = {};
    if (props.existingTask) {
        for (const fileRef of props.existingTask.fileRefs) {
            defaultFileAttachments[fileRef] = true;
        }
    }

    // Pre-fill checklist items, if possible
    let defaultChecklistItems = [];
    if (props.existingTask) {
        for (const checklistItem of props.existingTask.checklist) {
            defaultChecklistItems.push(Object.assign({}, checklistItem));
        }
    }

    const handleClickOpen = () => {
        clearState();
        clearChecklistErrors();
        setChecklistItems([]);
        setFileAttachments({});
        setSuccessSnackbar(false);
        setWarningSnackbar(false);
        setSelectedUsers([]);
        setSelectedDependents([]);
        setSelectedDependencies([]);
        setHasModifiedDependencies(false);
        setHasModifiedDependents(false);
        setHasModifiedUsers(false);

        setFileAttachments(defaultFileAttachments);
        setChecklistItems(defaultChecklistItems);

        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSuccessSnackbar(false);
        setWarningSnackbar(false);
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setSuccessSnackbar(false);
        setWarningSnackbar(false);
    };

    const handleSubmit = () => {
        const editMode = props.existingTask ? true : false;

        let label = document.getElementById('taskTitle').value.trim();
        let desc = document.getElementById('taskDescription').value.trim();
        let date = document.getElementById('taskDueDate').valueAsDate;

        // date inputs give UTC dates, so we need to convert that to the local timezone
        if (date !== null) {
            date = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
        }

        let columnElements = document.querySelectorAll('[name="taskColumnGroup"]');
        let columns = {};
        let columnIds = [];
        for (let columnElement of columnElements) {
            if (columnElement.value !== '') {
                columns[columnElement.previousSibling.id] = columnElement.value;
                columnIds.push(columnElement.value);
            }
        }

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
            if (!editMode || (editMode && date.getTime() !== props.existingTask.date.toDate().getTime())) {
                hasError = true;
                setDateError(true);
                setDateHelperText('Date cannot be in the past');
            }
        }

        let files = [];
        for (const file of Object.keys(fileAttachments)) {
            if (fileAttachments[file]) {
                files.push(file);
            }
        }

        if (!hasError) {
            setOpen(false);

            if (editMode) {
                if (!hasModifiedDependencies) {
                    selectedDependencies = props.existingTask.dependencies;
                }
                if (!hasModifiedDependents) {
                    selectedDependents = props.existingTask.dependents;
                }
                if (!hasModifiedUsers) {
                    selectedUsers = props.existingTask.users;
                }

                let prevColumnRefs = [...props.existingTask.columnRefs];
                let removedDependencies = props.existingTask.dependencies.filter(item => !selectedDependencies.includes(item) && item.trim() !== '');
                let removedDependents = props.existingTask.dependents.filter(item => !selectedDependents.includes(item) && item.trim() !== '');
                let newColumnRefs = columnIds.filter(item => !prevColumnRefs.includes(item));

                props.boardRef.ref.collection('tasks').doc(props.existingTaskRef.id).update({
                    title: label,
                    desc: desc,
                    date: date,
                    users: selectedUsers,
                    columnRefs: columnIds,
                    checklist: checklistItems,
                    fileRefs: files,
                    dependencies: selectedDependencies.filter(item => item.trim() !== ''),
                    dependents: selectedDependents.filter(item => item.trim() !== '')
                }).then(taskRef => {
                    let updates = [];
                    Object.keys(columns).forEach((colGroupId) => {
                        if (newColumnRefs.includes(columns[colGroupId])) {
                            updates.push(
                                props.boardRef.ref.collection("columnGroups").doc(colGroupId).collection("columns").doc(columns[colGroupId]).update({
                                    taskRefs: firebase.firestore.FieldValue.arrayUnion(props.existingTaskRef.id)
                                })
                            );
                        }
                    });
                    selectedDependencies.forEach(dependency => {
                        updates.push(
                            props.boardRef.ref.collection('tasks').doc(dependency).update({
                                dependents: firebase.firestore.FieldValue.arrayUnion(props.existingTaskRef.id)
                            })
                        );
                    });
                    selectedDependents.forEach(dependent => {
                        updates.push(
                            props.boardRef.ref.collection('tasks').doc(dependent).update({
                                dependencies: firebase.firestore.FieldValue.arrayUnion(props.existingTaskRef.id)
                            })
                        );
                    });
                    removedDependencies.forEach(dependency => {
                        updates.push(
                            props.boardRef.ref.collection('tasks').doc(dependency).update({
                                dependents: allTasksById[dependency].data().dependents.filter(item => item !== props.existingTaskRef.id)
                            })
                        );
                    });
                    removedDependents.forEach(dependent => {
                        updates.push(
                            props.boardRef.ref.collection('tasks').doc(dependent).update({
                                dependencies: allTasksById[dependent].data().dependencies.filter(item => item !== props.existingTaskRef.id)
                            })
                        );
                    });
                    return Promise.all(updates);
                }).then(result => {
                    const emailText = 'Task "' + label + '" edited';
                    dispatchUserNotifications(props.boardRef.data(), user, emailText, {
                        user: user.email,
                        userIsOwner: props.boardRef.data().owner === user.email,
                        action: 21,
                        timestamp: new Date(),
                        board: props.boardRef.data().label,
                        boardId: props.boardRef.id,
                        taskName: label,
                        unread: true
                    });
                    return db.collection('boards').doc(props.boardRef.id).collection('history').add({
                            user: user.email,
                            taskName: label,
                            action: 21,
                            timestamp: new Date(),
                            actionText: emailText
                        });
                }).catch(err => console.error("Error in editing task:", err));
            } else {
                props.boardRef.ref.collection("tasks").add({
                    title: label,
                    desc: desc,
                    date: date,
                    users: selectedUsers,
                    columnRefs: columnIds,
                    checklist: checklistItems,
                    fileRefs: files,
                    dependencies: selectedDependencies.filter(item => item.trim() !== ''),
                    dependents: selectedDependents.filter(item => item.trim() !== '')
                }).then((taskRef) => {
                    let updates = [];
                    Object.keys(columns).forEach((colGroupId) => {
                        updates.push(
                            props.boardRef.ref.collection("columnGroups").doc(colGroupId).collection("columns").doc(columns[colGroupId]).update({
                                taskRefs: firebase.firestore.FieldValue.arrayUnion(taskRef.id)
                            })
                        );
                    });
                    selectedDependencies.forEach(dependency => {
                        updates.push(
                            props.boardRef.ref.collection('tasks').doc(dependency).update({
                                dependents: firebase.firestore.FieldValue.arrayUnion(taskRef.id)
                            })
                        );
                    });
                    selectedDependents.forEach(dependent => {
                        updates.push(
                            props.boardRef.ref.collection('tasks').doc(dependent).update({
                                dependencies: firebase.firestore.FieldValue.arrayUnion(taskRef.id)
                            })
                        );
                    });
                    return Promise.all(updates);
                }).then(result => {
                    const emailText = 'Task "' + label + '" created';
                    dispatchUserNotifications(props.boardRef.data(), user, emailText, {
                        user: user.email,
                        userIsOwner: props.boardRef.data().owner === user.email,
                        action: 7,
                        timestamp: new Date(),
                        board: props.boardRef.data().label,
                        boardId: props.boardRef.id,
                        taskName: label,
                        unread: true
                    });
                    return db.collection('boards').doc(props.boardRef.id).collection('history').add({
                            user: user.email,
                            taskName: label,
                            action: 7,
                            timestamp: new Date(),
                            actionText: emailText
                        });
                }).catch(err => console.error("Error in adding task:", err));
            }
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

    const handleFileUpload = () => {
        const files = document.getElementById('taskFile').files;

        setSuccessSnackbar(false);
        setWarningSnackbar(false);

        if (files.length === 0) {
            setWarningSnackbar(true);
            return;
        }

        for (const file of files) {
            let filePath = props.boardRef.id + '/uploadedFiles/' + Date.now() + '-' + file.name;
            const storageRef = firebase.storage().ref(filePath);
            storageRef.put(file).then(() => {
                db.collection('boards').doc(props.boardRef.id).collection('files').add({
                    fileName: file.name,
                    filePath: filePath,
                    uploadedBy: user.email,
                    timestamp: new Date()
                }).then(() => {
                    const emailText = 'Document "' + file.name + '" uploaded';
                    db.collection('boards').doc(props.boardRef.id).collection('history').add(
                        {
                            user: user.email,
                            fileName: file.name,
                            action: 19,
                            timestamp: new Date(),
                            actionText: emailText
                        }
                    ).catch(err => {
                        console.log("Error logging new file upload: " + err);
                    });
                    dispatchUserNotifications(props.boardRef.data(), user, emailText, {
                        user: user.email,
                        userIsOwner: props.boardRef.data().owner === user.email,
                        action: 19,
                        timestamp: new Date(),
                        board: props.boardRef.data().label,
                        boardId: props.boardRef.id,
                        fileName: file.name,
                        unread: true
                    });
                });
            });
        }
        document.getElementById('taskFile').value = null;

        setSuccessSnackbar(true);
    };

    const handleFileAttachment = (event, fileRef) => {
        let fileAttachmentsCopy = Object.assign({}, fileAttachments);
        fileAttachmentsCopy[fileRef.id] = event.target.checked;
        setFileAttachments(fileAttachmentsCopy);
    };

    const handleDocumentClick = rowData => {
        const storageRef = firebase.storage().ref(rowData.filePath);
        storageRef.getDownloadURL().then(url => {
            window.open(url, '_blank');
        });
    };

    const handleUserSelect = event => {
        setSelectedUsers(event.target.value);
        setHasModifiedUsers(true);
    };

    const handleDependenciesSelect = event => {
        setSelectedDependencies(event.target.value);
        setHasModifiedDependencies(true);
    };

    const handleDependentsSelect = event => {
        setSelectedDependents(event.target.value);
        setHasModifiedDependents(true);
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
        <>
            <ButtonGroup size={props.buttonSize ? props.buttonSize : 'small'}>
                <Button onClick={handleClickOpen} className={classes[`${mode}Button`]} variant={props.buttonVariant ? props.buttonVariant : 'outlined'}>{props.buttonText ? props.buttonText : 'New task'}</Button>
            </ButtonGroup>
            <Dialog open={open} onClose={handleClose} aria-labelledby='form-dialog-title' fullWidth={true} maxWidth='md'>
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
                                defaultValue={props.existingTask ? props.existingTask.title : ''}
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
                                defaultValue={props.existingTask ? props.existingTask.desc : ''}
                            />
                        </Grid>
                        <Grid item xs={12}>
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
                                defaultValue={props.existingTask && props.existingTask.date ? dateFormat(props.existingTask.date.toDate(), 'yyyy-mm-dd') : ''}
                                /* The above defaultValue may or may not actually be the user-displayed selected date - this is OS, browser, and locale-
                                   dependent. Setting it to a standard ISO date seems to work regardless though */
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant='h6' component='h2'>
                                Files
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                margin='dense'
                                id='taskFile'
                                label='Upload new file'
                                type='file'
                                variant='outlined'
                                fullWidth
                                InputLabelProps={{shrink: true}}
                                style={{width: 92 + '%'}}
                            />
                            <IconButton aria-label='upload file' onClick={() => handleFileUpload()} style={{float: 'right'}}>
                                <CloudUploadIcon />
                            </IconButton>
                        </Grid>
                        <Grid item xs={12}>
                            <ExpansionPanel>
                                <ExpansionPanelSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls='files_content'
                                    id='files_header'
                                >
                                    <Typography>Select files to attach</Typography>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                    <TableContainer>
                                        <Table size='small'>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Attach file</TableCell>
                                                    <TableCell>Date uploaded</TableCell>
                                                    <TableCell>Uploaded by</TableCell>
                                                    <TableCell>Filename</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {props.fileRefs && props.fileRefs.map(fileRef => (
                                                    <TableRow key={fileRef.id}>
                                                        <TableCell>
                                                            <Checkbox
                                                                color='default'
                                                                value={fileRef.id}
                                                                onClick={(e) => handleFileAttachment(e, fileRef)}
                                                                checked={fileAttachments[fileRef.id]}
                                                            />
                                                        </TableCell>
                                                        <TableCell>{dateFormat(fileRef.data().timestamp.toDate(), 'mm/dd/yyyy hh:MM')}</TableCell>
                                                        <TableCell><Chip size='small' label={fileRef.data().uploadedBy} color='primary' variant={props.boardRef.data().owner === fileRef.data().uploadedBy ? 'default': 'outlined'} /></TableCell>
                                                        <TableCell><Link onClick={() => handleDocumentClick(fileRef.data())} style={{cursor: 'pointer'}}>{fileRef.data().fileName}</Link></TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
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
                                style={{width: '92%'}}
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
                                                    control={
                                                        <Checkbox
                                                            checked={checklistItem.completed}
                                                            onClick={(event) => handleChecklistItemStatusChange(event, index)
                                                    } />}
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
                                Columns
                            </Typography>
                        </Grid>
                        {props.allColGroups && props.allColGroups.sort((a, b) => a.data().label.localeCompare(b.data().label)).map((colGroup) => (
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
                                        <InputLabel id={'group-input-label-' + colGroup.id}>Column for {colGroup.data().label}</InputLabel>
                                        <Select
                                            id={colGroup.id}
                                            fullWidth
                                            margin='dense'
                                            labelId={'group-input-label-' + colGroup.id}
                                            error={columnError}
                                            name='taskColumnGroup'
                                            defaultValue={props.existingTask && props.existingTask.columnRefs.filter(item => props.allCols[colGroup.id].map(colRef => colRef.id).includes(item)).length > 0 ? props.existingTask.columnRefs.filter(item => props.allCols[colGroup.id].map(colRef => colRef.id).includes(item))[0] : ''}
                                            /* that line is awful */
                                        >
                                            <MenuItem value=''>
                                                (None)
                                            </MenuItem>
                                           {props.allCols && props.allCols[colGroup.id] && props.allCols[colGroup.id].map((column) => (
                                               <MenuItem key={column.id} value={column.id}>
                                                   {column.data().label}
                                               </MenuItem>
                                           ))} 
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </div>
                        ))}
                        <Grid item xs={12}>
                            <Typography variant='h6' component='h2' style={{marginTop: 10 + 'px'}}>
                                Collaborators
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl style={{width: '100%'}}>
                                <InputLabel id='users-input-label'>Users</InputLabel>
                                <Select
                                    id="taskUsers"
                                    label="Users"
                                    multiple
                                    margin='dense'
                                    fullWidth
                                    style={{marginTop: 12}}
                                    labelId='users-input-label'
                                    defaultValue={props.existingTask ? props.existingTask.users : []}
                                    onChange={handleUserSelect}
                                    renderValue={selected => (
                                        <div>
                                            {selected.map(value => (
                                                <Chip key={value} label={value} size='small' color='primary' variant={value === props.boardRef.data().owner ? 'default' : 'contained'} />
                                            ))}
                                        </div>
                                    )}
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
                            <Typography variant='h6' component='h2' style={{marginTop: 10 + 'px'}}>
                                Task relations
                            </Typography>
                        </Grid>
                        {allTasks && allTasks.length === 0 && (
                            <Grid item xs={12}>
                                <Typography variant='body2' component='p'>
                                    (No other tasks exist on board)
                                </Typography>
                            </Grid>
                        )}
                        {allTasks && allTasks.length > 0 && <React.Fragment>
                            <Grid item xs={12}>
                                <FormControl style={{width: '100%'}}>
                                    <InputLabel id='dependencies-input-label'>Dependencies</InputLabel>
                                    <Select
                                        id="taskDependencies"
                                        label="Dependencies"
                                        multiple
                                        margin='dense'
                                        fullWidth
                                        labelId='dependencies-input-label'
                                        onChange={handleDependenciesSelect}
                                        defaultValue={props.existingTask ? props.existingTask.dependencies : []}
                                        renderValue={selected => (
                                            <div>
                                                {selected.map(value => (
                                                    <Chip key={value} label={allTasksNameDisplay[value]} size='small' color='secondary' variant='outlined' />
                                                ))}
                                            </div>
                                        )}
                                    >
                                       {allTasks.filter(item => !selectedDependents.includes(item.id)).filter(item => !props.existingTask || item.id !== props.existingTaskRef.id).map(task => (
                                           <MenuItem key={task.id} value={task.id}>
                                               {task.title}
                                           </MenuItem>
                                       ))} 
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl style={{width: '100%'}}>
                                    <InputLabel id='dependents-input-label'>Dependents</InputLabel>
                                    <Select
                                        id="taskDependents"
                                        label="Dependents"
                                        multiple
                                        margin='dense'
                                        fullWidth
                                        style={{marginTop: 12}}
                                        labelId='dependents-input-label'
                                        onChange={handleDependentsSelect}
                                        defaultValue={props.existingTask ? props.existingTask.dependents : []}
                                        renderValue={selected => (
                                            <div>
                                                {selected.map(value => (
                                                    <Chip key={value} label={allTasksNameDisplay[value]} size='small' color='secondary' variant='outlined' />
                                                ))}
                                            </div>
                                        )}
                                    >
                                       {allTasks.filter(item => !selectedDependencies.includes(item.id)).filter(item => !props.existingTask || item.id !== props.existingTaskRef.id).map(task => (
                                           <MenuItem key={task.id} value={task.id}>
                                               {task.title}
                                           </MenuItem>
                                       ))} 
                                    </Select>
                                </FormControl>
                            </Grid>
                        </React.Fragment>}
                     </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} color='primary'>
                        {props.buttonConfirmText ? props.buttonConfirmText : 'Create task'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={successSnackbar} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} autoHideDuration={6000} severity='success'>
                    File uploaded
                </Alert>
            </Snackbar>
            <Snackbar open={warningSnackbar} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} autoHideDuration={6000} severity='warning'>
                    No file selected
                </Alert>
            </Snackbar>
        </>
    );
}

export default EditTaskDialog;