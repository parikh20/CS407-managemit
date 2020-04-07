import '../../App.css';
import React from 'react';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import InputLabel from '@material-ui/core/InputLabel';
import ListSubheader from '@material-ui/core/ListSubheader';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import IconButton from '@material-ui/core/IconButton';

import ApiHelpDialog from './ApiHelpDialog';

import { db } from '../../Firebase';

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
        width: 100 + '%',
        textAlign: 'left'
    },
    chip: {
        marginRight: 5,
        marginLeft: 5
    },
    settingsCard: {
        cursor: 'pointer',
        padding: theme.spacing(2.5),
        '&:hover': {
            background: '#D3D3D3',
        }
    },
    typography: {
        color: 'black'
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        flexBasis: '33.33%',
        flexShrink: 0,
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
    },
}));

function BoardApiSettingsComponent(props) {
    const classes = useStyles();

    const [params, setParams] = React.useState([{
        multiLine: false,
        name: '',
        value: ''
    }]);
    const [editMode, setEditMode] = React.useState(false);
    const [nameError, setNameError] = React.useState(false);
    const [nameHelperText, setNameHelperText] = React.useState('');
    const [urlError, setUrlError] = React.useState(false);
    const [urlHelperText, setUrlHelperText] = React.useState('');

    const handleAddRow = () => {
        let paramsCopy = [...params];
        paramsCopy.push({
            multiLine: false,
            name: '',
            value: ''
        });
        setParams(paramsCopy);
    };

    const handleRemoveRow = index => {
        let paramsCopy = [...params];
        paramsCopy.splice(index, 1);
        if (paramsCopy.length === 0) {
            paramsCopy.push({
                multiLine: false,
                name: '',
                value: ''
            });
        }
        setParams(paramsCopy);
    };

    const handleSubmit = () => {
        clearState();

        const name = document.getElementById('callName').value.trim();
        const url = document.getElementById('callUrl').value.trim();
        const method = document.getElementById('callMethod').value;
        const action = document.getElementById('callAction').value;
        const body = document.getElementById('callBody').value;


    };

    const clearState = () => {
        setNameError(false);
        setNameHelperText('');
        setUrlError(false);
        setUrlHelperText('');
    };

    return (
        <div className={classes.settingsBody}>
            <Paper className={classes.paper}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <h2>API calls</h2>
                    </Grid>
                    <Grid item xs={12}>
                         <Typography variant='body2' component='p' style={{width: 80 + '%', marginRight: 'auto', marginLeft: 'auto'}}>
                            API calls can be used to automatically integrate Managemit with other systems and applications. API calls will be invoked
                            whenever the specified action occurs.
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Button>Expand all</Button>
                        <Button>Collapse all</Button>
                    </Grid>
                    <Grid item xs={12}>
                        <ExpansionPanel style={{width: '80%', marginRight: 'auto', marginLeft: 'auto'}} expanded={true}>
                            <ExpansionPanelSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls='panel1bh-content'
                                id='panel1bh-header'
                            >
                                <Typography className={classes.heading} style={{textAlign: 'left'}}>API call label</Typography>
                                <Typography className={classes.secondaryHeading}>The url can be displayed here</Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                                <Grid container spacing={1}>
                                    <Grid item xs={12} style={{textAlign: 'left'}}>
                                        <Typography variant='h6'>
                                            Details
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <TextField
                                            id='callName'
                                            label='Name'
                                            variant='outlined'
                                            InputLabelProps={{shrink: true}}
                                            className={classes.textField}
                                            margin='dense'
                                            error={nameError}
                                            helperText={nameHelperText}
                                        />
                                    </Grid>
                                    <Grid item xs={4}>
                                        <FormControl variant='outlined' className={classes.textField} margin='dense'>
                                            <InputLabel id='callMethodLabel'>Method</InputLabel>
                                            <Select
                                                labelId='callMethodLabel'
                                                id='callMethod'
                                                label='Method'
                                                defaultValue='GET'
                                            >
                                                <MenuItem value='GET'>GET</MenuItem>
                                                <MenuItem value='POST'>POST</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <FormControl variant='outlined' className={classes.textField} margin='dense'>
                                            <InputLabel id='callActionLabel'>Action</InputLabel>
                                            <Select
                                                labelId='callActionLabel'
                                                id='callAction'
                                                label='Action'
                                                value={7}
                                            >
                                                <ListSubheader>Tasks</ListSubheader>
                                                <MenuItem value={7}>Task created</MenuItem>
                                                <MenuItem value={21}>Task edited</MenuItem>
                                                <MenuItem value={8}>Task deleted</MenuItem>
                                                <MenuItem value={9}>Comment posted on task</MenuItem>
                                                <MenuItem value={11}>Comment deleted on task</MenuItem>
                                                <ListSubheader>Columns and views</ListSubheader>
                                                <MenuItem value={4}>Column created</MenuItem>
                                                <MenuItem value={15}>View created</MenuItem>
                                                <MenuItem value={16}>View edited</MenuItem>
                                                <MenuItem value={17}>View deleted</MenuItem>
                                                <MenuItem value={18}>View set as default</MenuItem>
                                                <ListSubheader>Documents</ListSubheader>
                                                <MenuItem value={19}>Document uploaded</MenuItem>
                                                <MenuItem value={20}>Document deleted</MenuItem>
                                                <ListSubheader>Administration</ListSubheader>
                                                <MenuItem value={1}>Board settings changed</MenuItem>
                                                <MenuItem value={2}>User invited</MenuItem>
                                                <MenuItem value={3}>User removed</MenuItem>
                                                <MenuItem value={12}>User permissions changed</MenuItem>
                                                <MenuItem value={10}>Ownership transferred</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            id='callUrl'
                                            label='URL'
                                            variant='outlined'
                                            InputLabelProps={{shrink: true}}
                                            className={classes.textField}
                                            margin='dense'
                                            error={urlError}
                                            helperText={urlHelperText}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Divider />
                                    </Grid>
                                    <Grid item xs={12} style={{textAlign: 'left'}}>
                                        <Typography variant='h6'>
                                            Body (optional)
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            id='callBody'
                                            label='Body'
                                            variant='outlined'
                                            className={classes.textField}
                                            multiline
                                            rows={3}
                                            InputLabelProps={{shrink: true}}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Divider />
                                    </Grid>
                                    <Grid item xs={12} style={{textAlign: 'left'}}>
                                        <Typography variant='h6'>
                                            Parameters (optional)
                                        <ApiHelpDialog />
                                        </Typography>
                                    </Grid>
                                    {params.map((param, index) => (<React.Fragment key={index}>
                                        <Grid item xs={2}>
                                            <FormControl variant='outlined' className={classes.textField} margin='dense'>
                                                <InputLabel id={'paramMultiLine' + index + 'Label'}>Multi-line</InputLabel>
                                                <Select
                                                    labelId={'paramMultiLine' + index + 'Label'}
                                                    id={'paramMultiLine' + index}
                                                    label='Multi-line'
                                                    value={false}
                                                    data-index={index}
                                                    className='paramMultiLine'
                                                >
                                                    <MenuItem value={true}>Yes</MenuItem>
                                                    <MenuItem value={false}>No</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <TextField
                                                id='paramName'
                                                label='Parameter name'
                                                variant='outlined'
                                                InputLabelProps={{shrink: true}}
                                                className={classes.textField}
                                                style={{width: '100%'}}
                                                margin='dense'
                                                data-index={index}
                                                className='paramName'
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField
                                                id='paramValue'
                                                label='Parameter value'
                                                variant='outlined'
                                                InputLabelProps={{shrink: true}}
                                                className={classes.textField}
                                                style={{width: '90%'}}
                                                margin='dense'
                                                data-index={index}
                                                className='paramValue'
                                            />
                                            <IconButton onClick={() => handleRemoveRow(index)}>
                                                <RemoveCircleOutlineIcon />
                                            </IconButton>
                                        </Grid>
                                    </React.Fragment>))}
                                    <Grid item xs={12}>
                                        <Button variant='contained' style={{float: 'left'}} onClick={handleAddRow}>New row</Button>
                                        <div style={{float: 'right'}}>
                                            {editMode && <Button variant='contained' style={{marginRight: '10px'}}>Cancel</Button>}
                                            <Button variant='contained' color='primary'>Create new call</Button>
                                        </div>
                                    </Grid>
                                </Grid>
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                    </Grid>
                </Grid>
            </Paper>
        </div>
    );
}

export default BoardApiSettingsComponent;