
const API_URL = "https://opentdb.com/api.php?amount=10&category=18&difficulty=easy&type=multiple";

const questionEl = document.querySelector("#question");
const optionsEl = document.querySelector("#options");
const answEl = document.querySelector("#answ");
const submitBtn = document.querySelector(".btn.submit");
const nextBtn = document.querySelector(".btn.next");
const refreshBtn = document.querySelector(".refresh");
const themeToggle = document.getElementById("theme-toggle");

let questions = [];
let currentIndex = 0;

// Fetch quiz data
async function loadQuiz() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    if (!data.results?.length) {
      questionEl.textContent = "No questions loaded 😕";
      return;
    }

    questions = data.results;
    currentIndex = 0;
    showQuestion();
  } catch (err) {
    questionEl.textContent = "Server error. Try again.";
    console.error(err);
  }
}

// Show current question
function showQuestion() {
  const q = questions[currentIndex];
  questionEl.innerHTML = q.question;
  answEl.textContent = "";

  // Shuffle options
  const options = [q.correct_answer, ...q.incorrect_answers];
  options.sort(() => Math.random() - 0.5);

  optionsEl.innerHTML = options
    .map(
      (opt) => `
      <li>
        <label>
          <input type="radio" name="ans" value="${opt}">
          ${opt}
        </label>
      </li>
    `
    )
    .join("");

  submitBtn.disabled = false;
  nextBtn.disabled = false;
}

// Check answer
submitBtn.addEventListener("click", () => {
  const selected = document.querySelector('input[name="ans"]:checked');
  if (!selected) {
    answEl.textContent = "Please select an option";
    return;
  }

  const q = questions[currentIndex];
  const allLabels = optionsEl.querySelectorAll("label");
  allLabels.forEach((label) => label.classList.remove("correct", "wrong"));

  const correctLabel = optionsEl.querySelector(`input[value="${q.correct_answer}"]`).parentElement;

  if (selected.value === q.correct_answer) {
    answEl.textContent = "Correct Answer ✅";
    selected.parentElement.classList.add("correct");
  } else {
    answEl.textContent = "Wrong Answer ❌";
    selected.parentElement.classList.add("wrong");
    correctLabel.classList.add("correct");
  }

  submitBtn.disabled = true;
});

// Next question
nextBtn.addEventListener("click", () => {
  currentIndex++;
  if (currentIndex >= questions.length) {
    questionEl.textContent = "Quiz finished 🎉";
    answEl.textContent = "Well done 👏";
    submitBtn.disabled = true;
    nextBtn.disabled = true;
    return;
  }
  showQuestion();
});

// Refresh quiz
refreshBtn.addEventListener("click", () => location.reload());

// Theme toggle (dark / light)
themeToggle.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark");
  themeToggle.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
});

// Start the quiz
loadQuiz();
