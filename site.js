(() => {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ========================================================================
     1. 导航滚动态 & Reveal 动效
     ======================================================================== */
  const header = $("[data-header]");
  if (header && !header.classList.contains("solid")) {
    const syncNav = () => header.classList.toggle("scrolled", window.scrollY > 24);
    syncNav();
    window.addEventListener("scroll", syncNav, { passive: true });
  }

  const reveals = $$("[data-reveal]");
  if (reducedMotion || !("IntersectionObserver" in window)) {
    reveals.forEach((el) => el.classList.add("in"));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );
    reveals.forEach((el) => io.observe(el));
  }

  /* ========================================================================
     2. 复制按钮
     ======================================================================== */
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-copy]");
    if (btn) {
      const text = btn.getAttribute("data-copy");
      if (navigator.clipboard && text) {
        navigator.clipboard.writeText(text).then(() => {
          btn.classList.add("done");
          if (btn.classList.contains("url-item")) {
            const codeEl = $("code", btn);
            const prev = codeEl ? codeEl.textContent : "";
            if (codeEl) codeEl.textContent = "已复制命令";
            setTimeout(() => {
              if (codeEl) codeEl.textContent = prev;
              btn.classList.remove("done");
            }, 1400);
          } else {
            const prev = btn.textContent;
            btn.textContent = "已复制";
            setTimeout(() => {
              btn.textContent = prev;
              btn.classList.remove("done");
            }, 1600);
          }
        }).catch(() => {});
      }
    }
  });

  /* ========================================================================
     3. 十英尺电视界面交互演示（首页 / 详情 / 播放器 + 遥控器）
     ======================================================================== */
  const tv = $("#tv");
  const tvScreen = $("#tv-screen");
  const kv = $("#kv");
  if (tv && tvScreen && kv) {
    const SHOWS = [
      {
        id: "shanhai",
        title: "山海纪事",
        meta: "动画 · 奇幻 · Bilibili",
        source: "Bilibili",
        desc: "山海之间，异兽横行。少年背剑出行，在雾岭与赤原之间走向属于自己的远方。",
        backdrop: "assets/art/cinema/hero-shanhai.webp",
        poster: "assets/art/cinema/poster-shanhai.webp",
        still: "assets/art/cinema/still-shanhai.webp",
        total: 52,
        current: 23,
        progress: 0.21,
        timeText: "05:02 / 24:00",
        duration: 1440,
        savedSec: 302,
        fav: true,
        episodes: [
          "出山", "雾渡", "赤原旧闻", "白泽", "青霜剑", "石林夜火", "渡口", "归墟前夜",
          "云海", "山门", "孤舟", "秋风", "寒潭", "古道", "断桥", "落日",
          "霜降", "长夜", "破晓", "重逢", "雾中渡", "赤岭之约", "归墟", "夜渡",
          "山门再启", "风起"
        ]
      },
      {
        id: "xinghai",
        title: "星海漫游",
        meta: "科幻 · 剧集 · 爱奇艺",
        source: "爱奇艺",
        desc: "近地轨道环形空间站收到一段来自木卫二的周期信号，三名值守员决定偏航核查。",
        backdrop: "assets/art/cinema/still-xinghai.webp",
        poster: "assets/art/cinema/poster-xinghai.webp",
        still: "assets/art/cinema/still-xinghai.webp",
        total: 24,
        current: 9,
        progress: 0.62,
        timeText: "26:14 / 42:20",
        duration: 2540,
        savedSec: 1574,
        fav: false,
        episodes: [
          "静音轨道", "偏航", "回声", "冷启动", "冰层之下", "盲区", "备用频道", "日凌",
          "远光", "对接", "重力环", "白噪"
        ]
      },
      {
        id: "changan",
        title: "长安夜行",
        meta: "古装 · 悬疑 · 爱奇艺",
        source: "爱奇艺",
        desc: "上元灯市将启，坊间失踪的几卷旧账把两名互不相识的巡夜人牵进同一桩旧案。",
        backdrop: "assets/art/cinema/still-changan.webp",
        poster: "assets/art/cinema/poster-changan.webp",
        still: "assets/art/cinema/still-changan.webp",
        total: 36,
        current: 12,
        progress: 0.44,
        timeText: "19:40 / 44:50",
        duration: 2690,
        savedSec: 1180,
        fav: true,
        episodes: [
          "灯市", "旧账", "西市雨", "朱雀门", "茶肆", "渡船", "空巷", "残页",
          "更鼓", "暗流", "长安雪", "明月楼"
        ]
      },
      {
        id: "shenhai",
        title: "深海来信",
        meta: "纪录片 · 自然 · Bilibili",
        source: "Bilibili",
        desc: "跟随深潜团队潜入两千米以下的冷泉与海山，记录几乎从未被阳光照亮的深海生态。",
        backdrop: "assets/art/cinema/still-shenhai.webp",
        poster: "assets/art/cinema/poster-shenhai.webp",
        still: "assets/art/cinema/still-shenhai.webp",
        total: 8,
        current: 3,
        progress: 0.35,
        timeText: "17:10 / 49:00",
        duration: 2940,
        savedSec: 1030,
        fav: false,
        episodes: ["微光层", "海山", "冷泉", "鲸落", "热液口", "海沟", "潮汐", "归航"]
      },
      {
        id: "wuyin",
        title: "雾隐青城",
        meta: "动画 · 治愈 · Bilibili",
        source: "Bilibili",
        desc: "雨季的山中旧茶寮迎来形形色色的过客，每一杯新茶都连着一段没来得及说完的故事。",
        backdrop: "assets/art/cinema/still-wuyin.webp",
        poster: "assets/art/cinema/poster-wuyin.webp",
        still: "assets/art/cinema/still-wuyin.webp",
        total: 12,
        current: 5,
        progress: 0.15,
        timeText: "03:40 / 24:10",
        duration: 1450,
        savedSec: 220,
        fav: false,
        episodes: ["梅雨", "竹影", "旧伞", "青瓷", "山寺钟", "晚风"]
      },
      {
        id: "yunshang",
        title: "云上书院",
        meta: "动画 · 校园 · Bilibili",
        source: "Bilibili",
        desc: "建在积云之上的寄宿书院，每年秋分都会放飞折纸鹤，把新生的心愿送往地面。",
        backdrop: "assets/art/cinema/still-yunshang.webp",
        poster: "assets/art/cinema/poster-yunshang.webp",
        still: "assets/art/cinema/still-yunshang.webp",
        total: 16,
        current: 7,
        progress: 0.5,
        timeText: "12:00 / 24:00",
        duration: 1440,
        savedSec: 720,
        fav: true,
        episodes: ["云梯", "纸鹤", "晴空", "钟楼", "旧书架", "风铃", "秋分", "晨课"]
      }
    ];

    const DM_LINES = [
      { text: "这一段的配乐太顶了", gold: false },
      { text: "画面质感绝了！", gold: true },
      { text: "全屏看剧太丝滑了", gold: false },
      { text: "前面高能预警", gold: false },
      { text: "23 集终于等到名场面", gold: true },
      { text: "用方向键追剧太舒服了", gold: false },
      { text: "这个镜头构图真像电影", gold: false },
      { text: "进度自动保存好评", gold: false },
      { text: "云海这段可以当壁纸", gold: true },
      { text: "弹幕字号和半屏区域刚好不挡脸", gold: false }
    ];

    const QUALITIES = ["1080P 高码率", "1080P", "720P", "4K HDR"];
    const SPEEDS = [1.0, 1.25, 1.5, 2.0, 0.75];

    const state = {
      armed: false,
      screen: "home", // home | detail | player
      homeNav: "nav-home",
      showIndex: 0,
      epIndex: 23, // 1-based
      rangeStart: 1,
      focusEl: null,
      // 播放器状态
      paused: false,
      idle: false,
      controlsFocused: false,
      drawerOpen: false,
      danmakuOn: true,
      qIdx: 0,
      sIdx: 0,
      playSec: 302,
      idleTimer: null,
      playTimer: null,
      dmTimer: null,
      osdTimer: null,
      toastTimer: null
    };

    // 缩放 1280x720 设计稿以适配电视屏幕容器
    const syncScale = () => {
      const w = tvScreen.clientWidth || 960;
      kv.style.setProperty("--s", (w / 1280).toFixed(4));
    };
    syncScale();
    if ("ResizeObserver" in window) {
      new ResizeObserver(syncScale).observe(tvScreen);
    } else {
      window.addEventListener("resize", syncScale);
    }

    // 渲染首页继续观看 & 海报墙
    const contWrap = $("#kv-continue");
    const posterWrap = $("#kv-posters");
    SHOWS.slice(0, 3).forEach((s, idx) => {
      const btn = document.createElement("button");
      btn.className = "kv-cont";
      btn.setAttribute("data-f", "");
      btn.dataset.action = "open-continue";
      btn.dataset.idx = String(idx);
      btn.innerHTML = `
        <img src="${s.still}" alt="${s.title}">
        <div class="kv-cont-info">
          <strong>${s.title}</strong>
          <span><b>第 ${s.current} 集 · ${s.episodes[(s.current - 1) % s.episodes.length]}</b><em>${s.timeText}</em></span>
          <div class="kv-bar"><i style="width:${Math.round(s.progress * 100)}%"></i></div>
        </div>`;
      contWrap.appendChild(btn);
    });

    SHOWS.forEach((s, idx) => {
      const btn = document.createElement("button");
      btn.className = "kv-poster";
      btn.setAttribute("data-f", "");
      btn.dataset.action = "open-show";
      btn.dataset.idx = String(idx);
      btn.innerHTML = `<img src="${s.poster}" alt="${s.title}"><small>${s.source}</small><strong>${s.title}</strong>`;
      posterWrap.appendChild(btn);
    });

    const toastEl = $("#kv-toast");
    const showToast = (msg) => {
      toastEl.textContent = msg;
      toastEl.classList.add("show");
      clearTimeout(state.toastTimer);
      state.toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2000);
    };

    const osdEl = $("#kv-osd");
    const showOsd = (msg) => {
      osdEl.textContent = msg;
      osdEl.classList.add("show");
      clearTimeout(state.osdTimer);
      state.osdTimer = setTimeout(() => osdEl.classList.remove("show"), 1100);
    };

    const logEl = $("#remote-url");
    const logCmd = (cmd) => {
      if (!logEl) return;
      logEl.textContent = `kivo://remote/${cmd}`;
      logEl.classList.remove("flash");
      void logEl.offsetWidth;
      logEl.classList.add("flash");
      const urlRow = $(`#url-list li[data-cmd="${cmd}"]`);
      if (urlRow) {
        urlRow.classList.add("hit");
        setTimeout(() => urlRow.classList.remove("hit"), 900);
      }
    };

    const flashRemoteBtn = (cmd) => {
      const b = $(`.remote [data-remote="${cmd}"]`);
      if (!b) return;
      b.classList.add("hit");
      setTimeout(() => b.classList.remove("hit"), 180);
    };

    const formatTime = (sec) => {
      const s = Math.max(0, Math.floor(sec));
      const m = Math.floor(s / 60);
      const r = s % 60;
      return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
    };

    const syncHero = (idx) => {
      const s = SHOWS[idx] || SHOWS[0];
      $("#kv-hero-bg").src = s.backdrop;
      $("#kv-hero-title").textContent = s.title;
      $("#kv-hero-meta").textContent = s.meta;
      $("#kv-hero-desc").textContent = s.desc;
      $("#kv-hero-ep").textContent = `第 ${s.current} 集`;
    };

    const updateHomeScroll = (el) => {
      const scroller = $("#kv-home-scroll");
      if (!scroller) return;
      if (el && el.closest(".kv-posters")) {
        scroller.style.transform = "translateY(-240px)";
      } else if (el && el.closest(".kv-continue")) {
        scroller.style.transform = "translateY(-60px)";
      } else {
        scroller.style.transform = "translateY(0)";
      }
    };

    const updateKeyHints = () => {
      const box = $("#keyhints");
      if (!box) return;
      if (state.screen === "player") {
        if (state.drawerOpen) {
          box.innerHTML = `<span><kbd>↑</kbd><kbd>↓</kbd> 选择剧集</span><span><kbd>Enter</kbd> 切换播放</span><span><kbd>Esc</kbd> 关闭选集</span>`;
        } else if (state.controlsFocused) {
          box.innerHTML = `<span><kbd>←</kbd><kbd>→</kbd> 切换控制项</span><span><kbd>Enter</kbd> 确认</span><span><kbd>Esc</kbd> 退出控制栏</span>`;
        } else {
          box.innerHTML = `<span><kbd>Enter</kbd> 暂停 / 继续</span><span><kbd>←</kbd><kbd>→</kbd> 快退 / 快进 10 秒</span><span><kbd>↓</kbd> 进入控制栏</span><span><kbd>E</kbd> 选集</span><span><kbd>Esc</kbd> 返回详情</span>`;
        }
      } else if (state.screen === "detail") {
        box.innerHTML = `<span><kbd>←</kbd><kbd>↑</kbd><kbd>↓</kbd><kbd>→</kbd> 移动金色焦点</span><span><kbd>Enter</kbd> 播放所选剧集</span><span><kbd>Esc</kbd> 返回首页</span>`;
      } else {
        box.innerHTML = `<span><kbd>←</kbd><kbd>↑</kbd><kbd>↓</kbd><kbd>→</kbd> 浏览影视库</span><span><kbd>Enter</kbd> 打开作品或续播</span><span><kbd>Home</kbd> 回到首页</span>`;
      }
    };

    const getFocusableElements = () => {
      if (state.screen === "home") {
        return [...$$(".kv-side [data-f]", kv), ...$$(".kv-home [data-f]", kv)];
      }
      if (state.screen === "detail") {
        return [...$$(".kv-side [data-f]", kv), ...$$(".kv-detail [data-f]", kv)];
      }
      if (state.screen === "player") {
        if (state.drawerOpen) return $$(".kv-drawer [data-f]", kv);
        if (state.controlsFocused) return $$(".kv-controls [data-f]", kv);
        return [];
      }
      return [];
    };

    const setFocus = (el) => {
      if (state.focusEl) state.focusEl.classList.remove("is-focus");
      state.focusEl = el || null;
      if (el) {
        el.classList.add("is-focus");
        if (state.screen === "home") {
          updateHomeScroll(el);
          if (el.dataset.idx !== undefined) {
            syncHero(Number(el.dataset.idx));
          }
        }
      }
      updateKeyHints();
    };

    // 空间焦点导航算法（基于 1280x720 内元素包围盒）
    const moveFocusSpatial = (dir) => {
      const list = getFocusableElements();
      if (!list.length) return;
      if (!state.focusEl || !list.includes(state.focusEl)) {
        setFocus(list[0]);
        return;
      }
      const cur = state.focusEl.getBoundingClientRect();
      const cx = cur.left + cur.width / 2;
      const cy = cur.top + cur.height / 2;
      let best = null;
      let bestScore = Infinity;

      for (const el of list) {
        if (el === state.focusEl) continue;
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;
        const rx = r.left + r.width / 2;
        const ry = r.top + r.height / 2;
        const dx = rx - cx;
        const dy = ry - cy;
        let primary = 0;
        let cross = 0;
        if (dir === "right") {
          if (dx <= 4) continue;
          primary = dx;
          cross = Math.abs(dy);
        } else if (dir === "left") {
          if (dx >= -4) continue;
          primary = -dx;
          cross = Math.abs(dy);
        } else if (dir === "down") {
          if (dy <= 4) continue;
          primary = dy;
          cross = Math.abs(dx);
        } else if (dir === "up") {
          if (dy >= -4) continue;
          primary = -dy;
          cross = Math.abs(dx);
        }
        const score = primary + cross * 2.4;
        if (score < bestScore) {
          bestScore = score;
          best = el;
        }
      }
      if (best) setFocus(best);
    };

    /* ---- 详情页渲染 ---- */
    const renderDetail = (idx) => {
      state.showIndex = idx;
      const s = SHOWS[idx];
      $("#kv-detail-bg").src = s.backdrop;
      $("#kv-detail-poster").src = s.poster;
      $("#kv-detail-title").textContent = s.title;
      $("#kv-detail-meta").textContent = `${s.meta} · 共 ${s.total} 集正片`;
      $("#kv-detail-desc").textContent = s.desc;
      $("#kv-detail-play-label").textContent = `续播第 ${s.current} 集`;
      $("#kv-ep-total").textContent = `共 ${s.total} 集`;
      const favBtn = $('[data-action="detail-fav"]', kv);
      favBtn.classList.toggle("is-on", s.fav);
      $("#kv-fav-label").textContent = s.fav ? "已收藏" : "收藏";

      const rangesEl = $("#kv-ranges");
      rangesEl.innerHTML = "";
      const step = 26;
      const rangeCount = Math.ceil(s.total / step);
      state.rangeStart = 1;
      for (let i = 0; i < rangeCount; i++) {
        const start = i * step + 1;
        const end = Math.min(s.total, start + step - 1);
        const btn = document.createElement("button");
        btn.className = "kv-range" + (i === 0 ? " is-active" : "");
        btn.setAttribute("data-f", "");
        btn.dataset.action = "ep-range";
        btn.dataset.start = String(start);
        btn.textContent = `${start}–${end}`;
        rangesEl.appendChild(btn);
      }
      renderEpGrid(s, 1);
    };

    const renderEpGrid = (s, start) => {
      state.rangeStart = start;
      const grid = $("#kv-epgrid");
      grid.innerHTML = "";
      const end = Math.min(s.total, start + 25);
      for (let n = start; n <= end; n++) {
        const btn = document.createElement("button");
        btn.className = "kv-ep";
        if (n < s.current) btn.classList.add("is-watched");
        if (n === s.current) btn.classList.add("is-current");
        btn.setAttribute("data-f", "");
        btn.dataset.action = "play-ep";
        btn.dataset.ep = String(n);
        btn.innerHTML = `${n}${n === s.total ? "<em>新</em>" : ""}`;
        grid.appendChild(btn);
      }
      $$(".kv-range", kv).forEach((b) => {
        b.classList.toggle("is-active", Number(b.dataset.start) === start);
      });
    };

    /* ---- 播放器逻辑 ---- */
    const playerEl = $(".kv-player", kv);
    const dmBox = $("#kv-danmaku");

    const resetIdle = () => {
      state.idle = false;
      playerEl.classList.remove("is-idle");
      clearTimeout(state.idleTimer);
      if (state.screen === "player" && !state.paused && !state.controlsFocused && !state.drawerOpen) {
        state.idleTimer = setTimeout(() => {
          state.idle = true;
          playerEl.classList.add("is-idle");
        }, 3200);
      }
    };

    const syncPlayerUI = () => {
      const s = SHOWS[state.showIndex];
      const epTitle = s.episodes[(state.epIndex - 1) % s.episodes.length];
      $("#kv-video-img").src = s.still;
      $("#kv-player-title").textContent = s.title;
      $("#kv-player-ep").textContent = `第 ${state.epIndex} 集 · ${epTitle}`;
      $("#kv-time").textContent = `${formatTime(state.playSec)} / ${formatTime(s.duration)}`;
      $("#kv-progress-fill").style.width = `${Math.min(100, (state.playSec / s.duration) * 100)}%`;
      $("#kv-q-btn").textContent = QUALITIES[state.qIdx].split(" ")[0];
      const sp = SPEEDS[state.sIdx];
      $("#kv-s-btn").textContent = `${Number.isInteger(sp) ? sp.toFixed(1) : sp}×`;
      $("#kv-dm-btn").classList.toggle("is-on", state.danmakuOn);
      dmBox.classList.toggle("is-off", !state.danmakuOn);
      playerEl.classList.toggle("is-paused", state.paused);
      playerEl.classList.toggle("drawer-open", state.drawerOpen);
    };

    const renderDrawer = () => {
      const s = SHOWS[state.showIndex];
      $("#kv-drawer-count").textContent = `正片 ${s.total} 集`;
      const list = $("#kv-drawer-list");
      list.innerHTML = "";
      const start = Math.max(1, state.epIndex - 3);
      const end = Math.min(s.total, start + 9);
      for (let n = start; n <= end; n++) {
        const btn = document.createElement("button");
        btn.className = "kv-dr" + (n === state.epIndex ? " is-current" : "");
        btn.setAttribute("data-f", "");
        btn.dataset.action = "drawer-ep";
        btn.dataset.ep = String(n);
        const title = s.episodes[(n - 1) % s.episodes.length];
        btn.innerHTML = `<b>${String(n).padStart(2, "0")}</b><span>${title}</span>${n === state.epIndex ? "<em>播放中</em>" : ""}`;
        list.appendChild(btn);
      }
    };

    let dmLane = 0;
    const spawnDanmaku = () => {
      if (state.screen !== "player" || state.paused || !state.danmakuOn || reducedMotion) return;
      const item = DM_LINES[dmLane % DM_LINES.length];
      const el = document.createElement("span");
      el.className = "kv-dm" + (item.gold ? " gold" : "");
      el.textContent = item.text;
      const lane = dmLane % 6;
      dmLane += 1;
      el.style.top = `${14 + lane * 44}px`;
      const dur = 8.2 + (lane % 3) * 0.8;
      el.style.transition = `transform ${dur}s linear`;
      dmBox.appendChild(el);
      requestAnimationFrame(() => {
        el.style.transform = `translateX(-${1400 + el.offsetWidth}px)`;
      });
      setTimeout(() => el.remove(), dur * 1000 + 200);
    };

    const startPlayerTimers = () => {
      clearInterval(state.playTimer);
      clearInterval(state.dmTimer);
      state.playTimer = setInterval(() => {
        if (state.screen === "player" && !state.paused) {
          const s = SHOWS[state.showIndex];
          state.playSec = Math.min(s.duration, state.playSec + SPEEDS[state.sIdx]);
          s.savedSec = state.playSec;
          s.progress = state.playSec / s.duration;
          $("#kv-time").textContent = `${formatTime(state.playSec)} / ${formatTime(s.duration)}`;
          $("#kv-progress-fill").style.width = `${Math.min(100, s.progress * 100)}%`;
        }
      }, 1000);
      state.dmTimer = setInterval(spawnDanmaku, 1300);
      spawnDanmaku();
    };

    const stopPlayerTimers = () => {
      clearInterval(state.playTimer);
      clearInterval(state.dmTimer);
      clearTimeout(state.idleTimer);
      dmBox.innerHTML = "";
    };

    const goScreen = (next, focusSelector) => {
      state.screen = next;
      kv.dataset.screen = next;
      if (next !== "player") {
        state.drawerOpen = false;
        state.controlsFocused = false;
        stopPlayerTimers();
      }
      if (focusSelector) {
        const target = $(focusSelector, kv);
        setFocus(target);
      } else if (next === "player") {
        setFocus(null);
        resetIdle();
      }
      updateKeyHints();
    };

    const openDetail = (idx) => {
      renderDetail(idx);
      goScreen("detail", '[data-action="detail-play"]');
    };

    const openPlayer = (idx, ep) => {
      state.showIndex = idx;
      const s = SHOWS[idx];
      state.epIndex = ep || s.current;
      s.current = state.epIndex;
      state.playSec = ep && ep !== s.current ? 0 : s.savedSec;
      state.paused = false;
      state.drawerOpen = false;
      state.controlsFocused = false;
      syncPlayerUI();
      renderDrawer();
      goScreen("player");
      startPlayerTimers();
      showOsd(`第 ${state.epIndex} 集`);
    };

    const switchEpisode = (delta) => {
      const s = SHOWS[state.showIndex];
      const next = state.epIndex + delta;
      if (next < 1 || next > s.total) {
        showOsd(delta < 0 ? "已是第一集" : "已是最后一集");
        return;
      }
      state.epIndex = next;
      s.current = next;
      state.playSec = 0;
      dmBox.innerHTML = "";
      syncPlayerUI();
      renderDrawer();
      resetIdle();
      showOsd(`切换至第 ${next} 集`);
    };

    const handleAction = (el) => {
      if (!el) return;
      const act = el.dataset.action;
      if (!act) return;
      switch (act) {
        case "nav-home":
          $$(".kv-nav-item", kv).forEach((n) => n.classList.toggle("is-active", n === el));
          goScreen("home", '[data-action="hero-play"]');
          break;
        case "nav-library":
        case "nav-follow":
        case "nav-fav":
        case "nav-iptv":
        case "nav-sources":
        case "nav-settings":
          $$(".kv-nav-item", kv).forEach((n) => n.classList.toggle("is-active", n === el));
          if (state.screen !== "home") goScreen("home", '[data-action="hero-play"]');
          showToast(`已切换至「${el.textContent.trim()}」`);
          break;
        case "hero-play":
          openPlayer(state.showIndex, SHOWS[state.showIndex].current);
          break;
        case "hero-detail":
          openDetail(state.showIndex);
          break;
        case "open-continue":
          openPlayer(Number(el.dataset.idx), SHOWS[Number(el.dataset.idx)].current);
          break;
        case "open-show":
          openDetail(Number(el.dataset.idx));
          break;
        case "detail-play":
          openPlayer(state.showIndex, SHOWS[state.showIndex].current);
          break;
        case "detail-fav": {
          const s = SHOWS[state.showIndex];
          s.fav = !s.fav;
          el.classList.toggle("is-on", s.fav);
          $("#kv-fav-label").textContent = s.fav ? "已收藏" : "收藏";
          showToast(s.fav ? `已收藏《${s.title}》` : `已取消收藏《${s.title}》`);
          break;
        }
        case "detail-refresh":
          showToast("目录已刷新 · 正片与附加内容均为最新");
          break;
        case "ep-range":
          renderEpGrid(SHOWS[state.showIndex], Number(el.dataset.start));
          setFocus(el);
          break;
        case "play-ep":
          openPlayer(state.showIndex, Number(el.dataset.ep));
          break;
        case "p-prev":
          switchEpisode(-1);
          break;
        case "p-toggle":
          state.paused = !state.paused;
          syncPlayerUI();
          resetIdle();
          showOsd(state.paused ? "已暂停 · 进度已保存" : "继续播放");
          break;
        case "p-next":
          switchEpisode(1);
          break;
        case "p-danmaku":
          state.danmakuOn = !state.danmakuOn;
          syncPlayerUI();
          showOsd(state.danmakuOn ? "弹幕已开启" : "弹幕已关闭");
          break;
        case "p-quality":
          state.qIdx = (state.qIdx + 1) % QUALITIES.length;
          syncPlayerUI();
          showOsd(`清晰度：${QUALITIES[state.qIdx]}`);
          break;
        case "p-speed":
          state.sIdx = (state.sIdx + 1) % SPEEDS.length;
          syncPlayerUI();
          showOsd(`倍速：${SPEEDS[state.sIdx]}×`);
          break;
        case "p-episodes":
          state.drawerOpen = !state.drawerOpen;
          syncPlayerUI();
          if (state.drawerOpen) {
            setFocus($(".kv-dr.is-current", kv) || $(".kv-dr", kv));
          } else {
            setFocus($("#kv-play-btn"));
          }
          break;
        case "drawer-ep":
          state.drawerOpen = false;
          openPlayer(state.showIndex, Number(el.dataset.ep));
          break;
      }
    };

    // 统一处理遥控动作（与 kivo://remote/<cmd> 一致）
    const dispatchRemote = (cmd) => {
      if (!state.armed) armTV();
      logCmd(cmd);
      flashRemoteBtn(cmd);

      if (cmd === "power") {
        showToast("已保存播放进度 · 返回首页");
        goScreen("home", '[data-action="hero-play"]');
        return;
      }

      if (cmd === "home") {
        if (state.drawerOpen) return; // 选集打开时忽略
        if (state.screen === "player") showToast("已暂停并保存进度");
        goScreen("home", '[data-action="hero-play"]');
        return;
      }

      if (cmd === "menu") {
        if (state.screen === "player") {
          state.drawerOpen = !state.drawerOpen;
          state.controlsFocused = false;
          syncPlayerUI();
          if (state.drawerOpen) {
            setFocus($(".kv-dr.is-current", kv) || $(".kv-dr", kv));
          } else {
            setFocus(null);
            resetIdle();
          }
        } else {
          showToast("打开设置：通用 · 播放 · 插件 · 本地数据");
        }
        return;
      }

      if (cmd === "previous-episode") {
        if (state.screen === "player") switchEpisode(-1);
        return;
      }
      if (cmd === "next-episode") {
        if (state.screen === "player") switchEpisode(1);
        return;
      }
      if (cmd === "controls") {
        if (state.screen === "player") {
          state.drawerOpen = false;
          state.controlsFocused = true;
          syncPlayerUI();
          resetIdle();
          setFocus($("#kv-play-btn"));
        } else {
          showToast("在播放页按此键可快速进入控制栏");
        }
        return;
      }

      if (cmd === "play-pause") {
        if (state.screen === "player") {
          state.paused = !state.paused;
          syncPlayerUI();
          resetIdle();
          showOsd(state.paused ? "已暂停 · 进度已保存" : "继续播放");
        }
        return;
      }

      if (cmd === "back") {
        if (state.screen === "player") {
          if (state.drawerOpen) {
            state.drawerOpen = false;
            syncPlayerUI();
            setFocus(state.controlsFocused ? $("#kv-play-btn") : null);
            resetIdle();
          } else if (state.controlsFocused) {
            state.controlsFocused = false;
            setFocus(null);
            resetIdle();
          } else {
            showToast("进度已保存");
            renderDetail(state.showIndex);
            goScreen("detail", '[data-action="detail-play"]');
          }
        } else if (state.screen === "detail") {
          goScreen("home", `[data-action="open-show"][data-idx="${state.showIndex}"]`);
        } else {
          setFocus($('[data-action="hero-play"]', kv));
        }
        return;
      }

      if (cmd === "ok") {
        if (state.screen === "player" && !state.drawerOpen && !state.controlsFocused) {
          state.paused = !state.paused;
          syncPlayerUI();
          resetIdle();
          showOsd(state.paused ? "已暂停 · 进度已保存" : "继续播放");
          return;
        }
        handleAction(state.focusEl);
        return;
      }

      // 方向键
      if (["up", "down", "left", "right"].includes(cmd)) {
        if (state.screen === "player" && !state.drawerOpen && !state.controlsFocused) {
          if (cmd === "left" || cmd === "right") {
            const s = SHOWS[state.showIndex];
            state.playSec = Math.max(0, Math.min(s.duration, state.playSec + (cmd === "right" ? 10 : -10)));
            syncPlayerUI();
            resetIdle();
            showOsd(cmd === "right" ? "前进 10 秒" : "后退 10 秒");
            return;
          }
          if (cmd === "down") {
            state.controlsFocused = true;
            resetIdle();
            setFocus($("#kv-play-btn"));
            return;
          }
          if (cmd === "up") {
            showOsd("音量 +5%");
            return;
          }
        }
        if (state.screen === "player" && state.controlsFocused && !state.drawerOpen) {
          if (cmd === "up") {
            state.controlsFocused = false;
            setFocus(null);
            resetIdle();
            return;
          }
          const ctrls = $$(".kv-controls [data-f]", kv);
          const idx = ctrls.indexOf(state.focusEl);
          if (cmd === "left") setFocus(ctrls[Math.max(0, idx - 1)]);
          if (cmd === "right") setFocus(ctrls[Math.min(ctrls.length - 1, idx + 1)]);
          return;
        }
        if (state.screen === "player" && state.drawerOpen) {
          const items = $$(".kv-drawer [data-f]", kv);
          const idx = items.indexOf(state.focusEl);
          if (cmd === "up") setFocus(items[Math.max(0, idx - 1)]);
          if (cmd === "down") setFocus(items[Math.min(items.length - 1, idx + 1)]);
          if (cmd === "left") dispatchRemote("back");
          return;
        }
        moveFocusSpatial(cmd);
      }
    };

    const armTV = () => {
      if (state.armed) return;
      state.armed = true;
      tv.classList.add("armed");
      tvScreen.focus({ preventScroll: true });
      const splash = $("#kv-splash");
      if (splash) {
        setTimeout(() => {
          splash.classList.add("done");
          setFocus($('[data-action="hero-play"]', kv));
        }, reducedMotion ? 10 : 520);
      } else {
        setFocus($('[data-action="hero-play"]', kv));
      }
    };

    $("#tv-arm").addEventListener("click", armTV);

    // 直接点击演示屏幕中的任意元素也可交互
    kv.addEventListener("click", (e) => {
      if (!state.armed) {
        armTV();
        return;
      }
      const target = e.target.closest("[data-f]");
      if (target) {
        setFocus(target);
        handleAction(target);
      } else if (state.screen === "player") {
        resetIdle();
      }
    });

    // 遥控器按钮点击与键盘回车触发
    $$(".remote [data-remote]").forEach((btn) => {
      btn.addEventListener("click", () => dispatchRemote(btn.dataset.remote));
      btn.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          dispatchRemote(btn.dataset.remote);
        }
      });
    });

    // 键盘事件（仅在演示屏获得焦点时生效，不劫持整页浏览）
    tvScreen.addEventListener("keydown", (e) => {
      const map = {
        ArrowUp: "up",
        ArrowDown: "down",
        ArrowLeft: "left",
        ArrowRight: "right",
        Enter: "ok",
        " ": "ok",
        Escape: "back",
        Backspace: "back",
        Home: "home",
        e: "menu",
        E: "menu"
      };
      if (e.key === "[" || e.key === "]") {
        if (state.screen === "player") {
          e.preventDefault();
          state.sIdx = (state.sIdx + (e.key === "]" ? 1 : SPEEDS.length - 1)) % SPEEDS.length;
          syncPlayerUI();
          showOsd(`倍速：${SPEEDS[state.sIdx]}×`);
        }
        return;
      }
      const cmd = map[e.key];
      if (!cmd) return;
      e.preventDefault();
      dispatchRemote(cmd);
    });

    // 滚入视口时先隐藏启动屏，让页面静态呈现完整的首屏画面
    const splashEl = $("#kv-splash");
    if (splashEl) splashEl.classList.add("done");
    updateKeyHints();
  }

  /* ========================================================================
     4. 添加视频源交互演示
     ======================================================================== */
  const addSamples = [
    {
      url: "https://www.bilibili.com/bangumi/play/ep829104?from=search",
      plugin: "Bilibili · v1.2.1",
      title: "山海纪事",
      meta: "动画 · 自动识别整季并去除跟踪参数",
      poster: "assets/art/cinema/poster-shanhai.webp",
      counts: [["正片", "52 集"], ["预告", "3 条"], ["花絮", "12 条"]],
      s0: "自动匹配 Bilibili 扩展",
      s1: "读取季目录 · 正片与花絮分离",
      s2: "真实高清封面与简介",
      s3: "收进你的个人影视库"
    },
    {
      url: "https://www.bilibili.com/bangumi/play/ss28747",
      plugin: "Bilibili · v1.2.1",
      title: "云上书院",
      meta: "动画 · 整季链接一次收齐",
      poster: "assets/art/cinema/poster-yunshang.webp",
      counts: [["正片", "16 集"], ["预告", "2 条"], ["版本", "1 个"]],
      s0: "识别为整季链接",
      s1: "核对整季正片目录",
      s2: "16 集正片独立展示",
      s3: "已存在作品仅更新剧集"
    },
    {
      url: "https://www.iqiyi.com/v_1jm50v4hx7c.html",
      plugin: "爱奇艺 · 实验版 0.1.7",
      title: "长安夜行",
      meta: "古装 · 高清原生播放与滚动弹幕",
      poster: "assets/art/cinema/poster-changan.webp",
      counts: [["正片", "36 集"], ["弹幕", "滚动叠加"], ["画质", "高清原生"]],
      s0: "自动匹配爱奇艺扩展",
      s1: "读取完整剧集目录",
      s2: "高清封面与完整简介",
      s3: "收进你的个人影视库"
    },
    {
      url: "https://raw.githubusercontent.com/example/iptv/main/live.m3u",
      plugin: "IPTV · 实验版 0.1.0",
      title: "家庭直播列表",
      meta: "直播 · 按分组浏览，上下键换台",
      poster: "assets/art/cinema/poster-shenhai.webp",
      counts: [["频道", "86 个"], ["分组", "6 个"], ["换台", "上下键"]],
      s0: "识别 M3U 直播列表",
      s1: "自动按分组整理频道",
      s2: "跳过不可用频道地址",
      s3: "加入你的直播频道库"
    }
  ];

  const addPreview = $("#add-preview");
  const addLink = $("#add-link");
  const addConfirm = $("#add-confirm");
  if (addPreview && addLink) {
    let timerIds = [];
    const clearTimers = () => {
      timerIds.forEach(clearTimeout);
      timerIds = [];
    };

    const runSample = (idx) => {
      clearTimers();
      const s = addSamples[idx];
      $$(".add-samples button").forEach((b, i) => b.setAttribute("aria-pressed", String(i === idx)));
      addLink.textContent = s.url;
      addLink.classList.add("typed");
      addPreview.dataset.state = "loading";
      addConfirm.textContent = "确认入库";

      const stepEls = $$("#add-steps li");
      stepEls.forEach((li) => li.classList.remove("active", "done"));
      $("#add-s0").textContent = s.s0;
      $("#add-s1").textContent = s.s1;
      $("#add-s2").textContent = s.s2;
      $("#add-s3").textContent = s.s3;

      const stepDelay = reducedMotion ? 0 : 320;
      stepEls[0].classList.add("active");
      timerIds.push(
        setTimeout(() => {
          stepEls[0].classList.replace("active", "done");
          stepEls[1].classList.add("active");
        }, stepDelay),
        setTimeout(() => {
          stepEls[1].classList.replace("active", "done");
          stepEls[2].classList.add("active");
          $("#add-poster").src = s.poster;
          $("#add-poster").alt = s.title;
          $("#add-plugin").textContent = s.plugin;
          $("#add-title").textContent = s.title;
          $("#add-meta").textContent = s.meta;
          $("#add-counts").innerHTML = s.counts
            .map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`)
            .join("");
          addPreview.dataset.state = "ready";
        }, stepDelay * 2),
        setTimeout(() => {
          stepEls[2].classList.replace("active", "done");
          stepEls[3].classList.add("active");
        }, stepDelay * 3)
      );
    };

    $$(".add-samples button").forEach((btn) => {
      btn.addEventListener("click", () => runSample(Number(btn.dataset.sample)));
    });
    if (addConfirm) {
      addConfirm.addEventListener("click", () => {
        const last = $("#add-steps li[data-step='3']");
        if (last) last.classList.replace("active", "done");
        addPreview.dataset.state = "added";
        addConfirm.textContent = "已加入影视库";
      });
    }
    runSample(0);
  }

  /* ========================================================================
     5. 播放器 Bento 区域动态细节
     ======================================================================== */
  // 弹幕卡片
  const dmLanes = $("#dm-lanes");
  if (dmLanes && !reducedMotion) {
    const sampleDms = [
      { t: "这一幕构图好美", g: true },
      { t: "弹幕轻盈飘过完全不挡画面", g: false },
      { t: "字号和透明度都能调", g: false },
      { t: "半屏显示不遮字幕好评", g: true },
      { t: "拖进度条弹幕也严丝合缝跟得上", g: false },
      { t: "这里配乐太温柔了", g: false }
    ];
    let dmIdx = 0;
    const addLaneDm = () => {
      if (document.hidden) return;
      const d = sampleDms[dmIdx++ % sampleDms.length];
      const el = document.createElement("span");
      el.className = "dm-item" + (d.g ? " gold" : "");
      el.textContent = d.t;
      const lane = (dmIdx % 4);
      el.style.top = `${8 + lane * 24}%`;
      el.style.setProperty("--w", `${(dmLanes.clientWidth || 600) + 120}px`);
      const dur = 7 + (dmIdx % 3) * 1.4;
      el.style.animationDuration = `${dur}s`;
      dmLanes.appendChild(el);
      setTimeout(() => el.remove(), dur * 1000 + 200);
    };
    addLaneDm();
    setInterval(addLaneDm, 1700);
  }

  // 拼音搜索演示
  const pyQuery = $("#py-query");
  const pyResults = $("#py-results");
  if (pyQuery && pyResults && !reducedMotion) {
    const seq = [
      { q: "s", r: ["<b>山</b>海纪事", "<b>深</b>海来信"] },
      { q: "sh", r: ["<b>山海</b>纪事", "<b>深海</b>来信"] },
      { q: "shjs", r: ["<b>山海纪事</b> · 共 52 集"] },
      { q: "c", r: ["<b>长</b>安夜行"] },
      { q: "cayx", r: ["<b>长安夜行</b> · 共 36 集"] },
      { q: "yun", r: ["<b>云</b>上书院 · 共 16 集"] }
    ];
    let qi = 0;
    setInterval(() => {
      if (document.hidden) return;
      qi = (qi + 1) % seq.length;
      pyQuery.textContent = seq[qi].q;
      pyResults.innerHTML = seq[qi].r.map((x) => `<li>${x}</li>`).join("");
    }, 2200);
  }

  // 正片数字格
  const roleNums = $("#role-nums");
  if (roleNums) {
    let html = "";
    for (let i = 1; i <= 30; i++) {
      const cls = i < 23 ? "w" : i === 23 ? "c" : "";
      html += `<span class="${cls}">${i}</span>`;
    }
    roleNums.innerHTML = html;
  }

  // RemoteFlow 灵动岛实机卡片轮播（观看进度 + 追剧更新）
  const rfCover = $("#rf-cover");
  if (rfCover) {
    const cards = [
      { cover: "assets/art/cinema/still-shanhai.webp", title: "山海纪事", caption: "23 · 05:02 / 24:00", pct: 21 },
      { cover: "assets/art/cinema/still-xinghai.webp", title: "星海漫游", caption: "9 · 26:14 / 42:20", pct: 62 },
      { cover: "assets/art/cinema/still-changan.webp", title: "长安夜行", caption: "12 · 19:40 / 44:50", pct: 44 }
    ];
    const updates = [
      { sub: "2 部作品有新集", title: "长安夜行 · 第 13 集" },
      { sub: "2 部作品有新集", title: "云上书院 · 第 8 集" },
      { sub: "暂无新集", title: "收藏与追番已检查" }
    ];
    let ci = 0;
    let ui = 0;
    const body = $("#rf-progress .rf-progress-body");
    const updBody = $("#rf-updates-card .rf-updates-body");
    const applyCard = (idx) => {
      const c = cards[idx];
      rfCover.src = c.cover;
      $("#rf-title").textContent = c.title;
      $("#rf-ep").textContent = c.caption;
      $("#rf-bar").style.width = `${c.pct}%`;
    };
    const applyUpdate = (idx) => {
      const u = updates[idx];
      $("#rf-upd-sub").textContent = u.sub;
      $("#rf-upd-title").textContent = u.title;
    };
    applyCard(0);
    applyUpdate(0);
    if (!reducedMotion) {
      setInterval(() => {
        if (document.hidden) return;
        body.classList.add("swap");
        rfCover.classList.add("swap");
        if (updBody) updBody.classList.add("swap");
        setTimeout(() => {
          ci = (ci + 1) % cards.length;
          ui = (ui + 1) % updates.length;
          applyCard(ci);
          applyUpdate(ui);
          body.classList.remove("swap");
          rfCover.classList.remove("swap");
          if (updBody) updBody.classList.remove("swap");
        }, 280);
      }, 4500);
    }
  }

  /* ========================================================================
     6. 首页插件精选行（复用 plugins-data.js）
     ======================================================================== */
  const pluginRow = $("#plugin-row");
  if (pluginRow && window.KIVO_PLUGINS_DATA) {
    const capLabels = { collection: "目录", playback: "原生播放", authentication: "官方登录", danmaku: "弹幕" };
    const statusMap = {
      stable: { text: "稳定", cls: "tag-gold" },
      experimental: { text: "实验版", cls: "tag-lab" }
    };
    const featured = window.KIVO_PLUGINS_DATA.plugins.filter((p) => p.featured);
    pluginRow.innerHTML = featured
      .map((p) => {
        const iconHtml =
          p.icon.type === "svg"
            ? p.icon.svg
            : `<span>${p.icon.text}</span>`;
        const st = statusMap[p.status];
        const caps = p.capabilities.map((c) => `<span class="tag">${capLabels[c] || c}</span>`).join("");
        return `
          <a class="card plugin-card" href="plugins.html#${p.id}">
            <div class="plugin-card-top">
              <span class="plugin-icon" style="background:${p.icon.bg}">${iconHtml}</span>
              <div>
                <h3>${p.name}</h3>
                <span class="plugin-ver">v${p.version} · API v${p.apiVersion}</span>
              </div>
            </div>
            <p>${p.tagline}</p>
            <div class="plugin-tags">
              ${st ? `<span class="tag ${st.cls}">${st.text}</span>` : ""}
              ${caps}
            </div>
          </a>`;
      })
      .join("");
  }
})();
