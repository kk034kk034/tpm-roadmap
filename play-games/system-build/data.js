/* 系統建置案：一案主線。人物與案件虛構。 */

HOME.title = '系統建置案';
HOME.sub = '從第一次拜訪，到上線那一晚';
HOME.fine = '對應學習地圖工作場景。一般系統建置案節奏；人物、客戶與案件都是虛構的。';
// 官方允許的自願贊助（HOME.support）；不更動 fab24hr credit 列
HOME.support = { url: 'https://buymeacoffee.com/a123s34986n', label: '☕ 贊助我' };

SHARE.name = HOME.title;
SHARE.tagline = HOME.sub;
SHARE.fine = HOME.fine;
SHARE.url = '';
SHARE.file = 'system-build';
SHARE.tail = 'RD → TPM 情境模擬';

STORY.cast = {
  me: { name: '你', role: '剛轉任的 TPM', tag: '你', color: '#2f6f5e' },
  boss: {
    name: '林主管',
    role: '直屬主管',
    tag: '主管',
    color: '#d96c57',
    about: '要結果、要燈號、要你別把團隊燒穿。'
  },
  sales: {
    name: '小美',
    role: '業務',
    tag: '業務',
    color: '#7aa7b7',
    about: '把單談進來的人。常希望你先答應再說。'
  },
  rd: {
    name: '阿凱',
    role: '後端工程師',
    tag: 'RD',
    color: '#3d5a80',
    about: '真正要把東西做出來的人。最怕空白支票與假綠燈。'
  },
  client: {
    name: '王窗口',
    role: '客戶窗口',
    tag: '客戶',
    color: '#c4a35a',
    about: '需求說加就加、工期說不變就不變。不一定是最終簽核人。'
  }
};

WORLD.cast = {
  me: {
    label: '你・TPM',
    fill: '#2f6f5e',
    ink: '#ffffff',
    cloth: 0x24352f,
    color: 0x2f6f5e,
    hair: 0x2b2320,
    node: 'desk',
    face: Math.PI
  },
  boss: {
    label: '林主管',
    fill: '#d96c57',
    ink: '#ffffff',
    cloth: 0x4a3030,
    color: 0xd96c57,
    hair: 0x1c1c1c,
    node: 'bossdesk',
    face: 0
  },
  sales: {
    label: '小美・業務',
    fill: '#7aa7b7',
    ink: '#ffffff',
    cloth: 0x3a5560,
    color: 0x7aa7b7,
    hair: 0x6b3a22,
    long: true,
    node: 'sales',
    face: -Math.PI / 2
  },
  rd: {
    label: '阿凱・RD',
    fill: '#3d5a80',
    ink: '#ffffff',
    cloth: 0x2a3340,
    color: 0x3d5a80,
    hair: 0x2b2320,
    node: 'meet',
    face: Math.PI
  }
};

STORY.places = {
  desk: { name: '你的座位', at: [-4.2, 2.2], mark: [-4.2, 2.2, 2.2], go: '走回座位' },
  board: { name: '白板', at: [1.2, -3.6], mark: [1.2, 2.4, -4.6], go: '走去白板' },
  war: { name: '戰情室／會議室', at: [5.4, -3.2], mark: [5.4, 2.3, -4.2], go: '走進去' }
};

termsSet(
  [
    ['系統建置案', '從需求、開發、驗收到上線的交付型專案，常見於 SI／內部系統導入。'],
    ['Discovery', '先搞清楚問題、現況、限制與成功標準，再談方案。'],
    ['交接 / handover', '合約、提案、假設、風險、決策人與已承諾事項的完整移交。'],
    ['驗收條件', '什麼算完成、什麼失敗不能接受。沒寫清楚，UAT 會變成無限遊戲。'],
    ['假綠燈', '狀態顯示正常，但可驗證產物不存在或不可用。'],
    ['變更請求 / CR', '把「順便加一下」變成可追蹤的影響分析與核准。'],
    ['Go / No-Go', '上線前的明確決策：做或不做，附條件與負責人。'],
    ['Rollback', '出問題時如何回到上一版、多久內、誰執行。']
  ],
  ' / ',
  [],
  []
);
