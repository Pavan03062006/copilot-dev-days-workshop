// Core quiz logic.
// This file has NO browser (DOM) code so it can be tested with Node.js.

/**
 * Returns a new array with the items in random order.
 * The original array is not changed.
 */
function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Returns true when the selected option is the correct one.
 */
function isCorrect(question, selectedIndex) {
  return question.answer === selectedIndex;
}

/**
 * Converts a score into a whole-number percentage (0-100).
 */
function calculatePercentage(score, total) {
  if (total === 0) return 0;
  return Math.round((score / total) * 100);
}

/**
 * Turns a percentage into a grade.
 * A = 90% or more, B = 75% or more, C = 50% or more.
 */
function getGrade(percentage) {
  if (percentage >= 90) return "A";
  if (percentage > 75) return "B";
  if (percentage > 50) return "C";
  return "Keep practicing";
}

function formatTimeLeft(seconds) {
  return `⏱ ${Math.max(0, seconds)}s`;
}

function createQuiz(questions) {
  return { questions: [...questions], current: 0, score: 0 };
}

function answerQuestion(state, selectedIndex) {
  const question = state.questions[state.current];
  const correct = question !== undefined && isCorrect(question, selectedIndex);
  const nextState = {
    ...state,
    current: state.current + 1,
    score: state.score + (correct ? 1 : 0),
  };
  return { state: nextState, correct };
}

function isQuizFinished(state) {
  return state.current >= state.questions.length;
}

// Lets Node.js tests load this file. Browsers ignore this block.
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    shuffle,
    isCorrect,
    calculatePercentage,
    getGrade,
    formatTimeLeft,
    createQuiz,
    answerQuestion,
    isQuizFinished,
  };
}
