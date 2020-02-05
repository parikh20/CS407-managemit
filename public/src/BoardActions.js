import React from 'react';

import BoardBreadcrumbs from './BoardBreadcrumbs.js';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Grid from '@material-ui/core/Grid';

class BoardActions extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
    }

    render() {
        return (
            <Grid container style={{padding: '10px 10px 0px 10px'}}>
                <div style={{flexGrow: 1}}>
                    <BoardBreadcrumbs boardName="Placeholder name" />
                </div>
                <ButtonGroup size='small'>
                    <Button>New task</Button>
                    <Button>Select view</Button>
                    <Button>View history</Button>
                </ButtonGroup>
            </Grid>
        );
    }
}

export default BoardActions;