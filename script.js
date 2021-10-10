// Pages
const gamePage = document.getElementById("game-page");
const scorePage = document.getElementById("score-page");
const splashPage = document.getElementById("splash-page");
const countdownPage = document.getElementById("countdown-page");
// Splash Page
const startForm = document.getElementById("start-form");
const radioContainers = document.querySelectorAll(".radio-container");
const radioInputs = document.querySelectorAll("input");
const bestScores = document.querySelectorAll(".best-score-value");
// Countdown Page
const countdown = document.querySelector(".countdown");
// Game Page
const itemContainer = document.querySelector(".item-container");
// Score Page
const finalTimeEl = document.querySelector(".final-time");
const baseTimeEl = document.querySelector(".base-time");
const penaltyTimeEl = document.querySelector(".penalty-time");
const playAgainBtn = document.querySelector(".play-again");

// Equations

let equationsArray = [];
let playerGuessArray = [];

// Game Page
let firstNumber = 0;
let secondNumber = 0;
let equationObject = {};
const wrongFormat = [];
let questionAmount;
let bestScoreObj = {};
// Time
let timer;
let timePlayed = 0;
let baseTime = 0;
let penalityTime = 0;
let finalTime = 0;
let finalTimeDisplay = "0.0s";

function checkTime() {
  if (playerGuessArray.length == questionAmount) {
    clearInterval(timer);

    //Calculate penality time for each wrong guess
    for (let i = 0; i < questionAmount; i++) {
      if (equationsArray[i].evaluated === playerGuessArray[i])
        penalityTime += 0.5;
    }
    finalTime = timePlayed + penalityTime;
    scoreToDOM();
  }
}

function addTime() {
  timePlayed += 0.1;
  checkTime();
}

function startTimer() {
  //Reset Time
  timePlayed = 0;
  penalityTime = 0;
  finalTime = 0;
  //start a timer after click first time on page
  timer = setInterval(addTime, 100);
  gamePage.removeEventListener("click", startTimer);
}

// Scroll
let valueY = 0;

function selectItem(gussedTrue) {
  valueY += 75;
  itemContainer.scroll(0, valueY);
  return gussedTrue
    ? playerGuessArray.push("true")
    : playerGuessArray.push("false");
}

//Format and Display time in Dom
function scoreToDOM() {
  finalTimeDisplay = finalTime.toFixed(1);
  baseTime = timePlayed.toFixed(1);
  penalityTime = penalityTime.toFixed(1);

  baseTimeEl.textContent = `Base Time: ${baseTime}s`;
  penaltyTimeEl.textContent = `Penalty Time: ${penalityTime}s`;
  finalTimeEl.textContent = `${finalTimeDisplay}s`;
  changePage(gamePage, scorePage);
}

//Generate Random Number
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

// Create Correct/Incorrect Random Equations
function createEquations() {
  //move scroll to top
  valueY = 0;
  itemContainer.scroll(0, 0);
  // Randomly choose how many correct equations there should be
  const correctEquations = getRandomInt(questionAmount);
  // Set amount of wrong equations
  const wrongEquations = questionAmount - correctEquations;
  // Loop through, multiply random numbers up to 9, push to array
  for (let i = 0; i < correctEquations; i++) {
    firstNumber = getRandomInt(9);
    secondNumber = getRandomInt(9);
    const equationValue = firstNumber * secondNumber;
    const equation = `${firstNumber} x ${secondNumber} = ${equationValue}`;
    equationObject = { value: equation, evaluated: "true" };
    equationsArray.push(equationObject);
  }
  // Loop through, mess with the equation results, push to array
  for (let i = 0; i < wrongEquations; i++) {
    firstNumber = getRandomInt(9);
    secondNumber = getRandomInt(9);
    const equationValue = firstNumber * secondNumber;
    wrongFormat[0] = `${firstNumber} x ${secondNumber + 1} = ${equationValue}`;
    wrongFormat[1] = `${firstNumber} x ${secondNumber} = ${equationValue - 1}`;
    wrongFormat[2] = `${firstNumber + 1} x ${secondNumber} = ${equationValue}`;
    const formatChoice = getRandomInt(3);
    const equation = wrongFormat[formatChoice];
    equationObject = { value: equation, evaluated: "false" };
    equationsArray.push(equationObject);
  }
  shuffle(equationsArray);
}

