/* 系統建置案主線：8 章，一章一個經典判斷。 */

STORY.segs = {
  visit: {
    name: '售前・第一次拜訪',
    sub: '先建立上下文，不急著承諾解法。',
    t: 9 * 60 + 30,
    mood: 'day',
    scene() {
      if (!W) return;
      W.screen('laptop', ['日曆', '拜訪'], '#ffc94a');
      W.screen('war', ['建置案', '售前'], '#93a9b2');
    }
  },
  hand: {
    name: '啟動・突然接案',
    sub: '小陳離職了。第一天你要拿哪些資料？',
    t: 10 * 60 + 5,
    mood: 'day',
    scene() {
      if (!W) return;
      W.screen('laptop', ['Slack', '接案'], '#ffc94a');
    }
  },
  req: {
    name: '需求・我要一個功能',
    sub: '從 Why／Who／When 拆，不要直接開票。',
    t: 11 * 60 + 20,
    mood: 'day',
    scene() {
      if (!W) return;
      W.screen('laptop', ['客戶', '通知？'], '#ffc94a');
    }
  },
  plan: {
    name: '規劃・RD 說做不完',
    sub: '把空白支票翻成可管理的未知。',
    t: 14 * 60 + 10,
    mood: 'day',
    scene() {
      if (!W) return;
      W.screen('laptop', ['估時', '卡住'], '#93a9b2');
    }
  },
  ctrl: {
    name: '執行・看起來正常',
    sub: '綠燈要有產物，不能只有感覺。',
    t: 15 * 60 + 40,
    mood: 'day',
    scene() {
      if (!W) return;
      W.screen('war', ['狀態', '全綠？'], '#7fe3c8');
    }
  },
  chg: {
    name: '變更・三個小功能',
    sub: '加需求可以。假裝時程沒變不行。',
    t: 11 * 60 + 5,
    mood: 'day',
    note: '週程進入中段。客戶來信「都是微調」。',
    scene() {
      if (!W) return;
      W.screen('laptop', ['客戶信', '新'], '#ffc94a');
    }
  },
  uat: {
    name: '驗收・準備 UAT',
    sub: '條件、資料、分級、誰能簽。',
    t: 10 * 60,
    mood: 'day',
    note: '接近交付。下週客戶要進場測。',
    scene() {
      if (!W) return;
      W.screen('laptop', ['UAT', '下週'], '#ffc94a');
    }
  },
  ship: {
    name: '上線・Go / No-Go',
    sub: '範圍、回滾、監控、誰拍板。',
    t: 21 * 60,
    mood: 'night',
    scene() {
      if (!W) return;
      W.screen('war', ['Release', '今晚'], '#ffc94a');
      W.put('boss', 'war');
    }
  }
};

