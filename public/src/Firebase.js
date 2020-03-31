import firebase from 'firebase'
import {ReplaySubject} from 'rxjs';
import {email} from './Email';

email.sendNotification(["vinyardjoseph@gmail.com"], "Test Board", "This is a test notification");

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
  tasks = new Map();
  colGroups = new Map();
  columns = new Map();
  
  constructor(db) {
    this.db = db;
  }

  // Given the id of the board, returns an observable for the board
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

  loadTasks(boardRef) {
    if(this.tasks.has(boardRef.id)) {
      return this.tasks.get(boardRef.id);
    } else {
      let sub = new ReplaySubject(1);
      this.tasks.set(boardRef.id, sub);
      this.subscriptions.push(boardRef.ref.collection("tasks").onSnapshot((taskRefs) => {
        sub.next(taskRefs);
      }));
      return sub;
    }
  }

  // Given a boardRef and a columnGroupId, returns an observable for the Column Group
  loadColumnGroup(boardRef, columnGroupId) {
    let path = `${boardRef.id}-${columnGroupId}`;
    if(this.colGroups.has(path)) {
      return this.colGroups.get(path);
    } else {
      let sub = new ReplaySubject(1);
      this.colGroups.set(path, sub);
      this.subscriptions.push(boardRef.ref.collection("columnGroups").doc(columnGroupId).onSnapshot((colGroupRef) => {
        sub.next(colGroupRef);
      }));
      return sub;
    }
  }

  // Given a reference to a column group, returns an observable for columns in the column group
  loadColumns(colGroupRef) {
    if(this.columns.has(colGroupRef.id)) {
      return this.columns.get(colGroupRef.id);
    } else {
      let sub = new ReplaySubject(1);
      this.columns.set(colGroupRef.id, sub);
      this.subscriptions.push(colGroupRef.ref.collection("columns").onSnapshot((columnRefs) => {
        sub.next(columnRefs);
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