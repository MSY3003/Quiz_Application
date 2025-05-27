let quiz = document.querySelector(".quiz-app");
let con = document.querySelector(".container");
let countSpan = document.querySelector(".count span");
let bullets = document.querySelector(".bullets");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answerArea = document.querySelector(".answer-area");
let btn = document.querySelector(".submit-button");
let butn = document.querySelector(".btn");
let countDiv = document.querySelector(".countdown");

let currentIndex = 0;
let rightAnswers = 0;
let countdownInterval;

function getQuestions() {
  let myRequest = new XMLHttpRequest();
  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status == 200) {
      let questionsObject = JSON.parse(this.responseText);
      let qcount = questionsObject.length;
      createBullets(qcount);
      addQuestionData(questionsObject[currentIndex], qcount);
      countdown(20, qcount);
      btn.onclick = function () {
        let theRightAnswer = questionsObject[currentIndex].right_answer;
        currentIndex++;
        checkAnswer(theRightAnswer, qcount);
        quizArea.innerHTML = "";
        answerArea.innerHTML = "";
        addQuestionData(questionsObject[currentIndex], qcount);
        handleBullets();
        clearInterval(countdownInterval);
        countdown(20, qcount);
        showResults(qcount);
      };
    }
  };

  myRequest.open("GET", "html_questions.json", true);
  myRequest.send();
}

getQuestions();
function createBullets(num) {
  countSpan.innerHTML = num;
  for (let i = 0; i < num; i++) {
    let theBullets = document.createElement("span");
    if (i === 0) {
      theBullets.className = "on";
    }
    bulletsSpanContainer.appendChild(theBullets);
  }
}
function addQuestionData(obj, count) {
  if (currentIndex < count) {
    let questionTitle = document.createElement("h2");
    let text = document.createTextNode(obj["title"]);
    questionTitle.appendChild(text);
    quizArea.appendChild(questionTitle);
    for (let i = 1; i <= 4; i++) {
      let mainDiv = document.createElement("div");
      mainDiv.className = "answer";
      let rInpur = document.createElement("input");
      rInpur.name = "question";
      rInpur.type = "radio";
      rInpur.id = `answer_${i}`;
      rInpur.dataset.answer = obj[`answer_${i}`];
      let label = document.createElement("label");
      label.htmlFor = `answer_${i}`;
      let tlabel = document.createTextNode(obj[`answer_${i}`]);
      label.appendChild(tlabel);
      mainDiv.appendChild(rInpur);
      mainDiv.appendChild(label);
      answerArea.appendChild(mainDiv);
      if (i === 1) rInpur.checked = true;
    }
  }
}
function checkAnswer(r, q) {
  let answers = document.getElementsByName("question");
  let theChoosenAnswer;
  answers.forEach((e) => {
    e.checked ? (theChoosenAnswer = e.dataset.answer) : "";
  });
  if (theChoosenAnswer === r) {
    rightAnswers++;
  }
}
function handleBullets() {
  let bulletsSpans = document.querySelectorAll(".bullets .spans span");
  let arrayOfSpans = Array.from(bulletsSpans);
  arrayOfSpans.forEach((e, i) => {
    if (currentIndex === i) {
      e.className = "on";
    }
  });
}
function showResults(count) {
  let theResults;
  if (currentIndex === count) {
    quizArea.remove();
    answerArea.remove();
    butn.remove();
    bullets.remove();
    if (rightAnswers > count / 2 && rightAnswers < count) {
      theResults = `<span class="good">Good</span>, ${rightAnswers} From ${count}`;
    } else if (rightAnswers === count) {
      theResults = `<span class="perfect">Perfect</span>, All Answers Is Good`;
    } else {
      theResults = `<span class="bad">Bad</span>, ${rightAnswers} From ${count}`;
    }
    let resultDiv = document.createElement("div");
    resultDiv.className = "last";
    resultDiv.innerHTML = theResults;
    resultDiv.style.position = "absolute";
    resultDiv.style.top = "50%";
    resultDiv.style.left = "50%";
    quiz.style.cssText =
      "display: flex; flex-direction: column; justify-content: space-between; height: 100vh;";
    con.style.cssText = "width: 100%; padding: 0;";
    let body = document.querySelector("body");
    body.appendChild(resultDiv);
  }
}
function countdown(duration, count) {
  if (currentIndex < count) {
    let min, sec;
    countdownInterval = setInterval(() => {
      min = parseInt(duration / 60);
      sec = parseInt(duration % 60);
      min = min < 10 ? `0${min}` : min;
      sec = sec < 10 ? `0${sec}` : sec;
      countDiv.innerHTML = `${min}:${sec}`;
      if (--duration < 0) {
        clearInterval(countdownInterval);
        btn.click();
      }
    }, 1000);
  }
}
