const config = require("../util/config");
const firebase = require('firebase');
firebase.initializeApp(config);

const {db, admin} = require("../util/admin");

exports.getColumnGroups = (req, res) => {
    
}

exports.createColumnGroups = (req, res) => {
    
}

exports.createColumn = (req, res) => {

}

exports.getColumn = (req, res) => {
    const colId = req.body.colId;
    var docRef = db.collection("columns").doc(colId);
    // must have columnId
    docRef.get().then((doc) => {
        if (doc.exists) {
            return res.status(200).json(doc.data());
        } else {
            return res.status(404).json({error: "requested column not found"});
        }
    }).catch((error) => {
        console.log("Error getting document", error);
    })
}