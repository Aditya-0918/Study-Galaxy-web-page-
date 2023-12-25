//
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

const d = new Date();
let date = d.getDate();
let month = d.getMonth() + 1;
let year = d.getFullYear();
let div = date + "-" + month + "-" + year;

const database = firebase.database();
const scoreRef = database.ref(div);
const progressBar = document.querySelector(".progress-bar"),
  progressText = document.querySelector(".progress-text");

let result = "";
const progress = (value) => {
  const percentage = (value / time) * 100;
  progressBar.style.width = `${percentage}%`;
  progressText.innerHTML = result;
};

const startBtn = document.querySelector(".start"),
  quiz = document.querySelector(".quiz"),
  startScreen = document.querySelector(".start-screen");

let questions = [],
  time = 30,
  score = 0,
  currentQuestion,
  timer;
let skipped = 0;
let crect = 0;
let wrng = 0;
const startQuiz = () => {
  const num = 25;
  loadingAnimation();
  let myTimeout;

  function disqualify() {
    firebase.database().ref(div).child(UserCreds.uid).set({
      Name: UserInfo.Name,
      time: now,
      status: "disqualified",
      email: UserCreds.email,
    });
    window.location.reload();
  }

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      notification = new Notification("Comeback please", {
        body: "please come back or you'll be disqualified",
        tag: "alert notification",
      });

      myTimeout = setTimeout(disqualify, 15000);
    } else {
      notification.close();
      clearTimeout(myTimeout); // Clear the timeout when the notification is closed
    }
  });
  const url = `data/data.json`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      questions = data.results;
      setTimeout(() => {
        startScreen.classList.add("hide");
        quiz.classList.remove("hide");
        currentQuestion = 1;
        showQuestion(questions[0]);
      }, 1000);
    });
};

startBtn.addEventListener("click", startQuiz);

const showQuestion = (question) => {
  const questionText = document.querySelector(".question"),
    answersWrapper = document.querySelector(".answer-wrapper");
  questionNumber = document.querySelector(".number");

  questionText.innerHTML = question.question;

  const answers = [
    ...question.incorrect_answers,
    question.correct_answer.toString(),
  ];
  answersWrapper.innerHTML = "";
  answers.sort(() => Math.random() - 0.5);
  answers.forEach((answer) => {
    answersWrapper.innerHTML += `
                  <div class="answer ">
            <span class="text">${answer}</span>
            <span class="checkbox">
              <i class="fas fa-check"></i>
            </span>
          </div>
        `;
  });

  questionNumber.innerHTML = ` Question <span class="current">${
    questions.indexOf(question) + 1
  }</span>
            <span class="total">/${questions.length}</span>`;
  //add event listener to each answer
  const answersDiv = document.querySelectorAll(".answer");
  answersDiv.forEach((answer) => {
    answer.addEventListener("click", () => {
      if (!answer.classList.contains("checked")) {
        answersDiv.forEach((answer) => {
          answer.classList.remove("selected");
        });
        answer.classList.add("selected");
        submitBtn.disabled = false;
      }
    });
  });

  time = 180;
  startTimer(time);
};

const startTimer = (time) => {
  timer = setInterval(() => {
    if (time === 3) {
      playAdudio("countdown.mp3");
    }
    if (time >= 0) {
      progress(time);
      time--;
      const totalSeconds = time;

      // 👇️ get the number of full minutes
      const minutes = Math.floor(totalSeconds / 60);

      // 👇️ get the remainder of the seconds
      const seconds = totalSeconds % 60;

      function padTo2Digits(num) {
        return num.toString().padStart(2, "0");
      }

      // ✅ format as MM:SS
      result = `${padTo2Digits(minutes)}:${padTo2Digits(seconds)}`;
    } else {
      checkAnswer();
    }
  }, 1000);
};

const loadingAnimation = () => {
  startBtn.disabled = true;
  startBtn.innerHTML = "Loading";
  const loadingInterval = setInterval(() => {
    if (startBtn.innerHTML.length === 10) {
      startBtn.innerHTML = "Loading";
    } else {
      startBtn.innerHTML += ".";
    }
  }, 500);
};


const submitBtn = document.querySelector(".submit"),
  nextBtn = document.querySelector(".next");
submitBtn.addEventListener("click", () => {
  checkAnswer();
});

nextBtn.addEventListener("click", () => {
  nextQuestion();
  submitBtn.style.display = "block";
  nextBtn.style.display = "none";
});

const checkAnswer = () => {
  clearInterval(timer);
  const selectedAnswer = document.querySelector(".answer.selected");
  if (selectedAnswer) {
    const answer = selectedAnswer.querySelector(".text").innerHTML;
    console.log(currentQuestion);
    if (answer === questions[currentQuestion - 1].correct_answer) {
      score++;
      selectedAnswer.classList.add("correct");
      crect++;
    } else {
      selectedAnswer.classList.add("wrong");
      wrng++;
      const correctAnswer = document
        .querySelectorAll(".answer")
        .forEach((answer) => {
          if (
            answer.querySelector(".text").innerHTML ===
            questions[currentQuestion - 1].correct_answer
          ) {
            answer.classList.add("correct");
          }
        });
    }
  } else {
    const correctAnswer = document
      .querySelectorAll(".answer")
      .forEach((answer) => {
        if (
          answer.querySelector(".text").innerHTML ===
          questions[currentQuestion - 1].correct_answer
        ) {
          answer.classList.add("correct");
          skipped++;
        }
      });
  }
  const answersDiv = document.querySelectorAll(".answer");
  answersDiv.forEach((answer) => {
    answer.classList.add("checked");
  });

  submitBtn.style.display = "none";
  nextBtn.style.display = "block";
};
const now = Date();
const nextQuestion = () => {
  if (currentQuestion < questions.length) {
    currentQuestion++;
    showQuestion(questions[currentQuestion - 1]);
  } else {
    showScore();
  }
};
const endScreen = document.querySelector(".end-screen"),
  finalScore = document.querySelector(".final-score"),
  totalScore = document.querySelector(".total-score");
const showScore = () => {
  endScreen.classList.remove("hide");
  quiz.classList.add("hide");
  const totalquestions = parseInt(`${questions.length}`);
  finalScore.innerHTML = crect * 4 - wrng;
  totalScore.innerHTML = "/" + totalquestions * 4;

  firebase
    .database()
    .ref(div)
    .child(UserCreds.uid)
    .set({
      Name: UserInfo.Name,
      score: crect * 4 - wrng,
      time: now,
      email: UserCreds.email,
    });
};

const restartBtn = document.querySelector(".restart");
restartBtn.addEventListener("click", () => {
  window.location.reload();
});

const playAdudio = (src) => {
  const audio = new Audio(src);
  audio.play();
};

let cheakCred = () => {
  if (!localStorage.getItem("user-creds")) {
    window.location.href = "/Login.html";
  }else{    window.location.href = "studygalaxy.html";}
  const messagesRef = firebase.database().ref(div);
  // Use a one-time query to check for the UID folder
  messagesRef
    .orderByKey()
    .equalTo(UserCreds.uid)
    .once("value", (snapshot) => {
      if (snapshot.exists()) {
        // UID folder exists! Run the desired function
        window.location.href = "studygalaxy.html";
      } else {
        // UID folder doesn't exist, handle this case if needed
        console.log("nah");
      }
    });
};
let notification;
window.addEventListener("load", cheakCred);
Notification.requestPermission();


