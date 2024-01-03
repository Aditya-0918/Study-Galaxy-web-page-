const firebaseConfig = {
    apiKey: "AIzaSyBglkIqOIMsIIpnJBZtfQSRDdgRSXm-DPU",
    authDomain: "studygalaxy-8aa56.firebaseapp.com",
    databaseURL: "https://studygalaxy-8aa56-default-rtdb.firebaseio.com",
    projectId: "studygalaxy-8aa56",
    storageBucket: "studygalaxy-8aa56.appspot.com",
    messagingSenderId: "657368593724",
    appId: "1:657368593724:web:ee0b1facca005fe9689a39",
  };

  firebase.initializeApp(firebaseConfig);
  let UserCreds = JSON.parse(localStorage.getItem("user-creds"));
  let UserInfo = JSON.parse(localStorage.getItem("user-info"));
  let unsavedData = JSON.parse(localStorage.getItem("unsavedData"));
  let a = 1;
  const sessionNo = document.querySelector('.sessionNo');
  try   { firebase
  .database()
  .ref("studytime")
  .child(UserCreds.uid)
  .update({
    Name: UserInfo.Name,
  });} catch{}
  if (localStorage.getItem("unsavedData")){
    firebase
    .database()
    .ref("studytime")
    .child(UserCreds.uid)
    .update({
      time: firebase.database.ServerValue.increment(unsavedData),
    });
  }
  let checkCred = () => {
    if (!localStorage.getItem("user-creds")) {
      window.location.href = "/pages/Login.html";
    }
  };
  window.addEventListener("load", checkCred);

  div = document.querySelector(".nav").classList;
  document.querySelector(".bi-gear").addEventListener("click", () => {
    div.toggle("nav");
    document.querySelector(".btn1").style.display = "none";
  });
  document.querySelector(".bt").addEventListener("click", () => {
    div.toggle("nav");
    document.querySelector(".btn1").style.display = "block";
  });

  async function randomQuote() {
    const response = await fetch("https://api.quotable.io/random");
    const quote = await response.json();
    // Output the quote and author name
    document.getElementById("quote").innerHTML = quote.content;
    document.getElementById("quote-author").innerHTML = "-" + quote.author;
  }
  randomQuote();
  const pomodoro = document.querySelector(".timer");
  var time = 1500;
  var Break = 300;
  var clock = time;
  var condition = true;
  const startTimer = () => {
    sessionNo.innerHTML = a;
    window.addEventListener("beforeunload", beforeUnloadHandler);
    timer = setInterval(() => {
      getScreenLock()
      if (time === 3) {
        document.getElementById('countdown').play();
      }
      if (time > 0) {
        // progress(time);
        time--;
        const totalSeconds = time;

        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        function padTo2Digits(num) {
          return num.toString().padStart(2, "0");
        }

        result = `${padTo2Digits(minutes)}:${padTo2Digits(seconds)}`;
        pomodoro.innerHTML = result;
      } else if (condition === false) {
        window.removeEventListener("beforeunload", beforeUnloadHandler);
        clearInterval(timer);
        condition = true;
        time = clock;
        startTimer();
        Swal.fire({
          title: "your brake is over",
          text: "have a great study session",
          icon: "info",
          showConfirmButton: false,
          timer: 2000,
        });
      } else {
        window.removeEventListener("beforeunload", beforeUnloadHandler);
        firebase
          .database()
          .ref("studytime")
          .child(UserCreds.uid)
          .update({
            time: firebase.database.ServerValue.increment(clock),
          });
        time = clock;
        a++;
        const swalWithBootstrapButtons = Swal.mixin({
          customClass: {
            confirmButton: "btn btn-success",
            cancelButton: "btn btn-primary",
          },
          buttonsStyling: false,
        });
        swalWithBootstrapButtons
          .fire({
            title: "Good Work!",
            text: "Scession is over",
            icon: "success",
            showCancelButton: true,
            confirmButtonText: "take a break",
            cancelButtonText: "Continue studying",
            backdrop: `#212529bf`,
          })
          .then((result) => {
            if (result.isConfirmed) {
              swalWithBootstrapButtons.fire({
                title: "Break Started",
                text: "Drink some water and stay hydrated",
                icon: "info",
                showConfirmButton: false,
                timer: 2000,
              });
              condition = false;
              time = Break;
              startTimer();
            } else if (
              /* Read more about handling dismissals below */
              result.dismiss === Swal.DismissReason.cancel
            ) {
              swalWithBootstrapButtons.fire({
                title: "Session Started",
                timer: 2000,
                text: "You should take a break",
                icon: "info",
                showConfirmButton: false,
              });

              time = clock;
              startTimer();
            }
          });
        clearInterval(timer);
      }
    }, 1000);
  };

  let isTimerRunning = false;
  let isReloading = false;
  pomodoro.addEventListener("click", () => {
    if (isTimerRunning) {
      clearInterval(timer); // Pause the timer
    } else {
      startTimer(); // Start or resume the timer
    }

    isTimerRunning = !isTimerRunning;
  });

  function beforeUnloadHandler(event) {
    isReloading = true;
    // Show a confirmation message if needed
    var confirmationMessage =
      "if you are leaving your study time will be updated afeter you come back";
    (event || window.event).returnValue = confirmationMessage;
    return confirmationMessage;
  }
  window.addEventListener("unload", function () {
    if (isReloading) {
      sendDataToDatabase();
    }
  });

  function sendDataToDatabase() {
    // Add your code here to send data to the database
    if (condition) {
      localStorage.setItem("unsavedData", clock - time);
    }
  }
  setTimeout(() => {
    localStorage.setItem("unsavedData", 0);
  }, 100);

  document.getElementById("quit").addEventListener("click", () => {
    if (condition) {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
      firebase.database().ref("studytime").child(UserCreds.uid).update({
          time: firebase.database.ServerValue.increment(clock - time)});
    }
    Swal.fire({
                    html: `<span class="spinner-border text-primary spinner-border-sm" role="status" aria-hidden="true"></span> loading...`,
                    showConfirmButton:false,
                });
    setTimeout(() => {
      window.location.href = "/pages/studygalaxy.html";
    }, 1000);
  });
  document.getElementById("name").innerHTML += `${UserInfo.Name}`;
  function isScreenLockSupported() {
 return ('wakeLock' in navigator);
}let screenLock;
navigator.wakeLock.request('screen')
   .then(lock => { 
     screenLock = lock; 
});
  async function getScreenLock() {
  if(isScreenLockSupported()){
    let screenLock;
    try {
       screenLock = await navigator.wakeLock.request('screen');
    } catch(err) {
       console.log(err.name, err.message);
    }
    return screenLock;
  }
}


