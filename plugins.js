(() => {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const data = window.KIVO_PLUGINS_DATA;
  if (!data) return;

  const capLabels = {
    collection: "目录",
    playback: "原生播放",
    authentication: "官方登录",
    danmaku: "弹幕"
  };
  const statusMap = {
    stable: { text: "稳定", cls: "tag-gold" },
    experimental: { text: "实验版", cls: "tag-lab" },
    template: { text: "开发模板", cls: "" }
  };

  const state = { category: "all", status: "all", query: "" };

  const catWrap = $("#store-categories");
  const listEl = $("#store-list");
  const countEl = $("#store-count");
  const emptyEl = $("#store-empty");
  const searchInput = $("#store-search");
  const detailDialog = $("#plugin-detail-dialog");
  const detailContent = $("#detail-content");
  const submitDialog = $("#submit-plugin-dialog");

  const renderIcon = (icon) => {
    const inner = icon.type === "svg" ? icon.svg : `<span>${icon.text}</span>`;
    return `<span class="plugin-icon" style="background:${icon.bg}">${inner}</span>`;
  };

  // 渲染分类标签
  catWrap.innerHTML = data.categories
    .map(
      (c) =>
        `<button type="button" role="tab" data-cat="${c.id}" aria-selected="${c.id === "all"}">${c.name}</button>`
    )
    .join("");

  const renderList = () => {
    const q = state.query.trim().toLowerCase();
    const filtered = data.plugins.filter((p) => {
      if (state.category !== "all" && p.category !== state.category) return false;
      if (state.status !== "all" && p.status !== state.status) return false;
      if (q) {
        const hay = [
          p.name,
          p.id,
          p.tagline,
          p.description,
          p.author,
          ...p.capabilities.map((c) => capLabels[c] || c),
          ...(p.links || [])
        ]
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    countEl.textContent = `${filtered.length} 个插件`;
    emptyEl.hidden = filtered.length > 0;
    listEl.hidden = filtered.length === 0;

    listEl.innerHTML = filtered
      .map((p) => {
        const st = statusMap[p.status];
        const caps = p.capabilities
          .map((c) => `<span class="tag">${capLabels[c] || c}</span>`)
          .join("");
        const links = (p.links || []).map((l) => `<code>${l}</code>`).join("");
        return `
          <li class="store-item" id="card-${p.id}">
            <div class="store-item-head">
              ${renderIcon(p.icon)}
              <div class="store-item-meta">
                <div class="store-item-title">
                  <h3>${p.name}</h3>
                  ${st ? `<span class="tag ${st.cls}">${st.text}</span>` : ""}
                </div>
                <p class="store-item-sub">v${p.version} · API v${p.apiVersion} · ${p.author}</p>
              </div>
            </div>
            <p class="store-item-desc">${p.description}</p>
            ${links ? `<div class="store-item-links">${links}</div>` : ""}
            <div class="store-item-foot">
              <div class="store-item-caps">${caps}</div>
              <button type="button" class="store-detail-btn" data-open-plugin="${p.id}">查看详情</button>
            </div>
          </li>`;
      })
      .join("");
  };

  const openDetail = (id) => {
    const p = data.plugins.find((x) => x.id === id);
    if (!p || !detailDialog) return;
    const st = statusMap[p.status];
    const caps = p.capabilities.map((c) => `<span class="tag">${capLabels[c] || c}</span>`).join("");
    const highlights = (p.highlights || []).map((h) => `<li>${h}</li>`).join("");
    const limits = (p.limits || []).map((l) => `<li>${l}</li>`).join("");
    const changelog = (p.changelog || [])
      .map((c) => `<li><b>${c.version}</b><span>${c.notes}</span></li>`)
      .join("");
    const installBtn = p.download
      ? `<a class="btn btn-gold btn-small" href="${p.download}" download>下载压缩包</a>`
      : `<a class="btn btn-gold btn-small" href="index.html#download">在 Kivo 设置中安装</a>`;

    detailContent.innerHTML = `
      <div class="detail-head">
        ${renderIcon(p.icon)}
        <div>
          <h2 id="detail-title">${p.name}</h2>
          <p class="detail-sub">${p.id} · v${p.version} · API v${p.apiVersion} · contentRating: ${p.contentRating}</p>
        </div>
      </div>
      <div class="plugin-tags" style="margin-top:16px">
        ${st ? `<span class="tag ${st.cls}">${st.text}</span>` : ""}
        ${p.bundled ? `<span class="tag">随 Kivo 打包提供</span>` : ""}
        ${caps}
      </div>
      <p class="detail-desc">${p.description}</p>
      ${highlights ? `<div class="detail-section"><h3>主要特性</h3><ul class="detail-list">${highlights}</ul></div>` : ""}
      ${limits ? `<div class="detail-section"><h3>当前边界</h3><ul class="detail-list detail-limits">${limits}</ul></div>` : ""}
      ${changelog ? `<div class="detail-section"><h3>版本记录</h3><ul class="detail-changelog">${changelog}</ul></div>` : ""}
      <div class="detail-actions">
        ${installBtn}
        <a class="btn btn-glass btn-small" href="sdk.html">了解插件架构</a>
      </div>`;

    detailDialog.showModal();
  };

  // 事件监听
  catWrap.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-cat]");
    if (!btn) return;
    state.category = btn.dataset.cat;
    $$("[data-cat]", catWrap).forEach((b) => b.setAttribute("aria-selected", String(b === btn)));
    renderList();
  });

  $("#store-status-filter").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-status]");
    if (!btn) return;
    state.status = btn.dataset.status;
    $$("#store-status-filter button").forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
    renderList();
  });

  searchInput.addEventListener("input", () => {
    state.query = searchInput.value;
    renderList();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "/" && document.activeElement !== searchInput && !detailDialog.open && !submitDialog.open) {
      e.preventDefault();
      searchInput.focus();
    }
  });

  listEl.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-open-plugin]");
    if (btn) openDetail(btn.dataset.openPlugin);
  });

  $("#store-reset").addEventListener("click", () => {
    state.category = "all";
    state.status = "all";
    state.query = "";
    searchInput.value = "";
    $$("[data-cat]", catWrap).forEach((b) => b.setAttribute("aria-selected", String(b.dataset.cat === "all")));
    $$("#store-status-filter button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.status === "all")));
    renderList();
  });

  $("#open-submit-dialog").addEventListener("click", () => submitDialog.showModal());

  $("#copy-submit-json").addEventListener("click", (e) => {
    const btn = e.currentTarget;
    const text = $("#submit-json").textContent;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        btn.textContent = "已复制";
        btn.classList.add("done");
        setTimeout(() => {
          btn.textContent = "复制";
          btn.classList.remove("done");
        }, 1600);
      }).catch(() => {});
    }
  });

  // 点击遮罩关闭弹窗
  [detailDialog, submitDialog].forEach((dlg) => {
    dlg.addEventListener("click", (e) => {
      if (e.target === dlg) dlg.close();
    });
  });

  renderList();

  // 若 URL 带有 #pluginId，自动打开详情
  const hashId = location.hash.replace(/^#/, "");
  if (hashId && data.plugins.some((p) => p.id === hashId)) {
    openDetail(hashId);
  }
})();
