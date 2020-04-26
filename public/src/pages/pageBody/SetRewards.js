import React from 'react';
import { Grid, Dialog, DialogTitle, Button, ButtonGroup, DialogContent, TextField, DialogActions } from '@material-ui/core';
import RewardItem from '../component/RewardItem';

class SetRewards extends React.Component {
    
    rewardsSub;

    constructor(props) {
        super(props);
        this.state = {
            rewardDialogOpen: false
        }
        this.loadRewards();
    }

    loadRewards() {
        this.rewardsSub = this.props.boardRef.ref.collection("rewards").onSnapshot((rewards) => {
            this.setState({rewardRefs: rewards});
        });
    }

    openNewRewardDialog() {
        this.setState({rewardDialogOpen: true})
    }

    handleClose(reward) {
        this.setState({rewardDialogOpen: false})
        if(reward) {
            this.props.boardRef.ref.collection("rewards").add(reward);
        }
    }

    componentWillUnmount() {
        this.rewardsSub && this.rewardsSub();
    }

    render() {
        return (
            <React.Fragment>
                <Grid style={{padding: "10px"}} container>
                    <Grid style={{paddingBottom: "10px"}} container justify="flex-end">
                        <ButtonGroup variant="contained" color="primary" size="medium">
                            <Button onClick={this.openNewRewardDialog.bind(this)}>Add Reward</Button>
                        </ButtonGroup>
                    </Grid>
                    <Grid container justify="center" spacing={3}>
                        <Grid item xs={12}>
                            {this.state.rewardRefs && this.state.rewardRefs.docs.map((rewardRef) => {
                                return <RewardItem key={rewardRef.id} rewardRef={rewardRef}></RewardItem>
                            })}
                        </Grid>
                    </Grid>
                </Grid>
                <NewRewardDialog open={this.state.rewardDialogOpen} onClose={this.handleClose.bind(this)}></NewRewardDialog>
            </React.Fragment>
        );
    }
};

class NewRewardDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    updateName(event) {
        this.setState({name: event.target.value});
    }

    updatePrice(event) {
        this.setState({price: event.target.value});
    }

    updateDesc(event) {
        this.setState({desc: event.target.value});
    }

    validateName() {
        if(!this.state.name || !this.state.name.length) {
            this.setState({nameError: "Please enter a name"});
        } else if(this.state.name.length > 50) {
            this.setState({nameError: "Name cannot be more than 50 characters"});
        } else {
            this.setState({nameError: null});
            return true;
        }
        return false;
    }

    validatePrice() {
        if(!this.state.price) {
            this.setState({priceError: "Please enter a price above 0"});
        } else if(this.state.price > 1000000) {
            this.setState({priceError: "Price cannot be greater than 1000000"});
        } else {
            this.setState({priceError: null});
            return true;
        }
        return false
    }

    validateDesc() {
        if(!this.state.desc) {
            this.setState({descError: null});
            return true;
        }
        if(this.state.desc.length > 5000) {
            this.setState({descError: "Description cannot be longer than 5000 character"});
        } else {
            this.setState({descError: null});
            return true;
        }
        return false
    }

    validate() {
        let valid = this.validateName();
        valid = this.validatePrice() && valid;
        valid = this.validateDesc() && valid;
        if(valid) {
            this.setState({
                name: null,
                price: null,
                desc: null,
                nameError: null,
                priceError: null,
                descError: null
            });
            this.props.onClose({
                name: this.state.name,
                pointCost: this.state.price,
                description: this.state.desc || ""
            });
        }
    }

    cancel() {
        this.props.onClose();
    }

    render() {
        return (
            <Dialog onClose={this.cancel.bind(this)} maxWidth="sm" fullWidth={true} open={this.props.open}>
                <DialogTitle>New Reward</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={8}>
                            <TextField
                                autoFocus
                                onChange={this.updateName.bind(this)}
                                id="rewardName"
                                label="Reward Name"
                                type="text"
                                variant="outlined"
                                error={!!this.state.nameError}
                                helperText={this.state.nameError}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                onChange={this.updatePrice.bind(this)}
                                id="rewardPrice"
                                label="Reward Price"
                                type="number"
                                variant="outlined"
                                error={!!this.state.priceError}
                                helperText={this.state.priceError}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                onChange={this.updateDesc.bind(this)}
                                id="rewardDescription"
                                label="Reward Description (optional)"
                                type="text"
                                variant="outlined"
                                error={!!this.state.descError}
                                helperText={this.state.descError}
                                rows={5}
                                multiline
                                fullWidth
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.validate.bind(this)} color="primary">Submit</Button>
                    <Button onClick={this.cancel.bind(this)} color="primary">Cancel</Button>
                </DialogActions>
            </Dialog>
        )
    }
}

export default SetRewards;