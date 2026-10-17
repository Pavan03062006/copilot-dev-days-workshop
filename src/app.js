// UI code: connects the quiz logic (quiz.js) to the page (index.html).

let state = { questions: [], current: 0, score: 0 };
const QUESTION_TIME_LIMIT = 15;
const BEST_SCORE_KEY = "dev-days-quiz-best-score";
let timerId = null;
let timeLeft = QUESTION_TIME_LIMIT;

const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const progressText = document.getElementById("progress");
const timerText = document.getElementById("timer");
const questionText = document.getElementById("question-text");
const optionsList = document.getElementById("options");
const feedbackText = document.getElementById("feedback");
const nextButton = document.getElementById("next-btn");
const scoreText = document.getElementById("score-text");
const gradeText = document.getElementById("grade-text");
const bestScoreStart = document.getElementById("best-score-start");
const bestScoreResult = document.getElementById("best-score-result");

function readBestScore() {
  try {
    const savedScore = localStorage.getItem(BEST_SCORE_KEY);
    if (savedScore === null) return null;
    const score = Number(savedScore);
    return Number.isFinite(score) ? score : null;
  } catch {
    return null;
  }
}

function writeBestScore(score) {
  try {
    localStorage.setItem(BEST_SCORE_KEY, String(score));
    return true;
  } catch {
    return false;
  }
}

function renderStartBestScore() {
  const best = readBestScore();
  bestScoreStart.textContent = best === null ? "" : `Best score: ${best}%`;
}

function showScreen(screenToShow) {
  [startScreen, quizScreen, resultScreen].forEach((screen) => {
    screen.hidden = screen !== screenToShow;
  });
}

function startQuiz() {
  clearTimer();
  state = createQuiz(shuffle(QUESTIONS));
  showScreen(quizScreen);
  renderQuestion();
}

function renderQuestion() {
  clearTimer();
  const question = state.questions[state.current];
  progressText.textContent = `Question ${state.current + 1} of ${state.questions.length}`;
  timeLeft = QUESTION_TIME_LIMIT;
  updateTimer();
  questionText.textContent = question.question;
  feedbackText.textContent = "";
  nextButton.hidden = true;
  optionsList.innerHTML = "";

  question.options.forEach((option, index) => {
    const item = document.createElement("li");
    const button = document.createElement("button");
    button.className = "option";
    button.textContent = option;
    button.addEventListener("click", () => selectAnswer(index, button));
    item.appendChild(button);
    optionsList.appendChild(item);
  });

  timerId = setInterval(() => {
    timeLeft--;
    updateTimer();
    if (timeLeft <= 0) handleTimeout();
  }, 1000);
}

function selectAnswer(selectedIndex, selectedButton) {
  clearTimer();
  const question = state.questions[state.current];
  const buttons = optionsList.querySelectorAll("button");
  buttons.forEach((button) => (button.disabled = true));
  const result = answerQuestion(state, selectedIndex);
  state = result.state;

  if (result.correct) {
    selectedButton.classList.add("correct");
    feedbackText.textContent = "Correct!";
  } else {
    selectedButton.classList.add("wrong");
    buttons[question.answer].classList.add("correct");
    feedbackText.textContent = "Not quite. The correct answer is highlighted.";
  }

  nextButton.hidden = false;
  nextButton.focus();
}

function updateTimer() {
  timerText.textContent = formatTimeLeft(timeLeft);
  timerText.classList.toggle("warning", timeLeft <= 5);
}

function handleTimeout() {
  clearTimer();
  const question = state.questions[state.current];
  const buttons = optionsList.querySelectorAll("button");
  buttons.forEach((button) => (button.disabled = true));
  const result = answerQuestion(state, -1);
  state = result.state;
  buttons[question.answer].classList.add("correct");
  feedbackText.textContent = "Time's up!";
  nextButton.hidden = false;
  nextButton.focus();
}

function nextQuestion() {
  clearTimer();
  if (!isQuizFinished(state)) {
    renderQuestion();
  } else {
    showResults();
  }
}

function showResults() {
  clearTimer();
  const total = state.questions.length;
  const percentage = calculatePercentage(state.score, total);
  scoreText.textContent = `You scored ${state.score} out of ${total} (${percentage}%)`;
  gradeText.textContent = `Grade: ${getGrade(percentage)}`;
  const previousBest = readBestScore();
  const newBest = isNewBestScore(percentage, previousBest);
  if (newBest) writeBestScore(percentage);
  const best = newBest ? percentage : previousBest;
  bestScoreResult.textContent =
    best === null
      ? "Best score is unavailable."
      : newBest
        ? `New best score! ${best}%`
        : `Best score: ${best}%`;
  renderStartBestScore();
  showScreen(resultScreen);
}

function clearTimer() {
  if (timerId !== null) {
    clearInterval(timerId);
    timerId = null;
  }
}

document.getElementById("start-btn").addEventListener("click", startQuiz);
document.getElementById("restart-btn").addEventListener("click", startQuiz);
nextButton.addEventListener("click", nextQuestion);
renderStartBestScore();
