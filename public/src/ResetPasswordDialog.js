import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';


function ResetPasswordDialog() {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Button onClick={handleClickOpen}>Forgot password?</Button>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Reset password</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                    Enter your email. If the email is already associated with an account, you will recieve an email with a new password.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="forgotPasswordEmail"
                        label="Email"
                        type="email"
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleClose} color="primary">
                        Reset password
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default ResetPasswordDialog;