function calcAuthen(str) {
  // Tìm biểu thức số học trong chuỗi (ví dụ: "25 + 18")
  const match = str.match(/(\d+)\s*([\+\-\*\/])\s*(\d+)/);

  if (!match) return ""; // nếu không tìm thấy phép tính

  const so1 = parseFloat(match[1]);
  const toanTu = match[2];
  const so2 = parseFloat(match[3]);

  let ketQua;
  switch (toanTu) {
    case "+":
      ketQua = so1 + so2;
      break;
    case "-":
      ketQua = so1 - so2;
      break;
    case "*":
      ketQua = so1 * so2;
      break;
    case "/":
      ketQua = so1 / so2;
      break;
    default:
      return null;
  }

  return ketQua;
}

function fillForm(config) {
  if (!config || !config.pages) return;

  let nextBtn = document.querySelector("div[role='button'][jsname='OCpkoe']");
  // Tìm trang hiện tại theo tiêu đề
  const pageTitleEl = document.querySelectorAll("div[role='heading']");

  const queryPageAccept = document.evaluate(
    "//div[contains(., 'đồng ý với các điều kiện')]",
    document,
    null,
    XPathResult.ANY_TYPE,
    null
  );
  const pageAccept = queryPageAccept.iterateNext();

  if ((!pageTitleEl || pageTitleEl.length == 1) && pageAccept == null) return;

  const pageTitle = pageTitleEl[1].innerText.trim();
  console.log("🔎 Current page title:", pageTitle);

  let pageConfig = null;

  if (pageAccept != null) {
    const radioAccept = document.querySelector("[jsname='wCJL8'] [dir='auto']");
    radioAccept.click();
    if (nextBtn) {
      setTimeout(() => {
        nextBtn.click();
      }, 100);
    }
    return;
  } else {
    pageConfig = config.pages.find((p) => pageTitle.includes(p.label));
  }

  if (!pageConfig) {
    console.log("⚠️ No config for this page");
    return;
  }

  // Nếu trang chỉ cần bỏ qua
  if (pageConfig.skip) {
    if (nextBtn) {
      nextBtn.click();
    }
    return;
  }

  // Xử lý các câu hỏi
  if (pageConfig.questions) {
    pageConfig.questions.forEach((q) => {
      let questionEl = Array.from(
        document.querySelectorAll("div[role='listitem']")
      ).find((el) => el.innerText.toLowerCase().includes(q.text));
      if (!questionEl) {
        console.log("⚠️ Question not found:", q.text);
        return;
      }

      // Input text
      const input = questionEl.querySelector("input[type='text']");
      if (input) {
        if (pageConfig.authen) {
          nextBtn = document.querySelector(
            "div[role='button'][jsname='M2UYVd']"
          );
          q.answer = calcAuthen(questionEl.innerText);
        }

        input.value = q.answer;
        input.dispatchEvent(new Event("input", { bubbles: true }));
        console.log("✍️ Filled:", q.text, "->", q.answer);
        if (nextBtn) {
          setTimeout(() => {
            nextBtn.click();
          }, 100);
        }
      }

      // Radio button
      const radioLabels = document.querySelectorAll(
        "[jsname='wCJL8'] [dir='auto']"
      );

      if (radioLabels.length) {
        const option = Array.from(radioLabels).find((el) =>
          el.innerText.includes(q.answer)
        );
        if (option) {
          option.click();
          console.log("⭕ Selected:", q.text, "->", q.answer);
          if (nextBtn) {
            setTimeout(() => {
              nextBtn.click();
            }, 100);
          }
        }
      }
    });
  }
}

// chrome.storage.local.get("formConfig", ({ formConfig }) => {
//   console.log("📥 Loaded config from storage:", formConfig);
//   fillForm(formConfig);
// });

async function loadConfig() {
  // chrome.storage.local.clear();
  const stored = await chrome.storage.local.get("config");
  return stored.config || { pages: [] };
}

loadConfig().then((config) => {
  console.log("📥 Loaded config:", config);
  fillForm(config);
});
