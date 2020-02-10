import React from 'react';
import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';

function BoardSettingsBreadcrumbs(props) {
    return (
        <Grid container style={{padding: '10px 10px 0px 10px'}}>
            <Breadcrumbs aria-label='breadcrumbs'>
                <Link color='inherit' href='/boards'>
                    Boards
                </Link>
                <Link color='inherit' href={'/board/' + props.board.id}>
                    {props.board.label}
                </Link>
                <Typography color='textPrimary'>
                    Settings
                </Typography>
            </Breadcrumbs>
        </Grid>
    );
}

export default BoardSettingsBreadcrumbs;