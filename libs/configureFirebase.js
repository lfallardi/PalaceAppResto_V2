import * as firebase from "firebase";
import "firebase/firestore";

const configureFirebase = () => {
    const firebaseConfig = {
        apiKey: "AIzaSyCfeLKmwtx7bZ5rpErQmoVc_tovfeo0FKo",
        authDomain: "pepe-f1c03.firebaseapp.com",
        databaseURL: "https://pepe-f1c03.firebaseio.com",
        projectId: "pepe-f1c03",
        storageBucket: "pepe-f1c03.appspot.com",
        messagingSenderId: "1025723048121",
        appId: "1:1025723048121:web:ff3ee20f2fa2ebc0a1fb68",
        measurementId: "G-TCWG0BBJ40"
    };

    firebase.initializeApp(firebaseConfig);
    //firebase.analytics();
}

export default configureFirebase;