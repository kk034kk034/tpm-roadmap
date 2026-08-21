# RD to TPM Roadmap

中文 RD 轉 TPM 的互動式學習 Roadmap。目標不是照搬通用 PM 課程，而是從 RD 轉 TPM 的工作生命週期建立技能樹，讓使用者可以用「學習模式」循序補能力，也可以用「工作模式」從實際情境反查該看的節點。

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

Roadmap nodes are maintained in `src/data/roadmap.json`.

Topic articles are maintained as MDX files in `src/content/topics`.

To add a new skill node:

1. Add a node record in `src/data/roadmap.json`.
2. Add the corresponding MDX article in `src/content/topics`.
3. Set the node `path` to `/topics/<slug>`.

## Commit Convention

Use conventional commit style:

```text
init: initialize project
feat: add roadmap interaction
fix: correct topic routing
docs: update readme
chore: update dependencies
```
