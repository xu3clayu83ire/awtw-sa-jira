# SA 文件產出與 Jira 自動開票工具 — Frontend 任務

## 前置閱讀
- `_spec/sa-doc-jira-ticketing/requirement.md`（功能期望第 1、6 項；優先順序表 Should 項目）
- `_spec/sa-doc-jira-ticketing/design.md`（模組拆解：進度儀表板網頁）
- `_note/decisions.md`（[2026-07-15] 網頁前端與核心自動化流程分階段開發的決策理由）

> ⚠️ **本 Phase 屬 Should，待 Backend Phase 1（`tasks-backend.md`）與 QA 核心驗收通過後才開始**，不阻塞核心流程的完成與驗收。

---

## Phase 2 — 獨立網頁（~4h，全部 🤖，待核心流程驗證通過後啟動）

### T01 — 需求輸入表單 ❌ 已移除，不做

**移除原因**（2026-07-15）：實測發現「送出需求」無法真正觸發文件產出（`/addyosmani-saspec` 是 Claude Code 互動對話，網頁後端無法同步呼叫拿到結果），縮小範圍後只是把需求存成 `_idea/<日期時間>.md`，使用者還是要回來跟 Claude Code 對話才能真正產出文件——這一圈繞路沒有實質省事，判定為沒有意義，予以移除。前端維持純查詢功能（文件檢視器 + 進度儀表板）。詳見 `_note/decisions.md`。

元件與測試（`RequirementForm.jsx`／`.test.jsx`）與後端 `/api/requirements` 端點皆已刪除。

---

### T02 — 文件檢視器 ✅　🤖 AI 執行

顯示已產出的 `requirement.md`／`design.md`／`tasks-*.md`，渲染 Markdown。

**完成定義**：
- 測試命名：`應該_正確渲染四份文件內容_當文件已產出`
- 🔴 紅燈確認：文件未產出前，檢視器顯示空狀態，不報錯 ✅ 已重現
- 🟢 綠燈確認：文件產出後，畫面正確顯示對應內容 ✅ 已測試通過
- 單元測試覆蓋率 100% ✅ 2 個測試皆通過

---

### T03 — 進度儀表板（讀取 Jira 狀態，不寫回） ✅　🤖 AI 執行

**依賴**：`tasks-backend.md` T05（Jira 查詢 proxy）

透過 `tasks-backend.md` T05 的 proxy 讀取 Jira 票狀態並顯示，僅供顯示，不寫回 `tasks-*.md`，前端不直接呼叫 Jira API、不持有任何憑證。

**完成定義**：
- 測試命名：`應該_顯示Jira票即時狀態_當呼叫Jira API成功`
- 🔴 紅燈確認：未串接 API 前，儀表板顯示空狀態 ✅ 已重現
- 🟢 綠燈確認：串接後畫面狀態與 Jira 實際票狀態一致，且不修改任何本地文件 ✅ 已測試通過，並額外驗證所有 fetch 呼叫皆為 GET（無寫入呼叫）
- 單元測試覆蓋率 100% ✅

---

### T04 — 動態串接：功能選單 + 真實文件 + 真實票號 ✅　🤖 AI 執行

**依賴**：`tasks-backend.md` T07、T08、T09

原本 T02／T03 各自吃到的資料是寫死的（空文件、`ASJ-115` 寫死陣列）。本任務把 `App.jsx` 改成：
1. 進站抓 `GET /api/features` 列出所有已產出規格的功能，做成選單
2. 選定功能後抓 `GET /api/documents/:feature` 顯示真實文件
3. 同時抓 `GET /api/features/:feature/issues` 取得這個功能對應的真實 Jira 票號，餵給 `ProgressDashboard`

**完成定義**：
- 測試命名：`應該_動態顯示選定功能的文件與票號_當API回傳資料`
- 🔴 紅燈確認：串接前，`App.jsx` 顯示固定的空文件與寫死的 `ASJ-115` ✅ 已重現
- 🟢 綠燈確認：mock 三個端點回傳資料後，畫面正確顯示對應功能的文件標題與票號 ✅ 已測試通過
- 單元測試覆蓋率 100%