function pomodoroStart( studyTime, breakTime){
  if (condition){
    firebase
    .database()
    .ref("studytime")
    .child(UserCreds.uid)
    .update({
      time: firebase.database.ServerValue.increment(clock-time),
    });

  }
  isTimerRunning = true;

  let StudyTime = document.getElementById(studyTime).value;
  let BreakTime = document.getElementById(breakTime).value;
  clock = StudyTime*60;
  try {
    
  clearInterval(timer);
  }
  catch(err) {
   
  }
  time = clock
  Break = BreakTime*60;
  startTimer();
  document.querySelector('.pomodoroSettings').classList.remove('show');
}

// const video = document.querySelector("video");
const videoBackgrounds = new VideoBackgrounds('[data-vbg]' , {
  'mobile': true,
});
const firstElement = document.querySelector('[data-vbg]');

// get the first instance instance by UID
const firstInstance = videoBackgrounds.get(firstElement);
const music = document.querySelector('.bi-music-note');
let muted = true;
music.addEventListener("click" , () => {
  if (!muted) {
    firstInstance.mute();
    music.classList.add('bi-music-note');
    music.classList.remove('bi-pause-fill');
    muted = true;
  } else {
    firstInstance.unmute();
    music.classList.remove('bi-music-note');
    music.classList.add('bi-pause-fill');
    muted = false;
  }
});


