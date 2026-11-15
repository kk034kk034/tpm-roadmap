/* 辦公室：左邊座位區、中間走道、右邊業務桌，後方會議室與戰情室。 */
levelAdd('office', function (K) {
  const {box, flat, lam, M, TX, label, screen, desk, pickBox, G} = K;
  K.bounds(-8.5, 8.5, -6.4, 6.2);

  const carpet = lam(0xd9e2dc, {map: TX.carpet});
  const wall = lam(0xe8eee9, {map: TX.wall});
  const wood = lam(0xcfc0a4, {map: TX.wood});
  const panel = lam(0xb7c4c8, {map: TX.panel});

  flat(17, 12.6, carpet, 0, 0, -.1, 1, G);
  box(17.2, 3.2, .3, wall, 0, 1.6, -6.55, G);
  box(.3, 3.2, 12.8, wall, -8.65, 1.6, -.1, G);
  box(.3, 3.2, 12.8, wall, 8.65, 1.6, -.1, G);

  /* 你的座位區（左前） */
  desk(-4.2, 2.4, 1.5, G);
  box(.55, .35, .08, M.dark, -4.2, 1.25, 2.15, G);
  screen('laptop', G, -4.2, 1.35, 2.05, .7, .4, ['Slack', '未讀 1'], '#93a9b2');
  pickBox('desk', 2.2, 2, 2.2, -4.2, 1, 2.2, G);

  /* 主管桌（左後） */
  desk(-5.5, -3.8, 1.5, G);
  box(.9, 1.2, .08, panel, -5.5, 1.7, -4.5, G);

  /* 業務區（右前） */
  desk(4.8, 3.2, 1.4, G);
  box(1.6, .5, .7, M.glass, 4.8, 1.3, 3.2, G, false);

  /* 會議室（中後） */
  box(5.2, 2.6, .2, wall, 0, 1.3, -5.5, G);
  box(.2, 2.6, 3.2, wall, -2.6, 1.3, -3.9, G);
  box(.2, 2.6, 3.2, wall, 2.6, 1.3, -3.9, G);
  box(3.4, 1.1, .08, M.dark, 0, 1.55, -5.35, G);
  label('會議室', 0, -3.2, 2.2, G);
  box(2.6, .08, 1.4, wood, 0, .78, -3.6, G);
  [[-1, -3.2], [1, -3.2], [-1, -4], [1, -4]].forEach(p => box(.4, .45, .4, M.trim, p[0], .23, p[1], G));
  pickBox('board', 3.2, 2.4, 2.4, 0, 1.1, -3.8, G);

  /* 戰情室（右後） */
  box(4.2, 2.6, .2, wall, 5.8, 1.3, -5.5, G);
  box(.2, 2.6, 3.4, wall, 3.7, 1.3, -3.8, G);
  screen('war', G, 5.8, 1.7, -5.2, 1.6, .7, ['週會', '建置案'], '#7fe3c8');
  box(2.4, .08, 1.3, wood, 5.5, .78, -3.4, G);
  pickBox('war', 3.2, 2.4, 2.8, 5.5, 1.1, -3.5, G);
  label('戰情室', 5.6, -2.6, 2.2, G);

  label('座位區', -4.2, 4.2, 2.6, G);
  label('業務區', 4.8, 4.8, 2.6, G);

  K.block([
    [-8.5, -2.8, -6.4, -4.9],
    [-6.5, -3.8, -4.6, -3],
    [-5.4, -3, 1.7, 3.1],
    [3.9, 5.7, 2.5, 3.9],
    [-2.7, 2.7, -5.7, -4.9],
    [3.5, 8.2, -5.7, -4.9],
    [3.5, 4, -5.2, -2.2]
  ]);

  K.nodes({
    desk: [-4.2, 1.2],
    aisle: [-1, 1.5],
    sales: [3.6, 3.2],
    bossdesk: [-4.2, -3.2],
    meet: [0, -2.4],
    board: [1.2, -3.2],
    war: [5.4, -2.6],
    center: [1.5, 0.5]
  }, 'desk-aisle aisle-center center-sales desk-bossdesk aisle-meet meet-board meet-war center-war sales-center');

  WORLD.shots = [
    {p: [-4, 1.2, 2], d: 14, yaw: .25, pitch: .55},
    {p: [2, 1.1, -1], d: 16, yaw: -.2, pitch: .65}
  ];
});
WORLD.level = 'office';