STORY.beats = [
  /* —— 01 拜訪 —— */
  {
    seg: 'visit',
    to: 'war',
    guide: '走進會議室開始第一次拜訪',
    lines: () => [
      ['sales', '王窗口想聽方案，你盡量讓他覺得我們做得到。'],
      ['client', '我們就是希望管理更方便。跟舊系統即時同步，兩週夠不夠？']
    ],
    mini(done) {
      say([['sys', '現場你怎麼接？']], null, {
        choice: [
          ['可以，類似案我們兩週都有經驗', () => { ST.d.visit = 'yes'; done(); }],
          ['先請他走一遍現況與例外，工期回去評估', () => { ST.d.visit = 'walk'; done(); }],
          ['技術上都能做，細節會後正式回覆', () => { ST.d.visit = 'soft'; done(); }]
        ]
      });
    },
    post: () =>
      ST.d.visit === 'walk'
        ? [['client', '……好，我打開系統給你看現在怎麼做。'], ['sys', '你把提問變成求證。']]
        : ST.d.visit === 'soft'
          ? [['sys', '客戶點頭。他以為「都能做」等於「會做」。']]
          : [['sys', '業務很開心。執行債從這一秒開始計息。']]
  },

  /* —— 02 交接 —— */
  {
    seg: 'hand',
    ring: ['林主管', 'Slack 提及', '打開'],
    lines: () => [
      ['boss', '小陳離職了，這個建置案你先接。資料……業務有聊過，你問他就好。'],
      ['me', '……收到。']
    ],
    mini(done) {
      say([['sys', '接案第一個動作？']], null, {
        choice: [
          ['回好的，打開空白表自己瞎估', () => { ST.d.hand = 'yes'; done(); }],
          ['先要交接清單：合約／提案／假設／風險／決策人', () => { ST.d.hand = 'list'; done(); }],
          ['立刻約客戶 kickoff 展現積極', () => { ST.d.hand = 'kick'; done(); }]
        ]
      });
    },
    post: () =>
      ST.d.hand === 'list'
        ? [['sys', '主管回了幾個連結。你終於有東西能對。']]
        : ST.d.hand === 'kick'
          ? [['sys', '日曆跳出邀請。你還不確定上週承諾了什麼。']]
          : [['sys', '你很好帶。你對什麼負責，其實誰都說不清。']]
  },
  {
    seg: 'hand',
    to: 'sales',
    guide: '去找小美釘住售前到底承諾了什麼',
    lines: () => [
      ['sales', '我有講過大概時程，他們覺得蠻簡單的。對外別講太多風險。']
    ],
    mini(done) {
      say([['sys', '你怎麼接？']], null, {
        choice: [
          ['配合對外樂觀，內部再補洞', () => { ST.d.sales = 'soft'; done(); }],
          ['書面列出假設與待確認，再對外', () => { ST.d.sales = 'paper'; done(); }],
          ['回：你亂承諾關我什麼事', () => { ST.d.sales = 'fight'; done(); }]
        ]
      });
    },
    post: () =>
      ST.d.sales === 'paper'
        ? [['sales', '……好啦你列一版。別嚇跑客戶。']]
        : ST.d.sales === 'fight'
          ? [['sys', '情緒很爽。資訊開始繞過你走。']]
          : [['sys', '業務很開心。資料夾還是空的。']]
  },

  /* —— 03 需求 —— */
  {
    seg: 'req',
    to: 'desk',
    guide: '回座位看客戶「我要一個通知功能」',
    lines: () => [
      ['client', '我要一個通知功能，有異動就通知就好，很簡單。'],
      ['rd', '別直接丟「做一個通知」給我。']
    ],
    mini(done) {
      say([['sys', '你怎麼拆？']], null, {
        choice: [
          ['開票：做推播，RD 看著辦', () => { ST.d.req = 'ticket'; done(); }],
          ['先問目的、對象、觸發，再要一個真實案例', () => { ST.d.req = 'why'; done(); }],
          ['回：現成模組兩天搞定', () => { ST.d.req = 'mod'; done(); }]
        ]
      });
    },
    post: () =>
      ST.d.req === 'why'
        ? [['client', '上週財務漏看改價，對帳差三天。'], ['sys', '痛點是「改價必須被對的人看到」，不是通知本身。']]
        : ST.d.req === 'mod'
          ? [['sys', '客戶開始用「兩天」當基準。']]
          : [['sys', '票出去了。問號會全部噴回阿凱。']]
  },

  /* —— 04 估算 —— */
  {
    seg: 'plan',
    to: 'rd',
    guide: '去會議室跟阿凱對時程',
    lines: () => [
      ['rd', '規格有洞，串接文件缺一半。你叫我估？照這樣做不完。'],
      ['boss', '週五戰情室要聽數字。']
    ],
    mini(done) {
      say([['sys', '你怎麼把「做不完」往前推？']], null, {
        choice: [
          ['逼一個確定日交差', () => { ST.d.plan = 'force'; done(); }],
          ['拆工作包，未知開 spike，對外報範圍＋假設', () => { ST.d.plan = 'split'; done(); }],
          ['原話轉客戶：RD 說做不完', () => { ST.d.plan = 'dump'; done(); }]
        ]
      });
    },
    post: () =>
      ST.d.plan === 'split'
        ? [['rd', '兩天 spike 後給範圍。現在只能給區間。'], ['sys', '未知被放進計畫。']]
        : ST.d.plan === 'dump'
          ? [['sys', '客戶只聽到：你們團隊不行。']]
          : [['sys', '你拿到一個看起來像承諾的數字。']]
  },

  /* —— 05 假綠燈 —— */
  {
    seg: 'ctrl',
    to: 'war',
    guide: '走進戰情室，看板全綠',
    lines: () => [
      ['rd', 'Done 都勾了。整合測試……客戶資料沒來，我先勾開發完成。'],
      ['boss', '綠燈黃燈紅燈，給個說法。'],
      ['sales', '我對外都說順利，你別嚇到客戶。']
    ],
    mini(done) {
      say([['sys', '你報什麼燈？']], null, {
        choice: [
          ['綠燈：一切順利會準時', () => { ST.d.ctrl = 'green'; done(); }],
          ['黃燈：完成定義重定＋blocker 要 owner／決策日', () => { ST.d.ctrl = 'yellow'; done(); }],
          ['強調都是客戶／前人的坑', () => { ST.d.ctrl = 'blame'; done(); }]
        ]
      });
    },
    post: () =>
      ST.d.ctrl === 'yellow'
        ? [['boss', '清楚。那兩項我今天找人拍板。'], ['sys', '會議變成決策。']]
        : ST.d.ctrl === 'blame'
          ? [['boss', '坑我知道。我問你現在怎麼扛。']]
          : [['sys', '現場安靜三秒。假綠燈多活一週。']]
  },

  /* —— 06 變更 —— */
  {
    seg: 'chg',
    to: 'desk',
    guide: '回座位看「三個小功能，時程不用動」',
    lines: () => [
      ['client', '順便加三個小功能，都是微調。時程不用動喔，長官要看 demo。'],
      ['sales', '你先答應啦，單好不容易。']
    ],
    mini(done) {
      say([['sys', '經典組合。你怎麼回？']], null, {
        choice: [
          ['好的沒問題，內部消化', () => { ST.d.chg = 'yes'; done(); }],
          ['先做影響分析，請選：延後／換掉／加資源', () => { ST.d.chg = 'impact'; done(); }],
          ['合約沒寫就不能做', () => { ST.d.chg = 'no'; done(); }]
        ]
      });
    },
    post: () =>
      ST.d.chg === 'impact'
        ? [['sys', '客戶回：先拿掉第二項，demo 日期維持。變更被放到檯面上。']]
        : ST.d.chg === 'no'
          ? [['sys', '法律上可能對。LINE 群安靜得可怕。']]
          : [['sys', '風險吞進肚子。它會從時程長出來。']]
  },

  /* —— 07 UAT —— */
  {
    seg: 'uat',
    to: 'desk',
    guide: '安排下週 UAT',
    lines: () => [
      ['client', '下週二來測一下就好，有問題再跟你們說～'],
      ['rd', '沒真實主檔就只能塞假資料。假資料測過 ≠ 上線過。']
    ],
    mini(done) {
      say([['sys', '開測前你鎖定什麼？']], null, {
        choice: [
          ['到場再看怎麼測，帳密先寄', () => { ST.d.uat = 'wing'; done(); }],
          ['對齊腳本／資料缺口／缺陷分級／簽核人', () => { ST.d.uat = 'ready'; done(); }],
          ['取消 UAT，等資料齊再約', () => { ST.d.uat = 'cancel'; done(); }]
        ]
      });
    },
    post: () =>
      ST.d.uat === 'ready'
        ? [['sys', '客戶回：簽核是處長，不是窗口。你避開一顆炸彈。']]
        : ST.d.uat === 'cancel'
          ? [['sales', '你取消我怎麼講？'], ['sys', '有時正確，但要有替代節奏。']]
          : [['sys', 'UAT 會很熱鬧。通過條件永遠下一輪。']]
  },

  /* —— 08 上線 —— */
  {
    seg: 'ship',
    to: 'war',
    guide: '走進戰情室做 Go／No-Go',
    lines: () => [
      ['rd', '還有兩個 Major。回滾腳本昨天剛寫，沒演練過。'],
      ['sales', '客戶長官明天要看正式環境，今晚一定要上。'],
      ['boss', '你給建議。Go 還是 No-Go？']
    ],
    mini(done) {
      say([['sys', '你的建議？']], null, {
        choice: [
          ['Go：先上再說，出問題再補', () => { ST.d.ship = 'go'; done(); }],
          ['No-Go：條件沒齊；或有條件 Go（凍範圍／演練回滾／值班）', () => { ST.d.ship = 'hold'; done(); }],
          ['請業務／客戶自己決定，我只執行', () => { ST.d.ship = 'pass'; done(); }]
        ]
      });
    },
    post: () =>
      ST.d.ship === 'hold'
        ? [['boss', '……採有條件 Go。你去把清單釘死。'], ['sys', '決策有主人，風險有名字。']]
        : ST.d.ship === 'pass'
          ? [['boss', '我請你給判斷，不是當傳聲筒。']]
          : [['sys', '部署開始了。回滾仍是理論。']]
  },
  {
    seg: 'ship',
    end: true,
    t: 23 * 60 + 10,
    lines: () => [['sys', '23:10。這一案告一段落。結算看你一路留下的判斷。']]
  }
];

