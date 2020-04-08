import React from 'react';
import { forwardRef } from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import MaterialTable from 'material-table';
import Chip from '@material-ui/core/Chip';
import Link from '@material-ui/core/Link';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';

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
import DoneIcon from '@material-ui/icons/Done';
import DoneAllIcon from '@material-ui/icons/DoneAll';

import dateFormat from 'dateformat';

import { db } from '../../Firebase';

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
    return <Chip size='small' label={props.user} color='primary' variant={props.userIsOwner ? 'default': 'outlined'} />;
}

function ColumnChip(props) {
    return <Chip size='small' label={props.label} />
}

function TaskChip(props) {
    return <Chip size='small' label={props.label} color='secondary' variant='outlined' />
}


function HistoryAction(props) {
    const rowData = props.rowData;

    switch (rowData.action) {
        case 1:
            return (
                <span>
                    Board name changed to "{rowData.name}" and description changed to "{rowData.description}"
                </span>
            );
        case 2:
            return (
                <span>
                    <HistoryUser user={rowData.user2} userIsOwner={false} /> invited to the board
                </span>
            );
        case 3:
            return (
                <span>
                    <HistoryUser user={rowData.user2} userIsOwner={false} /> removed from the board
                </span>
            );
        case 4:
            return (
                <span>
                    Column <ColumnChip label={rowData.colName} /> created in the view <ColumnChip label={rowData.columnGroupName} />
                </span>
            );
        case 7:
            return (
                <span>
                    Task <TaskChip label={rowData.taskName} /> created
                </span>
            );
        case 8:
            return (
                <span>
                    Task <TaskChip label={rowData.taskName} /> deleted
                </span>
            );
        case 9:
            return (
                <span>
                    Comment posted on task <TaskChip label={rowData.taskName} />: "{rowData.commentText}"
                </span>
            );
        case 10:
            return (
                <span>
                    Ownership transferred from <HistoryUser user={rowData.user} userIsOwner={rowData.userIsOwner} /> to <HistoryUser user={rowData.user2} userIsOwner={false} />
                </span>
            );
        case 11:
            return (
                <span>
                    Comment deleted on task <TaskChip label={rowData.taskName} />: "{rowData.commentText}"
                </span>
            );
        case 12:
            return (
                <span>
                    Permissions for <HistoryUser user={rowData.user2} userIsOwner={false} /> changed to {rowData.newPermission ? 'administrator' : 'collaborator'}
                </span>
            );
        case 15:
            return (
                <span>
                    View <ColumnChip label={rowData.groupName} /> created with the columns {rowData.columns.map(columnName => (
                        <ColumnChip label={columnName} />
                    ))}
                </span>
            );
        case 16:
            return (
                <span>
                    View <ColumnChip label={rowData.groupName2} /> renamed to <ColumnChip label={rowData.groupName} />
                </span>
            );
        case 17:
            return (
                <span>
                    View <ColumnChip label={rowData.groupName} /> deleted
                </span>
            );
        case 18:
            return (
                <span>
                    View <ColumnChip label={rowData.groupName} /> set to default view
                </span>
            );
        case 19:
            return (
                <span>
                    Document "{rowData.fileName}" uploaded
                </span>
            );
        case 20:
            return (
                <span>
                    Document "{rowData.fileName}" deleted
                </span>
            );
        case 21:
            return (
                <span>
                    Task <TaskChip label={rowData.taskName} /> edited
                </span>
            );
        default:
            return (
                <span>HISTORY ENTRY MISSING</span>
            );  
    }
}

function UserNotificationsComponent(props) {
    const classes = useStyles();

    const user = JSON.parse(localStorage.getItem('user'));

    let columns = [];
    if (props.notificationRefs) {
        columns = [
            {
                title: 'Unread',
                field: 'unread',
                render: rowData => rowData.data().unread && <Tooltip title='Mark read' arrow><IconButton onClick={() => handleMarkRead(rowData)}><DoneIcon color='primary' /></IconButton></Tooltip>,
                width: 50
            },
            {
                title: 'Date',
                field: 'timestamp',
                render: rowData => dateFormat(rowData.data().timestamp.toDate(), 'mm/dd/yyyy hh:MM')
            },
            {
                title: 'Board',
                field: 'board',
                render: rowData => <Link href={'/board/' + rowData.data().boardId}>{rowData.data().board}</Link>
            },
            {
                title: 'User',
                field: 'user',
                render: rowData => <HistoryUser user={rowData.data().user} userIsOwner={rowData.data().userIsOwner} />
            },
            {
                title: 'Action',
                field: 'action',
                render: rowData => <HistoryAction rowData={rowData.data()} />
            }
        ];
    }

    const handleMarkRead = rowData => {
        db.collection('users').doc(user.email).collection('notifications').doc(rowData.id).update({
            unread: false
        });
    };

    const handleMarkAllRead = () => {
        db.collection('users').doc(user.email).collection('notifications').where('unread', '==', true).get().then(notificationRefs => {
            let batch = db.batch();
            notificationRefs.docs.forEach(notificationRef => {
                batch.update(notificationRef.ref, {unread: false});
            });
            batch.commit();
        });
    }

    return (
        <div className={classes.settingsBody}>
            <Paper className={classes.paper}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <h2>Notifications</h2>
                        <MaterialTable
                            icons={tableIcons}
                            columns={columns}
                            title=''
                            data={props.notificationRefs || []}
                            actions={[
                                {
                                    icon: () => (<DoneAllIcon />),
                                    tooltip: 'Mark all read',
                                    isFreeAction: true,
                                    onClick: event => handleMarkAllRead()
                                }
                            ]}
                        />
                    </Grid>
                </Grid>
            </Paper>
        </div>
    );
}

export default UserNotificationsComponent;