# RD to TPM Roadmap

中文 RD 轉 TPM 的互動式學習 Roadmap。目標不是照搬通用 PM 課程，而是從 RD 轉 TPM 的工作生命週期建立 12 大主幹與 100+ 技能節點，讓使用者可以用「學習模式」循序補能力，也可以用「工作模式」從實際情境反查該看的節點。

## Roadmap Scope

目前 V0.1 包含 12 大主幹：

1. RD → TPM 角色轉換
2. 售前 / Presales
3. 專案啟動 / Initiation
4. 需求與範疇 / Requirement & Scope
5. 規劃 / Planning
6. 執行與追蹤 / Execution & Control
7. 風險、議題、變更 / Risk Issue Change
8. 人與溝通 / Stakeholder & Communication
9. 軟體與技術交付 / Technical Delivery
10. 測試、上線 / QA Release
11. 驗收、維運、結案 / Acceptance & Closure
12. Senior TPM / Program Management

另外保留 SI / 政府標案作為 optional specialization，AI for TPM 作為橫跨整張 roadmap 的 workflow。

## Tech Stack

- Astro
- React
- React Flow / XYFlow
- Tailwind CSS
- TypeScript
- MDX
- Pagefind

## Project Structure

```text
src/
├─ components/
│  └─ RoadmapFlow.tsx
├─ content/
│  └─ topics/
├─ data/
│  └─ roadmap.json
├─ layouts/
└─ pages/
```

## Development

Install dependencies:

```bash
npm install
```

Start the local dev server:

```bash
npm run dev
```

Build the static site and Pagefind index:

```bash
npm run build
```

## Content Model

Roadmap branches and nodes are maintained in `src/data/roadmap.json`.

Topic articles are maintained as MDX files in `src/content/topics`.

Every roadmap node also has a generated learning page at:

```text
/roadmap/<branch-id>/<node-index>
```

MDX articles are used for deeper hand-written guides. Generated node pages make sure the full roadmap is readable even before every node has a long-form article.

Learning progress is tracked in the browser with `localStorage`, so V1 does not require login or a backend.

To add a new skill node:

1. Add a node record under the matching branch in `src/data/roadmap.json`.
2. Optionally add a deeper MDX article in `src/content/topics`.
3. If a deep article exists, set the node `p` to `/topics/<slug>`.

## Commit Convention

Use conventional commit style:

```text
init: initialize project
feat: add roadmap interaction
fix: correct topic routing
docs: update readme
chore: update dependencies
```
