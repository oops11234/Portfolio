# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Build & Development
- `npm run dev` - Start development server with Vite (runs on host 0.0.0.0)
- `npm run build` - Build for production (TypeScript compilation + Vite build)
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint on TypeScript files

### Deployment
- `npm run deploy` - Deploy to GitHub Pages (runs build first)

## Architecture Overview

This is a Web3 Blackjack DApp with a neon-themed cyberpunk aesthetic built on:

### Frontend Stack
- **React 19** with TypeScript and Vite for fast development
- **React Router** with HashRouter for GitHub Pages compatibility
- **Tailwind CSS v4** for styling with custom neon effects
- **Three.js + React Three Fiber** for 3D scenes and models

### Web3 Integration
- **Ethers.js v6** for smart contract interaction
- **Viem** for additional Web3 utilities
- Smart contract deployed on Sepolia testnet at `0xb5D480B9c3E9223184c9E0635A610137d790709C`
- MetaMask wallet integration required

### Key Components Structure
- **Pages**: Main routes (Index, BlackjackTable, CyberCity, CryptoMarket, LiveStream)
- **Components**: Reusable UI components including neon-styled buttons and 3D city elements
- **Hooks**: Custom hooks for contract calls (`useCallContract`), game state (`useGameState`), and MetaMask (`useMetaMask`)
- **Utils**: Contract utilities, card game logic, and helper functions

### Asset Organization
- **Card Assets**: Two sets - legacy PNG cards and modern SVG cards (C_1.svg format for Clubs 1, etc.)
- **3D Models**: GLB files for cars and city environments in `assets/models/`
- **Audio**: Game sounds including card flips, chips, and background music

### Game Logic
- On-chain Blackjack with manual seed handling for randomness
- Card deck creation and shuffling utilities
- Score calculation and game state management
- Contract interaction for betting and game flow

## Resume Page Todo List

| # | 任務 | 說明 | 已完成 | 完成日期 |
|---|------|------|--------|----------|
| 1 | 建立 Resume.tsx | 頁面骨架與霓虹風格背景 | [x] | 2026-03-20 |
| 2 | 路由 + NavBar | App.tsx 新增路由、NavBar 加入連結 | [x] | 2026-03-20 |
| 3 | Hero 區塊 | 名字、職稱、TypeAnimation 打字效果 | [x] | 2026-03-22 |
| 4 | About Me | 個人介紹霓虹卡片 | [x] | 2026-03-23 |
| 5 | Skills | 霓虹 tag / 進度條展示前端技能 | [ ] | - |
| 6 | Experience Timeline | 工作/學習經歷垂直時間軸 | [ ] | - |
| 7 | Education | 教育背景區塊 | [ ] | - |
| 8 | Projects | 作品集霓虹卡片網格 | [ ] | - |
| 9 | GitHub Graph | 嵌入 GitHub 貢獻度活躍圖 | [ ] | - |
| 10 | Contact | GitHub / LinkedIn / Email 聯絡區塊 | [ ] | - |
| 11 | RWD 優化 | 手機版排版與整體閱讀性調整 | [ ] | - |

## Resume Page — 目前進度 (2026-03-22)

### 已完成的架構
- `src/pages/Resume.tsx` — 主頁面，純組裝用，從 `resume.json` 讀取所有資料
- `src/data/resume.json` — 履歷資料來源，所有內容從這裡修改
- `src/components/resume/` — 各區塊獨立 component：
  - `SectionTitle.tsx` — 共用標題樣式
  - `HeroSection.tsx` — 照片（圓形 + CRT 掃描線效果）+ 名字 + TypeAnimation 職稱
  - `ContactSection.tsx` — 位於 Hero 下方、About Me 上方
  - `AboutSection.tsx`
  - `SkillsSection.tsx`
  - `ExperienceSection.tsx` — description 支援字串或字串陣列
  - `EducationSection.tsx`
  - `ProjectsSection.tsx`
  - `GitHubSection.tsx` — 使用 ghchart.ssh.surf 嵌入貢獻圖

### 照片設定
- 檔案位置：`src/assets/images/photo.jpg`
- HeroSection 使用靜態 import，`resume.json` 的 `hero.photo` 欄位非空即顯示

### 下一個要處理的 Task
- **Task #4 About Me** — 目前已有基本實作，待逐一確認與調整

### 重要慣例
- 每個區塊為獨立 component，不要把邏輯寫回 Resume.tsx
- 資料一律從 `resume.json` 讀取，不要 hardcode 在 component 裡

## Development Notes

- Uses HashRouter for GitHub Pages deployment compatibility
- 3D scenes use React Three Fiber with Drei helpers and postprocessing effects
- Smart contract ABI is stored in `src/abi/BlackJack.json`
- Loading screen component handles initial app loading state
- Mobile-responsive design with hamburger navigation