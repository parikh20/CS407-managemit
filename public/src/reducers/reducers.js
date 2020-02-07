import ActionTypes from '../actions/actionTypes';

const initialState = {
    user: null
};

export default function(state = initialState, action) {
    if (action.type === ActionTypes.LOGIN_USER) {
        return Object.assign({}, state, {
            user: action.payload
        });
    }
    return state;
}