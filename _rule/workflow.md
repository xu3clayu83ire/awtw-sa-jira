# 工作流程規範（本專案補充）

> 基礎規範沿用工作區共用的 `_rule/workflow.md`，本檔案只記錄本專案獨有的差異。

## 版本開發與標記策略

- 一般功能分支（`feature/<小功能>`、`fix/*`、`chore/*`）：沿用共用規範，merge 進 main 後照舊刪除，不永久保留
- **較大幅度的優化版本，開發期間用 `feature/v<N>-<描述>` 分支**（例如 `feature/v1-no-notion`），在這條分支上持續累積 commit，還沒做完之前不 merge 進 main
  - main 保持在「上一個已完成版本」的狀態，避免半成品進到 main
- **這個版本真正做完、驗證通過後**：merge 進 main，並對 merge 後的 commit 打 annotated tag `v<N>-<描述>`（例如 `v1-no-notion`），標記這個版本完成的定點
  - tag 是不可變的完成標記；分支是還在動的開發線。開發中用分支，完成後才打 tag，兩者搭配使用，不要用 tag 標記還沒做完的東西
