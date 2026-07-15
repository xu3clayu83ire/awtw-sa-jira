# 網頁 UI 改用文件站樣式呈現 — DevOps 任務

## 前置閱讀
- `_spec/hugo-book-ui/requirement.md`
- `_spec/hugo-book-ui/design.md`（技術架構）

---

## Phase 0 — Hugo 環境建置（~30min）

### T01 — 安裝 Hugo ✅　🤖 AI 執行

確認本機是否已安裝 Hugo（`awtw-short-url-service-agent/hugo-docs` 已在用，可能已裝過），未安裝則安裝。

**完成定義**：
- 🟢 綠燈確認：`hugo version` 執行成功 ✅ 已於 2026-07-15 確認，本機已安裝 `v0.163.3-extended`，不需重裝

---

### T02 — 建立 `hugo-docs/` 專案結構與 `hugo-book` 主題 ✅　🤖 AI 執行

**依賴**：T01

比照 `awtw-short-url-service-agent/hugo-docs` 的作法，在 `awtw-sa-jira/` 底下建立 `hugo-docs/`，加入 `hugo-book` 主題（git submodule 或直接 clone 進 `themes/`）。

**完成定義**：
- 🟢 綠燈確認：`hugo-docs/themes/hugo-book/` 存在，`hugo.toml` 設定 `theme = "hugo-book"` ✅ 已於 2026-07-15 以 `git submodule add https://github.com/alex-shpak/hugo-book` 完成，與短網址專案同一個上游來源

---

### T03 — 建立 `hugo.toml` 設定檔 ✅　🤖 AI 執行

**依賴**：T02

依 `design.md` 設定 `BookMenuFromFiles`、`BookToC`、`BookSearch`。

**完成定義**：
- 🟢 綠燈確認：`hugo server` 能成功啟動，瀏覽器開啟 `http://localhost:1313` 顯示頁面（即使內容還是空的） ✅ 已於 2026-07-15 實測，回應 200
