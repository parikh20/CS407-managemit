import { db } from './Firebase';
import { email } from './Email';

const dispatchUserNotifications = (boardData, currentUser, emailText, data) => {
    emailText = 'New notification from your board "' + boardData.label + '":\n' + emailText + '\n\nIf you wish to stop receiving these emails, disable email notifications from your user settings page.';

    for (const userEmail of boardData.userRefs) {
        if (userEmail === currentUser.email) {
            continue;
        }
        db.collection('users').doc(userEmail).get().then(userRef => {
            let userPrefs = userRef.data();
            if (userPrefs === undefined) {
                return;
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