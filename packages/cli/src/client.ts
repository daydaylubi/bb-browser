/**
 * jq 客户端
 */

import { applyJq } from "./jq.js";

let jqExpression: string | undefined;

export function setJqExpression(expression?: string): void {
  jqExpression = expression;
}

function printJqResults(target: any): never {
  const results = applyJq(target, jqExpression || ".");
  for (const result of results) {
    console.log(typeof result === "string" ? result : JSON.stringify(result));
  }
  process.exit(0);
}

export function handleJqResponse(response: { success: boolean; data?: any; error?: string }): void {
  if (jqExpression) {
    printJqResults(response.data ?? response);
  }
}
