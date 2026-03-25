---
name: bb-browser-openclaw
description: Turn the web into a CLI command. 36 platforms, 103 commands. Executes data extraction scripts directly within OpenClaw's native browser tabs, reusing the user's active login state. Provide clean and structured JSON output.
requires:
  bins: bb-browser, openclaw
allowed-tools: Bash(bb-browser:*)
---

# bb-browser sites — The web as CLI for OpenClaw

**bb-browser** is a dedicated adapter engine that bridges structured data extraction commands directly into the **OpenClaw native browser**.

There is no daemon, no Chrome extension, and no WebDriver involved. When you run `bb-browser site xxx`, it automatically connects to `openclaw browser evaluate` to execute logic securely inside the user's ongoing browsing session.

## Core Directives for AI Agents

1. **NEVER use the `--openclaw` flag**
   The tool is already hardwired for OpenClaw. Simply run: `bb-browser site <name> [args]`.
2. **Handle Auth Gracefully**
   If a command returns an `HTTP 401` or `Not logged in` error, you MUST stop and ask the user to log into that website manually inside their OpenClaw browser. Do not attempt to guess credentials.
3. **Parse Cleanly**
   All output is JSON by default. If you only need certain fields, use the built-in `--jq` flag to filter the output early and save context window.

## Quick Start

```bash
# First time setup / update library
bb-browser site update

# List all available adapters
bb-browser site list

# Read argument requirements for a specific adapter (parameters, usage)
bb-browser site info reddit/thread
```

## Data Extraction Examples

```bash
# Search & Social Media
bb-browser site twitter/search "AI agent"
bb-browser site reddit/thread <post-url>
bb-browser site weibo/hot
bb-browser site xiaohongshu/search "query"

# Developer & Tech
bb-browser site github/repo owner/repo
bb-browser site github/issues owner/repo
bb-browser site hackernews/top 10
bb-browser site stackoverflow/search "async await"
bb-browser site arxiv/search "transformer"

# Finance & News
bb-browser site xueqiu/stock SH600519
bb-browser site eastmoney/stock "茅台"
bb-browser site zhihu/hot
bb-browser site 36kr/newsflash

# Video
bb-browser site youtube/transcript VIDEO_ID
bb-browser site bilibili/search "query"
```

## Advanced Filtering with --jq

Use `--jq` to extract specific fields efficiently mapping over arrays (implied JSON parsing).

```bash
# Just extract stock names
bb-browser site xueqiu/hot-stock 5 --jq '.items[].name'

# Specific fields as objects
bb-browser site xueqiu/hot-stock 5 --jq '.items[] | {name, changePercent, heat}'

# Filter Reddit posts
bb-browser site reddit/hot --jq '.posts[] | {title, score}'
```

## Missing a Website? 

If the user needs data from a website that isn't supported yet, you (`the AI agent`) can build a new adapter!
```bash
bb-browser guide
```
Read the guide to learn how to reverse engineer a site using fetch calls, write an adapter, and execute it locally from `~/.bb-browser/sites/`.
