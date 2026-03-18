# AgentFi

AgentFi 是一个面向高阶 crypto 交易用户的 AI 决策与执行工具（非资管平台）。

## 90 天验证目标

北极星指标：

> 是否有一批高阶用户愿意持续使用并付费。

当前产品聚焦：

- Agent 创建与运行
- 策略建议 + 执行建议
- 半自动下单（人工确认）
- 风控开关（仓位、止损、频率）
- 决策日志（可解释、可回放）

暂不提供：

- AUM / 分润 / 跟投
- 策略市场
- 多交易所大而全接入（当前以单连接配置、真实行情模式、任务调度与本地持久化为生产接入骨架）

## 核心验证指标

1. Agent 创建后真实启动率
2. 7 天 / 30 天留存
3. 半自动执行频次
4. 决策日志查看率
5. 付费转化率

## 本地开发

```bash
npm install
npm run dev
```

打开 <http://localhost:3000> 查看。

## 代码检查

```bash
npm run lint
```

## 当前“生产接入”骨架

- **真实交易所接入**：设置页支持保存交易所 venue、API Key / Secret、passphrase、testnet 开关与连接状态。
- **真实行情模式**：可在模拟行情与真实行情之间切换，并保存 provider / tick interval 配置。
- **任务调度**：可配置后台 cadence、自动恢复 Agent、checkpoint 持久化开关。
- **持久化**：平台状态通过 Zustand persist 保存到浏览器 `localStorage`，用于 demo 阶段验证跨刷新保留状态。

> 当前仍是前端 demo 骨架，尚未实际直连交易所 REST / WebSocket 或后端任务队列。
