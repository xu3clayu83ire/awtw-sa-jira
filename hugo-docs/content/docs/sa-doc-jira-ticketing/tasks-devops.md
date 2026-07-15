---
title: "開發任務清單（DevOps）"
weight: 6
---

# SA 文件產出與 Jira 自動開票工具 — DevOps 任務

## 前置閱讀
- `_spec/sa-doc-jira-ticketing/requirement.md`
- `_spec/sa-doc-jira-ticketing/design.md`（Phase 0 環境門檻、已知風險與對策）

---

## Phase 0 — 環境門檻（~1h，全部 👤，開發前一次設定完）

> 這些任務不阻塞彼此以外的 🤖 任務，但 Backend Phase 1 依賴本 Phase 全部完成才能實測建票。

### T01 — 建立／沿用 Jira 專案 ✅　👤 手動執行

專案名稱 `awtw-sa-jira`，key `ASJ`。

**完成定義**：
- 🟢 綠燈確認：Jira 專案 `ASJ` 已建立，能在瀏覽器手動建立一張測試票成功 ✅ 已完成，測試票 `ASJ-114`

---

### T02 — 取得 Jira API Token 並設定 n8n credential ✅　👤 手動執行

**依賴**：T01

至 Atlassian 帳號設定產生 API Token，於 n8n 建立對應的 HTTP/Jira credential。

> 👤 手動原因：敏感憑證需手動輸入，不可寫入程式碼或文件。

**完成定義**：
- 🟢 綠燈確認：n8n credential 測試連線成功，無 401/403 錯誤 ✅ credential `Jira ASJ` 已建立

---

### T03 — 建立 n8n Webhook node，取得 Webhook URL ✅　🤖 AI 執行（原標記錯誤，更正）

**依賴**：T01

**更正說明**：原本標記為 👤 手動執行，實際上透過 n8n API 就能直接建立 Webhook node，不需要人工在 UI 拉節點。已由 `tasks-backend.md` T01 一併完成，Webhook URL `http://localhost:5678/webhook/sa-jira-ticketing` 已於 2026-07-15 測試打通並收到 200 回應。

**完成定義**：
- 🟢 綠燈確認：Webhook URL 可用 `curl` 打通並收到 200 回應 ✅ 已完成

---

## ⏳ 待人工處理

無，T01、T02、T03 皆已完成。
