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

function TaskListing(props) {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Card variant='outlined' style={{marginBottom: 5}}>
            <CardContent onClick={handleClickOpen} style={{cursor: 'pointer'}} className='taskListing'>
                <Typography variant='h6' component='h2'>
                    {props.title}
                </Typography>
                <Typography variant='body2' component='p'>
                    {props.description}
                </Typography>
            </CardContent>
            <Dialog open={open} onClose={handleClose} aria-labelledby='form-dialog-title'>
                <DialogTitle id='form-dialog-title'>{props.title}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={1}>
                        <Grid item xs={6}>
                            <Typography variant='h6' component='h2'>
                                Description
                            </Typography>
                            <Typography variant='body2' component='p'>
                                {props.description}

                                <br />Here's a bunch of text to make this longer. Here's a bunch of text to make this longer. Here's a bunch of text to make this longer. Here's a bunch of text to make this longer. Here's a bunch of text to make this longer. Here's a bunch of text to make this longer. Here's a bunch of text to make this longer. Here's a bunch of text to make this longer. 
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Grid container spacing={1}>
                                <Grid item xs={12}>
                                    <Typography variant='h6' component='h2'>
                                        Columns
                                    </Typography>
                                    <Typography variant='body2' component='p'>
                                        <Chip label='Placeholder column' color='primary' size='small' />
                                        <Chip label='Placeholder 2' color='primary' size='small' />
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid container spacing={1}>
                                <Grid item xs={12}>
                                    <Typography variant='h6' component='h2'>
                                        Due Date
                                    </Typography>
                                    <Typography variant='body2' component='p'>
                                        01/01/2020
                                        <Button variant='outlined' size='small' color='primary' style={{float: 'right'}}>View on calendar</Button>
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid container spacing={1}>
                                <Grid item xs={12}>
                                    <Typography variant='h6' component='h2'>
                                        Users
                                    </Typography>
                                    <Typography variant='body2' component='p'>
                                        <Chip label='John Doe' color='primary' size='small' />
                                        <Chip label='Joe User' color='primary' size='small' />
                                    </Typography>
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
                    <Button onClick={handleClose} color='primary'>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Card>
    );
    }

export default TaskListing;