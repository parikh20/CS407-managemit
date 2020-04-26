import React from 'react';
import { Paper, Grid, Typography, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';


class RewardItem extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            confirmDialogOpen: false
        }
    }

    delete() {
        this.props.rewardRef.ref.delete()
    }

    handleBuyClick() {
        this.setState({confirmDialogOpen: true})
    }

    handleClose(confirmed) {
        this.setState({confirmDialogOpen: false})
        if(confirmed) {
            this.props.onBuy(this.props.rewardRef);
        }
    }

    render() {
        return (
            <React.Fragment>
                <Paper style={{padding: "10px"}} elevation={1}>
                    <Grid container>
                        <Grid item xs={9}>
                            <Typography variant="h5">{this.props.rewardRef.data().name} - {this.props.rewardRef.data().pointCost}</Typography>
                            <Typography variant="body1">{this.props.rewardRef.data().description}</Typography>
                        </Grid>
                        <Grid item container justify="flex-end" xs={3}>
                            {!this.props.buymode && <IconButton onClick={this.delete.bind(this)}>
                                <DeleteIcon></DeleteIcon>
                            </IconButton>}
                            {this.props.buymode && <IconButton disabled={this.props.userPoints < this.props.rewardRef.data().pointCost} onClick={this.handleBuyClick.bind(this)}>
                                <AddShoppingCartIcon></AddShoppingCartIcon>
                            </IconButton>}
                        </Grid>
                    </Grid>
                </Paper>
                <RewardBuyConfirmDialog open={this.state.confirmDialogOpen} reward={this.props.rewardRef.data()} onClose={this.handleClose.bind(this)}></RewardBuyConfirmDialog>
            </React.Fragment>
        );
    }
};

class RewardBuyConfirmDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    confirm() {
        this.props.onClose(true)
    }

    cancel() {
        this.props.onClose(false);
    }

    render() {
        return (
            <Dialog onClose={this.cancel.bind(this)} maxWidth="sm" fullWidth={true} open={this.props.open}>
                <DialogTitle>Confirm Reward Redemption</DialogTitle>
                <DialogContent>
        <Typography variant="body1">You are about redeem '{this.props.reward.name}' for {this.props.reward.pointCost} points.</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.confirm.bind(this)} color="primary">Redeem</Button>
                    <Button onClick={this.cancel.bind(this)} color="primary">Cancel</Button>
                </DialogActions>
            </Dialog>
        )
    }
}

export default RewardItem;