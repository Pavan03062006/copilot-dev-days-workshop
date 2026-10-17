// Tests use Node's built-in test runner, so nothing needs to be installed.
// Run them with:  npm test
const { test } = require("node:test");
const assert = require("node:assert/strict");
const {
  shuffle,
  isCorrect,
  calculatePercentage,
  getGrade,
  formatTimeLeft,
  createQuiz,
  answerQuestion,
  isQuizFinished,
} = require("../src/quiz.js");

test("isCorrect returns true for the right answer", () => {
  assert.equal(isCorrect({ answer: 2 }, 2), true);
});

test("isCorrect returns false for a wrong answer", () => {
  assert.equal(isCorrect({ answer: 2 }, 0), false);
});

test("calculatePercentage rounds to a whole number", () => {
  assert.equal(calculatePercentage(2, 3), 67);
});

test("calculatePercentage returns 0 when there are no questions", () => {
  assert.equal(calculatePercentage(0, 0), 0);
});

test("shuffle keeps every item and does not change the original array", () => {
  const original = [1, 2, 3, 4, 5];
  const result = shuffle(original);
  assert.deepEqual([...result].sort(), [1, 2, 3, 4, 5]);
  assert.deepEqual(original, [1, 2, 3, 4, 5]);
});

test("getGrade gives an A for exactly 90%", () => {
  assert.equal(getGrade(90), "A");
});

test("formatTimeLeft returns seconds with a timer label", () => {
  assert.equal(formatTimeLeft(15), "⏱ 15s");
  assert.equal(formatTimeLeft(5), "⏱ 5s");
});

test("formatTimeLeft clamps negative seconds to zero", () => {
  assert.equal(formatTimeLeft(0), "⏱ 0s");
  assert.equal(formatTimeLeft(-1), "⏱ 0s");
});

test("createQuiz returns a fresh quiz state", () => {
  const questions = [{ answer: 1 }];
  const state = createQuiz(questions);

  assert.deepEqual(state, { questions, current: 0, score: 0 });
  assert.notEqual(state, questions);
  assert.notEqual(state.questions, questions);
});

test("answerQuestion advances and scores a correct answer without mutation", () => {
  const state = createQuiz([{ answer: 1 }, { answer: 0 }]);
  const result = answerQuestion(state, 1);

  assert.deepEqual(result, { state: { questions: state.questions, current: 1, score: 1 }, correct: true });
  assert.deepEqual(state, { questions: state.questions, current: 0, score: 0 });
  assert.notEqual(result.state, state);
});

test("answerQuestion advances without scoring an incorrect answer", () => {
  const state = { questions: [{ answer: 1 }], current: 0, score: 2 };

  const result = answerQuestion(state, 0);

  assert.equal(result.correct, false);
  assert.deepEqual(result.state, { questions: state.questions, current: 1, score: 2 });
  assert.equal(state.current, 0);
});

test("isQuizFinished reports whether every question has been answered", () => {
  const state = createQuiz([{ answer: 0 }]);

  assert.equal(isQuizFinished(state), false);
  assert.equal(isQuizFinished({ ...state, current: 1 }), true);
});
