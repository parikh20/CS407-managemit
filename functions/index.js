// const config = require("./util/config");
// const firebase = require("firebase");
// firebase.initializeApp(config);

const functions = require("firebase-functions");
const app = require("express")(); // routing for backend functions
const cors = require("cors"); // middleware for express
app.use(cors());



// index of functions

// from user.js

// from columns.js
const {getColumnGroups, createColumnGroups, getColumn, createColumn} = require("./handler/columns");
app.get("/getColumnGroups", getColumnGroups);
app.post("/createColumnGroups", createColumnGroups);
app.get("/getColumn", getColumn);
app.post("/createColumn", createColumn);
exports.api = functions.https.onRequest(app);