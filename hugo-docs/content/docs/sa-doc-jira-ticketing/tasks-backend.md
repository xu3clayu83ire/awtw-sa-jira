---
title: "開發任務清單（後端）"
weight: 4
---

# SA 文件產出與 Jira 自動開票工具 — Backend 任務

## 前置閱讀
- `_spec/sa-doc-jira-ticketing/requirement.md`
- `_spec/sa-doc-jira-ticketing/design.md`（技術架構、資料模型、API 契約）
- `_spec/sa-doc-jira-ticketing/tasks-devops.md`（Phase 0 環境門檻，需先完成才能實測）

---

## Phase 1 — n8n Workflow 開發（~3h，全部 🤖）

### T01 — 建立 n8n workflow：Webhook 接收 JSON ✅　🤖 AI 執行

透過 n8n API 直接建立 workflow（比照 `awtw-short-url-service` 的作法，不手動拉節點），新增 Webhook node，路徑 `/webhook/sa-jira-ticketing`，方法 POST。同時滿足 `tasks-devops.md` T03（建 Webhook node）——透過 API 建立，非手動操作，該任務已同步標記完成。

workflow 完整內容備份於 `_infra/n8n-workflows/sa-jira-ticketing.json`（不含明文憑證，僅 credential 的 id/名稱參照），避免只存在 n8n 伺服器裡、n8n 被重置就找不回來。

**完成定義**：
- 測試命名：`應該_接收任務JSON並回傳200_當Webhook被呼叫`
- 🔴 紅燈確認：`curl` POST 任意 JSON 到 Webhook URL，尚未接上後續節點時應無回應或報錯
- 🟢 綠燈確認：`curl` POST 合法 `TaskPayload` JSON，收到 200 回應 ✅ 已於 2026-07-15 實測通過
- 單元測試覆蓋率 100%（workflow 邏輯以整合測試驗證，記錄於本任務完成定義）

---

### T02 — 實作 Code node：解析任務 JSON、組裝 Jira issue 欄位 ✅　🤖 AI 執行

**依賴**：T01

依 `design.md` 的 `TaskPayload` schema 解析 `tasks[]`，逐筆組裝成 Jira `POST /rest/api/3/issue` 所需的 `fields`（`project.key`、`summary`、`issuetype.name`、`labels: [role, executorType]`）。

**完成定義**：
- 測試命名：`應該_正確組裝Jira欄位_當TaskPayload合法`
- 🔴 紅燈確認：先用假資料跑 Code node，確認未實作前輸出為空或報錯 ✅ 修正前已重現「讀不到 tasks 欄位」的錯誤（Webhook 資料實際包在 `json.body` 底下，初版程式碼讀錯路徑）
- 🟢 綠燈確認：輸入範例 `TaskPayload`，輸出的 issue 欄位陣列筆數與 `tasks[]` 一致，欄位內容正確對應 ✅ 已於 2026-07-15 實測通過
- 單元測試覆蓋率 100%

---

### T03 — 實作呼叫 Jira REST API 建票節點（含錯誤處理） ✅　🤖 AI 執行

**依賴**：T02、`tasks-devops.md` T01、T02 完成（T03 已由本文件 T01 一併完成）

迴圈呼叫 Jira REST API 建票；任一筆失敗時，回傳明確錯誤訊息（不可 silent fail），並在 Webhook 回應中標示成功與失敗的筆數。

**完成定義**：
- 測試命名：`應該_建立對應數量的Jira票_當所有欄位合法`
- 測試命名：`應該_回傳明確錯誤訊息_當Jira欄位缺漏`
- 🔴 紅燈確認：故意送出缺少必填欄位的 payload，確認未實作錯誤處理前會 silent fail 或整批中斷無訊息
- 🟢 綠燈確認（錯誤路徑）：✅ 已於 2026-07-15 實測，未設定 Jira credential 時，回應為 `HTTP 207` + `{"created":0,"issues":[],"errors":["Credentials not found"]}`，未 silent fail
- 🟢 綠燈確認（成功路徑）：✅ 已於 2026-07-15 實測，成功建立 Jira 票 `ASJ-115`
- 單元測試覆蓋率 100%

---

### T04 — 實作「任務轉換模組」：tasks-*.md → JSON → POST Webhook ✅　🤖 AI 執行

**依賴**：T01

在 Claude Code 對話流程中，使用者確認 tasks 文件後，AI 直接把任務表格轉換為 `TaskPayload` JSON 並呼叫 T01 建立的 Webhook（透過 `curl` 或等效 HTTP 呼叫）。不透過 Notion 中介，減少人工搬運步驟。

