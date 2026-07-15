# 技術棧規範

## 前端（改用文件站樣式，見 `_spec/hugo-book-ui/`）
- 框架：Hugo + `hugo-book` 主題（比照 `awtw-short-url-service-agent/hugo-docs`）
- 進度儀表板：Hugo 自訂 layout 頁面 + Alpine.js（輕量互動，無 build 步驟）
- ~~舊方案（React + Vite，`frontend/`）已淘汰，見 `_spec/hugo-book-ui/tasks-backend.md` T04~~

## 後端（輕量 proxy）
- 框架：Node.js + Express
- 職責：僅作為前端與 Jira REST API 之間的 proxy，收 Jira credential（存 `.env`，不進 git），前端不直接持有任何憑證
- 範圍：只服務「讀取 Jira 票狀態」這個需求，不做其他業務邏輯（觸發文件產出、呼叫 n8n Webhook 由前端直接呼叫，不需要憑證，不用經過這層 proxy）

## 測試
- 前端：Vitest + React Testing Library
- 後端：Vitest
