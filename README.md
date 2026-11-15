# RD → TPM Roadmap

中文 RD 轉 TPM 技能地圖，加上一則可玩的系統建置案情境模擬。

## 內容

- **技能地圖**：12 大主幹（角色轉換 → … → Senior / Program），資料在 `src/data/roadmap.json`；長文在 `src/content/topics`（MDX）。
- **情境模擬**（`/play`）：一案跑完地圖常見工作場景——拜訪、接案、需求、估算、假綠燈、變更、UAT、上線。

## 本機

```bash
npm install
npm run build:play   # 建置模擬 → public/sims/system-build/
npm run dev
```

- 地圖：http://localhost:4321/tpm-roadmap/
- 模擬：http://localhost:4321/tpm-roadmap/play/（會進入系統建置案）

```bash
npm run build        # build:play + Astro + pagefind
```

## 目錄

```text
src/                         地圖站（Astro + React）
play-games/system-build/     系統建置案劇情（meta / game / data / office / story）
scripts/build-play.mjs       建置 fab24hr 關卡 → public/sims/
```

引擎建置時下載到 `.cache/fab24hr-engine`（不進 git）。`public/` 為產物，亦不進 git。

## 授權注意

情境模擬使用 [fab24hr engine](https://github.com/mcltyl/fab24hr-engine)（非商業；須保留畫面上的 Powered by / 贊助 fab24hr）。遊戲作者自願贊助用 `HOME.support`。

## Commit

```text
feat: …
fix: …
docs: …
chore: …
```
