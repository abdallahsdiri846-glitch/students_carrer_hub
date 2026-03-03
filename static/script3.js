// ---------------- TEXT AI ----------------
function handleTextAI() {
  const inputField = document.getElementById("textInput");
  const input = inputField.value.trim();
  if (!input) return;

  fetch("/text-ai", {
    method: "POST", 
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: input })
  })
  .then(res => res.json())
  .then(data => {
    document.getElementById("textOutput").innerHTML =
      `<div class="response-box"><strong>AI Response:</strong><br>${data.reply}</div>`;
    inputField.value = "";
  });
}

document.getElementById("textInput").addEventListener("keypress", function(e) {
  if (e.key === "Enter") {
    e.preventDefault();
    handleTextAI();
  }
});

// ---------------- QUIZ GENERATOR ----------------
let currentQuiz = [];

function handleQuiz() {
  const topic = document.getElementById("quizTopic").value;
  const difficulty = document.getElementById("quizDifficulty").value;

  fetch("/quiz", {
    method: "POST", 
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic, difficulty })
  })
  .then(res => res.json())
  .then(data => {
    currentQuiz = Array.isArray(data) ? data : data.questions;

    const quizContainer = document.getElementById("quizOutput");
    quizContainer.innerHTML = "<h4>Quiz:</h4>";

    const letters = ["A", "B", "C", "D"];

    currentQuiz.forEach((q, index) => {
      const qDiv = document.createElement("div");
      qDiv.classList.add("quiz-question");
      qDiv.innerHTML = `<p><strong>Q${index+1}:</strong> ${q.question}</p><p><strong>Answer:</strong></p>`;

      const optionsDiv = document.createElement("div");
      optionsDiv.classList.add("quiz-options");

      q.options.forEach((opt, i) => {
        const label = document.createElement("label");
        label.classList.add("answer-label");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = opt;
        checkbox.name = `q${index}`;
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(` ${letters[i]}) ${opt}`));
        optionsDiv.appendChild(label);
      });

      qDiv.appendChild(optionsDiv);
      quizContainer.appendChild(qDiv);
    });

    document.getElementById("quizCorrectBtn").style.display = "block";
  });
}

function handleQuizCorrection() {
  const answers = [];
  currentQuiz.forEach((q, index) => {
    const selected = [];
    document.querySelectorAll(`input[name="q${index}"]:checked`).forEach(cb => {
      selected.push(cb.value);
    });
    answers.push({ question: q.question, selected });
  });

  fetch("/quiz-correct", {
    method: "POST", 
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ answers })
  })
  .then(res => res.json())
  .then(data => {
    document.getElementById("quizCorrectionOutput").innerHTML =
      `<div class="response-box"><strong>Correction & Explanation:</strong><br>${data.explanation}</div>`;
  });
}

// ---------------- SUMMARIZER ----------------
function handleNotes() {
  const notes = document.getElementById("notesInput").value.trim();
  if (!notes) return;

  fetch("/summarize", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ notes })
  })
  .then(res => res.json())
  .then(data => {
    document.getElementById("notesOutput").innerHTML =
      `<div class="response-box"><strong>Summary:</strong><br>${data.summary}</div>`;
  });
}

// ---------------- FLASHCARDS ----------------
function handleFlashcards() {
  const terms = document.getElementById("flashInput").value.trim();
  if (!terms) return;

  fetch("/flashcards", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ terms })
  })
  .then(res => res.json())
  .then(data => {
    document.getElementById("flashOutput").innerHTML =
      `<div class="response-box"><strong>Flashcards:</strong><br>${data.flashcards}</div>`;
  });
}

// ---------------- PLANNER ----------------
function handlePlanner() {
  const subjects = document.getElementById("plannerInput").value.trim();
  if (!subjects) return;

  fetch("/planner", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ subjects })
  })
  .then(res => res.json())
  .then(data => {
    document.getElementById("plannerOutput").innerHTML =
      `<div class="response-box"><strong>Plan:</strong><br>${data.plan}</div>`;
  });
}

// ---------------- CV GENERATOR ----------------
function handleCV() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const experience = document.getElementById("experience").value.trim();

  fetch("/cv", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, experience })
  })
  .then(res => res.json())
  .then(data => {
    document.getElementById("cvOutput").innerHTML =
      `<div class="response-box"><strong>CV:</strong><br>${data.cv}</div>`;
  });
}

// ---------------- COVER LETTER ----------------
function handleCover() {
  const job = document.getElementById("coverInput").value.trim();
  if (!job) return;

  fetch("/cover", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ job })
  })
  .then(res => res.json())
  .then(data => {
    document.getElementById("coverOutput").innerHTML =
      `<div class="response-box"><strong>Cover Letter:</strong><br>${data.cover}</div>`;
  });
}

// ---------------- INTERVIEW SIMULATOR ----------------
function handleInterview() {
  fetch("/interview", {
    method: "POST",
    headers: { "Content-Type": "application/json" }
  })
  .then(res => res.json())
  .then(data => {
    document.getElementById("interviewOutput").innerHTML =
      `<div class="response-box"><strong>Interview:</strong><br>${data.interview}</div>`;
  });
}

// ---------------- LINKEDIN HELPER ----------------
function handleLinkedIn() {
  const profile = document.getElementById("linkedinInput").value.trim();
  if (!profile) return;

  fetch("/linkedin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ profile })
  })
  .then(res => res.json())
  .then(data => {
    document.getElementById("linkedinOutput").innerHTML =
      `<div class="response-box"><strong>LinkedIn Suggestions:</strong><br>${data.linkedin}</div>`;
  });
}

console.log("✅ script3.js is loaded and running!");