**更新（2026-07-15）**：Webhook 回應（`{created, issues}`）需寫入 `_spec/<功能>/jira-issues.json`，供 T09 端點讀取，讓網頁進度儀表板能動態顯示這個功能對應的票號，不用寫死在前端程式碼。

**完成定義**：
- 測試命名：`應該_正確轉換tasks文件為TaskPayload_當四份tasks文件都已確認`
- 🔴 紅燈確認：轉換邏輯未實作前，無法產出合法 JSON
- 🟢 綠燈確認：✅ 已於 2026-07-15 以本專案 `tasks-frontend.md`／`tasks-qa.md` 的真實任務內容做 dry-run 轉換測試，輸出的 JSON 欄位結構與 T02 schema 完全對應（本次依使用者要求僅驗證結構，未呼叫 Webhook、未建立真實 Jira 票）
- 單元測試覆蓋率 100%

---

## Phase 2 — Jira 查詢 proxy（~1h，全部 🤖，隨 Frontend Phase 2 一起開發）

### T05 — 實作 Jira 查詢 proxy（Node.js + Express） ✅　🤖 AI 執行

**依賴**：`tasks-devops.md` T02（Jira credential）

只服務「讀取 Jira 票狀態」這個需求，不做其他業務邏輯。前端不直接持有 Jira credential，一律透過這層 proxy 查詢。詳見 `_note/decisions.md`「Frontend Phase 2 新增輕量 Node.js proxy 後端」。

**完成定義**：
- 測試命名：`應該_回傳票狀態_當查詢有效的Jira票號`
- 🔴 紅燈確認：proxy 未實作前，前端無法取得票狀態 ✅ 已重現（module not found）
- 🟢 綠燈確認：呼叫 proxy 查詢 `ASJ-115`，回傳正確的票狀態資訊，且瀏覽器開發者工具的網路請求中看不到 Jira API Token ✅ 已於 2026-07-15 實測，回傳 `{"key":"ASJ-115","summary":"[T測試] n8n自動建票驗證","status":"待辦事項"}`，token 只存在 proxy 端 `.env`（已加入 `.gitignore`），不會出現在前端請求或回應中
- 單元測試覆蓋率 100% ✅ 2 個測試皆通過（含 mock 404 錯誤路徑）

---

### T07 — 新增端點：列出所有已產出的功能（`GET /api/features`） ✅　🤖 AI 執行

讀取 `_spec/` 底下的資料夾清單，回傳給前端做選單。

**完成定義**：
- 測試命名：`應該_回傳功能清單_當_spec目錄下有子資料夾`
- 🔴 紅燈確認：端點未實作前，前端無法取得功能清單
- 🟢 綠燈確認：回傳陣列，內容與 `_spec/` 底下實際資料夾一致
- 單元測試覆蓋率 100%

---

### T08 — 新增端點：讀取指定功能的文件（`GET /api/documents/:feature`） ✅　🤖 AI 執行

**依賴**：T07

讀取 `_spec/<feature>/*.md`，回傳 `{ 檔名: 內容 }` 物件。

**完成定義**：
- 測試命名：`應該_回傳該功能所有文件內容_當功能存在`
- 🔴 紅燈確認：端點未實作前，前端無法取得文件內容
- 🟢 綠燈確認：回傳物件的 key 與 `_spec/<feature>/` 底下實際 `.md` 檔名一致，value 為檔案內容
- 單元測試覆蓋率 100%

---

### T09 — 新增端點：讀取指定功能已建立的 Jira 票（`GET /api/features/:feature/issues`） ✅　🤖 AI 執行

讀取 `_spec/<feature>/jira-issues.json`（由 T04 任務轉換模組呼叫 Webhook 後寫入，見 T04 更新），檔案不存在時回傳空陣列。

**完成定義**：
- 測試命名：`應該_回傳票號清單_當jira-issues.json存在`
- 測試命名：`應該_回傳空陣列_當jira-issues.json不存在`
- 🔴 紅燈確認：端點未實作前，前端無法取得票號清單
- 🟢 綠燈確認：兩種情境皆回傳正確結果
- 單元測試覆蓋率 100%

---

### T06 — 「送出需求」端點 ❌ 已移除，不做

**移除原因**（2026-07-15）：原本縮小範圍成「只存成 `_idea/<日期時間>.md`」，但實測後判定使用者還是要回來跟 Claude Code 對話才能真正產出文件，這一圈繞路沒有實質省事。`/api/requirements` 端點與其測試已刪除，前端維持純查詢功能。詳見 `_note/decisions.md`。
