import React from 'react';
import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';

class BoardBreadcrumbs extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
    }

    render() {
        return (
            <Breadcrumbs aria-label='breadcrumbs'>
                <Link color='inherit'>
                    Boards
                </Link>
                <Typography color='textPrimary'>
                    {this.props.boardName}
                </Typography>
            </Breadcrumbs>
        );
    }
}

export default BoardBreadcrumbs;