function score() {
  let good = 0;
  if (ST.d.visit === 'walk') good++;
  if (ST.d.hand === 'list') good++;
  if (ST.d.sales === 'paper') good++;
  if (ST.d.req === 'why') good++;
  if (ST.d.plan === 'split') good++;
  if (ST.d.ctrl === 'yellow') good++;
  if (ST.d.chg === 'impact') good++;
  if (ST.d.uat === 'ready') good++;
  if (ST.d.ship === 'hold') good++;
  return good;
}

function endingOf(n) {
  if (n >= 7) {
    return {
      title: '跑得完的建置案',
      badge: 'Judgment > Vibes',
      sub: '你不一定最討喜，但你讓不確定性一路可被管理到上線。'
    };
  }
  if (n >= 4) {
    return {
      title: '還在場上的 TPM',
      badge: 'Ship the judgment',
      sub: '有幾處守住了，有幾處用感覺過關。下一個案會繼承這些肌肉記憶。'
    };
  }
  if (ST.d.ship === 'go' && ST.d.ctrl === 'green') {
    return {
      title: '假綠燈直通上線',
      badge: 'Green until it burns',
      sub: '過程很順。債會從監控與客訴長出來。'
    };
  }
  return {
    title: '辛苦的一案',
    badge: 'Start again clearer',
    sub: '許多當下的「好的」堆成後面的救火。地圖上的節點，就是為此而在。'
  };
}

