# 工作流程規範（本專案補充）

> 基礎規範沿用工作區共用的 `_rule/workflow.md`，本檔案只記錄本專案獨有的差異。

## 分支保留策略

- 一般功能分支（`feature/*`、`fix/*`、`chore/*`）：沿用共用規範，merge 進 main 後照舊刪除
- **重要版本分支（`version/v<N>-<描述>`）：merge 進 main 之後不刪除**，永久保留，供事後追溯每個優化版本對應的程式碼狀態
  - 命名範例：`version/v1-no-notion`（核心流程，不含 Notion 整合）
  - 之後每次做較大幅度的架構優化（例如加入 Notion 整合），開新的 `version/v2-<描述>` 分支開發，驗證通過後 merge 進 main，分支保留不刪
