class History {
    constructor (user, action, board, timestamp) {
        this.user = user;
        this.action = action;
        this.board = board;
        this.timestamp = timestamp;
    }
}

export default History;