import axios from 'axios';

import { db } from './Firebase';
import { email } from './Email';

const dispatchUserNotifications = (boardData, currentUser, emailText, data, extraUser) => {
    emailText = 'New notification from your board "' + boardData.label + '":\n' + emailText + '\n\nIf you wish to stop receiving these emails, disable email notifications from your user settings page.';

    dispatchExternalHooks(data);

    let userList = boardData.userRefs;
    if (extraUser && !userList.includes(extraUser)) {
        userList.push(extraUser);
    }
    for (const userEmail of userList) {
        if (userEmail === currentUser.email) {
            continue;
        }
        db.collection('users').doc(userEmail).get().then(userRef => {
            let userPrefs = userRef.data();
            if (userPrefs === undefined) {
                return;
            }
            if (userPrefs.vacationMode && userPrefs.vacationModeEndDate !== null) {
                let today = new Date();
                if (userPrefs.vacationModeEndDate.toDate() >= today) {
                    return;
                }
                db.collection('users').doc(userEmail).update({
                    vacationModeEndDate: null,
                    vacationMode: false
                });
            }
            if (userPrefs.inAppNotifications) {
                db.collection('users').doc(userEmail).collection('notifications').add(data);
            }
            if (userPrefs.emailNotifications) {
                email.sendNotification([userEmail], boardData.label, emailText);
            }
        });
    }
};


const buildParams = (data, callData) => {
    let params = {};
    for (const item of callData.params) {
        let value = item.value;
        for (const dataKey of Object.keys(data)) {
            value = value.replace('{' + dataKey + '}', data[dataKey]);
        }
        params[item.name] = value;
    }
    return params;
};


const buildBody = (data, callData) => {
    let value = callData.body;
    for (const dataKey of Object.keys(data)) {
        value = value.replace('{' + dataKey + '}', data[dataKey]);
    }
    return value;
};


const dispatchExternalHooks = data => {
    let restrictedData = Object.assign({}, data);
    delete restrictedData['unread'];

    const boardApiHistoryRef = db.collection('boards').doc(data.boardId).collection('apiHistory');

    db.collection('boards').doc(data.boardId).collection('apiCalls').where('action', '==', data.action).get().then(callRefs => {
        callRefs.docs.forEach(callRef => {
            let callData = callRef.data();
            let params = buildParams(restrictedData, callData);
            let body = buildBody(restrictedData, callData).trim();
            console.log(params);

            if (callData.method === 'GET') {
                axios.get(callData.url, {
                    params: params
                }).then(response => {
                    boardApiHistoryRef.add({
                        status: response.status,
                        statusText: response.statusText,
                        data: response.data,
                        timestamp: new Date(),
                        name: callData.name,
                        id: callRef.id,
                        action: callData.action
                    });
                }).catch(error => {
                    if (error.response) {
                        boardApiHistoryRef.add({
                            status: error.response.status,
                            statusText: error.response.statusText,
                            data: error.response.data,
                            timestamp: new Date(),
                            name: callData.name,
                            id: callRef.id,
                            action: callData.action
                        });
                    } else if (error.request) {
                        console.log(error);
                        boardApiHistoryRef.add({
                            status: -1,
                            statusText: 'No Response Received',
                            data: '',
                            timestamp: new Date(),
                            name: callData.name,
                            id: callRef.id,
                            action: callData.action
                        });
                    } else {
                        boardApiHistoryRef.add({
                            status: 0,
                            statusText: 'Invalid Hook Details',
                            data: '"' + callData.name + '" could not be created',
                            timestamp: new Date(),
                            name: callData.name,
                            id: callRef.id,
                            action: callData.action
                        });
                    }
                });
            } else if (callData.method === 'POST') {
                axios.post(
                    callData.url, body !== '' ? body : params
                ).then(response => {
                    boardApiHistoryRef.add({
                        status: response.status,
                        statusText: response.statusText,
                        data: response.data,
                        timestamp: new Date(),
                        name: callData.name,
                        id: callRef.id,
                        action: callData.action
                    });
                }).catch(error => {
                    if (error.response) {
                        boardApiHistoryRef.add({
                            status: error.response.status,
                            statusText: error.response.statusText,
                            data: error.response.data,
                            timestamp: new Date(),
                            name: callData.name,
                            id: callRef.id,
                            action: callData.action
                        });
                    } else if (error.request) {
                        boardApiHistoryRef.add({
                            status: -1,
                            statusText: 'No Response Received',
                            data: '',
                            timestamp: new Date(),
                            name: callData.name,
                            id: callRef.id,
                            action: callData.action
                        });
                    } else {
                        boardApiHistoryRef.add({
                            status: 0,
                            statusText: 'Invalid Hook Details',
                            data: '"' + callData.name + '" could not be created',
                            timestamp: new Date(),
                            name: callData.name,
                            id: callRef.id,
                            action: callData.action
                        });
                    }
                });
            }
        });
    });
};


export { dispatchUserNotifications };