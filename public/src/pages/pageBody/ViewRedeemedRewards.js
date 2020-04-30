import React from 'react';
import { Typography, Paper, Grid } from '@material-ui/core';

class ViewRedeemedRewards extends React.Component {
    
    redeemedRewardsSub;
    rewardsSub;

    constructor(props) {
        super(props);
        this.state = {}
        this.loadRedeemedRewards();
        this.loadRewards();
    }

    loadRedeemedRewards() {
        if(this.props.email) {
            this.redeemedRewardsSub = this.props.boardRef.ref.collection("redeemedrewards").where("user", "==", this.props.email).onSnapshot((redeemedRewardsRef) => {
                this.setState({redeemedRewards: redeemedRewardsRef.docs});
            });
        } else {
            this.redeemedRewardsSub = this.props.boardRef.ref.collection("redeemedrewards").onSnapshot((redeemedRewardsRef) => {
                this.setState({redeemedRewards: redeemedRewardsRef.docs});
            });
        }
    }

    loadRewards() {
        this.rewardsSub = this.props.boardRef.ref.collection("rewards").onSnapshot((rewards) => {
            const rewardsMap = new Map();
            rewards.docs.forEach((ref) => {
                rewardsMap.set(ref.id, ref.data());
            });
            this.setState({rewardsMap: rewardsMap});
        });
    }

    formatDate(date) {
        let d = new Date();
        d.setTime(date.seconds*1000)
        return d.toDateString();
    }

    componentWillUnmount() {
        this.redeemedRewardsSub && this.redeemedRewardsSub()
        this.rewardsSub && this.rewardsSub()
    }

    render() {
        return (
            <React.Fragment>
                {this.state.rewardsMap && this.state.redeemedRewards && this.state.redeemedRewards.map((docRef) => {
                    return (
                    <React.Fragment>
                        <Paper style={{padding: "10px"}} elevation={1}>
                            <Grid container>
                                <Grid item xs={12}>
                                    <Typography variant="h5">{this.state.rewardsMap.get(docRef.data().reward).name} - {this.state.rewardsMap.get(docRef.data().reward).pointCost}</Typography>
                                    <Typography variant="body1">{this.state.rewardsMap.get(docRef.data().reward).description}</Typography>
                                    <Typography variant="body1">Redeemed {this.props.email ? "" : `by: ${docRef.data().user}`} on: {this.formatDate(docRef.data().date)}</Typography>
                                </Grid>
                            </Grid>
                        </Paper>
                    </React.Fragment>
                    )
                })}
            </React.Fragment>
        );
    }
};

export default ViewRedeemedRewards;