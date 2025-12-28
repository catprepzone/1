// question-page.js
function getQueryParam(name) {
  const params = new URLSearchParams(location.search);
  return params.get(name);
}

let stopwatchInterval = null;
let seconds = 0;

function startTimer() {
  const timerEl = document.getElementById("timer");
  seconds = 0;
  timerEl.textContent = `Time taken: ${seconds}s`;
  stopwatchInterval = setInterval(() => {
    seconds++;
    timerEl.textContent = `Time taken: ${seconds}s`;
  }, 1000);
}

function stopTimer() {
  clearInterval(stopwatchInterval);
}

async function loadQuestion() {
  const idStr = getQueryParam("id");
  if (!idStr) {
    document.getElementById("question-title").textContent = "No question id provided.";
    return;
  }
  const id = Number(idStr);

  try {
    const res = await fetch("questions_arithmetic.json");
    if (!res.ok) throw new Error("Could not load questions");
    const all = await res.json();

    // find requested question
    const q = all.find(x => Number(x.id) === id);
    if (!q) {
      document.getElementById("question-title").textContent = "Question not found.";
      return;
    }

    // render
    document.getElementById("question-title").textContent = `Q${q.id}. ${q.title}`;
    const form = document.getElementById("quiz-form");
    form.innerHTML = "";

    q.options.forEach((opt, idx) => {
      const label = document.createElement("label");
      label.className = "option";
      label.innerHTML = `<input type="radio" name="answer" value="${idx}"> ${String.fromCharCode(97+idx)}) ${opt}`;
      form.appendChild(label);
    });

    // set back-to-list
    // set back-to-list
    document.getElementById("back-to-list").href = "arithmetic.html";





    
    // prev/next within same chapter
    const chapterList = all.filter(x => x.chapter === q.chapter).sort((a,b)=>a.id - b.id);
    const idx = chapterList.findIndex(x => Number(x.id) === Number(q.id));
    const prev = chapterList[idx - 1];
    const next = chapterList[idx + 1];
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");
    if (prev) {
      prevBtn.href = `q.html?id=${prev.id}`;
      prevBtn.style.visibility = "visible";
    } else {
      prevBtn.style.visibility = "hidden";
    }
    if (next) {
      nextBtn.href = `q.html?id=${next.id}`;
      nextBtn.style.visibility = "visible";
    } else {
      nextBtn.style.visibility = "hidden";
    }

    // solution and submit logic
    const submitBtn = document.getElementById("submit-btn");
    const clearBtn = document.getElementById("clear-btn");
    const solutionDiv = document.getElementById("solution");
    const solutionText = document.getElementById("solution-text");
    const finalTime = document.getElementById("final-time");

    function resetHighlights() {
      document.querySelectorAll(".option").forEach(o => {
        o.classList.remove("correct", "wrong");
      });
    }

    submitBtn.onclick = () => {
      const selected = form.answer && form.answer.value;
      if (selected === undefined || selected === null || selected === "") {
        return alert("Please select an answer!");
      }
      stopTimer();
      resetHighlights();
      const correctIndex = Number(q.answer);

      // highlight correct
      const correctInput = document.querySelector(`input[name="answer"][value="${correctIndex}"]`);
      if (correctInput) correctInput.parentElement.classList.add("correct");

      // if wrong, highlight chosen
      if (Number(selected) !== correctIndex) {
        const chosen = document.querySelector(`input[name="answer"][value="${selected}"]`);
        if (chosen) chosen.parentElement.classList.add("wrong");
      }

      solutionText.textContent = q.solution || "Solution not provided.";
      finalTime.textContent = `You took ${seconds} seconds to answer.`;
      solutionDiv.style.display = "block";
    };

    clearBtn.onclick = () => {
      form.reset();
      resetHighlights();
      solutionDiv.style.display = "none";
      stopTimer();
      startTimer();
    };

    // start timer when question loads
    startTimer();

  } catch (err) {
    console.error(err);
    document.getElementById("question-title").textContent = "Error loading question.";
  }
}

document.addEventListener("DOMContentLoaded", loadQuestion);
