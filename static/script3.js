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
    inputField.value = ""; // مسح النص بعد الإرسال
  });
}

// تشغيل Text AI عند الضغط على Enter
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
    console.log("✅ Raw data from server:", data);

    if (Array.isArray(data)) {
      currentQuiz = data;
    } else {
      currentQuiz = data.questions;
    }

    console.log("✅ Quiz stored:", currentQuiz);

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
    console.log("✅ Quiz HTML:", quizContainer.innerHTML);
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

console.log("✅ script3.js is loaded and running!");
