import React from 'react';
import { createBrowserHistory } from 'history';

import NavBar from './component/NavBar';
import { Grid, ButtonGroup, Button, Paper } from '@material-ui/core';
import BoardSubpageBreadcrumbs from './component/BoardSubpageBreadcrumbs';
import { cache } from '../Firebase';
import SetRewards from './pageBody/SetRewards';
import ViewRedeemedRewards from './pageBody/ViewRedeemedRewards';
import { makeStyles } from '@material-ui/core/styles';

const primaryDark = "#222831"
const secondaryDark = "#30476E"
const darkTextColor = "#c1a57b"
const black = "#000"
const white = "#fff"

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
            let b = board.data();
            b.id = board.id;
            this.setState({boardRef: board, board: b});
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

        let shownComponent = this.state.setRewardsPanelShown ? <SetRewards boardRef={this.state.boardRef}></SetRewards> : (this.state.boardRef && <ViewRedeemedRewards boardRef={this.state.boardRef}></ViewRedeemedRewards>);
        const primaryDark = "#222831"
        const white = "#fff"
        const mode = localStorage.darkMode
        mode === 'dark' ? document.body.style.backgroundColor = primaryDark : document.body.style.backgroundColor = white;
        return (
            <div>
                <NavBar location={this.viewableHistory.location.pathname}  />
                <Grid justify="space-between" container>
                    <Grid item xs={8}>
                        <BoardSubpageBreadcrumbs currentPageName='Rewards Admin' board={this.state.boardRef ? this.state.board : {}} />
                    </Grid>
                    <Grid item xs={4} >
                        <Grid container justify="flex-end" >
                            <ButtonGroup style={{padding: "10px"}} size='medium'>
                                <Button onClick={this.setRewardsMode.bind(this)} style={this.state.setRewardsPanelShown ? this.activeButtonStyle : {}}>Set Rewards</Button>
                                <Button onClick={this.viewRedeemedMode.bind(this)} style={!this.state.setRewardsPanelShown ? this.activeButtonStyle : {}}>Redeemed Rewards</Button>
                            </ButtonGroup>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid container justify="center">
                    <Grid item xs={10}>
                        <Paper elevation={3} style={{"min-height": "80vh", backgroundColor:localStorage.darkMode==='dark'?secondaryDark:white, color: localStorage.darkMode==='dark'?darkTextColor:black}}>
                            {this.state.boardRef && shownComponent}
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        );
    }
};

export default RewardsAdmin;