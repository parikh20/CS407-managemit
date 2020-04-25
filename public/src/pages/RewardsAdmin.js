import React from 'react';
import { createBrowserHistory } from 'history';

import NavBar from './component/NavBar';
import { Grid, ButtonGroup, Button } from '@material-ui/core';
import BoardSubpageBreadcrumbs from './component/BoardSubpageBreadcrumbs';
import { cache } from '../Firebase';

class RewardsAdmin extends React.Component {
    
    activeButtonStyle= {
        backgroundColor: "lightgrey"
    }
    
    constructor(props) {
        super(props);
        this.state = {
            setRewardsPanelShown: true
        }
        this.viewableHistory = createBrowserHistory();
        this.loadBoard();
    }

    loadBoard() {
        cache.loadBoard(this.props.match.params.boardId).subscribe((board) => {
            this.setState({board: board.data()});
        })
    }

    setRewardsMode() {
        this.setState({setRewardsPanelShown: true});
    }

    viewRedeemedMode() {
        this.setState({setRewardsPanelShown: false});
    }

    render() {
        return (
            <div>
                <NavBar location={this.viewableHistory.location.pathname}  />
                <Grid container xs={12}>
                    <Grid container xs={8}>
                        <BoardSubpageBreadcrumbs currentPageName='Rewards Admin' board={this.state.board ? this.state.board : {}} />
                    </Grid>
                    <Grid style={{padding: "10px"}} container justify="center" xs={4}>
                        <ButtonGroup size='medium'>
                            <Button onClick={this.setRewardsMode.bind(this)} style={this.state.setRewardsPanelShown ? this.activeButtonStyle : {}}>Set Rewards</Button>
                            <Button onClick={this.viewRedeemedMode.bind(this)} style={!this.state.setRewardsPanelShown ? this.activeButtonStyle : {}}>Redeemed Rewards</Button>
                        </ButtonGroup>
                    </Grid>
                </Grid>
            </div>
        );
    }
};

export default RewardsAdmin;