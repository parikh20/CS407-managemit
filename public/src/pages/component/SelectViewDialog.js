import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

const useStyles = makeStyles(theme => ({
    list: {
        backgroundColor: theme.palette.background.paper
    },
}));

function SelectViewDialog(props) {
    const classes = useStyles();

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    let colGroups = Array.isArray(props.allColGroups) ? props.allColGroups : [];
    let allCols = Array.isArray(props.allCols) ? props.allCols : [];
    let colGroupDisplay = colGroups.map((colGroup, index) => {
        if (allCols.length <= index) {
            return {
                label: colGroup.label,
                id: colGroup.id,
                columnNames: []
            };
        }
        let columnNames = allCols[index].map(column => column.label);
        return {
            label: colGroup.label,
            id: colGroup.id,
            columnNames: columnNames
        };
    });

    return (
        <div>
            <ButtonGroup size='small'>
                <Button onClick={handleClickOpen}>Select view</Button>
            </ButtonGroup>
            <Dialog open={open} onClose={handleClose} aria-labelledby='form-dialog-title'>
                <DialogTitle id='form-dialog-title'>Select view</DialogTitle>
                <DialogContent>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <List className={classes.list}>
                                {colGroupDisplay.map((colGroup, index) => (
                                    <ListItem key={colGroup.id}>
                                        <ListItemText primary={colGroup.label} secondary={colGroup.columnNames.join(', ')} />
                                    </ListItem>
                                ))}
                            </List>
                        </Grid>
                     </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default SelectViewDialog;