import React from 'react';
import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';

function BoardSubpageBreadcrumbs(props) {
    return (
        <Grid container style={{padding: '10px 10px 0px 10px'}}>
            <Breadcrumbs aria-label='breadcrumbs'>
                <Link color='inherit' href='/boards'>
                    Boards
                </Link>
                <Link color='inherit' href={'/board/' + props.board.id}>
                    {props.board.label}
                </Link>
                {props.showSettings && (
                    <Link color='inherit' href={'/board/' + props.board.id + '/settings'}>
                        Settings
                    </Link>
                )}
                <Typography color='textPrimary'>
                    {props.currentPageName}
                </Typography>
            </Breadcrumbs>
        </Grid>
    );
}

export default BoardSubpageBreadcrumbs;