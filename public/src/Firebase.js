import firebase from 'firebase'

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

firebase.initializeApp(firebaseConfig);
export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();
export const db = firebase.firestore();
export default firebase;