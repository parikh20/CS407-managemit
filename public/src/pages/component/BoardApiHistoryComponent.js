import React from 'react';
import { forwardRef } from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import MaterialTable from 'material-table';
import Chip from '@material-ui/core/Chip';

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

import dateFormat from 'dateformat';

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

function BoardApiHistoryComponent(props) {
    const classes = useStyles();

    let columns = [];
    if (props.board) {
        columns = [
            {
                title: 'Date',
                field: 'timestamp',
                render: rowData => dateFormat(rowData.timestamp.toDate(), 'mm/dd/yyyy hh:MM')
            },
            {
                title: 'API hook',
                field: 'name'
            },
            {
                title: 'Action',
                field: 'action',
                render: rowData => actionIdToName[rowData.action]
            },
            {
                title: 'Status',
                field: 'status',
                render: rowData => rowData.status !== 0 && rowData.status !== -1 ? rowData.status + ' ' + rowData.statusText : rowData.statusText
            },
            {
                title: 'Response',
                field: 'data'
            }
        ];
    }

    return (
        <div className={classes.settingsBody}>
            <Paper className={classes.paper}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <h2>Board API history</h2>
                        <MaterialTable
                            icons={tableIcons}
                            columns={columns}
                            title=''
                            data={props.history || []}
                            options={{
                                search: true
                            }}
                        />
                    </Grid>
                </Grid>
            </Paper>
        </div>
    );
}

export default BoardApiHistoryComponent;