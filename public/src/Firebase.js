import firebase from 'firebase'
import {ReplaySubject} from 'rxjs';

const firebaseConfig = {
    apiKey: "AIzaSyCEN33oNb29C4H6rUj9H5do_zimBQS7ycI",
    authDomain: "managemit.firebaseapp.com",
    databaseURL: "https://managemit.firebaseio.com",
    projectId: "managemit",
    storageBucket: "managemit.appspot.com",
    messagingSenderId: "615143879220",
    appId: "1:615143879220:web:7e5d434378e0ef98401061",
    measurementId: "G-Z49YLSWB09"
  };

class FirebaseCache {
  
  subscriptions = [];
  boards = new Map();
  colGroups = new Map();
  
  constructor(db) {
    this.db = db;
  }

  loadBoard(boardId) {
    if(this.boards.has(boardId)) {
      return this.boards.get(boardId);
    } else {
      let sub = new ReplaySubject(1);
      this.boards.set(boardId, sub);
      this.subscriptions.push(this.db.collection("boards").doc(boardId).onSnapshot((boardRef) => {
        sub.next(boardRef);
      }));
      return sub;
    }
  }

  loadColumnGroup(boardRef, columnGroupId) {
    let path = `${boardRef.id}-${columnGroupId}`;
    if(this.colGroups.has(path)) {
      console.log("Old");
      return this.colGroups.get(path);
    } else {
      console.log("New");
      let sub = new ReplaySubject(1);
      this.colGroups.set(path, sub);
      this.subscriptions.push(boardRef.ref.collection("columnGroups").doc(columnGroupId).onSnapshot((colGroupRef) => {
        sub.next(colGroupRef);
      }));
      return sub;
    }
  }

}


firebase.initializeApp(firebaseConfig);
export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();
export const currentUser = new ReplaySubject(1);
export const db = firebase.firestore();
export const cache = new FirebaseCache(db);
export default firebase;

auth.onAuthStateChanged((user) => {
  currentUser.next(user);
});