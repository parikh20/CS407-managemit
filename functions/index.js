const functions = require("firebase-functions");
const firebase_tools = require('firebase-tools');
const admin = require('firebase-admin');
const serviceAccount = require('./admin.json')
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://managemit.firebaseio.com"
});
// const app = require("express")(); // routing for backend functions
// const cors = require("cors"); // middleware for express
// app.use(cors());

exports.getBoardTasks = functions
  .runWith({
    timeoutSeconds: 60,
    memory: '512MB'
  })
  .https.onCall(async (data, context) => {
    const db = admin.firestore();
    console.log(`Getting information for board ${data.boardId}`);
    var results = {};
    if (data.apiKey == "") {
      return "Error: API key is null"
    }
    try {
      const boardSnapshot = await db.collection('boards').doc(data.boardId).get();
      const board = boardSnapshot.data();
      if (board.apiKey == data.apiKey) {
        const tasksSnapshot = await db.collection('boards').doc(data.boardId).collection('tasks').get();
        tasksSnapshot.forEach(doc => {
          if (doc.exists) {
            results[doc.id] = doc.data();
          } else {
            return "Error: No tasks exist"
          }
        });
        return results;
      } else {
        return "Error: API key does not match"
      }
    }
    catch (error) {
      console.log(error)
      return error
    }
  });

  exports.getBoardHistory = functions
  .runWith({
    timeoutSeconds: 60,
    memory: '512MB'
  })
  .https.onCall(async (data, context) => {
    const db = admin.firestore();
    console.log(`Getting history for board ${data.boardId}`);
    var results = {};
    if (data.apiKey == "") {
      return "Error: API key is null"
    }
    try {
      const boardSnapshot = await db.collection('boards').doc(data.boardId).get();
      const board = boardSnapshot.data();
      if (board.apiKey == data.apiKey) {
        const tasksSnapshot = await db.collection('boards').doc(data.boardId).collection('history').get();
        tasksSnapshot.forEach(doc => {
          if (doc.exists) {
            results[doc.id] = doc.data();
          } else {
            return "Error: No history exists"
          }
        });
        return results;
      } else {
          return "Error: API key does not match"
      }
    }
    catch (error) {
      console.log(error)
      return error
    }
  });

exports.generateAPI = functions
  .runWith({
    timeoutSeconds: 30,
    memory: '512MB'
  })
  .https.onCall(async (data, context) => {
    var key = "";
    var charset = "abcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 64; i++) {
      key += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    const db = admin.firestore();
    console.log(`Updating board ${data.boardId} with new API key`)
    try {
      const board = db.collection('boards').doc(data.boardId);
      await board.update({
        apiKey: key
      });
      return key
    }
    catch (error) {
      return error
    }
  });

  exports.deleteAPI = functions
  .runWith({
    timeoutSeconds: 30,
    memory: '512MB'
  })
  .https.onCall(async (data, context) => {
    const db = admin.firestore();
    console.log(`Deleting API key for board ${data.boardId}`)
    try {
      const board = db.collection('boards').doc(data.boardId);
      await board.update({
        apiKey: null
      });
      return true
    }
    catch (error) {
      return error
    }
  });

  exports.changeEmail = functions
  .runWith({
    timeoutSeconds: 120,
    memory: '512MB'
  })
  .https.onCall(async (data, context) => {
      const oldEmail = data.oldEmail;
      const newEmail = data.newEmail;
      const uid = data.uid;
      const db = admin.firestore();
      const auth = admin.auth();
      try {
        await auth.updateUser(uid, {email: newEmail});
        var batch = db.batch();
        const boardRef = await db.collection('boards').where('userRefs', 'array-contains', oldEmail).get();
        boardRef.forEach(doc => {
          if (doc.exists) {
            var info = doc.data();
            if (info.owner !== oldEmail) {
                var newUserRefs = info.userRefs;
                for (var i = 0; i < newUserRefs.length; i++) {
                  if (newUserRefs[i] == oldEmail) {
                    newUserRefs[i] = newEmail;
                  }
                }
                var newPermissions = info.permissions;
                newPermissions[newEmail] = info.permissions[oldEmail];
                delete newPermissions[oldEmail];
                batch.update(doc.ref, {userRefs: newUserRefs});
                batch.update(doc.ref, {permissions: newPermissions});
            } else {
              var newUserRefs = info.userRefs;
              for (var i = 0; i < newUserRefs.length; i++) {
                if (newUserRefs[i] == oldEmail) {
                  newUserRefs[i] = newEmail;
                }
              }
              var newPermissions = info.permissions;
              newPermissions[newEmail] = info.permissions[oldEmail];
              delete newPermissions[oldEmail];
              batch.update(doc.ref, {userRefs: newUserRefs});
              batch.update(doc.ref, {permissions: newPermissions});
              batch.update(doc.ref, {owner: newEmail})
            }
          }
        });
        const userRef = await db.collection('users').doc(oldEmail).get();
        const newUserRef = db.collection('users').doc(newEmail);
        const user = userRef.data();
        batch.set(newUserRef, user);
        batch.delete(userRef.ref);
        await batch.commit();
        return true;
      }
      catch (error) {
        console.log(error);
        return error;
      }
  });

exports.recursiveDelete = functions
  .runWith({
    timeoutSeconds: 540,
    memory: '2GB'
  })
  .https.onCall((data, context) => {

    const pathArr = data.path;

    for (path of pathArr) {
      console.log(
        `User ${context.auth.uid} has requested to delete path ${path}`
      );

      firebase_tools.firestore
      .delete(path, {
        project: process.env.GCLOUD_PROJECT,
        recursive: true,
        yes: true,
      })
      .then(() => {
      });
    }

    return true;
  });

  // const {getColumnGroups, createColumnGroups, getColumn, createColumn} = require("./handler/columns");
// app.get("/getColumnGroups", getColumnGroups);
// app.post("/createColumnGroups", createColumnGroups);
// app.get("/getColumn", getColumn);
// app.post("/createColumn", createColumn);
//exports.api = functions.https.onRequest(app);