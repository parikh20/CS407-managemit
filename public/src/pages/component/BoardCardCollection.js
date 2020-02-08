import React from 'react';

import Grid from '@material-ui/core/Grid';

import BoardCard from './BoardCard.js'

const placeholderBoards = [
    {
        title: 'My title',
        description: 'My description'
    },
    {
        title: 'Second title',
        description: 'A slightly longer description'
    },
    {
        title: 'Third title',
        description: 'Once descriptions get long enough, we will need to do some truncation. This is fine though.'
    },
    {
        title: 'My title',
        description: 'My description'
    },
    {
        title: 'Second title',
        description: 'A slightly longer description'
    },
    {
        title: 'Third title',
        description: 'Once descriptions get long enough, we will need to do some truncation. This is fine though.'
    },
    {
        title: 'My title',
        description: 'My description'
    },
    {
        title: 'Second title',
        description: 'A slightly longer description'
    },
    {
        title: 'Third title',
        description: 'Once descriptions get long enough, we will need to do some truncation. This is fine though.'
    },
    {
        title: 'My title',
        description: 'My description'
    },
    {
        title: 'Second title',
        description: 'A slightly longer description'
    },
    {
        title: 'Third title',
        description: 'Once descriptions get long enough, we will need to do some truncation. This is fine though.'
    },
    {
        title: 'My title',
        description: 'My description'
    },
    {
        title: 'Second title',
        description: 'A slightly longer description'
    },
    {
        title: 'Third title',
        description: 'Once descriptions get long enough, we will need to do some truncation. This is fine though.'
    }
];

class BoardCardCollection extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
    }
    render() {
        return (
            <div style={{width: 80 + '%', margin: '10px auto 0px auto'}}>
                <Grid container spacing={3}>
                    {placeholderBoards.map(board => (
                        <BoardCard title={board.title} description={board.description} />
                    ))}
                </Grid>
            </div>
        );
    }
}

export default BoardCardCollection;