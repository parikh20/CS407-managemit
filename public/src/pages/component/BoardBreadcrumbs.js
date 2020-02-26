import React from 'react';
import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import { Link } from 'react-router-dom';
// import Link from '@material-ui/core/Link';

function BoardBreadcrumbs(props) {
    return (
        <Breadcrumbs aria-label='breadcrumbs'>
            <Link to="/boards" color='inherit'>
                Boards
            </Link>
            <Typography color='textPrimary'>
                {props.board.label}
            </Typography>
        </Breadcrumbs>
    );
}

export default BoardBreadcrumbs;