function equationsToDom() {
  equationsArray.forEach((equation) => {
    //item
    const item = document.createElement("div");
    item.classList.add("item");
    //Equation Text
    const equationText = document.createElement("h1");
    equationText.textContent = equation.value;
    //Append
    item.appendChild(equationText);
    itemContainer.appendChild(item);
  });
}

// Dynamically adding correct/incorrect equations
function populateGamePage() {
  // Reset DOM, Set Blank Space Above
  itemContainer.textContent = "";
  // Spacer
  const topSpacer = document.createElement("div");
  topSpacer.classList.add("height-240");
  // Selected Item
  const selectedItem = document.createElement("div");
  selectedItem.classList.add("selected-item");
  // Append
  itemContainer.append(topSpacer, selectedItem);

  // Create Equations, Build Elements in DOM
  createEquations();
  equationsToDom();
  // Set Blank Space Below
  const bottomSpacer = document.createElement("div");
  bottomSpacer.classList.add("height-500");
  itemContainer.appendChild(bottomSpacer);
}

let countdownNumber = 3;
let intervalVar;
//change Page
function changePage(currentPage, nextPage) {
  currentPage.hidden = true;
  nextPage.hidden = false;
}

//clear interval and show game page
function stopInterval() {
  clearInterval(intervalVar);
  countdownNumber = 3;
  changePage(countdownPage, gamePage);
  populateGamePage();
}

//Show countdown on page
function setCountDownPage() {
  if (countdownNumber > 0) {
    countdown.textContent = `${countdownNumber}`;
  } else if (countdownNumber == 0) {
    countdown.textContent = "GO!";
  } else {
    stopInterval();
  }
  countdownNumber--;
}

//start interval countdown
function startCountDown() {
  setCountDownPage();
  intervalVar = setInterval(setCountDownPage, 1000);
}

//Get value from question
function getRadioValue() {
  let radioValue;
  radioInputs.forEach((radioInput) => {
    if (radioInput.checked) {
      radioValue = radioInput.value;
    }
  });
  return radioValue;
}

//Select amount of question from selected options
function selectQuestionAmount(e) {
  e.preventDefault();
  questionAmount = getRadioValue();
  if (questionAmount) {
    changePage(splashPage, countdownPage);
    startCountDown();
  }
}

//Form Eventlistner
startForm.addEventListener("click", () => {
  radioContainers.forEach((radioInputEl) => {
    radioInputEl.classList.remove("selected-label");
    if (radioInputEl.children[1].checked) {
      radioInputEl.classList.add("selected-label");
    }
  });
});

function bestscoreToDOM() {
  Object.values(bestScoreObj).forEach((bestscore, index) => {
    bestScores[index].textContent = `${bestscore.toFixed(2)}s`;
  });
}

//Best Score show
function showBestScore() {
  if (localStorage.getItem("bestScore")) {
    bestScoreObj = JSON.parse(localStorage.getItem("bestScore"));
    bestScoreObj[questionAmount] = bestScoreObj[questionAmount]
      ? Math.min(bestScoreObj[questionAmount], finalTime)
      : finalTime;
  } else {
    bestScoreObj[questionAmount] = finalTime;
  }
  localStorage.setItem("bestScore", JSON.stringify(bestScoreObj));
  bestscoreToDOM();
  changePage(scorePage, splashPage);
}

startForm.addEventListener("submit", selectQuestionAmount);
gamePage.addEventListener("click", startTimer);
playAgainBtn.addEventListener("click", showBestScore);

// show best score in spalsh screen
if (localStorage.getItem("bestScore")) {
  bestScoreObj = JSON.parse(localStorage.getItem("bestScore"));
  bestscoreToDOM();
}