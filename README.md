<div align="center">

# bb-browser (OpenClaw Edition)

### The API For Your OpenClaw Browser

**Your browser is the API. No keys. No bots. No scrapers.**

[![npm](https://img.shields.io/npm/v/bb-browser?color=CB3837&logo=npm&logoColor=white)](https://www.npmjs.com/package/bb-browser)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

[English](README.md) · [中文](README.zh-CN.md)

</div>

---

**bb-browser** is a highly customized CLI abstraction engine built exclusively to supercharge your [OpenClaw](https://openclaw.ai) native browser.

It bridges 36+ platforms and 100+ community scraping adapters directly into OpenClaw's browsing context, meaning your AI agents can execute deeply authenticated data extraction operations seamlessly, reusing your existing logins.

```bash
# Example agent workflows:
bb-browser site twitter/search "AI agent"       # Search latest tweets
bb-browser site zhihu/hot                        # Fetch trending topics
bb-browser site youtube/transcript VIDEO_ID      # Get full video transcript
```

## How It Works

This repository is purely an **adapter execution CLI**. It delegates Chrome processes and session management entirely to the Native `openclaw` shell command.

Instead of parsing the DOM manually, bb-browser reads the target scrape adapter script (which contains internal API reverse-engineering logic), injects it as an async payload via `openclaw browser evaluate`, and securely pipes back the clean structured JSON.

## Quick Start

### 1. Prerequisites
Ensure you have Node.js (v18+) and [OpenClaw](https://openclaw.ai) properly installed in your system PATH.

### 2. Install & Build
Compile the streamlined pnpm workspace:

```bash
pnpm install
pnpm run build
```

Then, link it globally so your AI Agents can invoke it as a native command from anywhere:
```bash
pnpm link --global
```

### 3. Sync Adapter Library
Before running tasks, pull the community adapter library locally:
```bash
bb-browser site update
```

## Usage commands

The core namespace is `site`.

```bash
bb-browser site list                       # List all supported adapters
bb-browser site search <query>             # Find a specific adapter
bb-browser site info <name>                # Read arguments and descriptions for an adapter
bb-browser site <name> [args]              # Execute the adapter via OpenClaw
```

All commands seamlessly accept the `--jq` operator to parse, format, or extract nested outputs cleanly from the terminal without leaving your CLI workflow:
```bash
bb-browser site xueqiu/hot-stock 5 --jq '.items[] | {name, changePercent}'
```

## AI Agent Integration

Your AI Agent (Claude Code, Cursor, LangChain script) doesn't need to spin up Chrome plugins or WebSocket Servers. It simply invokes the bash command:

```bash
bb-browser site <platform/feature> <args...>
```
If the targeted site requires authentication, you just log into the target domains natively inside OpenClaw once. The agent scripts operate instantly across the authenticated browsing session.

## License

[MIT](LICENSE)
