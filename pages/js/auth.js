    // Import the functions you need from the SDKs you need
    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
    import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
    import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
    // TODO: Add SDKs for Firebase products that you want to use
    // https://firebase.google.com/docs/web/setup#available-libraries

    // Your web app's Firebase configuration
    const firebaseConfig = {
        apiKey: "AIzaSyBglkIqOIMsIIpnJBZtfQSRDdgRSXm-DPU",
        authDomain: "studygalaxy-8aa56.firebaseapp.com",
        projectId: "studygalaxy-8aa56",
        storageBucket: "studygalaxy-8aa56.appspot.com",
        messagingSenderId: "657368593724",
        appId: "1:657368593724:web:ee0b1facca005fe9689a39"
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore();
    const auth = getAuth(app);

    let email = document.getElementById('email');
    let emailreg = document.getElementById('emailreg');
    let password = document.getElementById('password');
    let passwordreg = document.getElementById('passwordreg');
    let loginForm = document.getElementById('login');
    let signupForm = document.getElementById('signup');
    let username = document.getElementById('username');


    let registerUser = evt => {
        evt.preventDefault();
        createUserWithEmailAndPassword(auth, emailreg.value, passwordreg.value).then(async (credentials) => {
            Swal.fire({
                title: "Success!",
                text: "Your account has been created",
                icon: "success"
            });
            var ref = doc(db, "UserAuthList", credentials.user.uid);
            await setDoc(ref, {
                Name: username.value,
            });
            console.log(credentials);

        }).catch((error) => {
            Swal.fire({
                title: "error!",
                text: error.message,
                icon: "error"
            });
            console.log(error.code);
            console.log(error.message);
        })
    };
    let signInUser = evt => {
        evt.preventDefault();
        signInWithEmailAndPassword(auth, email.value, password.value).then(async (credentials) => {
            Swal.fire({ html: `<span class="spinner-border text-dark spinner-border-sm" role="status" aria-hidden="true"></span> Logging in...` });
            var ref = doc(db, "UserAuthList", credentials.user.uid);
            const docSnap = await getDoc(ref);
            if (docSnap.exists()) {
                localStorage.setItem("user-info", JSON.stringify({
                    Name: docSnap.data().Name,
                }))
                localStorage.setItem("user-creds", JSON.stringify(credentials.user));
                window.location.href = "studygalaxy.html";
                
            }
        }).catch((error) => {
            Swal.fire({
                title: "error!",
                text: error.message,
                icon: "error"
            });
            console.log(error.code);
            console.log(error.message);
        })
    }
    loginForm.addEventListener('submit', signInUser);
    signupForm.addEventListener('submit', registerUser);