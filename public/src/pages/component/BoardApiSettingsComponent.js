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
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

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

function Alert(props) {
    return <MuiAlert elevation={6} variant='filled' {...props} />;
}

function BoardApiSettingsComponent(props) {
    const classes = useStyles();

    const [params, setParams] = React.useState([{
        name: '',
        value: ''
    }]);
    const [editMode, setEditMode] = React.useState(false);
    const [editingId, setEditingId] = React.useState('');
    const [editingItem, setEditingItem] = React.useState({});
    const [nameError, setNameError] = React.useState(false);
    const [nameHelperText, setNameHelperText] = React.useState('');
    const [urlError, setUrlError] = React.useState(false);
    const [urlHelperText, setUrlHelperText] = React.useState('');
    const [successSnackbar, setSuccessSnackbar] = React.useState(false);
    const [successText, setSuccessText] = React.useState('');
    const [savedMethod, setSavedMethod] = React.useState('GET');
    const [savedAction, setSavedAction] = React.useState(7);
    const [savedName, setSavedName] = React.useState('');
    const [savedUrl, setSavedUrl] = React.useState('');
    const [savedBody, setSavedBody] = React.useState('');

    const actionIdToName = {
        '7': 'Task created',
        '21': 'Task edited',
        '8': 'Task deleted',
        '9': 'Comment posted on task',
        '11': 'Comment deleted on task',
        '4': 'Column created',
        '15': 'View created',
        '16': 'View edited',
        '17': 'View deleted',
        '18': 'View set as default',
        '19': 'Document uploaded',
        '20': 'Document deleted',
        '1': 'Board settings changed',
        '2': 'User invited',
        '3': 'User removed',
        '12': 'User permissions changed',
        '10': 'Ownership transferred'
    };

    const handleAddRow = () => {
        let paramsCopy = [...params];
        paramsCopy.push({
            name: '',
            value: ''
        });
        setParams(paramsCopy);
    };

    const handleRemoveRow = index => {
        let paramsCopy = [...getCurrentParams()];
        paramsCopy.splice(index, 1);
        if (paramsCopy.length === 0) {
            paramsCopy.push({
                name: '',
                value: ''
            });
        }
        setParams(paramsCopy);
    };

    const handleSubmit = () => {
        clearState();

        const name = savedName.trim();
        const url = savedUrl.trim();
        const method = savedMethod;
        const action = savedAction;
        const body = savedBody;
        const currentParams = getCurrentParams();

        let hasError = false;
        if (name === '') {
            hasError = true;
            setNameError(true);
            setNameHelperText('Name is required');
        }
        if (url === '') {
            hasError = true;
            setUrlError(true);
            setUrlHelperText('URL is required');
        }
        if (hasError) {
            return;
        }

        if (editMode) {
            db.collection('boards').doc(props.board.id).collection('apiCalls').doc(editingId).update({
                name: name,
                url: url,
                method: method,
                action: action,
                body: body,
                params: currentParams.filter(param => param.name.trim() !== '')
            }).then(() => {
                setSuccessSnackbar(true);
                setSuccessText('Changes saved');
                clearFields();
                handleCancelEdit();
            });
        } else {
            db.collection('boards').doc(props.board.id).collection('apiCalls').add({
                name: name,
                url: url,
                method: method,
                action: action,
                body: body,
                params: currentParams.filter(param => param.name.trim() !== '')
            }).then(() => {
                setSuccessSnackbar(true);
                setSuccessText('New API call created');
                clearFields();
            });
        }
    };

    const handleDelete = callId => {
        db.collection('boards').doc(props.board.id).collection('apiCalls').doc(callId).delete().then(() => {
            setSuccessSnackbar(true);
            setSuccessText('API call deleted');
        });
    };

    const handleStartEdit = (callId, data) => {
        setEditMode(true);
        setEditingId(callId);
        setEditingItem(data);
        setSavedName(data.name);
        setSavedMethod(data.method);
        setSavedAction(data.action);
        setSavedUrl(data.url);
        setSavedBody(data.body);
        setParams([...data.params]);
    };

    const handleCancelEdit = () => {
        setEditMode(false);
        setEditingId('');
        setEditingItem({});
        clearFields();
    };

    const getCurrentParams = () => {
        const nameElems = document.getElementsByName('paramName');
        const valueElems = document.getElementsByName('paramValue');

        let nameElemsByIndex = [];
        for (const nameElem of nameElems) {
            nameElemsByIndex[nameElem.dataset.index] = nameElem;
        }
        let valueElemsByIndex = [];
        for (const valueElem of valueElems) {
            valueElemsByIndex[valueElem.dataset.index] = valueElem;
        }

        let newParams = [];
        for (let i = 0; i < nameElemsByIndex.length; i++) {
            newParams[i] = {
                name: nameElemsByIndex[i].value.trim(),
                value: valueElemsByIndex[i].value
            };
        }

        return newParams;
    }

    const handleFieldChange = (event, index, field) => {
        let paramsCopy = [...params];
        paramsCopy[index][field] = event.target.value;
        setParams(paramsCopy);
    };

    const handleMethodChange = event => {
        setSavedMethod(event.target.value);
    }

    const handleActionChange = event => {
        setSavedAction(event.target.value);
    }

    const handleNameChange = event => {
        setSavedName(event.target.value);
    };

    const handleUrlChange = event => {
        setSavedUrl(event.target.value);
    };

    const handleBodyChange = event => {
        setSavedBody(event.target.value);
    };
    
    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setSuccessSnackbar(false);
    };

    const clearState = () => {
        setNameError(false);
        setNameHelperText('');
        setUrlError(false);
        setUrlHelperText('');
        setSuccessSnackbar(false);
        setSuccessText('');
    };

    const clearFields = () => {
        setParams([{
            name: '',
            value: ''
        }]);
        setSavedMethod('GET');
        setSavedAction(7);
        setSavedBody('');
        setSavedName('');
        setSavedBody('');
    }

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
                        <ExpansionPanel style={{width: '80%', marginRight: 'auto', marginLeft: 'auto'}} expanded={true}>
                            <ExpansionPanelSummary
                                aria-controls='panel1bh-content'
                                id='panel1bh-header'
                            >
                                <Typography style={{textAlign: 'left'}}>{editMode ? 'Editing "' + editingItem.name + '"' : 'Create a new API call'}</Typography>
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
                                            value={savedName}
                                            onChange={handleNameChange}
                                        />
                                    </Grid>
                                    <Grid item xs={4}>
                                        <FormControl variant='outlined' className={classes.textField} margin='dense'>
                                            <InputLabel id='callMethodLabel'>Method</InputLabel>
                                            <Select
                                                labelId='callMethodLabel'
                                                id='callMethod'
                                                label='Method'
                                                value={savedMethod}
                                                onChange={handleMethodChange}
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
                                                value={savedAction}
                                                onChange={handleActionChange}
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
                                            value={savedUrl}
                                            onChange={handleUrlChange}
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
                                            value={savedBody}
                                            onChange={handleBodyChange}
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
                                        <Grid item xs={3}>
                                            <TextField
                                                id='paramName'
                                                label='Parameter name'
                                                variant='outlined'
                                                InputLabelProps={{shrink: true}}
                                                className={classes.textField}
                                                margin='dense'
                                                inputProps={{
                                                    'data-index': index
                                                }}
                                                name='paramName'
                                                value={param.name}
                                                onChange={(event) => handleFieldChange(event, index, 'name')}
                                            />
                                        </Grid>
                                        <Grid item xs={9}>
                                            <TextField
                                                id='paramValue'
                                                label='Parameter value'
                                                variant='outlined'
                                                InputLabelProps={{shrink: true}}
                                                className={classes.textField}
                                                style={{width: '90%'}}
                                                margin='dense'
                                                inputProps={{
                                                    'data-index': index
                                                }}
                                                name='paramValue'
                                                value={param.value}
                                                onChange={(event) => handleFieldChange(event, index, 'value')}
                                            />
                                            <IconButton onClick={() => handleRemoveRow(index)}>
                                                <RemoveCircleOutlineIcon />
                                            </IconButton>
                                        </Grid>
                                    </React.Fragment>))}
                                    <Grid item xs={12}>
                                        <Button variant='contained' style={{float: 'left'}} onClick={handleAddRow}>New row</Button>
                                        <div style={{float: 'right'}}>
                                            {editMode &&
                                                <Button
                                                    variant='contained'
                                                    style={{marginRight: '10px'}}
                                                    onClick={handleCancelEdit}
                                                >
                                                    Cancel
                                                </Button>
                                            }
                                            <Button
                                                variant='contained'
                                                color='primary'
                                                onClick={handleSubmit}
                                            >
                                                {editMode ? 'Save changes' : 'Create new API call'}
                                            </Button>
                                        </div>
                                    </Grid>
                                </Grid>
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                        {props.apiCallRefs.map(apiCallRef => (
                            <ExpansionPanel style={{width: '80%', marginRight: 'auto', marginLeft: 'auto'}}>
                                <ExpansionPanelSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls='panel1bh-content'
                                    id='panel1bh-header'
                                >
                                    <Typography className={classes.heading} style={{textAlign: 'left'}}>{apiCallRef.data().name}</Typography>
                                    <Typography className={classes.secondaryHeading}>{apiCallRef.data().url}</Typography>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                    <Grid container spacing={1}>
                                        <Grid item xs={12} style={{textAlign: 'left'}}>
                                            <Typography variant='h6'>
                                                Details
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TableContainer>
                                                <Table size="small">
                                                    <TableBody>
                                                        <TableRow>
                                                            <TableCell style={{width: '33%'}}>Name</TableCell>
                                                            <TableCell>{apiCallRef.data().name}</TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell>Method</TableCell>
                                                            <TableCell>{apiCallRef.data().method}</TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell>Action</TableCell>
                                                            <TableCell>{actionIdToName[apiCallRef.data().action]}</TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell>URL</TableCell>
                                                            <TableCell>{apiCallRef.data().url}</TableCell>
                                                        </TableRow>
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </Grid>
                                        {apiCallRef.data().body !== '' && <React.Fragment>
                                            <Grid item xs={12}>
                                                <Divider />
                                            </Grid>
                                            <Grid item xs={12} style={{textAlign: 'left'}}>
                                                <Typography variant='h6'>
                                                    Body
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} style={{textAlign: 'left'}}>
                                                <Typography variant='pre' component='pre'>
                                                    {apiCallRef.data().body}
                                                </Typography>
                                            </Grid>
                                        </React.Fragment>}
                                        {apiCallRef.data().params.length > 0 && <React.Fragment>
                                            <Grid item xs={12}>
                                                <Divider />
                                            </Grid>
                                            <Grid item xs={12} style={{textAlign: 'left'}}>
                                                <Typography variant='h6'>
                                                    Parameters
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TableContainer>
                                                    <Table size="small">
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell style={{width: '25%'}}>Parameter name</TableCell>
                                                                <TableCell>Parameter value</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {apiCallRef.data().params.map(param => (
                                                                <TableRow>
                                                                    <TableCell style={{width: '25%'}}>{param.name}</TableCell>
                                                                    <TableCell>{param.value}</TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            </Grid>
                                        </React.Fragment>}
                                        <Grid item xs={12}>
                                            <div style={{float: 'right'}}>
                                                <Button
                                                    variant='contained'
                                                    color='secondary'
                                                    style={{marginRight: '10px'}}
                                                    onClick={() => handleDelete(apiCallRef.id)}
                                                >
                                                    Delete
                                                </Button>
                                                <Button
                                                    variant='contained'
                                                    color='primary'
                                                    onClick={() => handleStartEdit(apiCallRef.id, apiCallRef.data())}
                                                >
                                                    Edit
                                                </Button>
                                            </div>
                                        </Grid>
                                    </Grid>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>

                        ))}
                    </Grid>
                </Grid>
            </Paper>

            <Snackbar open={successSnackbar} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} autoHideDuration={6000} severity='success'>
                    {successText}
                </Alert>
            </Snackbar>
        </div>
    );
}

export default BoardApiSettingsComponent;