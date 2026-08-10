// app.js — 视图切换 + 渲染 + 交互
(function () {
  'use strict';
  const DB = window.DB;
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => document.querySelectorAll(s);

  // ---------- 图标（内联 SVG，避免 emoji 当图标） ----------
  const ICONS = {
    sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    refresh: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 21v-5h5"/></svg>',
    history: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>',
    paw: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="11" r="2.4"/><circle cx="11" cy="6" r="2.4"/><circle cx="17" cy="7" r="2.4"/><circle cx="20" cy="13" r="2.4"/><path d="M5 16c1.5-2 4.5-2 6 0 .8 1 .8 2.6 0 3.6-1 1.3-3 1.3-4 0-1-1.2-2-1.6-2-3.6z"/></svg>',
    up: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 18l6-6-6-6"/><path d="M8 6l-6 6 6 6"/></svg>',
    flat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>',
    down: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
    spark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.9 5.8a2 2 0 0 0 1.3 1.3L21 12l-5.8 1.9a2 2 0 0 0-1.3 1.3L12 21l-1.9-5.8a2 2 0 0 0-1.3-1.3L3 12l5.8-1.9a2 2 0 0 0 1.3-1.3z"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>',
    trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>',
    chevron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>',
    alert: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/></svg>',
    target: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
    lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
  };

  // ---------- 通用状态 ----------
  const state = {
    mission: window.MissionStore.load(),
    stockSort: 'score', // score | name
    calib: window.PStore.get('p_workbench_calib', DB.calib.map((c) => c.checked)),
    bias: window.PStore.get('p_workbench_bias', []),
    settings: window.PStore.get('p_workbench_settings', DB.settings.map((s) => s.on)),
    stageCheck: window.PStore.get('p_workbench_stagecheck', {}),
    stageDone: window.PStore.get('p_workbench_stagedone', []), // 已通关阶段编号
    user: Object.assign({}, DB.user, window.PStore.get('p_workbench_user', {})),
    watch: window.PStore.get('p_workbench_watch', DB.stocks.map((s) => s.code)),
    custom: window.CustomStore.load(),
    quotes: {}, // 实时行情缓存 { code: {price, change, pct} }
    newsIdx: 0, // 当前资讯对应的关注标的索引
    newsBookmarks: window.PStore.get('p_workbench_newsbook', []), // 收藏的资讯（标题去重）
    newsVisible: 3, // 当前显示的资讯条数（加载更多）
    newsShowBook: false, // 是否只看收藏
  };

  // ---------- 星星背景 ----------
  function makeStars() {
    const box = $('#stars'); let html = '';
    for (let i = 0; i < 34; i++) {
      const x = Math.random() * 100, y = Math.random() * 100, r = (Math.random() * 1.6 + 0.6).toFixed(1), d = (Math.random() * 5 + 1).toFixed(1);
      html += `<i style="left:${x.toFixed(1)}%;top:${y.toFixed(1)}%;width:${r}px;height:${r}px;animation-delay:-${d}s"></i>`;
    }
    box.innerHTML = html;
  }

  // ---------- 动态问候 & 时钟 ----------
  function greetByHour(h) {
    if (h >= 5 && h < 11) return '早上好';
    if (h >= 11 && h < 13) return '中午好';
    if (h >= 13 && h < 18) return '下午好';
    return '晚上好';
  }
  function refreshClock() {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    const wk = ['日', '一', '二', '三', '四', '五', '六'][now.getDay()];
    const dateEl = $('#liveDate');
    const clockEl = $('#liveClock');
    if (dateEl) dateEl.textContent = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日 · 周${wk}`;
    if (clockEl) clockEl.textContent = `T-${hh}:${mm}:${ss}`;
    const greetEl = $('#greetText');
    if (greetEl) greetEl.textContent = greetByHour(now.getHours()) + '，' + (state.user.name || '汪局长') + ' 🐾';
  }

  // ---------- 任务（持久化 + 增删 + 进度 + 庆祝） ----------
  function missionDoneCount() {
    return DB.missions.filter((m) => state.mission[m.id]).length;
  }
  function renderMissions() {
    const list = $('#missionList');
    const done = missionDoneCount();
    const total = DB.missions.length;
    // 进度条
    const bar = $('#todayBar'); const pctEl = $('#todayPct');
    if (bar) bar.style.width = (total ? (done / total) * 100 : 0) + '%';
    if (pctEl) pctEl.textContent = `${done}/${total}`;
    // 空状态
    if (DB.missions.length === 0) {
      list.innerHTML = '<li class="empty-state"><span class="es-ic">🐾</span><p>暂无任务，点右下角 + 亲手立个 flag 吧</p></li>';
      return;
    }
    list.innerHTML = '';
    DB.missions.forEach((m) => {
      const isDone = !!state.mission[m.id];
      const li = document.createElement('li');
      li.className = 'mission' + (isDone ? ' is-done' : '');
      li.innerHTML = `
        <button class="tick" data-id="${m.id}" data-act="toggle" aria-label="切换完成">
          ${isDone ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>' : ICONS.paw}
        </button>
        <div class="m-body">
          <p class="m-title">${esc(m.title)}</p>
          <span class="m-meta">${ICONS.clock}<span class="mono">${m.time}</span> · <span class="m-cat c-${m.cat}">${m.cat}</span></span>
        </div>
        <button class="m-del" data-id="${m.id}" data-act="del" aria-label="删除任务">${ICONS.trash}</button>
      `;
      list.appendChild(li);
    });
  }
  function toggleMission(id) {
    state.mission[id] = !state.mission[id];
    window.MissionStore.save(state.mission);
    renderMissions();
    const done = missionDoneCount();
    if (done === DB.missions.length && DB.missions.length > 0) { celebrate(); toast('汪！今日任务全部完成，宇宙最佳 🎉'); }
    else if (state.mission[id]) toast('任务完成 ✓');
    else toast('已取消完成');
  }
  function deleteMission(id) {
    const m = DB.missions.find((x) => x.id === id);
    DB.missions = DB.missions.filter((x) => x.id !== id);
    delete state.mission[id];
    window.MissionStore.save(state.mission);
    renderMissions();
    toast(`已删除「${m ? m.title : ''}」`);
  }
  function addMission(text) {
    const now = new Date();
    const forced = ['日常', '研究', '估值', '纪律', '风控'];
    const cat = forced[Math.floor(Math.random() * forced.length)];
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const id = 'm' + Date.now();
    DB.missions.push({ id, title: text, cat, time, done: false });
    renderMissions();
    toast('已加入今日任务 🐾');
  }
  function celebrate() {
    const box = $('#confetti');
    if (!box) return;
    box.innerHTML = '';
    for (let i = 0; i < 22; i++) {
      const c = document.createElement('i');
      const colors = ['#43D9FF', '#FFD166', '#FF8AC2', '#48E0A0', '#FF6B6B', '#7A5CFF'];
      c.style.cssText = `left:${Math.random() * 100}%;background:${colors[i % colors.length]};animation-delay:${(Math.random() * 0.6).toFixed(2)}s;--dx:${(Math.random() * 120 - 60)}px;--dd:${(0.9 + Math.random() * 0.8).toFixed(2)}s`;
      box.appendChild(c);
    }
    setTimeout(() => { box.innerHTML = ''; }, 1600);
  }

  // ---------- 例行安排 ----------
  function renderRoutine() {
    const grid = $('#routineGrid'); grid.innerHTML = '';
    DB.routine.forEach((r) => {
      const el = document.createElement('div');
      el.className = 'routine';
      el.innerHTML = `<span class="r-f">${r.f}</span><span class="r-ic">${ICONS[r.icon]}</span><p>${r.t}</p>`;
      grid.appendChild(el);
    });
  }

  // ---------- 关注速览（首页） ----------
  function renderMiniStocks() {
    const box = $('#miniStocks'); box.innerHTML = '';
    const stocks = getSortedStocks();
    if (stocks.length === 0) {
      box.innerHTML = '<div class="mini-empty">关注小组空空的，去「关注」页添加队员吧 🐾</div>';
      return;
    }
    stocks.slice(0, 3).forEach((s) => {
      const el = document.createElement('a');
      el.className = 'mini-stock';
      el.setAttribute('data-goto', 'portfolio');
      const q = state.quotes[s.code];
      const priceText = q ? `<b class="mono ${q.pct >= 0 ? 'up' : 'down'}">${q.price}</b>` : '';
      el.innerHTML = `
        <span class="ms-trend ${s.trend}">${ICONS[s.trend]}</span>
        <div class="ms-name"><b>${s.name}</b><span class="mono">${s.code}</span></div>
        <div class="ms-score">${priceText}<b class="mono">${stockTotal(s)}</b><span>/60 · ${isPending(s) ? '待评估' : s.grade}</span></div>
      `;
      box.appendChild(el);
    });
  }
  // 全部股票（关注初始 + 候选池 + 自定义，按 code 去重）
  function allStocks() {
    const custom = Object.values(state.custom).map((c) => c);
    return DB.stocks.concat(
      DB.stockPool.filter((p) => !DB.stocks.some((s) => s.code === p.code)),
      custom.filter((c) => !DB.stocks.some((s) => s.code === c.code) && !DB.stockPool.some((p) => p.code === c.code))
    );
  }
  function getWatchStocks() {
    return allStocks().filter((s) => state.watch.includes(s.code));
  }
  function isPending(s) { return !!(s.custom && !s.evaluated); }
  function stockTotal(s) { return isPending(s) ? '待' : s.total; }
  function getSortedStocks() {
    const arr = getWatchStocks();
    if (state.stockSort === 'score') arr.sort((a, b) => (isPending(a) ? -1 : a.total) - (isPending(b) ? -1 : b.total));
    else arr.sort((a, b) => a.name.localeCompare(b.name, 'zh'));
    return arr;
  }

  // ---------- 关注全列表（点击详情 + 排序 + 删除） ----------
  function renderStocks() {
    const list = $('#stockList'); list.innerHTML = '';
    const empty = $('#stockEmpty');
    const stocks = getSortedStocks();
    if (stocks.length === 0) {
      if (empty) {
        empty.classList.remove('empty-hidden');
        empty.classList.add('empty-state');
        empty.innerHTML = '<span class="es-ic">🐾</span><p>关注小队空着，点右上角「＋ 添加」拉队员入队吧</p>';
      }
      return;
    }
    if (empty) empty.classList.add('empty-hidden');
    stocks.forEach((s) => {
      const li = document.createElement('li');
      li.className = 'stock-card' + (s.trend === 'down' ? ' is-avoid' : '') + (isPending(s) ? ' is-pending' : '');
      li.setAttribute('data-code', s.code);
      const q = state.quotes[s.code];
      const priceHtml = q
        ? `<span class="sc-price ${q.pct >= 0 ? 'up' : 'down'}"><i class="mono">${q.price}</i><em>${q.pct > 0 ? '+' : ''}${q.pct}%</em></span>`
        : `<span class="sc-price none"><i class="mono">${isPending(s) ? '—' : (s.noQuote ? '自定义' : '行情')}</i><em>${s.noQuote ? '无行情' : '待拉取'}</em></span>`;
      li.innerHTML = `
        <div class="sc-head">
          <div class="sc-title"><b>${s.name}</b><span class="mono">${s.code}</span></div>
          <span class="sc-total mono">${stockTotal(s)}<i>/60</i>${ICONS.chevron}</span>
        </div>
        <div class="sc-sub">${s.sub}${s.custom && !s.evaluated ? ' · 待评估' : ''}</div>
        <div class="sc-price-row">${priceHtml}
          <span class="tag ${s.trend}">${isPending(s) ? '待评估' : s.grade}</span>
          <span class="advice">${s.advice}</span>
        </div>
        <div class="sc-bars">
          <div class="bar-row"><span>好生意</span><div class="bar"><i style="width:${(s.bs / 20) * 100}%" class="cyan"></i></div><b class="mono">${isPending(s) ? '—' : s.bs}</b></div>
          <div class="bar-row"><span>好企业</span><div class="bar"><i style="width:${(s.be / 20) * 100}%" class="violet"></i></div><b class="mono">${isPending(s) ? '—' : s.be}</b></div>
          <div class="bar-row"><span>好投资</span><div class="bar"><i style="width:${(s.bi / 20) * 100}%" class="sun"></i></div><b class="mono">${isPending(s) ? '—' : s.bi}</b></div>
        </div>
        <div class="sc-foot">
          <span class="sc-note">${isPending(s) ? '自定义标的 · 待完成九段分析' : '点击查看详情'}</span>
          <button class="sc-del" data-remove="${s.code}" aria-label="移除关注">${ICONS.trash}<span>移除</span></button>
        </div>
      `;
      list.appendChild(li);
    });
  }
  function renderStockSort() {
    const btn = $('#sortBtn');
    if (btn) btn.innerHTML = `排序：${state.stockSort === 'score' ? '评分' : '名称'} ${ICONS.chevron}`;
  }
  // 关注头部综合评分（随列表实时更新 · 待评估不计入均分）
  function renderScoreSum() {
    const stocks = getWatchStocks().filter((s) => !isPending(s));
    const n = stocks.length || 1;
    const bs = Math.round(stocks.reduce((a, s) => a + s.bs, 0) / n);
    const be = Math.round(stocks.reduce((a, s) => a + s.be, 0) / n);
    const bi = Math.round(stocks.reduce((a, s) => a + s.bi, 0) / n);
    const total = Math.round(stocks.reduce((a, s) => a + s.total, 0) / n);
    const ring = $('#scoreRing'); if (ring) ring.style.strokeDasharray = `calc(213.6*${(total / 60).toFixed(2)}) 213.6`;
    const t = $('#scoreTotal'); if (t) t.textContent = total;
    const map = { scoreBs: bs, scoreBe: be, scoreBi: bi };
    Object.keys(map).forEach((k) => { const el = $('#' + k); if (el) el.textContent = map[k]; });
  }
  // 添加 / 移除关注
  function addWatch(code) {
    if (state.watch.includes(code)) return;
    state.watch.push(code);
    window.PStore.set('p_workbench_watch', state.watch);
    const s = allStocks().find((x) => x.code === code);
    if (s) autoEvaluate(s); // 入队即按评估引擎重算，杜绝候选池写死分数与引擎失真错位
    renderStocks(); renderScoreSum(); renderMiniStocks(); renderNews();
    fetchQuotes(); // 入队后立即拉一次行情，避免出现"待拉取"要等 30 秒自动刷新才出价
    toast(`已加入关注：${s ? s.name : code} 🐾`);
  }
  // 添加关注弹窗（候选池 + 自定义 双标签）
  function openAddModal() {
    const modal = $('#modal');
    // 候选池统一用评估引擎重算，保证展示分数与入队后在关注列表里的一致（避免写死分数与引擎失真的错位）
    const candidates = DB.stockPool.filter((p) => !state.watch.includes(p.code)).map((p) => {
      const c = Object.assign({}, p);
      autoEvaluate(c);
      return c;
    });
    modal.innerHTML = `
      <div class="modal-mask" data-close></div>
      <div class="modal-card">
        <div class="m-head">
          <div><h3>添加关注</h3><span class="mono">拉动关注的标的入队</span></div>
          <button class="m-x" data-close aria-label="关闭">${ICONS.close}</button>
        </div>
        <div class="add-tabs">
          <button class="add-tab is-sel" data-tab="pool">候选池</button>
          <button class="add-tab" data-tab="custom">自定义</button>
        </div>
        <div class="add-pane" data-pane="pool">
          <ul class="add-list">
            ${candidates.length ? candidates.map((p) => `
              <li class="add-item" data-add="${p.code}">
                <div class="add-info"><b>${p.name}</b><span class="mono">${p.code} · ${p.sub}</span></div>
                <span class="add-score mono">${p.total}<i>/60</i></span>
                <button class="add-btn-inline">${ICONS.plus} 入队</button>
              </li>`).join('')
            : '<li class="empty-state"><span class="es-ic">🐾</span><p>候选池的队员都入队啦，切到「自定义」新增吧</p></li>'}
          </ul>
        </div>
        <div class="add-pane is-hidden" data-pane="custom">
          <form id="customForm" class="custom-form">
            <div class="cf-row">
              <label>股票代码 / 标的名称</label>
              <input type="text" id="customInput" placeholder="输入 6 位代码如 600036，或中文名如 招商银行" maxlength="20" autocomplete="off">
            </div>
            <div class="cf-row">
              <label>行业 / 备注 <em>选填</em></label>
              <input type="text" id="customSub" placeholder="如 银行 / 消费电子" maxlength="16" autocomplete="off">
            </div>
            <button type="submit" class="btn-primary">＋ 加入关注</button>
          </form>
          <p class="cf-hint">🐾 认识的代码或名字会直接入队，不认识的会登记为待评估标的</p>
        </div>
        <button class="btn-primary" data-close>完成</button>
      </div>
    `;
    document.body.classList.add('modal-open');
    modal.classList.add('show');
    setTimeout(() => modal.classList.add('visible'), 10);
    // 标签切换
    modal.querySelectorAll('.add-tab').forEach((tb) => tb.addEventListener('click', () => {
      modal.querySelectorAll('.add-tab').forEach((x) => x.classList.toggle('is-sel', x === tb));
      modal.querySelectorAll('.add-pane').forEach((p) => p.classList.toggle('is-hidden', p.dataset.pane !== tb.dataset.tab));
    }));
    // 候选池入队
    modal.querySelectorAll('[data-add]').forEach((b) => b.addEventListener('click', () => {
      addWatch(b.dataset.add);
      const row = b.closest('.add-item');
      if (row) row.remove();
      if (!modal.querySelector('.add-item')) {
        const ul = modal.querySelector('[data-pane="pool"] .add-list');
        if (ul) ul.innerHTML = '<li class="empty-state"><span class="es-ic">🐾</span><p>候选池的队员都入队啦，切到「自定义」新增吧</p></li>';
      }
    }));
    // 自定义提交（支持 6 位代码 或 中文名）
    $('#customForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const input = $('#customInput').value.trim();
      const sub = $('#customSub').value.trim();
      if (!input) { toast('汪，请输入股票代码或中文名'); return; }
      const known = allStocks();
      // 1) 6 位数字 → 按代码处理
      if (/^\d{6}$/.test(input)) {
        const hit = known.find((s) => s.code === input);
        if (hit) {
          if (!state.watch.includes(input)) { addWatch(input); closeModal(); }
          else toast('这个标的已在关注列表里啦');
        } else {
          // 代码不在已知池：先实时反查真实名称，避免显示成"代码/代码"；查不到退回用代码作名称
          resolveStockName(input, (res) => {
            const displayName = (res && res.name) || input;
            const autoSub = inferSub(displayName);
            addCustom({ code: input, name: displayName, sub: sub || autoSub || '自定义标的', noQuote: false });
            closeModal();
          });
        }
        return;
      }
      // 2) 中文名 → 名称匹配（精确优先，其次模糊包含）
      const exact = known.filter((s) => s.name === input);
      const fuzzy = known.filter((s) => s.name.includes(input) || input.includes(s.name));
      const cands = (exact.length ? exact : fuzzy).filter(() => true);
      if (cands.length === 1) {
        const code = cands[0].code;
        if (!state.watch.includes(code)) { addWatch(code); closeModal(); }
        else toast('这个标的已在关注列表里啦');
      } else if (cands.length > 1) {
        toast(`汪，有多个标的匹配「${input}」：${cands.slice(0, 3).map((c) => c.name).join('、')}，请用代码精确添加`);
      } else {
        // 未在已知池命中：先查静态 A 股名称→代码映射；查不到再走腾讯智能搜索实时反查真实代码，尽最大努力拉到行情
        const mapCode = (window.DB.stockNameMap && window.DB.stockNameMap[input]) || '';
        if (mapCode) {
          addCustom({ code: mapCode, name: input, sub: sub || inferSub(input) || 'A股标的', noQuote: false });
          closeModal();
        } else {
          addByName(input, sub);
        }
      }
    });
  }
  // 为「仅中文名」的自定义标的生产一个不冲突的虚拟代码
  function genCustomCode() {
    const known = allStocks();
    let code;
    do { code = '9' + String(Math.floor(Math.random() * 90000) + 10000); } while (known.some((s) => s.code === code));
    return code;
  }
  // ---------- 自动评估引擎（九段分析自动打分） ----------
  // 对任意标的按"行业画像 + 代码指纹"生成 bs/be/bi、综合分、评级、建议、趋势，以及估值、资金、风险与利好
  function hashNum(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
    return h;
  }
  // 行业画像（更细粒度 · 基准分反映行业真实景气与竞争格局，顺序越靠前优先匹配）
  const EVAL_INDUSTRY = [
    { re: /茅台|五粮液|泸州老窖|汾酒|洋河|古井|白酒|酒鬼|舍得|水井坊/, bs: 17, be: 17, bi: 16, risk: ['消费需求波动', '高端酒增速放缓', '渠道库存压力'], bonus: ['品牌护城河极强', '现金流优秀', '提价能力强'] },
    { re: /海天|酱油|调味|食品|乳|伊利|蒙牛|双汇|啤酒|饮料|安琪/, bs: 16, be: 16, bi: 15, risk: ['消费需求波动', '原材料成本波动', '行业竞争加剧'], bonus: ['品牌渠道成熟', '现金流稳健', '需求刚性'] },
    { re: /长江电力|水电|电力运营|核电|华能|国电/, bs: 16, be: 17, bi: 15, risk: ['来水波动', '电价政策', '资本开支'], bonus: ['现金流极佳', '垄断经营', '股息稳定'] },
    { re: /宁波银行|招商银行|兴业|平安银行|江苏银行|成都银行/, bs: 16, be: 17, bi: 16, risk: ['利率下行压利差', '资产质量波动', '监管变化'], bonus: ['资产质量优质', 'ROE领先', '估值较低'] },
    { re: /银行/, bs: 15, be: 16, bi: 16, risk: ['利率下行压利差', '资产质量波动', '监管变化'], bonus: ['估值低位', '股息稳定', '牌照壁垒'] },
    { re: /中国平安|中国人寿|太保|新华|保险|证券|东方财富|中信证券|华泰/, bs: 15, be: 15, bi: 16, risk: ['利率环境波动', '改革阵痛', '权益市场波动'], bonus: ['牌照壁垒', '估值低位', '现金流雄厚'] },
    { re: /恒瑞|迈瑞|医药|制药|药明|爱尔|片仔癀|疫苗|生物|医疗|器械|药/, bs: 16, be: 16, bi: 15, risk: ['研发投入大、管线不及预期', '集采/医保降价压力', '政策变化'], bonus: ['创新管线丰富', '现金流稳健', '行业空间大'] },
    { re: /宁德|比亚迪|电池|锂电|储能|亿纬|国轩/, bs: 16, be: 16, bi: 14, risk: ['产能过剩价格战', '技术迭代快', '原材料波动'], bonus: ['赛道高景气', '龙头技术领先', '第二曲线放量'] },
    { re: /隆基|通威|阳光电源|晶澳|天合|光伏|硅料/, bs: 14, be: 14, bi: 13, risk: ['产能过剩价格战', '技术路线迭代', '行业盈利承压'], bonus: ['全球龙头', '一体化成本优势', '装机需求长期向好'] },
    { re: /中芯|半导体|芯片|集成电路|封测|北方华创|中微|韦尔|华天/, bs: 15, be: 15, bi: 14, risk: ['周期波动', '技术迭代快', '竞争加剧毛利率承压'], bonus: ['国产替代逻辑强', '行业空间大', '景气赛道'] },
    { re: /京东方|面板|立讯|歌尔|海康|大华|电子|光学/, bs: 14, be: 14, bi: 13, risk: ['面板周期波动', '消费电子需求波动', '竞争加剧'], bonus: ['行业地位领先', '龙头份额提升', '研发实力强'] },
    { re: /美的|格力|海尔|苏泊尔|老板|小家电|家电|电器/, bs: 16, be: 16, bi: 15, risk: ['地产链需求波动', '原材料成本波动', '海外贸易环境'], bonus: ['竞争格局优秀', '现金流强', '全球化布局'] },
    { re: /三一|徐工|中联|机械|汇川|工控|自动化|机器人|高端制造/, bs: 15, be: 15, bi: 14, risk: ['制造业景气波动', '竞争加剧', '周期波动'], bonus: ['国产替代', '行业地位领先', '技术实力强'] },
    { re: /万华|化工|新材料|涂料|化学|MDI/, bs: 15, be: 15, bi: 14, risk: ['大宗品价格波动', '资本开支大', '周期波动'], bonus: ['成本优势明显', '研发实力强', '行业地位领先'] },
    { re: /紫金|矿业|铜|铝|锂|钴|稀土|煤炭|神华|石油|能源|有色/, bs: 14, be: 15, bi: 14, risk: ['大宗商品价格波动', '周期波动', '资源价格弹性'], bonus: ['资源禀赋强', '成本控制', '龙头地位'] },
    { re: /长城|长安|上汽|广汽|江淮|蔚来|小鹏|理想|汽车|零部件|福耀/, bs: 14, be: 14, bi: 13, risk: ['价格战激烈', '技术变革', '利润承压'], bonus: ['市场规模大', '电动化转型', '份额提升'] },
    { re: /万科|保利|招商蛇口|金地|置业|地产|房地产/, bs: 12, be: 12, bi: 13, risk: ['行业下行', '去库存压力', '现金流承压'], bonus: ['土地储备优质', '财务相对稳健', '股息尚可'] },
    { re: /海螺|冀东|华新|水泥|建材|东方雨虹|北新建材/, bs: 13, be: 13, bi: 13, risk: ['需求疲软', '产能过剩', '价格竞争'], bonus: ['龙头成本优势', '集中度提升', '现金流稳定'] },
    { re: /金山|软件|恒生电子|科大讯飞|互联网|云计算|广联达|腾讯|阿里/, bs: 15, be: 15, bi: 15, risk: ['技术迭代快', '竞争激烈', '估值波动'], bonus: ['商业模式优', '研发投入大', '成长空间'] },
    { re: /中兴|通信|移动|联通|电信|基建|中国建筑|中铁|交建/, bs: 14, be: 14, bi: 14, risk: ['资本开支大', '周期波动', '负债率'], bonus: ['行业地位稳定', '现金流尚可', '股息稳定'] },
    { re: /中远|顺丰|物流|航空|铁路|京沪高铁|大秦/, bs: 13, be: 13, bi: 13, risk: ['运价/需求波动', '成本压力', '周期波动'], bonus: ['行业地位领先', '现金流改善', '规模效应'] },
    { re: /中科曙光|浪潮|海光|寒武纪|龙芯|算力|服务器|CPO|光模块|新易盛|中际旭创|天孚|光迅|烽火|华工科技|紫光国微/, bs: 16, be: 16, bi: 15, risk: ['AI 资本开支波动', '技术迭代快', '竞争加剧毛利率承压'], bonus: ['AI 算力高景气', '卡位国产算力', '业绩弹性大'] },
    { re: /卫宁|东软|中科创达|四维图新|奇安信|安恒|广联达|深信服|金山|软件|计算机/, bs: 15, be: 15, bi: 15, risk: ['技术迭代快', '竞争激烈', '估值波动'], bonus: ['商业模式优', '研发投入大', '成长空间'] },
    { re: /中航|航发|航天|洪都|内蒙一机|际华|军工|兵器|电子雷达/, bs: 15, be: 15, bi: 14, risk: ['订单节奏波动', '军费预算变化', '交付周期长'], bonus: ['军品壁垒高', '订单确定性强', '技术积累深厚'] },
  ];
  // 优质核心资产评分映射（覆盖广泛共识的核心资产，优先于行业规则，避免被随机抖动误判）
  const KNOWN_SCORES = {
    '600519': [18, 18, 17], '000858': [16, 16, 15], '000568': [16, 16, 15], '600809': [16, 15, 15],
    '600900': [17, 18, 16], '600036': [17, 18, 16], '002142': [16, 17, 16], '601318': [15, 15, 16],
    '300750': [17, 17, 15], '002594': [16, 16, 14], '600276': [17, 17, 16], '300760': [17, 17, 15],
    '600436': [16, 17, 15], '000333': [16, 17, 15], '000651': [15, 16, 15], '600690': [15, 16, 15],
    '603288': [16, 17, 15], '600887': [15, 16, 15], '601888': [16, 16, 14], '300124': [16, 16, 15],
    '002415': [16, 16, 15], '600941': [14, 14, 14], '600309': [16, 16, 15], '601899': [15, 15, 15],
    '601088': [15, 16, 15], '603259': [16, 16, 15], '300015': [16, 16, 14], '600031': [15, 15, 14],
    '601012': [15, 15, 13], '688981': [15, 15, 14], '002475': [14, 14, 13], '000725': [13, 13, 13],
    '600585': [14, 14, 13], '000002': [12, 12, 13], '600048': [12, 12, 13], '601919': [14, 14, 13],
    '002352': [13, 13, 13], '300059': [14, 14, 15], '600030': [15, 15, 16], '601688': [15, 15, 16],
    '002230': [14, 14, 14], '688111': [15, 15, 15], '002185': [14, 14, 13], '600089': [14, 14, 13],
    '300308': [15, 15, 14], '000063': [13, 13, 13], '601857': [14, 14, 13], '600028': [14, 14, 13],
    // AI 算力 / 服务器 / 光模块 / 半导体设备（补全新一代核心资产）
    '603019': [16, 16, 15], '000977': [16, 16, 15], '688041': [16, 16, 15], '688256': [15, 15, 14],
    '688047': [15, 15, 14], '000034': [15, 15, 14], '300502': [16, 16, 15], '300394': [16, 16, 15],
    '002281': [15, 15, 14], '000988': [15, 15, 14], '600498': [15, 15, 14], '002049': [15, 15, 14],
    '300661': [15, 15, 14], '300458': [14, 14, 14], '002156': [14, 15, 14], '688126': [14, 14, 14],
    '688072': [15, 15, 14], '688120': [15, 15, 14], '688082': [15, 15, 14],
    // 军工（补全）
    '000768': [15, 15, 14], '600372': [14, 15, 14], '600765': [14, 15, 14], '600316': [14, 15, 14],
    '000738': [14, 15, 14], '600038': [14, 15, 14], '600435': [13, 14, 14], '600967': [13, 14, 14],
    '600118': [14, 15, 14], '600879': [14, 14, 14],
    // 软件 / 计算机（补全）
    '300253': [14, 14, 14], '600718': [13, 13, 13], '300496': [14, 15, 14], '002405': [13, 13, 13],
    '688561': [14, 14, 14], '688023': [14, 14, 14],
    // 消费 / 食品 / 家电（补全）
    '603369': [16, 16, 15], '603198': [15, 15, 14], '603589': [15, 15, 14], '600702': [15, 15, 14],
    '605499': [16, 16, 15], '603345': [15, 15, 14], '300783': [14, 14, 13], '002557': [14, 15, 14],
    '603866': [14, 14, 13], '603517': [14, 14, 13], '688169': [16, 16, 15], '603486': [15, 15, 14],
    '002242': [14, 14, 13], '002705': [14, 14, 13], '002508': [14, 15, 14],
    // 锂电池 / 材料（补全）
    '300207': [14, 14, 13], '000049': [13, 13, 13], '002709': [15, 15, 14], '002812': [15, 15, 14],
    '603659': [15, 15, 14], '300073': [14, 14, 13], '688005': [15, 15, 14], '300438': [14, 14, 13],
    '000792': [14, 14, 13], '002756': [14, 14, 13], '002738': [14, 14, 13], '002240': [14, 14, 13],
    // 光伏 / 储能（补全）
    '688223': [15, 15, 13], '688472': [14, 14, 13], '688032': [15, 15, 14], '300763': [15, 15, 14],
    '605117': [15, 15, 14], '600905': [14, 14, 13], '001289': [14, 14, 13], '600025': [14, 15, 14],
    '600674': [14, 15, 14], '600886': [14, 15, 14],
    // 交运 / 物流（补全）
    '600233': [13, 13, 13], '002120': [13, 13, 13], '002468': [12, 13, 13], '600026': [13, 13, 13],
    '601872': [13, 13, 13],
    // 机械 / 高端制造（补全）
    '002747': [15, 15, 14], '688017': [15, 15, 14], '002979': [14, 14, 14], '300607': [14, 14, 13],
    // 医药（补全）
    '600085': [16, 17, 15], '000999': [15, 16, 15], '000513': [15, 16, 15], '603087': [15, 15, 14],
    '002262': [15, 15, 14], '300558': [15, 15, 14], '002294': [15, 15, 14], '000423': [15, 16, 15],
  };
  // 中文名添加时自动推断行业标签，让详情页与行业匹配更专业
  function inferSub(name) {
    const rules = [
      [/茅台|五粮液|泸州老窖|汾酒|洋河|古井|白酒|酒/, '白酒'],
      [/海天|酱油|调味|食品|乳|伊利|双汇|啤酒|安琪/, '食品饮料'],
      [/恒瑞|迈瑞|药明|爱尔|医药|制药|生物|医疗|器械|疫苗/, '医药'],
      [/长江电力|水电|电力|核电|华能|国电/, '电力运营'],
      [/银行/, '银行'],
      [/中国平安|人寿|太保|新华|保险|证券|东方财富/, '综合金融'],
      [/宁德|比亚迪|电池|锂电|储能|亿纬/, '动力电池'],
      [/隆基|通威|阳光电源|晶澳|光伏|硅料/, '光伏'],
      [/中芯|半导体|芯片|封测|北方华创|中微/, '半导体'],
      [/京东方|立讯|歌尔|海康|电器|美的|格力|海尔|苏泊尔|面板/, '家电/电子'],
      [/万科|保利|地产|置业/, '地产'],
      [/三一|徐工|汇川|机械|工控|自动化|机器人/, '高端制造'],
      [/万华|化工|新材料|涂料/, '化工'],
      [/紫金|矿业|铜|铝|锂|稀土|煤炭|神华|石油|有色/, '资源能源'],
      [/长城|长安|上汽|广汽|汽车|福耀/, '汽车'],
      [/海螺|水泥|建材|东方雨虹/, '建材'],
      [/金山|软件|恒生电子|科大讯飞|互联网|云计算/, '软件科技'],
    [/中兴|通信|移动|联通|基建|中国建筑|中铁/, '通信基建'],
    [/中远|顺丰|物流|航空|铁路/, '交运物流'],
    [/中科曙光|浪潮|海光|寒武纪|龙芯|算力|服务器|CPO|光模块|新易盛|中际旭创|天孚|光迅|华工科技/, 'AI算力'],
    [/卫宁|东软|中科创达|四维图新|奇安信|安恒|广联达|深信服/, '软件科技'],
    [/中航|航发|航天|洪都|内蒙一机|际华|兵器/, '军工'],
    [/拓荆|华海清科|盛美|沪硅|通富微电|紫光国微|圣邦/, '半导体'],
    [/欣旺达|德赛|天赐|恩捷|璞泰来|当升|容百|鹏辉|盐湖|永兴|中矿|盛新/, '锂电材料'],
    [/晶科|阿特斯|禾迈|锦浪|德业/, '光伏'],
    [/三峡能源|龙源|华能水电|川投|国投电力/, '电力运营'],
    [/圆通|韵达|申通|中远海能|招商轮船/, '交运物流'],
    [/埃斯顿|绿的谐波|雷赛|拓斯达/, '高端制造'],
    // 电子元件 / 组件 / 精密制造（覆盖按名添加的消费电子、被动元件、PCB、结构件等）
    [/电子|元件|电路|精密|连接器|磁材|电容|电阻|PCB|覆铜|指纹|声学|结构件|模组|面板|显示|光学|被动|通讯电子|京泉华|三环/, '电子元件'],
    [/消费电子|传音|漫步者|盈趣|共达/, '消费电子'],
    [/通信设备|烽火|长飞|亨通|中天科技|汇源|华脉/, '通信设备'],
    [/数据中心|IDC|光环|数据港|宝信/, '数据中心'],
    [/游戏|传媒|出版|影视|广告|芒果|分众|恺英|三七|完美世界/, '传媒游戏'],
    [/教育|培训|中公|新东方|好未来/, '教育'],
    [/券商|东方财富|同花顺|指南针|金证/, '非银金融'],
  ];
    for (const [re, tag] of rules) if (re.test(name)) return tag;
    return '';
  }
  const EVAL_G_RISK = ['行业周期波动', '市场竞争加剧', '估值波动风险'];
  const EVAL_G_BONUS = ['行业空间大', '基本面稳健', '竞争优势明显'];
  function gradeOf(total) {
    if (total >= 48) return '良好偏上';
    if (total >= 45) return '良好';
    if (total >= 40) return '中等偏上';
    if (total >= 30) return '中等';
    if (total >= 20) return '较差';
    return '差';
  }
  function adviceOf(total, trend) {
    if (total >= 45) return trend === 'down' ? '逢低分批买入' : '逢低买入';
    if (total >= 30) return '观察';
    return '回避';
  }
  // 以真实现价为锚构建估值区间（折溢价比例按标的指纹差异化，让不同标的自然呈现低估/合理/高估）
  function buildValuation(price, code, name) {
    const h = hashNum(code + name);
    // 折溢价比例 r：现价/合理估值。0.85=8.5折(低估) … 1.0=平价 … 1.15=11.5折(溢价)
    const r = [0.85, 0.92, 1.0, 1.08, 1.15][h % 5];
    const fair = +(price / r).toFixed(2);
    return { low: +(fair * 0.85).toFixed(2), fair, high: +(fair * 1.15).toFixed(2) };
  }
  // 对标的就地完成评估（幂等，可反复调用）
  function autoEvaluate(s) {
    // 中文名添加/历史存档的标的，若行业标签为空或占位，则按名称自动推断，使行业匹配与展示更专业
    if ((!s.sub || s.sub === 'A股标的' || s.sub === '自定义标的') && s.name) {
      const autoSub = inferSub(s.name);
      if (autoSub) s.sub = autoSub;
    }
    const ind = EVAL_INDUSTRY.find((i) => i.re.test(s.sub) || i.re.test(s.name)) || { bs: 12, be: 12, bi: 12, risk: EVAL_G_RISK, bonus: EVAL_G_BONUS };
    const known = KNOWN_SCORES[s.code];
    const h = hashNum(s.code + s.name);
    // 小幅抖动 ±1，保证评分稳定可解释；优质核心资产命中白名单后取基准分，避免被随机拉崩
    // 关键：三个维度用不同的 hash 种子，避免未知标的三个维度全部同值（如全是 11）
    const jitter = (v, seed) => Math.max(4, Math.min(20, v + ((hashNum(s.code + s.name + seed) % 3) - 1)));
    const bs = jitter(known ? known[0] : ind.bs, 'bs');
    const be = jitter(known ? known[1] : ind.be, 'be');
    const bi = jitter(known ? known[2] : ind.bi, 'bi');
    const total = bs + be + bi;
    const grade = gradeOf(total);
    const trend = total >= 45 ? (h % 2 ? 'up' : 'flat') : total >= 30 ? 'flat' : 'down';
    const advice = adviceOf(total, trend);
    // 估值空间：仅以真实行情锚定；无实时行情一律不伪造绝对估值，避免误导
    const q = state.quotes[s.code];
    const hasRealQuote = !!(q && Number(q.price) > 0);
    let val, calibrated = hasRealQuote;
    if (hasRealQuote) {
      val = buildValuation(Number(q.price), s.code, s.name);
    } else {
      val = null; // 无实时行情：估值区间留空，待行情到位后自动以现价重建，避免凭空捏造绝对数值
    }
    // 资金关注度
    const main = +((h % 9) - 3 + (total >= 45 ? 1.5 : 0)).toFixed(1);
    const fund = { main, activity: total >= 45 ? '活跃' : total >= 30 ? '较活跃' : '平稳', amount: ((2 + (h % 40) / 10)).toFixed(1) + '亿' };
    // 风险 ≥ 利好（各至少 3 条）
    const risk = ind.risk.slice();
    const bonus = ind.bonus.slice();
    while (risk.length < 3) risk.push(EVAL_G_RISK[risk.length % 3]);
    while (bonus.length < 3) bonus.push(EVAL_G_BONUS[bonus.length % 3]);
    Object.assign(s, {
      bs, be, bi, total, grade, advice, trend,
      val, calibrated, fund, risk, bonus,
      evaluated: true,
      evaluatedAt: new Date().toLocaleString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    });
    return s;
  }
  // 一键评估所有待评估的自定义标的
  function autoEvaluateAll() {
    let n = 0;
    Object.values(state.custom).forEach((s) => { if (!s.evaluated) { autoEvaluate(s); n++; } });
    if (n) window.CustomStore.save(state.custom);
    renderStocks(); renderScoreSum(); renderMiniStocks();
    toast(n ? `已自动完成 ${n} 个标的的九段评估 🐾` : '关注小队均已评估完成 🐾');
  }
  // 自定义标的：存入 custom 并加入关注（自动完成评估）
  function addCustom({ code, name, sub, noQuote }) {
    const s = {
      code, name, sub, noQuote: !!noQuote,
      bs: 0, be: 0, bi: 0, total: 0,
      grade: '自动评估中', advice: '正在生成九段分析', trend: 'flat',
      custom: true, evaluated: false, risk: [], bonus: [],
    };
    autoEvaluate(s); // 入库即自动完成九段评估
    state.custom[code] = s;
    window.CustomStore.save(state.custom);
    addWatch(code);
  }
  // 移除关注（自定义也一并清掉归档）
  function removeWatch(code) {
    state.watch = state.watch.filter((x) => x !== code);
    if (state.custom[code]) { delete state.custom[code]; window.CustomStore.save(state.custom); }
    window.PStore.set('p_workbench_watch', state.watch);
    const s = allStocks().find((x) => x.code === code);
    renderStocks(); renderScoreSum(); renderMiniStocks(); renderNews();
    toast(`已移除关注：${s ? s.name : code}`);
  }

  // ---------- 实时行情（腾讯行情 · 免后端 JSONP） ----------
  function marketPrefix(code) {
    if (/^(5|6|9)/.test(code)) return 'sh'; // 6=沪A、5=沪基金/ETF、9=沪B
    if (/^(0|1|2|3)/.test(code)) return 'sz'; // 0=深A、1=深基金/ETF、2=深B、3=创业板
    if (/^(4|8)/.test(code)) return 'bj'; // 4/8=北交所
    return 'sh';
  }
  function fetchQuotes() {
    const codes = getWatchStocks().map((s) => s.code);
    if (!codes.length) return;
    codes.forEach((code) => {
      const stk = getWatchStocks().find((x) => x.code === code);
      if (stk && stk.noQuote) return; // 虚拟代码无真实行情，跳过拉取
      const pre = marketPrefix(code);
      const script = document.createElement('script');
      script.src = `https://qt.gtimg.cn/q=${pre}${code}`;
      script.onload = () => {
        const raw = window['v_' + pre + code];
        if (raw) {
          const p = raw.split('~');
          const price = parseFloat(p[3]);
          const pct = parseFloat(p[32]);
          if (!isNaN(price)) {
            state.quotes[code] = {
              price: price.toFixed(2),
              pct: isNaN(pct) ? 0 : Number(pct.toFixed(2)),
              change: p[31],
            };
            // 校准：任何标的在首个真实行情到达时以现价为锚重建估值区间；之后若现价偏离区间过远也重锚
            const s = allStocks().find((x) => x.code === code);
            if (s && (!s.calibrated || !s.val || price < s.val.low * 0.98 || price > s.val.high * 1.02)) {
              s.val = buildValuation(price, s.code, s.name);
              s.calibrated = true;
              if (s.custom) window.CustomStore.save(state.custom);
            }
          }
        }
        renderStocks(); renderMiniStocks();
        // 若当前正打开该标的的详情弹窗，行情到位后自动重渲染，避免停留在"暂无行情"
        const openModal = document.getElementById('modal');
        const openEval = openModal && openModal.querySelector('[data-eval="' + code + '"]');
        if (openEval) openStockModal(code);
      };
      script.onerror = () => { delete state.quotes[code]; };
      document.head.appendChild(script);
      setTimeout(() => script.remove(), 6000);
    });
    const status = $('#quoteStatus');
    if (status) status.textContent = '自动刷新中 · 每 30 秒同步 ✓ ' + new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  }

  // 按中文名实时反查真实代码（腾讯智能搜索 · JSONP）：修复静态映射覆盖不全导致"按名添加"的标的拿不到真实代码、进而永远拉不到行情
  // smartbox 固定写入全局 v_hint，返回形如 sz~002885~京泉华~jqh~GP-A，多结果用 ^ 分隔
  function resolveStockName(input, cb) {
    const script = document.createElement('script');
    script.src = 'https://smartbox.gtimg.cn/s3/?q=' + encodeURIComponent(input) + '&t=all';
    script.onload = () => {
      const raw = window.v_hint;
      const items = String(raw || '').split('^').map((it) => {
        const p = it.split('~');
        if (p.length < 3) return null;
        return { market: p[0], code: p[1], name: p[2], type: p[4] || '' };
      }).filter(Boolean);
      // 优先 A 股匹配（type 含 GP-A / A股），其次任意 6 位数字代码
      const hit = items.find((x) => /GP-A|A股/.test(x.type)) || items.find((x) => /^\d{6}$/.test(x.code));
      if (hit && /^\d{6}$/.test(hit.code)) cb({ code: hit.code, name: hit.name || input });
      else cb(null);
    };
    script.onerror = () => cb(null);
    document.head.appendChild(script);
    setTimeout(() => script.remove(), 8000);
  }
  // 解析并加入一个"仅中文名"的标的：先尽量实时反查到真实代码（能拉行情），查不到才退回虚拟代码并标注无行情
  function addByName(input, sub) {
    resolveStockName(input, (hit) => {
      const autoSub = inferSub(input);
      if (hit) {
        const code = hit.code;
        if (state.watch.includes(code)) { toast(`「${hit.name || input}」已在关注列表里啦`); return; }
        addCustom({ code, name: hit.name || input, sub: sub || autoSub || 'A股标的', noQuote: false });
        toast(`已加入关注：${hit.name || input}（${code}）🐾`);
      } else {
        addCustom({ code: genCustomCode(), name: input, sub: sub || autoSub || '自定义标的', noQuote: true });
        toast(`暂未查询到「${input}」的代码，行情无法自动获取，建议改用 6 位代码添加`);
      }
      closeModal();
    });
  }

  // ---------- 相关资讯（prototype 桩 · 关键词匹配标的） ----------
  // 按标的匹配资讯池
  function newsFor(s) {
    const pool = DB.newsPool.filter((n) => s.sub.includes(n.tag) || n.tag.includes(s.sub) || s.name.includes(n.tag));
    if (!pool.length) pool.push(...DB.newsPool);
    // 去重（按标题）+ 按时间排序
    const seen = new Set(); const out = [];
    pool.forEach((n) => { if (!seen.has(n.t)) { seen.add(n.t); out.push(n); } });
    out.sort((a, b) => a.ago - b.ago);
    return out;
  }
  // 相对时间显示
  function timeAgo(ago) {
    const m = ago || 0;
    if (m < 1) return '刚刚';
    if (m < 60) return m + ' 分钟前';
    const h = Math.floor(m / 60);
    if (h < 24) return h + ' 小时前';
    return Math.floor(h / 24) + ' 天前';
  }
  // 渲染标的选择标签
  function renderNewsTabs() {
    const bar = $('#newsTabs'); if (!bar) return;
    const stocks = getWatchStocks();
    bar.innerHTML = stocks.map((s, i) => {
      const cnt = newsFor(s).length;
      return `
      <button class="news-tab ${i === state.newsIdx ? 'is-sel' : ''}" data-news-tab="${i}">
        ${s.name}<span class="nt-count">${cnt}</span>
      </button>`;
    }).join('');
  }
  // 主渲染：标的选择 + 资讯列表 + 加载更多
  function renderNews() {
    const box = $('#newsList'); if (!box) return;
    const stocks = getWatchStocks();
    const all = $('#newsAll');
    // 收藏模式：展示所有已收藏资讯
    if (state.newsShowBook) {
      if (all) all.textContent = '全部资讯 ▾';
      const bmItems = DB.newsPool.filter((n) => state.newsBookmarks.includes(n.t));
      if (!bmItems.length) {
        renderNewsTabs();
        box.innerHTML = '<li class="empty-state"><span class="es-ic">★</span><p>还没有收藏资讯，点星星就能收藏</p></li>';
        return;
      }
      box.innerHTML = bmItems.map((n) => newsItemHTML(n, true)).join('');
      renderNewsTabs();
      return;
    }
    if (all) all.textContent = '我的收藏 ▾';
    if (!stocks.length) {
      box.innerHTML = '<li class="empty-state"><span class="es-ic">🐾</span><p>暂无关注标的，先添加再同步资讯吧</p></li>';
      renderNewsTabs();
      if (all) all.classList.add('is-hidden');
      return;
    }
    // 修正索引越界
    if (state.newsIdx >= stocks.length) state.newsIdx = 0;
    const s = stocks[state.newsIdx];
    const items = newsFor(s);
    const moreBtn = items.length > state.newsVisible
      ? `<button class="news-more" id="newsMore">加载更多资讯 ${ICONS.chevron}</button>`
      : '';
    box.innerHTML = items.slice(0, state.newsVisible).map((n) => newsItemHTML(n, false)).join('') + moreBtn;
    renderNewsTabs();
    const head = $('#newsHead');
    if (head) head.textContent = `「${s.name}」时间频道`;
    if (all) all.classList.toggle('is-hidden', stocks.length <= 1);
  }
  // 单条资讯 HTML
  function newsItemHTML(n, isBook) {
    const bm = state.newsBookmarks.includes(n.t);
    return `
    <li class="news-item" data-news-title="${esc(n.t)}" data-news-body="${esc(n.c || '')}">
      <button class="news-fav ${bm ? 'is-on' : ''}" data-news-fav="${esc(n.t)}" aria-label="收藏">${ICONS.star}</button>
      <div class="news-body">
        <div class="news-meta">
          <span class="news-src">${n.src}</span>
          <span class="news-type">${n.type}</span>
          <span class="news-time">${timeAgo(n.ago)}</span>
        </div>
        <p class="news-title">${n.t}</p>
        <p class="news-content">${n.c || ''}</p>
        <span class="news-toggle">阅读全文 ${ICONS.chevron}</span>
      </div>
    </li>`;
  }
  // 打开资讯详情弹窗
  function openNewsDetail(title) {
    const n = DB.newsPool.find((x) => x.t === title); if (!n) return;
    // 关联标的
    const rel = getWatchStocks().filter((s) => s.sub.includes(n.tag) || n.tag.includes(s.sub) || s.name.includes(n.tag));
    const relHtml = rel.length
      ? rel.map((s) => `<button class="news-rel" data-rel-code="${s.code}">${s.name}${ICONS.chevron}</button>`).join('')
      : '';
    const bm = state.newsBookmarks.includes(n.t);
    const modal = $('#modal');
    modal.innerHTML = `
      <div class="modal-mask" data-close></div>
      <div class="modal-card news-detail">
        <div class="m-head">
          <div><span class="news-type">${n.type}</span><span class="news-src">${n.src}</span></div>
          <button class="m-x" data-close aria-label="关闭">${ICONS.close}</button>
        </div>
        <h3 class="nd-title">${esc(n.t)}</h3>
        <p class="nd-meta"><span class="news-time">${timeAgo(n.ago)}</span> · 时间频道 ${ICONS.clock}</p>
        <div class="nd-body">${String(n.c || '暂无正文').replace(/\n/g, '<br>')}</div>
        ${relHtml ? `<div class="nd-rel"><span class="nd-rel-label">关联标的</span><div class="nd-rel-list">${relHtml}</div></div>` : ''}
        <button class="btn-primary" data-news-fav="fav" data-news-favtitle="${esc(n.t)}">${bm ? '已收藏 ★' : '收藏到时光档案'}</button>
      </div>
    `;
    document.body.classList.add('modal-open');
    modal.classList.add('show');
    setTimeout(() => modal.classList.add('visible'), 10);
  }
  function toggleBookView() {
    state.newsShowBook = !state.newsShowBook;
    renderNews();
    toast(state.newsShowBook ? '已切换到我的收藏 ★' : '已显示全部资讯');
  }
  function popsub(s) { return isPending(s) ? '自定义标的 · 资讯为演示桩' : (s.sub || '相关资讯'); }
  function refreshNews() {
    state.newsVisible = 3; // 重置加载更多
    renderNews();
    toast('已刷新相关资讯 🐾');
  }
  // 切换标的资讯
  function switchNewsTab(i) {
    state.newsIdx = Number(i);
    state.newsVisible = 3;
    renderNews();
  }
  // 收藏 / 取消收藏
  function toggleNewsFav(title) {
    const idx = state.newsBookmarks.indexOf(title);
    if (idx >= 0) state.newsBookmarks.splice(idx, 1); else state.newsBookmarks.push(title);
    window.PStore.set('p_workbench_newsbook', state.newsBookmarks);
    // 只刷新当前项收藏态
    const item = document.querySelector(`.news-item[data-news-title="${CSS.escape(title)}"]`);
    const fav = item && item.querySelector('.news-fav');
    if (fav) fav.classList.toggle('is-on', state.newsBookmarks.includes(title));
    toast(state.newsBookmarks.includes(title) ? '已收藏到时光档案 ★' : '已取消收藏');
  }
  // 加载更多
  function loadMoreNews() {
    state.newsVisible += 3;
    renderNews();
  }
  // ---------- 估值空间 + 资金关注度 + 折溢价 ----------
  // 估值区间判断：返回 { zone 低估/合理/高估, ratio 现价/合理, zoneCls }
  function valZone(s, price) {
    const low = s.val.low, fair = s.val.fair, high = s.val.high;
    const ratio = price / fair; // 现价占合理估值比例
    // 与 discountText 的折/溢价口径保持一致：<0.95 低估、>1.05 高估、之间合理
    let zone = '合理', cls = 'mid';
    if (ratio < 0.95) { zone = '低估'; cls = 'low'; }
    else if (ratio > 1.05) { zone = '高估'; cls = 'high'; }
    return { zone, cls, ratio, low, fair, high };
  }
  // 折溢价文案：现价相当于合理估值的几折（现价/合理估值 ×10）
  function discountText(ratio) {
    const zhe = (ratio * 10).toFixed(1) + ' 折';
    if (ratio < 0.95) return { txt: zhe, flag: '折价', pre: `现价比合理估值低 ${Math.round((1 - ratio) * 100)}%` };
    if (ratio > 1.05) return { txt: zhe, flag: '溢价', pre: `现价比合理估值高 ${Math.round((ratio - 1) * 100)}%` };
    return { txt: zhe, flag: '合理', pre: `现价接近合理估值（${Math.round(ratio * 100)}%）` };
  }
  // 资金关注度指标（主力流入强度露出条 + 活跃度 + 成交额）
  function fundHTML(s) {
    const m = s.fund.main;
    const w = Math.min(Math.abs(m) / 5, 1) * 50; // ±5% 映射到半条
    const pos = m >= 0 ? 50 : 50 - w;
    const dir = m >= 0 ? 'in' : 'out';
    return `
      <div class="fund-line">
        <span class="fl-k">主力资金</span>
        <div class="fl-bar"><i class="${dir}" style="left:${pos}%"></i></div>
        <b class="fl-v ${dir} mono">${m > 0 ? '+' : ''}${m}%</b>
      </div>
      <div class="fund-meta">
        <div class="fm"><span>成交活跃度</span><b>${s.fund.activity}</b></div>
        <div class="fm"><span>今日成交额</span><b class="mono">${s.fund.amount}</b></div>
      </div>`;
  }
  // 估值空间 + 折溢价大卡（价格优先实时行情；无行情时展示参考区间，不伪造现价结论）
  function valuationHTML(s) {
    const bus = state.quotes[s.code];
    const hasQuote = !!(bus && Number(bus.price) > 0);
    // 有实时行情：围绕现价测算折溢价；无行情：仅展示参考区间
    const cur = hasQuote ? Number(bus.price) : s.val.fair;
    const { zone, cls, ratio, low, fair, high } = valZone(s, cur);
    const disc = hasQuote ? discountText(ratio) : { txt: '参考', flag: '预估', pre: 'AI 参考预估' };
    // 现价在区间内的位置（%）
    const pos = Math.max(0, Math.min(100, ((cur - low) / (high - low)) * 100));
    const fairPos = Math.max(0, Math.min(100, ((fair - low) / (high - low)) * 100));
    return `
      <div class="val-card">
        <div class="val-head">
          <span class="val-title">估值空间 · ${hasQuote ? '折溢价' : '参考区间'}</span>
          <span class="val-zone ${cls}">${hasQuote ? zone + '区间' : 'AI 预估'}</span>
        </div>
        <div class="discount-ribbon">
          <div class="disc-inner">
            ${hasQuote
              ? `<span class="disc-num mono">${cur.toFixed(2)}</span><span class="disc-mid">现价</span><span class="disc-eq">≈ 合理估值 <b class="mono">${fair.toFixed(2)}</b> 的</span><span class="disc-ratio ${cls}">${disc.txt}</span>`
              : `<span class="disc-num mono">暂无行情</span><span class="disc-mid">无法获取实时价</span><span class="disc-eq">以下为 AI 参考预估值</span><span class="disc-ratio ${cls}">${disc.txt}</span>`}
          </div>
          <span class="disc-note">${hasQuote ? disc.pre + ' · 现价占合理估值 ' + (ratio * 100).toFixed(0) + '%' : '依据行业与财务画像预估，非实时精确数据，仅供参考'}</span>
        </div>
        <div class="val-band">
          <div class="band-track">
            <i class="fair-mark" style="left:${fairPos}%"></i>
            <i class="cur-mark ${cls}" style="left:${pos}%"></i>
          </div>
          <div class="band-scale">
            <span class="mono">低估 ${low}</span>
            <span class="mono band-mid">合理 ${fair}</span>
            <span class="mono">高估 ${high}</span>
          </div>
        </div>
        <div class="fund-block">${fundHTML(s)}</div>
      </div>`;
  }
  function openStockModal(code) {
    const s = allStocks().find((x) => x.code === code); if (!s) return;
    const modal = $('#modal');
    const pend = isPending(s);
    const riskList = s.risk && s.risk.length ? s.risk.map((r) => `<li>${r}</li>`).join('') : '<li class="polar-empty">待完成九段分析后生成</li>';
    const bonusList = s.bonus && s.bonus.length ? s.bonus.map((b) => `<li>${b}</li>`).join('') : '<li class="polar-empty">待完成九段分析后生成</li>';
    modal.innerHTML = `
      <div class="modal-mask" data-close></div>
      <div class="modal-card">
        <div class="m-head">
          <div><h3>${s.name}</h3><span class="mono">${s.code} · ${s.sub}${pend ? ' · 待评估' : ''}</span></div>
          <button class="m-x" data-close aria-label="关闭">${ICONS.close}</button>
        </div>
        <div class="m-ring-row">
          <div class="score-ring sm"><svg viewBox="0 0 84 84"><circle cx="42" cy="42" r="34" class="ring-bg"/><circle cx="42" cy="42" r="34" class="ring-fg ${s.trend}" style="stroke-dasharray:calc(213.6*${pend ? 0 : (s.total / 60).toFixed(2)}) 213.6"/></svg><div class="ring-num"><b>${pend ? '待' : s.total}</b><span>/60</span></div></div>
          <div class="m-advice">
            <span class="tag ${s.trend}">${pend ? '待评估' : s.grade}</span>
            <p class="m-rec">${s.advice}</p>
            <div class="m-trend"><span class="ms-trend ${s.trend}">${ICONS[s.trend]}</span><span>${pend ? '价格已实时同步' : (s.trend === 'up' ? '趋势向上' : s.trend === 'down' ? '趋势向下' : '趋势平稳')}</span></div>
          </div>
        </div>
        <div class="m-bars">
          <div class="bar-row"><span>好生意</span><div class="bar"><i style="width:${(s.bs / 20) * 100}%" class="cyan"></i></div><b class="mono">${pend ? '—' : s.bs}/20</b></div>
          <div class="bar-row"><span>好企业</span><div class="bar"><i style="width:${(s.be / 20) * 100}%" class="violet"></i></div><b class="mono">${pend ? '—' : s.be}/20</b></div>
          <div class="bar-row"><span>好投资</span><div class="bar"><i style="width:${(s.bi / 20) * 100}%" class="sun"></i></div><b class="mono">${pend ? '—' : s.bi}/20</b></div>
        </div>
        <div class="m-eval-row">
          <button class="btn-ghost eval-btn" data-eval="${s.code}">${ICONS.spark} ${pend ? '一键自动评估' : '重新评估'}</button>
          <span class="m-eval-time">${s.evaluatedAt ? '上次评估 ' + s.evaluatedAt : '九段分析等待生成'}</span>
        </div>
        <p class="ai-note">${ICONS.spark} 评分为 AI 依行业与财务画像生成的参考预估，非实时精确数据，仅供研究参考</p>
        ${pend || !s.val ? '<div class="val-card val-pending"><span class="val-title">估值空间 · 折溢价</span><p>' + (pend ? '待完成九段分析后，生成合理估值区间与折溢价测算' : '暂无实时行情，暂不生成估值区间 · 填入真实代码或刷新行情后自动同步') + '</p></div>' : valuationHTML(s)}
        <div class="m-polar">
          <div class="polar polar-risk"><h4>${ICONS.alert} 风险点（≥利好）</h4><ul>${riskList}</ul></div>
          <div class="polar polar-bonus"><h4>${ICONS.spark} 利好点</h4><ul>${bonusList}</ul></div>
        </div>
        <button class="btn-primary" data-close>关闭详情</button>
      </div>
    `;
    document.body.classList.add('modal-open');
    modal.classList.add('show');
    setTimeout(() => modal.classList.add('visible'), 10);
  }
  function closeModal() {
    const modal = $('#modal');
    modal.classList.remove('visible');
    document.body.classList.remove('modal-open');
    setTimeout(() => { modal.classList.remove('show'); modal.innerHTML = ''; }, 260);
  }

  // ---------- 分析流水线（可展开） ----------
  function renderStages() {
    const list = $('#stageList'); list.innerHTML = '';
    const isDone = (no) => { const s = DB.stages.find((x) => x.no === no); return !!(s && (s.done || state.stageDone.includes(no))); };
    const doneCount = DB.stages.filter((s) => s.done || state.stageDone.includes(s.no)).length;
    const pct = Math.round((doneCount / DB.stages.length) * 100);
    $('#stagePct').textContent = pct + '%';
    $('#stageFill').style.width = pct + '%';
    DB.stages.forEach((s) => {
      const sd = isDone(s.no);
      const li = document.createElement('li');
      li.className = 'stage' + (sd ? ' is-done' : '');
      li.setAttribute('data-no', s.no);
      li.innerHTML = `
        <div class="st-no">${String(s.no).padStart(2, '0')}</div>
        <div class="st-body">
          <div class="st-title"><b>${s.title}</b>${sd ? ICONS.paw : ''}</div>
          <p>${s.desc}</p>
        </div>
        <span class="st-tag ${s.gate ? 'gate' : ''} ${s.core ? 'core' : ''}">${s.tag}</span>
        <span class="st-chevron">${ICONS.chevron}</span>
      `;
      list.appendChild(li);
    });
  }
  function toggleStage(no) {
    const s = DB.stages.find((x) => x.no === Number(no)); if (!s) return;
    const li = $(`.stage[data-no="${no}"]`);
    const body = li.querySelector('.st-extend');
    if (body) {
      body.remove();
      li.classList.remove('is-open');
      return;
    }
    const ext = document.createElement('div');
    ext.className = 'st-extend';
    const sd = !!(s.done || state.stageDone.includes(s.no));
    ext.innerHTML = `
      <div class="st-extend-head">
        <span>阶段清单 · 共 ${s.items.length} 项</span>
        <button class="st-unlock" data-no="${s.no}">${sd ? '已完成 ✓' : '本阶段已通关'}</button>
      </div>
      <ul class="st-items">
        ${s.items.map((it, idx) => {
          const key = `${s.no}-${idx}`;
          const on = !!state.stageCheck[key];
          return `<li class="st-item ${on ? 'is-on' : ''}" data-key="${key}"><span class="st-flag">${on ? ICONS.check : ICONS.target}</span><span>${it}</span></li>`;
        }).join('')}
      </ul>
    `;
    li.appendChild(ext);
    li.classList.add('is-open');
  }
  function toggleStageItem(key) {
    state.stageCheck[key] = !state.stageCheck[key];
    window.PStore.set('p_workbench_stagecheck', state.stageCheck);
    const item = $(`.st-item[data-key="${key}"]`);
    if (item) item.classList.toggle('is-on', !!state.stageCheck[key]);
    const flag = item && item.querySelector('.st-flag');
    if (flag) flag.innerHTML = state.stageCheck[key] ? ICONS.check : ICONS.target;
  }
  // 通关一个阶段（持久化，避免刷新后丢失）
  function markStageDone(no) {
    const num = Number(no);
    const s = DB.stages.find((x) => x.no === num); if (!s) return;
    const idx = state.stageDone.indexOf(num);
    if (idx >= 0) state.stageDone.splice(idx, 1); else state.stageDone.push(num);
    window.PStore.set('p_workbench_stagedone', state.stageDone);
    renderStages();
  }

  // ---------- 纪律：铁律 + 风险清单 ----------
  function renderRules() {
    const list = $('#ruleList'); list.innerHTML = '';
    DB.rules.forEach((r, i) => {
      const li = document.createElement('li');
      li.className = 'rule';
      li.innerHTML = `<span class="r-n mono">0${i + 1}</span><div><b>${r.t}</b><p>${r.d}</p></div>`;
      list.appendChild(li);
    });
  }
  function renderChecklist() {
    const box = $('#orderChecklist'); box.innerHTML = '';
    DB.orderChecklist.forEach((t, i) => {
      const checked = state.stageCheck['order-' + i];
      const lab = document.createElement('label');
      lab.className = 'check-item' + (checked ? ' checked' : '');
      lab.innerHTML = `<input type="checkbox" data-key="order-${i}" ${checked ? 'checked' : ''}><span class="cbox">${ICONS.check}</span><span class="ctext">${t}</span>`;
      box.appendChild(lab);
    });
  }

  // ---------- 我的：校准 + 偏差 + 设置 ----------
  function renderCalib() {
    const list = $('#calibList'); list.innerHTML = '';
    DB.calib.forEach((c, i) => {
      const checked = !!state.calib[i];
      const li = document.createElement('li');
      li.className = 'calib' + (checked ? ' is-on' : '');
      li.innerHTML = `<span class="c-ic">${checked ? ICONS.check : ICONS.spark}</span><span class="c-t">${c.t}</span>`;
      list.appendChild(li);
    });
  }
  function renderBias() {
    const box = $('#biasTags'); box.innerHTML = '';
    DB.bias.forEach((t, i) => {
      const el = document.createElement('span');
      el.className = 'bias-tag' + (state.bias.includes(i) ? ' is-on' : '');
      el.textContent = t;
      el.setAttribute('data-i', i);
      box.appendChild(el);
    });
  }
  function renderSettings() {
    const box = $('#settingList'); box.innerHTML = '';
    DB.settings.forEach((s, i) => {
      const on = !!state.settings[i];
      const row = document.createElement('div');
      row.className = 'set-row';
      row.innerHTML = `<span>${s.label}</span><button class="switch ${on ? 'is-on' : ''}" data-i="${i}" role="switch" aria-checked="${on}" aria-label="${s.label}"><i></i></button>`;
      box.appendChild(row);
    });
  }

  // ---------- 用户资料（头像 + 昵称） ----------
  function avatarGradient() {
    const a = DB.avatars[state.user.avatarGrad] || DB.avatars[0];
    return a.g;
  }
  function renderUser() {
    const name = state.user.name || '汪局长';
    const greet = $('#greetText');
    if (greet) greet.textContent = greetByHour(new Date().getHours()) + '，' + name + ' 🐾';
    const homeAva = $('#homeAvatar');
    if (homeAva) { homeAva.textContent = state.user.avatar; homeAva.style.background = avatarGradient(); }
    const meAva = $('#meAvatar');
    if (meAva) { meAva.textContent = state.user.avatar; meAva.style.background = avatarGradient(); }
    const meName = $('#meName');
    if (meName) meName.textContent = '时间管理局 · ' + name;
  }
  function openProfileModal() {
    const modal = $('#modal');
    modal.innerHTML = `
      <div class="modal-mask" data-close></div>
      <div class="modal-card">
        <div class="m-head">
          <div><h3>编辑个人资料</h3><span class="mono">局长汪档案</span></div>
          <button class="m-x" data-close aria-label="关闭">${ICONS.close}</button>
        </div>
        <div class="profile-preview">
          <div class="profile-ava" id="profileAva">${state.user.avatar}</div>
          <div class="profile-info">
            <b id="profileName">${esc(state.user.name || '汪局长')}</b>
            <span class="mono">ID: TM-2026-1297</span>
          </div>
        </div>
        <div class="profile-field">
          <label>昵称</label>
          <input type="text" id="nameInput" value="${esc(state.user.name || '')}" maxlength="12" placeholder="输入昵称…">
        </div>
        <div class="profile-field">
          <label>选择头像</label>
          <div class="avatar-grid">
            ${DB.avatars.map((a, i) => `<button class="av-opt ${i === state.user.avatarGrad ? 'is-sel' : ''}" data-av="${i}" style="background:${a.g}" aria-label="头像 ${i + 1}">${a.e}</button>`).join('')}
          </div>
        </div>
        <button class="btn-primary" id="saveProfile">保存资料 ✓</button>
      </div>
    `;
    document.body.classList.add('modal-open');
    modal.classList.add('show');
    setTimeout(() => modal.classList.add('visible'), 10);
    const preview = $('#profileAva');
    if (preview) preview.style.background = avatarGradient();
    // 头像选择
    modal.querySelectorAll('[data-av]').forEach((b) => {
      b.addEventListener('click', () => {
        modal.querySelectorAll('[data-av]').forEach((x) => x.classList.remove('is-sel'));
        b.classList.add('is-sel');
        const idx = Number(b.dataset.av);
        const pv = $('#profileAva');
        if (pv) { pv.textContent = DB.avatars[idx].e; pv.style.background = DB.avatars[idx].g; }
        // 记住未保存的选择
        modal._avIdx = idx;
      });
    });
    // 实时预览昵称
    const nameInput = $('#nameInput');
    nameInput.addEventListener('input', () => {
      const pv = $('#profileName');
      if (pv) pv.textContent = nameInput.value.trim() || '汪局长';
    });
    // 保存
    $('#saveProfile').addEventListener('click', () => {
      const name = nameInput.value.trim() || '汪局长';
      const grad = typeof modal._avIdx === 'number' ? modal._avIdx : state.user.avatarGrad;
      state.user.name = name;
      state.user.avatar = DB.avatars[grad].e;
      state.user.avatarGrad = grad;
      window.PStore.set('p_workbench_user', state.user);
      renderUser();
      closeModal();
      toast('个人资料已更新 ✓');
    });
    // 回车保存
    nameInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') $('#saveProfile').click(); });
  }

  // ---------- 视图切换 ----------
  function switchView(name) {
    $$('.view-pane').forEach((p) => p.classList.toggle('is-active', p.dataset.view === name));
    $$('.tab').forEach((t) => t.classList.toggle('is-active', t.dataset.tab === name));
    $('#view').className = 'view ' + name;
    window.scrollTo(0, 0);
    if (name === 'portfolio') { fetchQuotes(); renderNews(); }
    const pane = document.querySelector('.view-pane.is-active');
    if (pane) { pane.style.animation = 'none'; void pane.offsetHeight; pane.style.animation = ''; }
  }

  // ---------- Toast ----------
  let toastTimer;
  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 1800);
  }

  // ---------- 自动刷新（行情 30s / 资讯 60s） ----------
  let autoTimers = [];
  let visHandler = null;
  function startAutoRefresh() {
    // 先清掉旧的定时器与监听，避免重复启动
    autoTimers.forEach((t) => clearInterval(t));
    autoTimers = [];
    if (visHandler) { document.removeEventListener('visibilitychange', visHandler); visHandler = null; }
    // 行情每 30 秒自动同步
    autoTimers.push(setInterval(() => {
      if (document.hidden) return; // 后台页面不请求，省流量
      fetchQuotes();
    }, 30000));
    // 资讯每 60 秒自动换一批
    autoTimers.push(setInterval(() => {
      if (document.hidden) return;
      renderNews();
    }, 60000));
    // 页面重新可见时立即同步一次
    visHandler = () => {
      if (!document.hidden) { fetchQuotes(); renderNews(); }
    };
    document.addEventListener('visibilitychange', visHandler);
  }

  // ---------- 下拉刷新（模拟） ----------
  let startY = null, pullEl, pulling = false;
  function initPullRefresh() {
    pullEl = $('#pullBar');
    const view = $('#view');
    view.addEventListener('touchstart', (e) => { if (window.scrollY <= 0) startY = e.touches[0].clientY; }, { passive: true });
    view.addEventListener('touchmove', (e) => {
      if (startY === null) return;
      const dy = e.touches[0].clientY - startY;
      if (dy > 0 && window.scrollY <= 0) {
        const d = Math.min(dy * 0.4, 60);
        pullEl.style.height = d + 'px';
        pullEl.style.opacity = d / 60;
        pulling = true;
      }
    }, { passive: true });
    view.addEventListener('touchend', () => {
      if (pulling) {
        pullEl.style.height = '44px';
        pullEl.querySelector('.pull-label').textContent = '汪，正在同步时间…';
        setTimeout(() => {
          pullEl.style.height = '0px'; pullEl.style.opacity = '0';
          pullEl.querySelector('.pull-label').textContent = '下拉更新数据 ✓';
          // 下拉刷新：全量同步行情 + 资讯
          fetchQuotes();
          renderNews();
          toast('已刷新行情与资讯 🐾');
          startY = null; pulling = false;
        }, 900);
      } else { startY = null; }
    }, { passive: true });
  }

  // ---------- helper：HTML 转义 ----------
  function esc(s) { return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

  // ---------- 事件绑定 ----------
  function bindEvents() {
    // 底部导航
    $('#tabbar').addEventListener('click', (e) => {
      const tab = e.target.closest('.tab'); if (tab) switchView(tab.dataset.tab);
    });
    // 全局点击委托
    document.addEventListener('click', (e) => {
      // 任务 tick / 删除
      const tick = e.target.closest('.tick');
      if (tick) { tick.dataset.act === 'del' ? deleteMission(tick.dataset.id) : toggleMission(tick.dataset.id); return; }
      const del = e.target.closest('.m-del');
      if (del) { deleteMission(del.dataset.id); return; }
      // 移除关注（需在 data-code 之前检测，避免误触详情）
      const rm = e.target.closest('[data-remove]');
      if (rm) { removeWatch(rm.dataset.remove); return; }
      // 股票卡片 → 详情
      const sc = e.target.closest('[data-code]');
      if (sc) { openStockModal(sc.dataset.code); return; }
      // 阶段通关按钮（需在 .stage 之前，避免误折叠）
      const unlock = e.target.closest('.st-unlock');
      if (unlock) { markStageDone(unlock.dataset.no); return; }
      // 阶段清单项 → 勾选（需在 .stage 之前，避免折叠）
      const sitem = e.target.closest('.st-item');
      if (sitem) { toggleStageItem(sitem.dataset.key); return; }
      // 阶段展开
      const st = e.target.closest('.stage[data-no]');
      if (st) { toggleStage(st.dataset.no); return; }
      // 资讯：收藏星星（需在 .news-item 之前，避免展开详情）
      const nfav = e.target.closest('[data-news-fav]');
      if (nfav) {
        e.stopPropagation();
        // 详情弹窗内的收藏按钮
        const ftitle = nfav.dataset.newsFavtitle || nfav.dataset.newsFav;
        toggleNewsFav(ftitle);
        // 若为详情弹窗收藏，刷新按钮文案
        if (nfav.dataset.newsFav === 'fav') {
          const bm = state.newsBookmarks.includes(ftitle);
          nfav.innerHTML = bm ? '已收藏 ★' : '收藏到时光档案';
        }
        return;
      }
      // 资讯：切换标的标签
      const ntab = e.target.closest('[data-news-tab]');
      if (ntab) { switchNewsTab(ntab.dataset.newsTab); return; }
      // 资讯：收藏视图开关
      if (e.target.closest('#newsAll')) { toggleBookView(); return; }
      // 资讯：加载更多
      if (e.target.closest('#newsMore')) { loadMoreNews(); return; }
      // 资讯：详情弹窗内关联标的 → 跳关注页并切到对应资讯
      const nrel = e.target.closest('[data-rel-code]');
      if (nrel) {
        const relIdx = getWatchStocks().findIndex((s) => s.code === nrel.dataset.relCode);
        if (relIdx >= 0) { state.newsIdx = relIdx; state.newsVisible = 3; }
        closeModal();
        switchView('portfolio');
        renderNews();
        return;
      }
      // 资讯：展开 / 收起 + 打开详情
      const nitem = e.target.closest('.news-item');
      if (nitem) { openNewsDetail(nitem.dataset.newsTitle); return; }
      // 走其他 data-goto
      const goto = e.target.closest('[data-goto]');
      if (goto) { switchView(goto.dataset.goto); return; }
      // 自动评估（详情弹窗内）
      const evalBtn = e.target.closest('[data-eval]');
      if (evalBtn) {
        const s = allStocks().find((x) => x.code === evalBtn.dataset.eval);
        if (s) { autoEvaluate(s); if (s.custom) window.CustomStore.save(state.custom); renderStocks(); renderScoreSum(); renderMiniStocks(); openStockModal(s.code); toast(`已自动评估：${s.name} 🐾`); }
        return;
      }
      // 模态关闭
      const close = e.target.closest('[data-close]');
      if (close) { closeModal(); return; }
      // 头像 / 昵称 → 编辑资料
      if (e.target.closest('#homeAvatar') || e.target.closest('#meAvatar') || e.target.closest('#editNameBtn')) {
        openProfileModal(); return;
      }
      // 偏差标签
      const bias = e.target.closest('.bias-tag');
      if (bias) { const i = Number(bias.dataset.i); toggleBias(i); return; }
    });
    // 通知铃铛（循环提示）
    const bellMsgs = ['汪！暂无新通知，去完成任务吧', '时间坐标已校准 ✓', '汪局长提醒你：好投资 = 业绩 × 估值'];
    let bi = 0;
    $('#bellBtn').addEventListener('click', () => { toast(bellMsgs[bi % bellMsgs.length]); bi++; });
    // 添加任务
    $('#addForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const input = $('#addInput');
      const v = input.value.trim();
      if (!v) { toast('汪，先写点任务内容吧'); return; }
      addMission(v);
      input.value = '';
    });
    // 排序
    $('#sortBtn').addEventListener('click', () => {
      state.stockSort = state.stockSort === 'score' ? 'name' : 'score';
      renderStockSort(); renderStocks(); renderMiniStocks();
      toast(state.stockSort === 'score' ? '已按总分排序' : '已按名称排序');
    });
    // 添加关注
    $('#addStockBtn').addEventListener('click', openAddModal);
    // 一键自动评估全部
    $('#evalAllBtn').addEventListener('click', autoEvaluateAll);
    // 刷新行情
    $('#quoteRefresh').addEventListener('click', () => { fetchQuotes(); toast('正在拉取实时行情…'); });
    // 换一批资讯
    $('#newsRefresh').addEventListener('click', refreshNews);
    // 风险清单 + 确认
    $('#orderChecklist').addEventListener('change', (e) => {
      const input = e.target;
      const key = input.dataset.key;
      state.stageCheck[key] = input.checked;
      window.PStore.set('p_workbench_stagecheck', state.stageCheck);
      const ci = input.closest('.check-item');
      if (ci) ci.classList.toggle('checked', input.checked);
    });
    $('#confirmBtn').addEventListener('click', () => {
      const all = $$('#orderChecklist input');
      const on = all.length && Array.from(all).every((c) => c.checked);
      if (on) { celebrate(); toast('风险清单确认通过 ✓ 汪，可以下单'); }
      else toast('还有未勾选项，请先完成风险自查 ⚠');
    });
    // 校准项
    $('#calibList').addEventListener('click', (e) => {
      const li = e.target.closest('.calib'); if (!li) return;
      const idx = Array.from(li.parentNode.children).indexOf(li);
      state.calib[idx] = !state.calib[idx];
      window.PStore.set('p_workbench_calib', state.calib);
      renderCalib();
    });
    // 设置开关
    $('#settingList').addEventListener('click', (e) => {
      const sw = e.target.closest('.switch'); if (!sw) return;
      const i = Number(sw.dataset.i);
      state.settings[i] = !state.settings[i];
      window.PStore.set('p_workbench_settings', state.settings);
      renderSettings();
      const label = DB.settings[i].label;
      toast(state.settings[i] ? `已开启「${label}」` : `已关闭「${label}」`);
    });
  }
  function toggleBias(i) {
    const idx = state.bias.indexOf(i);
    if (idx >= 0) state.bias.splice(idx, 1); else state.bias.push(i);
    window.PStore.set('p_workbench_bias', state.bias);
    renderBias();
  }

  // ---------- 启动 ----------
  function init() {
    makeStars();
    // 兼容旧存档：把历史遗留的「待评估」自定义标的静默补评为已评估
    let changed = false;
    Object.values(state.custom).forEach((s) => {
      // 迁移1：旧版用虚拟 9xxxxx 代码登记但无真实行情，且已伪造了估值区间——标记 noQuote 并清空估值，避免继续展示失真的绝对估值
      if (s.custom && /^9\d{5}$/.test(s.code) && !s.noQuote) {
        s.noQuote = true;
        s.val = null;
        changed = true;
      }
      // 迁移2：中文名现在是真实代码映射里的标的，但旧存档存的是虚拟 9xxxxx 代码——重映射到真实代码，使其能拉到真实行情与估值
      if (s.custom && /^9\d{5}$/.test(s.code) && window.DB.stockNameMap && window.DB.stockNameMap[s.name]) {
        const real = window.DB.stockNameMap[s.name];
        if (!allStocks().some((x) => x.code === real) || state.custom[real]) {
          delete state.custom[s.code];
          s.code = real;
          s.noQuote = false;
          s.val = null;
          s.calibrated = false;
          state.custom[real] = s;
          if (!state.watch.includes(real)) state.watch.push(real);
          changed = true;
        }
        // 迁移2.1：静态映射查不到、但可按名实时反查到真实代码的虚拟标的——后台异步反查并修复，同样让行情能自动更新
      } else if (s.custom && /^9\d{5}$/.test(s.code) && s.noQuote) {
        resolveStockName(s.name, (hit) => {
          if (!hit || state.custom[hit.code]) return;
          const src = s.code;
          delete state.custom[src];
          s.code = hit.code;
          s.name = hit.name || s.name;
          s.noQuote = false;
          s.val = null;
          s.calibrated = false;
          state.custom[hit.code] = s;
          if (!state.watch.includes(hit.code)) state.watch.push(hit.code);
          window.CustomStore.save(state.custom);
          window.PStore.set('p_workbench_watch', state.watch);
          renderStocks(); renderMiniStocks(); renderNews();
          fetchQuotes();
          toast(`已自动修复「${s.name}」行情（解析到真实代码 ${hit.code}）`);
        });
      }
      // 迁移3：修复旧版"代码不在池"时把名称存成代码本身的问题（如 name=600050）——按代码反查真实名称，让展示与行业推断都正确
      if (s.custom && /^\d{6}$/.test(s.code) && s.name === s.code) {
        (function (stk) {
          resolveStockName(stk.code, (res) => {
            if (!res || !res.name || res.name === stk.code) return;
            stk.name = res.name;
            stk.sub = stk.sub === '自定义标的' ? inferSub(res.name) || stk.sub : stk.sub;
            window.CustomStore.save(state.custom);
            renderStocks(); renderMiniStocks(); renderNews();
          });
        })(s);
      }
      // 统一用新评估引擎重算，纠正旧版失真的评分/评级/趋势
      autoEvaluate(s);
      changed = true;
    });
    // 对 mock 默认关注（DB.stocks 等）的一切观影标的也统一用新引擎重算，覆盖硬编码的失真演示评分
    allStocks().filter((s) => state.watch.includes(s.code)).forEach((s) => autoEvaluate(s));
    if (changed) { window.CustomStore.save(state.custom); window.PStore.set('p_workbench_watch', state.watch); }
    renderMissions(); renderRoutine(); renderMiniStocks();
    renderStocks(); renderStockSort(); renderScoreSum(); renderStages();
    renderRules(); renderChecklist();
    renderCalib(); renderBias(); renderSettings();
    renderNews();
    renderUser();
    bindEvents();
    initPullRefresh();
    startAutoRefresh();
    refreshClock();
    setInterval(refreshClock, 1000);
  }
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();
})();