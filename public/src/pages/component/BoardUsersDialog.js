import React from 'react';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Chip from '@material-ui/core/Chip';
import { db } from '../../Firebase';
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

function BoardUsersDialog(props) {
    const user = JSON.parse(localStorage.getItem('user'));
    const [open, setOpen] = React.useState(false);
    const classes = useStyles();
    const [mode, setMode] = React.useState('dark')
    db.collection('users').doc(user.email).get().then(doc => {
        doc.data().darkMode ? setMode("dark") : setMode("white");
    })


    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <ButtonGroup size='small'>
                <Button onClick={handleClickOpen} className={classes[`${mode}Button`]}>Collaborators</Button>
            </ButtonGroup>
            <Dialog open={open} onClose={handleClose} aria-labelledby='form-dialog-title'>
                <DialogTitle id='form-dialog-title'>Collaborators for {props.board.label}</DialogTitle>
                <DialogContent>
                    {props.board.owner === user.email && (
                        <DialogContentText>
                            As the board owner, you can add and remove users as well as change permissions from the <a href={'/board/' + props.boardRef.id + '/settings'}>board settings</a> page.
                        </DialogContentText>
                    )}
                    <TableContainer>
                        <Table size='small'>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Email</TableCell>
                                    <TableCell align='right'>Role</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell>
                                        {props.board && <>
                                            <Chip label={props.board.owner} color='primary' />
                                        </>}
                                    </TableCell>
                                    <TableCell align='right'>
                                        Owner
                                    </TableCell>
                                </TableRow>
                                {props.board && props.board.userRefs && <>
                                    {props.board.userRefs.filter(userEmail => userEmail !== props.board.owner).map(userEmail => (
                                        <TableRow key={userEmail}>
                                            <TableCell>
                                                <Chip label={userEmail} color='primary' key={userEmail} variant='outlined' />
                                            </TableCell>
                                            <TableCell align='right'>
                                                {props.board.permissions[userEmail].isAdmin ? 'Administrator' : 'Collaborator'}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </>}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default BoardUsersDialog;