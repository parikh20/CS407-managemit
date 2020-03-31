const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')();
const sg = require("@sendgrid/mail");
sg.setApiKey("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");
const app = express()
const port = process.env.PORT || 3001

app.use(cors);
app.use(bodyParser.json());

app.get('/', (req, res) => res.send("Email Server up and Running"))

app.post('/sendNotification', (req, res) => {
    const emails = req.body.emails;
    const boardName = req.body.boardName;
    const message = req.body.message;

    let promises = [];

    emails.forEach((destEmail) => {
        promises.push(sg.send({
            to: destEmail,
            from: "managemit@gmail.com",
            subject: `Notification${boardName ? ' for ' + boardName : ''}`,
            text: message
        }))
    })

    Promise.all(promises).then(() => {
        res.status(200).end(JSON.stringify({message: "Emails Sent"}));
    }).catch((err) => {
        console.error(err);
        res.status(500).end(JSON.stringify({message: "Error sending emails, see server for details"}));
    })
});

app.listen(port, () => console.log(`Email Server running on ${port}`))
