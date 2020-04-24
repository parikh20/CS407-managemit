import React from 'react';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';

import LoadingAnimation from './LoadingAnimation';
import { makeStyles } from '@material-ui/core/styles';

import { db } from '../../Firebase';

const primaryDark = "#222831"
const secondaryDark = "#30476E"
const darkTextColor = "#c1a57b"
const black = "#000"
const white = "#fff"

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: white
    },
    darkBody: {
        color: darkTextColor,
        backgroundColor: primaryDark
    },
    whiteBody: {
        color: black,
        backgroundColor: white
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



const defaultColumns = ["Backlog","In Progress","Reviewing","Complete"];

const createBoard = async (name, description) => {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const permissionsObj = {};
    permissionsObj[currentUser.email] = { isAdmin: true };
    return new Promise((res,rej) => {
        let boardRef2 = null;
        db.collection("boards").add({
            owner: currentUser.email,
            label: name,
            description: description,
            defaultColumnGroup: "",
            taskRefs: [],
            userRefs: [currentUser.email],
            permissions: permissionsObj
        }).then((boardRef) => {
            boardRef2 = boardRef;
            return boardRef.collection("columnGroups").add({
                label: "Default view"
            });
        }).then(async (columnGroupRef) => {
            let columnRefs = [];
            for (const title of defaultColumns) {
                let colRef = await columnGroupRef.collection("columns").add({
                    label: title,
                    taskRefs: [],        
                });
                columnRefs.push(colRef.id);
            }
            await columnGroupRef.set({
                columnOrder: columnRefs
            }, {merge: true});
            await boardRef2.update({
                defaultColumnGroup: columnGroupRef.id
            });
        }).then(() => {
            res();
        }).catch((err) => {
            rej(err);
        })
    });
};

function Alert(props) {
    return <MuiAlert elevation={6} variant='filled' {...props} />;
}

function NewBoardDialog() {
    const [open, setOpen] = React.useState(false);
    const [buttonDisabled, setButtonDisabled] = React.useState(false);
    
    const [nameError, setNameError] = React.useState(false);
    const [nameHelperText, setNameHelperText] = React.useState('');
    const [descriptionError, setDescriptionError] = React.useState(false);
    const [descriptionHelperText, setDescriptionHelperText] = React.useState('');
    const [showLoadingAnimation, setShowLoadingAnimation] = React.useState(false);
    const [successSnackbar, setSuccessSnackbar] = React.useState(false);
    const user = JSON.parse(localStorage.getItem('user'));
    const classes = useStyles();
    const [mode, setMode] = React.useState('dark')
    db.collection('users').doc(user.email).get().then(doc => {
        doc.data().darkMode ? setMode("dark") : setMode("white");
    })

    const handleClickOpen = () => {
        setOpen(true);
    };
    
    const handleClose = (name,description) => {
        setOpen(false);
    };
    
    const handleSubmit = async () => {
        const name = document.getElementById('newBoardName').value.trim();
        const description = document.getElementById('newBoardDescription').value.trim();
        
        clearState();
        
        if (name === '') {
            setNameError(true);
            setNameHelperText('Board name is required');
        } else if (name.length > 50) {
            setNameError(true);
            setNameHelperText('Board name must be less than 50 characters long')
        } else if (description.length > 150) {
            setDescriptionError(true);
            setDescriptionHelperText('Board description must be greater than 150 characters long')
        } else {
            setButtonDisabled(true);
            try {
                setShowLoadingAnimation(true);
                createBoard(name,description).then(() => {
                    setShowLoadingAnimation(false);
                    setOpen(false);
                    setSuccessSnackbar(true);
                    setButtonDisabled(false);
                }).catch((err) => {console.error(err)});
            } catch (err) {
                setOpen(true);
                setNameError(true);
                setNameHelperText('Board could not be created!');
                setButtonDisabled(false);
            }
        }
    };
    
    const clearState = () => {
        setNameError(false);
        setNameHelperText('');
        setDescriptionError(false);
        setDescriptionHelperText('');
        setShowLoadingAnimation(false);
        setSuccessSnackbar(false);
    };
    
    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setSuccessSnackbar(false);
    };
    
    return (
        <div>
            <ButtonGroup size='small'>
                <Button onClick={handleClickOpen} className={classes[`${mode}Button`]}>New board</Button>
            </ButtonGroup>
            <Dialog open={open} onClose={handleClose} aria-labelledby='form-dialog-title'>
                <DialogTitle id='form-dialog-title'>New board</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter a name for your new board.
                    </DialogContentText>
                    <TextField
                    autoFocus
                    margin='dense'
                    id='newBoardName'
                    label='Board name'
                    variant='outlined'
                    fullWidth
                    error={nameError}
                    helperText={nameHelperText}
                    />
                    <TextField
                    margin='dense'
                    id='newBoardDescription'
                    label='Board description (optional)'
                    rows='5'
                    variant='outlined'
                    multiline
                    fullWidth
                    error={descriptionError}
                    helperText={descriptionHelperText}
                    />
                    {showLoadingAnimation && (
                        <LoadingAnimation />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} color='primary' disabled={buttonDisabled}>
                        Create board
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={successSnackbar} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} autoHideDuration={6000} severity='success'>
                    New board created
                </Alert>
            </Snackbar>
        </div>
        );
    }
    
    export default NewBoardDialog;