# 技術棧規範

## 前端（Frontend Phase 2 — 獨立網頁）
- 框架：React + Vite
- 語言：JavaScript（PoC 規模，不引入 TypeScript 建置複雜度）
- 頁面：需求輸入表單、文件檢視器（Markdown 渲染）、進度儀表板

## 後端（輕量 proxy）
- 框架：Node.js + Express
- 職責：僅作為前端與 Jira REST API 之間的 proxy，收 Jira credential（存 `.env`，不進 git），前端不直接持有任何憑證
- 範圍：只服務「讀取 Jira 票狀態」這個需求，不做其他業務邏輯（觸發文件產出、呼叫 n8n Webhook 由前端直接呼叫，不需要憑證，不用經過這層 proxy）

## 測試
- 前端：Vitest + React Testing Library
- 後端：Vitest
