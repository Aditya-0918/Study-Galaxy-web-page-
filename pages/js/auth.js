// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  OAuthProvider, // Add OAuthProvider import
  signInWithPopup,
  GoogleAuthProvider,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { sendEmailVerification } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBglkIqOIMsIIpnJBZtfQSRDdgRSXm-DPU",
  authDomain: "studygalaxy-8aa56.firebaseapp.com",
  projectId: "studygalaxy-8aa56",
  storageBucket: "studygalaxy-8aa56.appspot.com",
  messagingSenderId: "657368593724",
  appId: "1:657368593724:web:ee0b1facca005fe9689a39",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth(app);

let email = document.getElementById("email");
let emailreg = document.getElementById("emailreg");
let password = document.getElementById("password");
let passwordreg = document.getElementById("passwordreg");
let loginForm = document.getElementById("login");
let signupForm = document.getElementById("signup");
let username = document.getElementById("username");
const discordClientId = "1189554323026362468";
const discordRedirectUri = "http://localhost:5500/discord-callback"; // Update with your callback URI

let registerUser = async (evt) => {
  evt.preventDefault();

  try {
    const credentials = await createUserWithEmailAndPassword(
      auth,
      emailreg.value,
      passwordreg.value
    );

    // Send verification email
    await sendVerificationEmail(credentials.user);

    // Increment user counter
    const userCounterRef = doc(db, "UserAuthList", "userCounter");
    const counterDoc = await getDoc(userCounterRef);
    let userCount = counterDoc.exists() ? counterDoc.data().count + 1 : 1;

    // Set user registration details with the incremented counter
    const userRef = doc(db, "UserAuthList", credentials.user.uid);
    await setDoc(userRef, {
      Name: "",
      email: emailreg.value,
      regNo: userCount,
    });

    // Update the user counter in the database
    await setDoc(userCounterRef, { count: userCount });

    Swal.fire({
      title: "Success!",
      text: "Your account has been created. Please check your email for verification.",
      icon: "success",
    });

    console.log(credentials);
  } catch (error) {
    Swal.fire({
      title: "Error!",
      text: error.message,
      icon: "error",
    });

    console.error(error.code);
    console.error(error.message);
  }
};
// Send verification email function
async function sendVerificationEmail(user) {
  try {
    await sendEmailVerification(user);
    console.log("Verification email sent!");
  } catch (error) {
    console.error("Error sending verification email:", error.message);
    throw error; // Rethrow the error to be caught in the main registerUser catch block
  }
}

let signInUser = async (evt) => {
  evt.preventDefault();
  const emailValue = email.value;
  const passwordValue = password.value;

  try {
    const credentials = await signInWithEmailAndPassword(
      auth,
      emailValue,
      passwordValue
    );

    // Check if the email is verified
    if (credentials.user.emailVerified) {
      // Proceed with sign-in
      Swal.fire({
        html: `<span class="spinner-border text-primary
         spinner-border-sm" role="status" aria-hidden="true"></span> Logging in...`,

        showConfirmButton: false,
      });

      const ref = doc(db, "UserAuthList", credentials.user.uid);
      const docSnap = await getDoc(ref);

      if (docSnap.exists()) {
        localStorage.setItem(
          "user-info",
          JSON.stringify({
            Name: docSnap.data().Name,
          })
        );
        localStorage.setItem("user-creds", JSON.stringify(credentials.user));
        window.location.href = "studygalaxy.html";
      }
    } else {
      // Show verification prompt
      Swal.fire({
        title: "Verify!",
        text: "Please verify your email address",
        icon: "info",
      });
    }
  } catch (error) {
    Swal.fire({
      title: "Error!",
      text: error.message,
      icon: "error",
    });
    console.log(error.code);
    console.log(error.message);
  }
};

loginForm.addEventListener("submit", signInUser);
signupForm.addEventListener("submit", registerUser);

// Function to login with Google
let signInUserWithGoogle = async () => {
  const googleProvider = new GoogleAuthProvider();
  try {
    const credentials = await signInWithPopup(auth, googleProvider);
    const userCounterRef = doc(db, "UserAuthList", "userCounter");
    const counterDoc = await getDoc(userCounterRef);
    let userCount = counterDoc.exists() ? counterDoc.data().count + 1 : 1;

    // Set user registration details with the incremented counter

    const ref = doc(db, "UserAuthList", credentials.user.uid);
    const docSnap = await getDoc(ref);
    if (!docSnap.exists()) {
      const userRef = doc(db, "UserAuthList", credentials.user.uid);
      await setDoc(userRef, {
        Name: username.value,
        email: emailreg.value,
        regNo: userCount,
      });
      await setDoc(userCounterRef, { count: userCount });
    }
    // Update the user counter in the database

    await saveUserInfo(credentials);
  } catch (error) {
    console.error("Google Authentication Error:", error.message);
  }
};

async function saveUserInfo(credentials) {
  try {
    const ref = doc(db, "UserAuthList", credentials.user.uid);
    const docSnap = await getDoc(ref);

    if (docSnap.exists()) {
      localStorage.setItem(
        "user-info",
        JSON.stringify({
          Name: docSnap.data().Name,
        })
      );
      localStorage.setItem("user-creds", JSON.stringify(credentials.user));
      window.location.href = "studygalaxy.html";
    }
  } catch (error) {
    console.error("Error saving user information:", error.message);
  }
}

// Event listeners for Google and Discord login buttons
document
  .getElementById("googleLoginBtn")
  .addEventListener("click", signInUserWithGoogle);
// document.getElementById("loginwithfb").addEventListener("click", loginWithFacebook);
