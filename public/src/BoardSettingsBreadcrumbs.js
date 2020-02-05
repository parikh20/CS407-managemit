import React from 'react';
import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';

class BoardSettingsBreadcrumbs extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
    }

    render() {
        return (
            <Grid container style={{padding: '10px 10px 0px 10px'}}>
                <Breadcrumbs aria-label='breadcrumbs'>
                    <Link color='inherit'>
                        Boards
                    </Link>
                    <Link color='inherit'>
                        {this.props.boardName}
                    </Link>
                    <Typography color='textPrimary'>
                        Settings
                    </Typography>
                </Breadcrumbs>
            </Grid>
        );
    }
}

export default BoardSettingsBreadcrumbs;