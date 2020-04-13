import { db } from './Firebase';
import { email } from './Email';

const dispatchUserNotifications = (boardData, currentUser, emailText, data, extraUser) => {
    emailText = 'New notification from your board "' + boardData.label + '":\n' + emailText + '\n\nIf you wish to stop receiving these emails, disable email notifications from your user settings page.';

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

export { dispatchUserNotifications };