chrome.storage.local.get(["commentsEnabled"], (res) => {
  let enabled = res.commentsEnabled ?? true;

  function applyToggle(enabled) {
    const commentSection = document.querySelector('[class*="comments"]');
    const inputBox = document.querySelector('textarea');
    if (commentSection) commentSection.style.display = enabled ? "" : "none";
    if (inputBox) {
      inputBox.disabled = !enabled;
      inputBox.placeholder = enabled ? "Type your comment..." : "Comments disabled";
    }
  }

  function insertToggle(enabled) {
    if (document.querySelector(".comment-toggle")) return;

    const replyBtn = document.querySelector("textarea")?.closest("form")?.querySelector("button");
    if (!replyBtn) return;

    const btn = document.createElement("button");
    btn.textContent = enabled ? "✅ Disable Comments" : "❌ Enable Comments";
    btn.classList.add("comment-toggle", enabled ? "enabled" : "disabled");

    btn.onclick = () => {
      const newState = !enabled;
      chrome.storage.local.set({ commentsEnabled: newState }, () => {
        applyToggle(newState);
        btn.textContent = newState ? "✅ Disable Comments" : "❌ Enable Comments";
        btn.classList.remove("enabled", "disabled");
        btn.classList.add(newState ? "enabled" : "disabled");
        enabled = newState;
      });
    };

    replyBtn.insertAdjacentElement("afterend", btn);
  }

  applyToggle(enabled);
  insertToggle(enabled);

  const observer = new MutationObserver(() => {
    applyToggle(enabled);
    insertToggle(enabled);
  });
  observer.observe(document.body, { childList: true, subtree: true });
});
