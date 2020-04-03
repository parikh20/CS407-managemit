import React from 'react';
import { forwardRef } from 'react';

import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import MaterialTable from 'material-table';
import Chip from '@material-ui/core/Chip';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import Link from '@material-ui/core/Link';

import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import DeleteIcon from '@material-ui/icons/Delete';

import dateFormat from 'dateformat';

import LoadingAnimation from './LoadingAnimation';

import firebase from '../../Firebase';
import { db } from '../../Firebase';
import { dispatchUserNotifications } from '../../Notifications';

const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

const useStyles = makeStyles(theme => ({
    settingsBody: {
        flexGrow: 1,
        padding: 20,
        paddingRight: 200,
        paddingLeft: 200
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        marginBottom: 20
    },
    button: {
        marginRight: 5,
        marginLeft: 5
    },
    textField: {
        width: 80 + '%'
    },
    chip: {
        marginRight: 5,
        marginLeft: 5
    }
}));


function HistoryUser(props) {
    return <Chip size='small' label={props.user} color='primary' variant={props.board.owner === props.user ? 'default': 'outlined'} />;
}

function Alert(props) {
    return <MuiAlert elevation={6} variant='filled' {...props} />;
}

function BoardDocumentsComponent(props) {
    const classes = useStyles();

    const [successSnackbar, setSuccessSnackbar] = React.useState(false);
    const [errorSnackbar, setErrorSnackbar] = React.useState(false);
    const [successMessage, setSuccessMessage] = React.useState('');
    const [showLoadingAnimation, setShowLoadingAnimation] = React.useState(false);

    const user = JSON.parse(localStorage.getItem('user'));

    let columns = [];
    if (props.board) {
        columns = [
            {
                title: 'Date uploaded',
                field: 'timestamp',
                render: rowData => dateFormat(rowData.timestamp.toDate(), 'mm/dd/yyyy hh:MM')
            },
            {
                title: 'Uploaded by',
                field: 'uploadedBy',
                render: rowData => <HistoryUser board={props.board} user={rowData.uploadedBy} />
            },
            {
                title: 'Filename',
                field: 'fileName',
                render: rowData => <Link onClick={() => handleDocumentClick(rowData)} style={{cursor: 'pointer'}}>{rowData.fileName}</Link>
            }
        ];
    }

    const handleUpload = async () => {
        const files = document.getElementById('uploadFile').files;

        setSuccessSnackbar(false);
        setErrorSnackbar(false);

        if (files.length === 0) {
            setErrorSnackbar(true);
            return;
        }

        setShowLoadingAnimation(true);

        for (const file of files) {
            let filePath = props.board.id + '/uploadedFiles/' + Date.now() + '-' + file.name;
            const storageRef = firebase.storage().ref(filePath);
            await storageRef.put(file);
            await db.collection('boards').doc(props.board.id).collection('files').add({
                fileName: file.name,
                filePath: filePath,
                uploadedBy: user.email,
                timestamp: new Date()
            });
            await db.collection('boards').doc(props.board.id).collection('history').add(
                {
                    user: user.email,
                    fileName: file.name,
                    action: 19,
                    timestamp: new Date()
                }
            );

            const emailText = 'Document "' + file.name + '" uploaded';
            dispatchUserNotifications(props.board, user, emailText, {
                user: user.email,
                userIsOwner: props.board.owner === user.email,
                action: 19,
                timestamp: new Date(),
                board: props.board.label,
                boardId: props.board.id,
                fileName: file.name,
                unread: true
            });
        }

        setSuccessSnackbar(true);
        setSuccessMessage('File uploaded');
        setShowLoadingAnimation(false);

        document.getElementById('uploadFile').value = null;
    };

    const handleDeleteDocument = async (rowData) => {
        setSuccessSnackbar(false);

        const fileId = rowData.id;

        await db.collection('boards').doc(props.board.id).collection('files').doc(rowData.id).delete();

        db.collection('boards').doc(props.board.id).collection('tasks').where('fileRefs', 'array-contains', fileId).get().then(async (taskRefs) => {
            for (const taskRef of taskRefs.docs) {
                await taskRef.ref.update({
                    fileRefs: taskRef.data().fileRefs.filter(fileRef => fileRef !== fileId)
                });
            }
        }).then(() => {
            db.collection('boards').doc(props.board.id).collection('history').add(
                {
                    user: user.email,
                    fileName: rowData.fileName,
                    action: 20,
                    timestamp: new Date()
                }
            ).catch(err => {
                console.log("Error logging file delete: " + err);
            });

            const emailText = 'Document "' + rowData.fileName + '" deleted';
            dispatchUserNotifications(props.board, user, emailText, {
                user: user.email,
                userIsOwner: props.board.owner === user.email,
                action: 20,
                timestamp: new Date(),
                board: props.board.label,
                boardId: props.board.id,
                fileName: rowData.fileName,
                unread: true
            });
        });

        setSuccessSnackbar(true);
        setSuccessMessage('File deleted');
    };

    const handleDocumentClick = rowData => {
        const storageRef = firebase.storage().ref(rowData.filePath);
        storageRef.getDownloadURL().then(url => {
            window.open(url, '_blank');
        });
    };
    
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setErrorSnackbar(false);
        setSuccessSnackbar(false);
    };

    return (
        <div className={classes.settingsBody}>
            <Paper className={classes.paper}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <h2>Board Documents</h2>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant='body2' component='p'>
                            Select a file to upload. Once uploaded, files can be associated to tasks, as well as downloaded or removed at any time.
                        </Typography>
                        <TextField
                            margin='dense'
                            id='uploadFile'
                            label='File'
                            type='file'
                            variant='outlined'
                            fullWidth
                            multiple
                            InputLabelProps={{shrink: true}}
                            style={{width: 90 + '%'}}
                        />
                        <IconButton aria-label='upload files' onClick={() => handleUpload()}>
                            <CloudUploadIcon />
                        </IconButton>
                    </Grid>
                    <Grid item xs={12}>
                        {showLoadingAnimation && (
                            <LoadingAnimation />
                        )}
                        <Divider />
                    </Grid>
                    <Grid item xs={12}>
                        <MaterialTable
                            icons={tableIcons}
                            columns={columns}
                            title=''
                            actions={[{
                                icon: () => (<DeleteIcon />),
                                tooltip: 'Delete document',
                                onClick: (event, rowData) => handleDeleteDocument(rowData)
                            }]}
                            options={{actionsColumnIndex: -1}}
                            data={props.files || []}
                        />
                    </Grid>
                </Grid>
            </Paper>

            <Snackbar open={successSnackbar} onClose={handleClose}>
                <Alert onClose={handleClose} autoHideDuration={6000} severity='success'>
                    {successMessage}
                </Alert>
            </Snackbar>
            <Snackbar open={errorSnackbar} onClose={handleClose}>
                <Alert onClose={handleClose} autoHideDuration={6000} severity='warning'>
                    No file selected
                </Alert>
            </Snackbar>
        </div>
    );
}

export default BoardDocumentsComponent;