import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import RewardItem from '../component/RewardItem';
import { cache, addPointsToUser } from '../../Firebase';

class RedeemNewRewards extends React.Component {
    
    rewardsSub;
    userSub;

    constructor(props) {
        super(props);
        this.state = {}
        this.loadRewards();
    }

    loadRewards() {
        this.rewardsSub = this.props.boardRef.ref.collection("rewards").onSnapshot((rewards) => {
            this.setState({rewardRefs: rewards});
        });
    }

    handleBuy(rewardRef) {
        addPointsToUser(this.props.boardRef.ref.id, this.props.userEmail, -1*(rewardRef.data().pointCost));
        this.props.boardRef.ref.collection("redeemedrewards").add({user: this.props.userEmail, reward: rewardRef.ref.id, date: new Date()});
    }

    componentWillUnmount() {
        this.rewardsSub && this.rewardsSub();
    }

    render() {
        return (
            <React.Fragment>
                <Grid style={{padding: "10px"}} container>
                    <Grid style={{paddingBottom: "10px"}} container justify="flex-end">
                        <Typography variant="h5">Points: {this.props.userPoints}</Typography>
                    </Grid>
                    <Grid container justify="center" spacing={3}>
                        <Grid item xs={12}>
                            {this.state.rewardRefs && this.state.rewardRefs.docs.map((rewardRef) => {
                                return <RewardItem key={rewardRef.id} buymode={true} userPoints={this.props.userPoints} onBuy={this.handleBuy.bind(this)} rewardRef={rewardRef}></RewardItem>
                            })}
                        </Grid>
                    </Grid>
                </Grid>
            </React.Fragment>
        );
    }
};

export default RedeemNewRewards;