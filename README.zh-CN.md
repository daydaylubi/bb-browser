<div align="center">

# bb-browser (OpenClaw 专属精简版)

### 让你的 OpenClaw 浏览器成为原生 API

**你的浏览器就是 API。不需要密钥，不需要爬虫，无需模拟。**

[![npm](https://img.shields.io/npm/v/bb-browser?color=CB3837&logo=npm&logoColor=white)](https://www.npmjs.com/package/bb-browser)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

[English](README.md) · [中文](README.zh-CN.md)

</div>

---

**bb-browser** 经过深度精简与重构，现在是一个专门为 [OpenClaw](https://openclaw.ai) 打造的无状态终端适配器引擎。

它将 36 个平台、100+ 个抓取命令直接桥连进 OpenClaw 真实的浏览器环境中让 AI Agent 调用，让你手下的每一个大模型/脚本能够无缝且毫无察觉地**复用你正在使用的账号登录态**，实现最高级别的数据提取。

```bash
# 常见 Agent 终端操作流示例：
bb-browser site twitter/search "AI agent"       # 搜索推文
bb-browser site zhihu/hot                        # 获取知乎热榜
bb-browser site youtube/transcript VIDEO_ID      # 获取完整视频字幕全文
```

## 核心架构原理

目前该项目是一个**纯粹的中间层任务派发 CLI**。它不维持 WebSocket 会话，不绑定任何后台常驻 Daemon，不干涉 Chrome 本地调试。

一切通过操作系统层级原生地调用 `openclaw` shell 接口进行指令集分发。它负责找到正确的社区抓取代码（Adapter），将其注入到命令 `openclaw browser evaluate` 中并接管 JSON 输出。因为代码就运行在你的 OpenClaw Tab 中，“网站以为是你在操作，因为那就是你。”

## 入门指南

### 1. 运行条件
请确保 Node.js 在 v18 以上，并且您的系统环境变量中已经具备全局可用的 `openclaw` 命令。

### 2. 构建与全局挂载
进入项目根目录并在本地执行编译：

```bash
pnpm install
pnpm run build
```

编译成功后，将本工具挂载到系统全局全局可用，以便各类 Agent 在任意工作目录自由调用：
```bash
pnpm link --global
```

### 3. 同步官方抓取适配器库
首次使用请必须同步位于 GitHub 上的开源站点头部抓取逻辑库：
```bash
bb-browser site update
```

## CLI 使用方法

目前，系统功能完全收敛在 `site` 命名空间内。

```bash
bb-browser site list                       # 列出所有平台及适配器
bb-browser site search <query>             # 关键词搜索任意平台指令
bb-browser site info <name>                # 查看某个命令必须要带的具体参数
bb-browser site <name> [args]              # 启动执行该网站的抓取逻辑
```

所有结果默认支持链式结构化过滤。如果你在终端只需提纯一部分节点段，可以搭配内建的 `--jq` 命令使用：
```bash
bb-browser site xueqiu/hot-stock 5 --jq '.items[] | {name, changePercent}'
```

## 供 AI Agent 接入

对于上层调度架构（例如 Claude Code, Cursor, 还是复杂的 LangChain/Dify），Agent 本身甚至不需要知道网页长什么样。无需部署那些脆弱的 Selenium 环境。

只需在系统的终端里调用：
```bash
bb-browser site <分类/命令> <参数>
```
只要网站要求登录，由于它调用的是正在运行的 OpenClaw 环境，您本人在里头登录一次即可，机器随后便能肆意抓取其私域信息。

## 开源协议

[MIT](LICENSE)
