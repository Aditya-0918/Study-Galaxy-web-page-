const firebaseConfig = {
    apiKey: "AIzaSyBglkIqOIMsIIpnJBZtfQSRDdgRSXm-DPU",
    authDomain: "studygalaxy-8aa56.firebaseapp.com",
    databaseURL: "https://studygalaxy-8aa56-default-rtdb.firebaseio.com",
    projectId: "studygalaxy-8aa56",
    storageBucket: "studygalaxy-8aa56.appspot.com",
    messagingSenderId: "657368593724",
    appId: "1:657368593724:web:ee0b1facca005fe9689a39",
  };
const d = new Date();
let gtdate = d.getDate();
let month = d.getMonth() + 1;
const data = gtdate + "-" + month ;


  firebase.initializeApp(firebaseConfig);
  let UserCreds = JSON.parse(localStorage.getItem("user-creds"));
  let UserInfo = JSON.parse(localStorage.getItem("user-info"));
  let unsavedData = JSON.parse(localStorage.getItem("unsavedData"));
  let a = 1;
  const sessionNo = document.querySelector('.sessionNo');
  try   { 
    let firbse = firebase.database().ref("studytime").child(UserCreds.uid)

  firbse.update({
    Name: UserInfo.Name,
  });
  firbse.child(data)
    .update({
      time: firebase.database.ServerValue.increment(0),
    });


} catch{}

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
    const response = await fetch("https://api.quotable.io/quotes?tags=Education|famous-quotes|inspirational|knowledge");
    const quote = await response.json();
    if (response.ok) {
      // Update DOM elements
      console.log(quote);
    document.getElementById("quote").innerHTML = `“ ${quote.results[0].content}”`;
    document.getElementById("quote-author").innerHTML = "-" + quote.results[0].author;
    } 
  }
  
  
  randomQuote();
  // timer function
  const pomodoro = document.querySelector(".timer");
  var time = 1500;
  var Break = 300;
  var clock = time;
  var condition = true;
  const startTimer = () => {
    sessionNo.innerHTML = a;
    if (condition) {
      upgtime = setInterval(() => {
        updateStudyTime();
      }, 30000);
    }
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
        time = clock;
        a++;
        randomQuote();
        
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
        clearInterval(upgtime);
      }
    }, 1000);
  };

  let isTimerRunning = false;
  let isReloading = false;
  pomodoro.addEventListener("click", () => {
    if (isTimerRunning) {
      clearInterval(timer); 
      clearInterval(upgtime);// Pause the timer
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


  document.getElementById("quit").addEventListener("click", () => {
    Swal.fire({
                    html: `<span class="spinner-border text-primary spinner-border-sm" role="status" aria-hidden="true"></span> loading...`,
                    showConfirmButton:false,
                });
    setTimeout(() => {
      window.location.href = "/pages/studygalaxy.html";
    }, 1000);
  });

  // get username and show it to the html 
  document.getElementById("name").innerHTML += `${UserInfo.Name}`;

  //screen lock to avoid truning off the screen 


  
  function isScreenLockSupported() {
 return ('wakeLock' in navigator);
}let screenLock;
if(isScreenLockSupported()){
navigator.wakeLock.request('screen')
   .then(lock => { 
     screenLock = lock; 
   });
}
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




// video settings and mute unmute settings
const videoBackgrounds = new VideoBackgrounds('[data-vbg]' , {
  'mobile': true,
});
const firstElement = document.querySelector('[data-vbg]');
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



// pomodoro settings 
function increaseMinutes(inputId) {
  var inputElement = document.getElementById(inputId);
  var currentValue = parseInt(inputElement.value);

  if (currentValue < parseInt(inputElement.max)) {
    inputElement.value = Math.floor(currentValue / 5) * 5 + 5;
    if (parseInt(inputElement.value) > parseInt(inputElement.max)) {
      inputElement.value = parseInt(inputElement.max);
    }
  }
}

function decreaseMinutes(inputId) {
  var inputElement = document.getElementById(inputId);
  var currentValue = parseInt(inputElement.value);

  if (currentValue >= parseInt(inputElement.min) + 5) {
    inputElement.value = Math.floor(currentValue / 5) * 5 - 5;
    if (parseInt(inputElement.value) < parseInt(inputElement.min)) {
      inputElement.value = parseInt(inputElement.min);
    }
  }
}
function updateStudyTime() {
  firebase
    .database()
    .ref("studytime")
    .child(UserCreds.uid).child(data)
    .update({
      time: firebase.database.ServerValue.increment(30),
    });
}

function checkInput(inputId) {
  var inputElement = document.getElementById(inputId);
  var value = parseInt(inputElement.value);

  if (value < parseInt(inputElement.min)) {
    inputElement.value = parseInt(inputElement.min);
  } else if (value > parseInt(inputElement.max)) {
    inputElement.value = parseInt(inputElement.max);
  } else if (value % 5 !== 0) {
    inputElement.value = Math.floor(value / 5) * 5;
  }
}

document.querySelector('.bi-stopwatch').addEventListener('click', () => {
  document.querySelector('.pomodoroSettings').classList.toggle('show');
});
function pomodoroStart( studyTime, breakTime){
  isTimerRunning = true;

  let StudyTime = document.getElementById(studyTime).value;
  let BreakTime = document.getElementById(breakTime).value;
  clock = StudyTime*60;
  try {
    
  clearInterval(timer);
  clearInterval(upgtime);

  }
  catch(err) {
   
  }
  time = clock
  Break = BreakTime*60;
  startTimer();
  document.querySelector('.pomodoroSettings').classList.remove('show');
}

// change backgrounds


let sourcesLofiRecords = [ 'n61ULEU7CO0' ,'TURbeWK2wwg'];
let sourcesLofiEveryday= ['ezdP1lzsNUg','dzUHadgLiIY' , 'ZVEGvdh4-bM' , 'yKH7g4oupDE'  ,'MZhivjxcF-M','Zbd1PKd-J_o','1bPb0egItVI', 'lzqHzF1S1F4','taNGanhQ8zo','n4P3CLAxJiw', 'Wqm-qADZP3U', 'BMCHy-AyhkY', 'UbLSGl-W46E']
// firstInstance.setSource(`https://www.youtube.com/watch?v=${sourcesLofiEveryday[0]}`)


let bgbox = document.querySelector('.changebg');
let defElement = '<img src="';
let imgsrc = 'https://img.youtube.com/vi/'

document.querySelector('.bi-card-image').addEventListener('click', () => {
 
  document.getElementById('changebg').classList.toggle('show');
});
sourcesLofiEveryday.map((value) => { 
  bgbox.innerHTML += `${defElement}${imgsrc}${value}/0.jpg" id='${value}'>`;
});
const loadimg = () =>{
  Swal.fire({
    html: `<span class="spinner-border text-primary spinner-border-sm" role="status" aria-hidden="true"></span> loading...`,
    showConfirmButton:false,
    allowOutsideClick: false,
    timer: 3000
});
music.classList.add('bi-music-note');
music.classList.remove('bi-pause-fill');
}
for(let i = 0; i < bgbox.children.length; i++){
  let currentChild = bgbox.children[i];
  currentChild.addEventListener('click', () => {
    firstInstance.setSource(`https://www.youtube.com/watch?v=${currentChild.id}`);
    firstInstance.play();
    document.getElementById('changebg').classList.remove('show');
    loadimg();
  });
}
var lofirec = true;
var lifiever = false;
document.querySelector('.lofirec').addEventListener('click', () => {
  if (lofirec){

  document.querySelector('.lofiever').classList.toggle('text-primary');
  document.querySelector('.lofirec').classList.toggle('text-primary');
  bgbox.innerHTML = '';
  sourcesLofiRecords.map((value) => { 
    bgbox.innerHTML += `${defElement}${imgsrc}${value}/0.jpg" id='${value}'>`;
    lifiever = true;
    lofirec = false;
  });
  for(let i = 0; i < bgbox.children.length; i++){
    let currentChild = bgbox.children[i];
    currentChild.addEventListener('click', () => {
      firstInstance.setSource(`https://www.youtube.com/watch?v=${currentChild.id}`);
      firstInstance.play();
      document.getElementById('changebg').classList.remove('show');
      loadimg();
    });
  }
  }
});
document.querySelector('.lofiever').addEventListener('click', () => {
  if (lifiever){
    document.querySelector('.lofiever').classList.toggle('text-primary');
    document.querySelector('.lofirec').classList.toggle('text-primary');
    bgbox.innerHTML = '';
    sourcesLofiEveryday.map((value) => { 
      bgbox.innerHTML += `${defElement}${imgsrc}${value}/0.jpg" id='${value}'>`;
      lifiever = false;
      lofirec = true;
    });
    for(let i = 0; i < bgbox.children.length; i++){
      let currentChild = bgbox.children[i];
      currentChild.addEventListener('click', () => {
        firstInstance.setSource(`https://www.youtube.com/watch?v=${currentChild.id}`);
        firstInstance.play();
        document.getElementById('changebg').classList.remove('show');
        loadimg();
      });
    }
  }
});
// bg by url 
document.getElementById('custombg').addEventListener('click' , async()=>{
  const { value: url } =  await Swal.fire({
  input: "url",
  inputLabel: "add youtube video address",  
  showCancelButton: true,
  inputPlaceholder: "Enter youtube video URL"
});
if (url) {
  firstInstance.setSource(`https://www.youtube.com/watch?v=${url}`);
        firstInstance.play();
        document.getElementById('changebg').classList.remove('show');
        loadimg();
}
});