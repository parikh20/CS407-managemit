const functions = require("firebase-functions");
const firebase_tools = require('firebase-tools');
// const app = require("express")(); // routing for backend functions
// const cors = require("cors"); // middleware for express
// app.use(cors());

exports.recursiveDelete = functions
  .runWith({
    timeoutSeconds: 540,
    memory: '2GB'
  })
  .https.onCall((data, context) => {

    const path = data.path;
    console.log(
      `User ${context.auth.uid} has requested to delete path ${path}`
    );

    return firebase_tools.firestore
      .delete(path, {
        project: process.env.GCLOUD_PROJECT,
        recursive: true,
        yes: true,
      })
      .then(() => {
        return {
          path: path 
        };
      });
  });

// const {getColumnGroups, createColumnGroups, getColumn, createColumn} = require("./handler/columns");
// app.get("/getColumnGroups", getColumnGroups);
// app.post("/createColumnGroups", createColumnGroups);
// app.get("/getColumn", getColumn);
// app.post("/createColumn", createColumn);
// exports.api = functions.https.onRequest(app);