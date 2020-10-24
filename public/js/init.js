const firebaseConfig = {
    apiKey: "AIzaSyDkn3sh33RTb6nRPtNAD9p-JZc6Qbb-frg",
    authDomain: "test-json-cbef3.firebaseapp.com",
    databaseURL: "https://test-json-cbef3.firebaseio.com",
    projectId: "test-json-cbef3",
    storageBucket: "test-json-cbef3.appspot.com",
    messagingSenderId: "610759909312",
    appId: "1:610759909312:web:e3fb6f03a77529824a7225"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage()

auth.onAuthStateChanged(user=>{
    if(user){
        //try to get resources
        console.log("user signed in", user.uid);
        
    }else{
        //not signed in
        console.log("no user");
    }
});