STORY.ending = () => {
  const n = score();
  const end = endingOf(n);
  const more = [
    ST.d.visit === 'walk' ? '拜訪先走現況' : '拜訪偏承諾',
    ST.d.hand === 'list' ? '接案要清單' : '接案偏急',
    ST.d.req === 'why' ? '需求先問 Why' : '需求偏功能',
    ST.d.plan === 'split' ? '估算報範圍' : '估算偏假精確',
    ST.d.ctrl === 'yellow' ? '敢報黃燈' : '狀態偏感覺',
    ST.d.chg === 'impact' ? '變更做取捨' : '變更偏吞下',
    ST.d.uat === 'ready' ? 'UAT 先就緒' : 'UAT 偏即興',
    ST.d.ship === 'hold' ? '上線有條件' : '上線偏硬上'
  ];
  return {
    title: end.title,
    led: end.badge,
    // 結算卡時間軸固定 3 格
    tl: [
      [clockOf(STORY.segs.visit.t), '售前拜訪'],
      [clockOf(STORY.segs.ctrl.t), '執行追蹤'],
      [clockOf(STORY.segs.ship.t), '上線決策']
    ],
    sub: end.sub,
    stats: [
      ['關鍵判斷', `${n} / 9`],
      ['類型', '系統建置']
    ],
    more,
    lines: [
      '這一案按學習地圖的工作場景走完一輪。',
      n >= 7 ? '你已經能把經典情境連成一條交付鏈。' : '回地圖對應節點，把薄弱的那幾章再練一次。'
    ],
    share: `【系統建置案】${end.title}（${end.badge}）\n關鍵判斷 ${n}/9\n${end.sub}`
  };
};

STORY.talk = (id) => {
  if (id === 'sales') {
    busy = true;
    showGuide();
    say([['sales', '我先去追別的事，等等再找你。']], () => {
      busy = false;
      showGuide();
    }, { end: '好' });
    return true;
  }
  if (id === 'rd') {
    busy = true;
    showGuide();
    say([['rd', '你先把手上那包講清楚再說。']], () => {
      busy = false;
      showGuide();
    }, { end: '好' });
    return true;
  }
  return false;
};
