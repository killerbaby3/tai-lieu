function fillForm(config) {
  if (!config || !config.pages) return;

  // Tìm trang hiện tại theo tiêu đề
  const pageTitleEl = document.querySelectorAll("div[role='heading']");
  if (!pageTitleEl || pageTitleEl.length == 1) return;

  const pageTitle = pageTitleEl[1].innerText.trim();
  console.log("🔎 Current page title:", pageTitle);

  const pageConfig = config.pages.find((p) => pageTitle.includes(p.label));
  if (!pageConfig) {
    console.log("⚠️ No config for this page");
    return;
  }
  const nextBtn = document.querySelector("div[role='button'][jsname='OCpkoe']");
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
      const questionEl = Array.from(
        document.querySelectorAll("div[role='listitem']")
      ).find((el) => el.innerText.includes(q.text));
      if (!questionEl) {
        console.log("⚠️ Question not found:", q.text);
        return;
      }

      // Input text
      const input = questionEl.querySelector("input[type='text']");
      if (input) {
        input.value = q.answer;
        input.dispatchEvent(new Event("input", { bubbles: true }));
        console.log("✍️ Filled:", q.text, "->", q.answer);
        if (nextBtn) {
          setTimeout(() => {
            nextBtn.click();
          }, 150);
        }
      }

      // Radio button
      const radioLabels = questionEl.querySelectorAll(
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
            }, 150);
          }
        }
      }
    });
  }
}

chrome.storage.local.get("formConfig", ({ formConfig }) => {
  console.log("📥 Loaded config from storage:", formConfig);
  fillForm(formConfig);
});
