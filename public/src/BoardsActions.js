import React from 'react';

import BoardBreadcrumbs from './BoardBreadcrumbs.js';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';

import NewBoardDialog from './NewBoardDialog.js';

class BoardActions extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
    }

    render() {
        return (
            <Grid container style={{padding: '10px 10px 0px 10px'}}>
                <div style={{flexGrow: 1}}>
                    <Breadcrumbs aria-label='breadcrumbs'>
                        <Typography color='textPrimary'>
                            Boards
                        </Typography>
                    </Breadcrumbs>
                </div>
                <NewBoardDialog />
            </Grid>
        );
    }
}

export default BoardActions;