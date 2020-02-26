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
  
  constructor(db) {
    console.log("New class");
    this.db = db;
  }

  loadBoard(boardId) {
    console.log(Array.from(this.boards.keys()), boardId);
    if(this.boards.has(boardId)) {
      console.log("Old");
      return this.boards.get(boardId);
    } else {
      console.log("New");
      let sub = new ReplaySubject(1);
      this.boards.set(boardId, sub);
      this.subscriptions.push(this.db.collection("boards").doc(boardId).onSnapshot((boardRef) => {
        sub.next(boardRef);
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