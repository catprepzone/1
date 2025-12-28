// quiz-list.js
async function loadQuestionList(fileName = "question_geometry.json") {
  try {
    const res = await fetch(fileName);
    if (!res.ok) throw new Error(`Could not load ${fileName}`);
    const questions = await res.json();

    // sort by id
    questions.sort((a, b) => a.id - b.id);

    const container = document.getElementById("questions-list");
    if (!container) return;

    if (questions.length === 0) {
      container.innerHTML = "<p>No questions found.</p>";
      return;
    }

    // build list
    const ul = document.createElement("div");
    ul.className = "question-list";
    questions.forEach(q => {
      const a = document.createElement("a");

      a.href = `q.html?id=${q.id}`;  // ../ goes up to parent folder
      
      a.className = "question-link";
      a.innerHTML = `
        <div class="question-bar">
          <span class="question-title">${q.id}. ${escapeHtml(q.title)}</span>
          <span class="question-meta">${escapeHtml(q.difficulty)}</span>
        </div>`;
      ul.appendChild(a);
    });

    container.innerHTML = "";
    container.appendChild(ul);
  } catch (err) {
    console.error(err);
    const c = document.getElementById("questions-list");
    if (c) c.innerHTML = `<p>Error loading questions.</p>`;
  }
}

// helper
function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// run it
document.addEventListener("DOMContentLoaded", () => {
  // example: load number system questions
  loadQuestionList("question_geometry.json");

  // for arithmetic.html, you’d call:
  // loadQuestionList("questions_arithmetic.json");

  // for algebra.html, you’d call:
  // loadQuestionList("questions_algebra.json");
});
