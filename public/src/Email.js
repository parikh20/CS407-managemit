const axios = require('axios').default;

class Email {
    //Takes a list of emails, board name, and a notification message
    sendNotification(emails, boardName, message) {
        return new Promise((res,rej) => {
            axios.post("http://localhost:3001/sendNotification", {
                emails: emails,
                boardName: boardName,
                message: message
            }).then((response) => {
                res();
            }).catch((err) => {
                rej("Failed");
            })
        })
    }

    constructor() {}
}

export const email = new Email();