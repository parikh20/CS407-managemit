import React from 'react';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import AttachmentIcon from '@material-ui/icons/Attachment';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import dateFormat from 'dateformat';

import { db } from '../../Firebase';

function TaskListing(props) {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleDelete = () => {
        db.runTransaction(async (t) => {
            props.boardRef.ref.collection('tasks').doc(props.taskRef.id).delete();
        });
        setOpen(false);
    };

    return (
        <Card variant='outlined' style={{marginBottom: 5}}>
            <CardContent onClick={handleClickOpen} style={{cursor: 'pointer'}} className='taskListing'>
                <Typography variant='h6' component='h2'>
                    {props.task.title.length < 30 ? props.task.title : props.task.title.slice(0, 30) + '...'}
                </Typography>
                <Typography variant='body2' component='p'>
                    {props.task.desc}
                </Typography>
            </CardContent>
            <Dialog open={open} onClose={handleClose} aria-labelledby='form-dialog-title'>
                <DialogTitle id='form-dialog-title'>{props.task.title}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={1}>
                        <Grid item xs={6}>
                            <Typography variant='h6' component='h2'>
                                Description
                            </Typography>
                            <Typography variant='body2' component='p'>
                                {props.task.desc !== '' ? props.task.desc : '(No description provided)'}
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Grid container spacing={1}>
                                <Grid item xs={12}>
                                    <Typography variant='h6' component='h2'>
                                        Columns
                                    </Typography>
                                    {props.task.columnRefs.map(columnId => 
                                        <Chip key={columnId} label={props.allColumnNames[columnId]} color='primary' size='small' />
                                    )}
                                </Grid>
                            </Grid>
                            <Grid container spacing={1}>
                                <Grid item xs={12}>
                                    <Typography variant='h6' component='h2'>
                                        Due Date
                                    </Typography>
                                    <Typography variant='body2' component='p'>
                                        {props.task.date === null && (
                                            '(No due date)'
                                        )}
                                        {props.task.date !== null && (<>
                                            {dateFormat(props.task.date.toDate(), 'mm/dd/yyyy')}
                                            <Button variant='outlined' size='small' color='primary' style={{float: 'right'}}>View on calendar</Button>
                                        </>)}
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid container spacing={1}>
                                <Grid item xs={12}>
                                    <Typography variant='h6' component='h2'>
                                        Users
                                    </Typography>
                                    {props.task.users.length === 0 && (
                                        <Typography variant='body2' component='p'>
                                            (No users assigned to task)
                                        </Typography>
                                    )}
                                    {props.task.users.length > 0 && props.task.users.map(user =>
                                        <Chip key={user} label={user} color='primary' size='small' />
                                    )}
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant='h6' component='h2'>
                                Documents
                            </Typography>
                            <List component='nav'>
                                <ListItem button>
                                  <ListItemIcon>
                                    <AttachmentIcon />
                                  </ListItemIcon>
                                  <ListItemText primary='Placeholder_Document.docx' />
                                </ListItem>
                                <Divider />
                                <ListItem button>
                                  <ListItemIcon>
                                    <AttachmentIcon />
                                  </ListItemIcon>
                                  <ListItemText primary='Placeholder_Document.pdf' />
                                </ListItem>
                                <Divider />
                                <ListItem button>
                                  <ListItemIcon>
                                    <AttachmentIcon />
                                  </ListItemIcon>
                                  <ListItemText primary='Placeholder_Document.png' />
                                </ListItem>
                            </List>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant='h6' component='h2'>
                                Checklist
                            </Typography>
                            <FormControl component='fieldset'>
                                <FormGroup>
                                    <FormControlLabel
                                        control={<Checkbox checked={true} value='1' />}
                                        label='Do the first thing on the list'
                                    />
                                    <FormControlLabel
                                        control={<Checkbox checked={false} value='2' />}
                                        label='Complete the second thing'
                                    />
                                    <FormControlLabel
                                        control={<Checkbox checked={true} value='3' />}
                                        label='Just do the rest'
                                    />
                                </FormGroup>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant='h6' component='h2'>
                                Comments
                            </Typography>
                            <Typography variant='body2' component='p'>
                            To be designed later
                            </Typography>
                        </Grid>
                     </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>
                        View connected tasks
                    </Button>
                    <Button onClick={handleDelete} color='secondary'>
                        Delete
                    </Button>
                    <Button onClick={handleClose}>
                        Edit
                    </Button>
                    <Button onClick={handleClose} color='primary'>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Card>
    );
    }

export default TaskListing;