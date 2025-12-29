// Import Firebase (v9 modular)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// 🔁 REPLACE THIS WITH YOUR FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Signup
window.signup = function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then(() => alert("Account created!"))
    .catch(err => alert(err.message));
};

// Login
window.login = function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      document.getElementById("auth").style.display = "none";
      document.getElementById("dashboard").style.display = "block";
      loadTotal();
    })
    .catch(err => alert(err.message));
};

// Logout
window.logout = function () {
  signOut(auth).then(() => location.reload());
};

// Log volunteer hours
window.logHours = async function () {
  const hours = Number(document.getElementById("hours").value);
  const organization = document.getElementById("organization").value;

  if (!hours || !organization) {
    alert("Please fill in all fields");
    return;
  }

  await addDoc(collection(db, "hours"), {
    uid: auth.currentUser.uid,
    hours,
    organization,
    approved: true // auto-approved for now
  });

  alert("Hours logged!");
  loadTotal();
};

// Load total hours
async function loadTotal() {
  const q = query(
    collection(db, "hours"),
    where("uid", "==", auth.currentUser.uid),
    where("approved", "==", true)
  );

  const snapshot = await getDocs(q);
  let total = 0;
  snapshot.forEach(doc => total += doc.data().hours);

  document.getElementById("total").innerText = total;
}
