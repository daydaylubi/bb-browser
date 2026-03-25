---
name: bb-browser
description: Turn the web into a CLI command. Executes data extraction scripts directly within the user's native browser tabs, reusing their active login state. Provides clean and structured JSON output.
requires:
  bins: bb-browser, openclaw
allowed-tools: Bash(bb-browser:*)
---

# bb-browser sites — The web as CLI for AI Agents

**bb-browser** bridges structured data extraction commands directly into the user's native browsing session.

## When to Use This Skill

You should proactively use this skill whenever the user asks you to:
- **Search for real-time information** across social media (Twitter, Reddit, Weibo, Xiaohongshu), news, or developer platforms (GitHub, HackerNews).
- **Extract structured data** from a specific URL or platform (e.g., "Summarize this YouTube video", "Get the latest trending topics on Zhihu").
- **Access authenticated content** (e.g., retrieving data from domains where the user is already logged in, since this tool executes inside their active browser session).

*Do NOT try to use raw `curl`, `python requests`, or scrape HTML manually for supported platforms. Always check `bb-browser site list` or `bb-browser site search <query>` first to see if an adapter exists.*

## Core Directives for Data Extraction

1. **General Usage**
   Execute tasks by running: `bb-browser site <name> [args]`.
2. **Handle Auth Gracefully**
   If a command returns an `HTTP 401` or `Not logged in` error, you MUST stop and ask the user to log into that website manually in their browser. Do not attempt to guess credentials.
3. **Parse Cleanly**
   All output is JSON by default. If you only need certain fields, use the built-in `--jq` flag to filter the output early and save context window constraints.
4. **Finding Adapters (Crucial)**
   NEVER pipe `site list` to `grep` (e.g., `site list | grep twitter`), as the output is tree-formatted and `grep` will falsely truncate the available commands. You MUST use the built-in search command: `bb-browser site search <query>`.

## Standard Workflow for AI Agents

Whenever you need to extract information from a specific website, strictly follow this execution sequence:

1. **Search for Adapters** (Do NOT dump the entire list)
   Directly use the search command to find if an adapter exists for your target platform.
   *(Tip: If a search yields no results, try common alternative names or English aliases. e.g., "x" -> "twitter", "小红书" -> "xiaohongshu", "B站" -> "bilibili")*.
   ```bash
   bb-browser site search <keyword>
   ```
2. **Check Adapter Requirements**
   Once you identify the adapter name (e.g., `reddit/thread`), you MUST read its argument requirements before execution to avoid missing parameters.
   ```bash
   bb-browser site info <adapter_name>
   ```
3. **Execute & Parse**
   Run the adapter. Use `--jq` if you need to filter the JSON payload.
   ```bash
   bb-browser site <adapter_name> [args]
   ```

*(Note: Run `bb-browser site update` if you suspect the local adapter library is missing expected newer scripts).*

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

If you need data from a website that isn't supported yet, you can build a new adapter!
```bash
bb-browser guide
```
Read the guide to learn how to reverse engineer a site using fetch calls, write an adapter, and execute it locally from `~/.bb-browser/sites/`.
