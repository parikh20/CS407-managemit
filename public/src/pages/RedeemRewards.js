import React from 'react';
import { createBrowserHistory } from 'history';

import NavBar from './component/NavBar';
import { Grid, ButtonGroup, Button, Paper } from '@material-ui/core';
import BoardSubpageBreadcrumbs from './component/BoardSubpageBreadcrumbs';
import { cache, db, currentUser } from '../Firebase';
import RedeemNewRewards from './pageBody/RedeemNewRewards';
import ViewRedeemedRewards from './pageBody/ViewRedeemedRewards';

class RedeemRewards extends React.Component {
    
    boardSub;
    pointSub;

    activeButtonStyle= {
        backgroundColor: "lightgrey"
    }
    
    constructor(props) {
        super(props);
        this.state = {
            setRewardsPanelShown: true,
            userEmail: JSON.parse(localStorage.getItem('user')).email
        }
        this.viewableHistory = createBrowserHistory();
        this.loadBoard();
    }

    loadBoard() {
        this.boardSub = cache.loadBoard(this.props.match.params.boardId).subscribe((board) => {
            let b = board.data();
            b.id = board.id;
            this.setState({boardRef: board, board: b});
            this.loadUserPoints(board)
        })
    }

    loadUserPoints(boardRef) {
        this.pointSub = boardRef.ref.collection("points").doc(this.state.userEmail).onSnapshot((pointsRef) => {
            this.setState({userPoints: pointsRef.data() ? pointsRef.data().points : 0});
        });
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

        let shownComponent = this.state.setRewardsPanelShown ? <RedeemNewRewards userPoints={this.state.userPoints} userEmail={this.state.userEmail} boardRef={this.state.boardRef}></RedeemNewRewards> : (this.state.boardRef && <ViewRedeemedRewards boardRef={this.state.boardRef} email={this.state.userEmail}></ViewRedeemedRewards>);

        return (
            <div>
                <NavBar location={this.viewableHistory.location.pathname}  />
                <Grid justify="space-between" container>
                    <Grid item xs={8}>
                        <BoardSubpageBreadcrumbs currentPageName='Redeem Rewards' board={this.state.boardRef ? this.state.board : {}} />
                    </Grid>
                    <Grid item xs={4}>
                        <Grid container justify="flex-end">
                            <ButtonGroup style={{padding: "10px"}} size='medium'>
                                <Button onClick={this.setRewardsMode.bind(this)} style={this.state.setRewardsPanelShown ? this.activeButtonStyle : {}}>View Rewards</Button>
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

export default RedeemRewards;