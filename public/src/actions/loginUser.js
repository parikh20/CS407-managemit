import ActionTypes from './actionTypes';

export function loginUser(userObj) {
    return {
        type: ActionTypes.LOGIN_USER,
        payload: userObj
    };
};