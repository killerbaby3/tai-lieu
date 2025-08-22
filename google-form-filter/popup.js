let config = { pages: [] };

document.addEventListener("DOMContentLoaded", async () => {
  // Load config từ storage
  const stored = await chrome.storage.local.get("config");
  config = stored.config || { pages: [] };
  renderPages();

  document.getElementById("addPage").addEventListener("click", () => {
    config.pages.push({ label: "Trang mới", questions: [] });
    renderPages();
  });

  document.getElementById("saveConfig").addEventListener("click", async () => {
    const allPage = document.querySelectorAll(".page");
    if (!allPage) {
      return alert("⚠️ Không có trang nào để lưu cấu hình");
    }
    let arrConfig = [];
    for (const el of allPage) {
      const label = el.querySelector(".label input").value.trim();
      const skip = el.querySelector(".skip input").checked;
      const authen = el.querySelector(".authen input").checked;
      let questions = [];
      const wrapQuestions = el.querySelector(".questions");
      const allQuestions = wrapQuestions.querySelectorAll(".block-q");

      if (allQuestions.length > 0) {
        for (const qEl of allQuestions) {
          const text = qEl.querySelector(".text input").value.trim();
          const answer = qEl.querySelector(".answer input").value.trim();
          if (text) {
            questions.push({ text, answer });
          }
        }
      }

      arrConfig.push({ label, skip, questions, authen });
    }
    config.pages = arrConfig;
    await chrome.storage.local.set({ config });
    alert("✅ Đã lưu cấu hình");
  });

  document.getElementById("delConfig").addEventListener("click", async () => {
    config.pages = [];
    await chrome.storage.local.set({ config });
    alert("✅ Đã xóa cấu hình");
    renderPages();
  });
});

function renderPages() {
  const container = document.getElementById("pages");
  container.innerHTML = "";
  config.pages.forEach((page, pIndex) => {
    const pageDiv = document.createElement("div");
    pageDiv.className = "page";

    pageDiv.innerHTML = `
      <label class="label">Trang: <input type="text" value="${
        page.label
      }" /></label>
      <br>
      <label class="skip">Skip: <input type="checkbox" ${
        page.skip ? "checked" : ""
      } 
        /></label>
      <br>
      <label class="authen">Authen: <input type="checkbox" ${
        page.authen ? "checked" : ""
      } 
        /></label>
      <br>
      <button class="delete-page-${pIndex}" page-idx="${pIndex}">🗑 Xoá trang</button>
      <div class="questions" id="questions-${pIndex}"></div>
      <button class="add-q-${pIndex}" page-idx="${pIndex}">➕ Thêm câu hỏi</button>
    `;

    container.appendChild(pageDiv);
    renderQuestions(pIndex);
    document.querySelector(`.add-q-${pIndex}`).addEventListener("click", () => {
      addQuestion(pIndex);
    });
    document
      .querySelector(`.delete-page-${pIndex}`)
      .addEventListener("click", () => {
        deletePage(pIndex);
      });
    pageDiv.querySelector(".label input").addEventListener("change", (e) => {
      updatePageLabel(pIndex, e.target.value);
    });
    pageDiv.querySelector(".skip input").addEventListener("change", (e) => {
      toggleSkip(pIndex, e.target.checked);
    });
    pageDiv.querySelector(".authen input").addEventListener("change", (e) => {
      toggleAuthen(pIndex, e.target.checked);
    });
  });
}

function renderQuestions(pIndex) {
  const qContainer = document.getElementById(`questions-${pIndex}`);
  qContainer.innerHTML = "";
  const questions = config.pages[pIndex].questions || [];
  questions.forEach((q, qIndex) => {
    const qDiv = document.createElement("div");
    qDiv.classList = "block-q";
    qDiv.innerHTML = `
      <label class="text">Text: <input type="text" value="${q.text}" /></label>
      <br>
      <label class="answer">Answer: <input type="text" value="${q.answer}" /></label>
      <button class="delete-q-${qIndex}-${pIndex}"">🗑 Xoá câu hỏi</button>
      <hr>
    `;
    qContainer.appendChild(qDiv);
    document
      .querySelector(`.delete-q-${qIndex}-${pIndex}`)
      .addEventListener("click", () => {
        deleteQuestion(pIndex, qIndex);
      });

    qDiv.querySelector(".text input").addEventListener("change", (e) => {
      updateQuestionText(pIndex, qIndex, e.target.value);
    });
    qDiv.querySelector(".answer input").addEventListener("change", (e) => {
      updateQuestionAnswer(pIndex, qIndex, e.target.value);
    });
  });
}

// Hàm cập nhật
function updatePageLabel(pIndex, value) {
  config.pages[pIndex].label = value;
}
function toggleSkip(pIndex, value) {
  config.pages[pIndex].skip = value;
}

function toggleAuthen(pIndex, value) {
  config.pages[pIndex].authen = value;
}

function deletePage(pIndex) {
  config.pages.splice(pIndex, 1);
  renderPages();
}
function addQuestion(pIndex) {
  if (!config.pages[pIndex].questions) config.pages[pIndex].questions = [];
  config.pages[pIndex].questions.push({ text: "Câu hỏi mới", answer: "" });
  renderPages();
}
function updateQuestionText(pIndex, qIndex, value) {
  config.pages[pIndex].questions[qIndex].text = value;
}
function updateQuestionAnswer(pIndex, qIndex, value) {
  config.pages[pIndex].questions[qIndex].answer = value;
}
function deleteQuestion(pIndex, qIndex) {
  config.pages[pIndex].questions.splice(qIndex, 1);
  renderPages();
}
