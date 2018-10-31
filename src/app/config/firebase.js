import firebase from 'firebase'
import 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyDeaVG1xzsJMpj7FhwWN4gVtzBL6AJRWZo",
    authDomain: "revents-99d5b.firebaseapp.com",
    databaseURL: "https://revents-99d5b.firebaseio.com",
    projectId: "revents-99d5b",
    storageBucket: "revents-99d5b.appspot.com",
    messagingSenderId: "424558437895"
}


firebase.initializeApp(firebaseConfig);
const firestore = firebase.firestore();
const settings = {
    timestampsInSnapshots: true
}
firestore.settings(settings);
export default firebase;