/**
 * bb-browser CLI 入口 (OpenClaw 版)
 */

import { siteCommand } from "./commands/site.js";
import { setJqExpression } from "./client.js";

declare const __BB_BROWSER_VERSION__: string;

const VERSION = typeof __BB_BROWSER_VERSION__ !== "undefined" ? __BB_BROWSER_VERSION__ : "unknown";

const HELP_TEXT = `
bb-browser - AI Agent 浏览器自动化工具 (Powered by OpenClaw)

用法：
  bb-browser <command> [options]

开始使用：
  site list                    列出所有 adapter
  site info <name>             查看 adapter 用法（参数、返回值、示例）
  site <name> [args]           运行 adapter
  site update                  更新社区 adapter 库
  guide                        如何把任何网站变成 adapter
  star                         ⭐ Star bb-browser on GitHub

选项：
  --json               以 JSON 格式输出
  --jq <expr>          对 JSON 输出应用 jq 过滤
  --help, -h           显示帮助信息
  --version, -v        显示版本号
`.trim();

interface ParsedArgs {
  command: string | null;
  args: string[];
  flags: {
    json: boolean;
    help: boolean;
    version: boolean;
    jq?: string;
  };
}

/**
 * 解析命令行参数
 */
function parseArgs(argv: string[]): ParsedArgs {
  const args = argv.slice(2); // 跳过 node 和脚本路径

  const result: ParsedArgs = {
    command: null,
    args: [],
    flags: {
      json: false,
      help: false,
      version: false,
    },
  };

  let skipNext = false;
  for (const arg of args) {
    if (skipNext) {
      skipNext = false;
      continue;
    }
    if (arg === "--json") {
      result.flags.json = true;
    } else if (arg === "--jq") {
      skipNext = true;
      const nextIdx = args.indexOf(arg) + 1;
      if (nextIdx < args.length) {
        result.flags.jq = args[nextIdx];
        result.flags.json = true;
      }
    } else if (arg === "--help" || arg === "-h") {
      result.flags.help = true;
    } else if (arg === "--version" || arg === "-v") {
      result.flags.version = true;
    } else if (arg.startsWith("-")) {
      // 未知选项，忽略
    } else if (result.command === null) {
      result.command = arg;
    } else {
      result.args.push(arg);
    }
  }

  return result;
}

/**
 * 主函数
 */
async function main(): Promise<void> {
  const parsed = parseArgs(process.argv);
  setJqExpression(parsed.flags.jq);

  if (parsed.flags.version) {
    console.log(VERSION);
    return;
  }

  if (parsed.flags.help || !parsed.command) {
    console.log(HELP_TEXT);
    return;
  }

  try {
    switch (parsed.command) {
      case "site": {
        await siteCommand(parsed.args, {
          json: parsed.flags.json,
          jq: parsed.flags.jq,
        });
        break;
      }

      case "star": {
        const { execSync } = await import("node:child_process");
        try {
          execSync("gh auth status", { stdio: "pipe" });
        } catch {
          console.error("需要先安装并登录 GitHub CLI: https://cli.github.com");
          console.error("  brew install gh && gh auth login");
          process.exit(1);
        }
        const repos = ["epiral/bb-browser", "epiral/bb-sites"];
        for (const repo of repos) {
          try {
            execSync(`gh api user/starred/${repo} -X PUT`, { stdio: "pipe" });
            console.log(`⭐ Starred ${repo}`);
          } catch {
            console.log(`Already starred or failed: ${repo}`);
          }
        }
        console.log("\\nThanks for your support! 🙏");
        break;
      }

      case "guide": {
        console.log(`How to turn any website into a bb-browser site adapter
=======================================================

1. REVERSE ENGINEER the API
   openclaw browser evaluate ...

2. WRITE the adapter (one JS file per operation)

   /* @meta
   {
     "name": "platform/command",
     "description": "What it does",
     "domain": "www.example.com",
     "args": { "query": {"required": true, "description": "Search query"} },
     "readOnly": true,
     "example": "bb-browser site platform/command value"
   }
   */
   async function(args) {
     if (!args.query) return {error: 'Missing argument: query'};
     const resp = await fetch('/api/search?q=' + encodeURIComponent(args.query), {credentials: 'include'});
     if (!resp.ok) return {error: 'HTTP ' + resp.status, hint: 'Not logged in?'};
     return await resp.json();
   }

3. TEST it
   Save to ~/.bb-browser/sites/platform/command.js (private, takes priority)
   bb-browser site platform/command "test query" --json

4. CONTRIBUTE
   Option A (with gh CLI):
     git clone https://github.com/epiral/bb-sites && cd bb-sites
     git checkout -b feat-platform
     # add adapter files
     git push -u origin feat-platform
     gh pr create --repo epiral/bb-sites

Private adapters:  ~/.bb-browser/sites/<platform>/<command>.js
Community:         ~/.bb-browser/bb-sites/ (via bb-browser site update)
Full guide:        https://github.com/epiral/bb-sites/blob/main/SKILL.md`);
        break;
      }

      default: {
        console.error(`错误：未知命令 "${parsed.command}"`);
        console.error("运行 bb-browser --help 查看可用命令");
        process.exit(1);
      }
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    if (parsed.flags.json) {
      console.log(
        JSON.stringify({
          success: false,
          error: message,
        })
      );
    } else {
      console.error(`错误：${message}`);
    }

    process.exit(1);
  }
}

main().then(() => process.exit(0));
