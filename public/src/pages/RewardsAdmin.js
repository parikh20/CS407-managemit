import React from 'react';
import { createBrowserHistory } from 'history';

import NavBar from './component/NavBar';
import { Grid, ButtonGroup, Button, Paper } from '@material-ui/core';
import BoardSubpageBreadcrumbs from './component/BoardSubpageBreadcrumbs';
import { cache } from '../Firebase';
import SetRewards from './pageBody/SetRewards';
import ViewRedeemedRewards from './pageBody/ViewRedeemedRewards';

class RewardsAdmin extends React.Component {
    
    boardSub;

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
            this.setState({boardRef: board});
        })
    }

    setRewardsMode() {
        this.setState({setRewardsPanelShown: true});
    }

    viewRedeemedMode() {
        this.setState({setRewardsPanelShown: false});
    }

    componentWillUnmount() {
        this.boardSub && this.boardSub();
    }

    render() {

        let shownComponent = this.state.setRewardsPanelShown ? <SetRewards boardRef={this.state.boardRef}></SetRewards> : <ViewRedeemedRewards></ViewRedeemedRewards>;

        return (
            <div>
                <NavBar location={this.viewableHistory.location.pathname}  />
                <Grid justify="space-between" container>
                    <Grid item xs={8}>
                        <BoardSubpageBreadcrumbs currentPageName='Rewards Admin' board={this.state.boardRef ? this.state.boardRef.data() : {}} />
                    </Grid>
                    <Grid item xs={4}>
                        <Grid container justify="flex-end">
                            <ButtonGroup style={{padding: "10px"}} size='medium'>
                                <Button onClick={this.setRewardsMode.bind(this)} style={this.state.setRewardsPanelShown ? this.activeButtonStyle : {}}>Set Rewards</Button>
                                <Button onClick={this.viewRedeemedMode.bind(this)} style={!this.state.setRewardsPanelShown ? this.activeButtonStyle : {}}>Redeemed Rewards</Button>
                            </ButtonGroup>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid container justify="center">
                    <Grid item xs={10}>
                        <Paper elevation={3} style={{"min-height": "80vh"}}>
                            {this.state.boardRef && shownComponent}
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        );
    }
};

export default RewardsAdmin;