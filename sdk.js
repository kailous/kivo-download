(() => {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const data = window.KIVO_SDK_DOCS;
  if (!data) return;

  // 包大小
  const sizeEl = $("#sdk-zip-size");
  if (sizeEl && data.zipSizeKB) {
    sizeEl.textContent = `ZIP · ${data.zipSizeKB} KB`;
  }

  // 包目录卡片
  const fileList = $("#sdk-file-list");
  if (fileList && data.files) {
    fileList.innerHTML = data.files
      .map(
        (f) => `
        <li class="sdk-file">
          <code>${f.path}</code>
          <p>${f.desc}</p>
        </li>`
      )
      .join("");
  }

  // 复制按钮
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-copy]");
    if (!btn) return;
    const text = btn.getAttribute("data-copy");
    if (navigator.clipboard && text) {
      navigator.clipboard.writeText(text).then(() => {
        const prev = btn.textContent;
        btn.textContent = "已复制";
        btn.classList.add("done");
        setTimeout(() => {
          btn.textContent = prev;
          btn.classList.remove("done");
        }, 1600);
      }).catch(() => {});
    }
  });

  // 文档标签切换
  const bodyEl = $("#sdk-doc-body");
  const tocEl = $("#sdk-toc-nav");
  const sourceEl = $("#sdk-doc-source");
  const tabsWrap = $("#sdk-doc-tabs");

  const renderDoc = (key) => {
    const doc = data.docs[key] || data.docs.sdk;
    if (!doc) return;
    bodyEl.innerHTML = doc.html;
    sourceEl.textContent = doc.source;
    tocEl.innerHTML = doc.toc
      .map(
        (item) =>
          `<a href="#${item.id}" class="${item.level > 2 ? "sub" : ""}">${item.text}</a>`
      )
      .join("");
    $$("[data-doc-tab]", tabsWrap).forEach((b) =>
      b.setAttribute("aria-selected", String(b.dataset.docTab === key))
    );
  };

  tabsWrap.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-doc-tab]");
    if (!btn) return;
    renderDoc(btn.dataset.docTab);
  });

  renderDoc("sdk");
})();
