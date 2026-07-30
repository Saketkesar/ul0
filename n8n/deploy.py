#!/usr/bin/env python3
"""
Enterprise n8n YouTube Automation — Deployment Script
=====================================================
Deploys 18 modular workflows to an n8n instance via its REST API.

Usage:
    python3 deploy.py

Reads API key from ./apikey.txt (same directory as this script).
"""

import json
import uuid
import time
import urllib.request
import urllib.error
import os
import sys
from typing import Any

# ─────────────────────────────────────────────
# Configuration
# ─────────────────────────────────────────────
BASE_URL = "https://n8n.saket.bond"
API_BASE = f"{BASE_URL}/api/v1"
WEBHOOK_BASE = f"{BASE_URL}/webhook"
GROQ_CRED_ID = "hKzckkiDP5y9jq7B"
GROQ_CRED_NAME = "Groq account"
WORK_DIR = "/tmp/n8n-youtube"
GROQ_MODEL = "llama-3.3-70b-versatile"
GROQ_MODEL_FAST = "llama-3.1-8b-instant"

# Load API key
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
with open(os.path.join(SCRIPT_DIR, "apikey.txt"), "r") as f:
    API_KEY = f.read().strip()


# ─────────────────────────────────────────────
# Webhook path registry (known upfront)
# ─────────────────────────────────────────────
WEBHOOKS = {
    "01": "yt-pipeline-trend-collector",
    "02": "yt-pipeline-topic-ranking",
    "03": "yt-pipeline-seo-research",
    "04": "yt-pipeline-script-generator",
    "05": "yt-pipeline-fact-checker",
    "05a": "yt-pipeline-fact-approval",
    "06": "yt-pipeline-image-prompt-gen",
    "07": "yt-pipeline-image-generator",
    "08": "yt-pipeline-voice-generator",
    "09": "yt-pipeline-subtitle-generator",
    "10": "yt-pipeline-ffmpeg-video",
    "11": "yt-pipeline-thumbnail-gen",
    "12": "yt-pipeline-youtube-metadata",
    "13": "yt-pipeline-youtube-upload",
    "14": "yt-pipeline-analytics-db",
    "15": "yt-pipeline-telegram-report",
    "17": "yt-pipeline-error-handler",
}


def webhook_url(key: str) -> str:
    return f"{WEBHOOK_BASE}/{WEBHOOKS[key]}"


# ─────────────────────────────────────────────
# n8n API Client
# ─────────────────────────────────────────────
class N8nClient:
    def __init__(self, api_base: str, api_key: str):
        self.api_base = api_base
        self.api_key = api_key

    def _request(self, method: str, path: str, data: dict | None = None) -> dict:
        url = f"{self.api_base}{path}"
        body = json.dumps(data).encode("utf-8") if data else None
        req = urllib.request.Request(
            url,
            data=body,
            method=method,
            headers={
                "X-N8N-API-KEY": self.api_key,
                "Content-Type": "application/json",
                "Accept": "application/json",
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            },
        )
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                return json.loads(resp.read().decode("utf-8"))
        except urllib.error.HTTPError as e:
            error_body = e.read().decode("utf-8") if e.fp else ""
            print(f"  ✗ HTTP {e.code}: {error_body[:500]}")
            raise

    def get(self, path: str) -> dict:
        return self._request("GET", path)

    def post(self, path: str, data: dict) -> dict:
        return self._request("POST", path, data)

    def put(self, path: str, data: dict) -> dict:
        return self._request("PUT", path, data)

    def delete(self, path: str) -> dict:
        return self._request("DELETE", path)

    # High-level methods
    def create_tag(self, name: str) -> dict:
        return self.post("/tags", {"name": name})

    def list_tags(self) -> list:
        return self.get("/tags")["data"]

    def list_workflows(self) -> list:
        return self.get("/workflows")["data"]

    def create_workflow(self, wf: dict) -> dict:
        return self.post("/workflows", wf)

    def update_workflow(self, wf_id: str, wf: dict) -> dict:
        return self.put(f"/workflows/{wf_id}", wf)

    def activate_workflow(self, wf_id: str) -> dict:
        return self.post(f"/workflows/{wf_id}/activate", {})

    def deactivate_workflow(self, wf_id: str) -> dict:
        return self.post(f"/workflows/{wf_id}/deactivate", {})

    def create_data_table(self, name: str) -> dict:
        return self.post("/data-tables", {"name": name})

    def list_data_tables(self) -> list:
        return self.get("/data-tables")["data"]

    def add_column(self, table_id: str, name: str, col_type: str = "string") -> dict:
        return self.post(
            f"/data-tables/{table_id}/columns",
            {"name": name, "dataType": col_type},
        )


# ─────────────────────────────────────────────
# Node Builder Helpers
# ─────────────────────────────────────────────
def _uid() -> str:
    return str(uuid.uuid4())


def schedule_trigger(name: str, pos: list, cron: str = "0 9 * * *") -> dict:
    """Daily schedule trigger. cron format: minute hour dom month dow"""
    parts = cron.split()
    return {
        "parameters": {
            "rule": {
                "interval": [
                    {
                        "field": "cronExpression",
                        "expression": cron,
                    }
                ]
            }
        },
        "type": "n8n-nodes-base.scheduleTrigger",
        "typeVersion": 1.3,
        "position": pos,
        "id": _uid(),
        "name": name,
    }


def webhook_trigger(name: str, path: str, pos: list) -> dict:
    return {
        "parameters": {
            "path": path,
            "httpMethod": "POST",
            "responseMode": "onReceived",
            "options": {},
        },
        "type": "n8n-nodes-base.webhook",
        "typeVersion": 2,
        "position": pos,
        "id": _uid(),
        "name": name,
    }


def code_node(name: str, js_code: str, pos: list, mode: str = "runOnceForAllItems") -> dict:
    return {
        "parameters": {"jsCode": js_code, "mode": mode},
        "type": "n8n-nodes-base.code",
        "typeVersion": 2,
        "position": pos,
        "id": _uid(),
        "name": name,
    }


def http_request(
    name: str,
    url: str,
    pos: list,
    method: str = "GET",
    body: str | None = None,
    content_type: str | None = None,
    headers: dict | None = None,
    response_format: str = "autodetect",
    retry: bool = False,
    on_error: str = "continueRegularOutput",
) -> dict:
    params: dict[str, Any] = {
        "url": url,
        "method": method,
        "options": {"response": {"response": {"responseFormat": response_format}}},
    }
    if body:
        params["sendBody"] = True
        params["specifyBody"] = "json"
        params["jsonBody"] = body
        if content_type:
            params["contentType"] = content_type
    if headers:
        params["sendHeaders"] = True
        params["headerParameters"] = {
            "parameters": [{"name": k, "value": v} for k, v in headers.items()]
        }
    node = {
        "parameters": params,
        "type": "n8n-nodes-base.httpRequest",
        "typeVersion": 4.4,
        "position": pos,
        "id": _uid(),
        "name": name,
    }
    if retry:
        node["retryOnFail"] = True
        node["maxTries"] = 3
        node["waitBetweenTries"] = 2000
    if on_error != "stopWorkflow":
        node["onError"] = on_error
    return node


def xml_node(name: str, pos: list) -> dict:
    return {
        "parameters": {"options": {}},
        "type": "n8n-nodes-base.xml",
        "typeVersion": 1,
        "position": pos,
        "id": _uid(),
        "name": name,
    }


def if_node(name: str, conditions: dict, pos: list) -> dict:
    return {
        "parameters": {"conditions": conditions, "options": {}},
        "type": "n8n-nodes-base.if",
        "typeVersion": 2.2,
        "position": pos,
        "id": _uid(),
        "name": name,
    }


def merge_node(name: str, pos: list, mode: str = "append", inputs: int = 2) -> dict:
    return {
        "parameters": {"mode": mode, "options": {}},
        "type": "n8n-nodes-base.merge",
        "typeVersion": 3.1,
        "position": pos,
        "id": _uid(),
        "name": name,
    }


def ai_agent(name: str, prompt: str, pos: list) -> dict:
    return {
        "parameters": {
            "promptType": "define",
            "text": prompt,
            "options": {},
        },
        "type": "@n8n/n8n-nodes-langchain.agent",
        "typeVersion": 3.1,
        "position": pos,
        "id": _uid(),
        "name": name,
    }


def groq_model(name: str, pos: list, model: str = GROQ_MODEL) -> dict:
    return {
        "parameters": {"model": model, "options": {}},
        "type": "@n8n/n8n-nodes-langchain.lmChatGroq",
        "typeVersion": 1,
        "position": pos,
        "id": _uid(),
        "name": name,
        "credentials": {"groqApi": {"id": GROQ_CRED_ID, "name": GROQ_CRED_NAME}},
    }


def error_trigger(name: str, pos: list) -> dict:
    return {
        "parameters": {},
        "type": "n8n-nodes-base.errorTrigger",
        "typeVersion": 1,
        "position": pos,
        "id": _uid(),
        "name": name,
    }


def set_node(name: str, assignments: list, pos: list) -> dict:
    """assignments: list of {"name": str, "value": str, "type": str}"""
    return {
        "parameters": {
            "mode": "manual",
            "assignments": {"assignments": assignments},
            "options": {},
        },
        "type": "n8n-nodes-base.set",
        "typeVersion": 3.4,
        "position": pos,
        "id": _uid(),
        "name": name,
    }


def noop_node(name: str, pos: list) -> dict:
    return {
        "parameters": {},
        "type": "n8n-nodes-base.noOp",
        "typeVersion": 1,
        "position": pos,
        "id": _uid(),
        "name": name,
    }


def execute_command(name: str, command: str, pos: list) -> dict:
    return {
        "parameters": {"command": command},
        "type": "n8n-nodes-base.executeCommand",
        "typeVersion": 1,
        "position": pos,
        "id": _uid(),
        "name": name,
    }


def split_in_batches(name: str, pos: list, batch_size: int = 1) -> dict:
    return {
        "parameters": {"batchSize": batch_size, "options": {}},
        "type": "n8n-nodes-base.splitInBatches",
        "typeVersion": 3,
        "position": pos,
        "id": _uid(),
        "name": name,
    }


def conn(from_node: str, to_node: str, from_output: int = 0) -> tuple:
    """Helper to build a connection tuple."""
    return (from_node, to_node, from_output)


def build_connections(conns: list[tuple]) -> dict:
    """Build n8n connections dict from list of (from_name, to_name, output_index) tuples."""
    result: dict = {}
    for from_name, to_name, output_idx in conns:
        if from_name not in result:
            result[from_name] = {"main": []}
        main = result[from_name]["main"]
        while len(main) <= output_idx:
            main.append([])
        main[output_idx].append({"node": to_name, "type": "main", "index": 0})
    return result


def build_ai_connections(model_node_name: str, agent_node_name: str) -> dict:
    """Build the ai_languageModel connection from a model to an agent."""
    return {
        model_node_name: {
            "ai_languageModel": [
                [{"node": agent_node_name, "type": "ai_languageModel", "index": 0}]
            ]
        }
    }


def merge_connection_dicts(*dicts: dict) -> dict:
    """Merge multiple connection dicts, combining entries for same node."""
    result: dict = {}
    for d in dicts:
        for node_name, connections in d.items():
            if node_name not in result:
                result[node_name] = {}
            for conn_type, outputs in connections.items():
                if conn_type not in result[node_name]:
                    result[node_name][conn_type] = outputs
                else:
                    existing = result[node_name][conn_type]
                    for i, output_list in enumerate(outputs):
                        while len(existing) <= i:
                            existing.append([])
                        existing[i].extend(output_list)
    return result


def workflow_settings() -> dict:
    return {
        "executionOrder": "v1",
    }


def build_workflow(name: str, nodes: list, connections: dict, tags: list | None = None) -> dict:
    wf: dict = {
        "name": name,
        "nodes": nodes,
        "connections": connections,
        "settings": workflow_settings(),
        "staticData": None,
        "pinData": {},
    }
    if tags:
        wf["tags"] = tags
    return wf


# ─────────────────────────────────────────────
# Error handler call (added to most workflows)
# ─────────────────────────────────────────────
def error_handler_nodes(pos_y: int = 600) -> tuple[list, dict]:
    """Returns (nodes, connections) for error trigger → call error handler."""
    et = error_trigger("Error Trigger", [0, pos_y])
    eh_call = http_request(
        "Call Error Handler",
        webhook_url("17"),
        [250, pos_y],
        method="POST",
        body='={{ JSON.stringify({ pipeline_id: $json.pipeline_id || "unknown", workflow: $json.workflow || "unknown", error: $json.error || $json, timestamp: new Date().toISOString() }) }}',
    )
    nodes = [et, eh_call]
    conns = build_connections([conn("Error Trigger", "Call Error Handler")])
    return nodes, conns


# ═════════════════════════════════════════════
# WORKFLOW DEFINITIONS
# ═════════════════════════════════════════════


# ─── 00: Master Scheduler ───────────────────
def w00_master_scheduler() -> dict:
    nodes = [
        schedule_trigger("Daily Schedule", [0, 0], "0 9 * * *"),
        code_node(
            "Generate Pipeline ID",
            """
const crypto = require('crypto');
const pipeline_id = crypto.randomUUID();
const now = new Date().toISOString();

return [{
  json: {
    pipeline_id,
    started_at: now,
    config: {
      max_videos_per_day: 3,
      target_duration: 35,
      format: "shorts",
      work_dir: "/tmp/n8n-youtube",
      sources: ["google_trends", "reddit", "hackernews", "google_news", "producthunt", "github_trending"]
    }
  }
}];
""",
            [250, 0],
        ),
        code_node(
            "Check Rate Limit",
            """
const items = $input.all();
const item = items[0].json;
// Use workflow static data to track daily count
const staticData = $getWorkflowStaticData('global');
const today = new Date().toISOString().split('T')[0];

if (staticData.date !== today) {
  staticData.date = today;
  staticData.count = 0;
}

const maxPerDay = item.config.max_videos_per_day || 3;
const rateLimited = staticData.count >= maxPerDay;

staticData.count = (staticData.count || 0) + 1;

return [{
  json: {
    ...item,
    rate_limited: rateLimited,
    daily_count: staticData.count,
    max_per_day: maxPerDay
  }
}];
""",
            [500, 0],
        ),
        if_node(
            "IF Not Rate Limited",
            {
                "options": {"caseSensitive": True, "leftValue": "", "typeValidation": "strict"},
                "conditions": [
                    {
                        "id": _uid(),
                        "leftValue": "={{ $json.rate_limited }}",
                        "rightValue": "false",
                        "operator": {"type": "string", "operation": "equals"},
                    }
                ],
                "combinator": "and",
            },
            [750, 0],
        ),
        http_request(
            "Call Trend Collector",
            webhook_url("01"),
            [1000, -100],
            method="POST",
            body='={{ JSON.stringify($json) }}',
        ),
        noop_node("Rate Limited - Skip", [1000, 100]),
    ]

    eh_nodes, eh_conns = error_handler_nodes(400)
    nodes.extend(eh_nodes)

    conns = build_connections([
        conn("Daily Schedule", "Generate Pipeline ID"),
        conn("Generate Pipeline ID", "Check Rate Limit"),
        conn("Check Rate Limit", "IF Not Rate Limited"),
        conn("IF Not Rate Limited", "Call Trend Collector", 0),  # true
        conn("IF Not Rate Limited", "Rate Limited - Skip", 1),   # false
    ])
    conns = merge_connection_dicts(conns, eh_conns)

    return build_workflow("00-Master-Scheduler", nodes, conns)


# ─── 01: Trend Collector ────────────────────
def w01_trend_collector() -> dict:
    nodes = [
        webhook_trigger("Webhook", WEBHOOKS["01"], [0, 0]),
        # Google Trends RSS
        http_request("Google Trends RSS", "https://trends.google.com/trending/rss?geo=US", [300, -500], on_error="continueRegularOutput"),
        xml_node("Parse Google Trends", [550, -500]),
        code_node("Format Google Trends", """
const items = $input.all();
const results = [];
try {
  const data = items[0].json;
  const entries = data?.rss?.channel?.[0]?.item || data?.channel?.item || [];
  const list = Array.isArray(entries) ? entries : [entries];
  for (const entry of list.slice(0, 15)) {
    results.push({
      json: {
        topic: entry.title?.[0] || entry.title || 'Unknown',
        source: 'google_trends',
        score: 80,
        url: entry.link?.[0] || entry.link || '',
        description: entry.description?.[0] || entry.description || ''
      }
    });
  }
} catch(e) { results.push({ json: { topic: 'parse_error', source: 'google_trends', score: 0, error: e.message } }); }
return results.length > 0 ? results : [{ json: { topic: 'no_data', source: 'google_trends', score: 0 } }];
""", [800, -500]),

        # Reddit
        http_request("Reddit Hot", "https://www.reddit.com/r/technology+science+worldnews+Futurology+artificial/hot.json?limit=20", [300, -250],
                      headers={"User-Agent": "n8n-bot/1.0"}, on_error="continueRegularOutput"),
        code_node("Format Reddit", """
const items = $input.all();
const results = [];
try {
  const posts = items[0].json?.data?.children || [];
  for (const p of posts.slice(0, 15)) {
    const d = p.data;
    results.push({
      json: {
        topic: d.title,
        source: 'reddit',
        score: Math.min(100, Math.round((d.ups || 0) / 100)),
        url: 'https://reddit.com' + d.permalink,
        subreddit: d.subreddit,
        description: (d.selftext || '').slice(0, 200)
      }
    });
  }
} catch(e) { results.push({ json: { topic: 'parse_error', source: 'reddit', score: 0, error: e.message } }); }
return results.length > 0 ? results : [{ json: { topic: 'no_data', source: 'reddit', score: 0 } }];
""", [550, -250]),

        # HackerNews
        http_request("HN Top Stories", "https://hacker-news.firebaseio.com/v0/topstories.json", [300, 0], on_error="continueRegularOutput"),
        code_node("Format HN IDs", """
const ids = $input.all()[0].json || [];
const topIds = Array.isArray(ids) ? ids.slice(0, 15) : [];
return topIds.map(id => ({ json: { id, url: 'https://hacker-news.firebaseio.com/v0/item/' + id + '.json' } }));
""", [550, 0]),
        http_request("Fetch HN Items", "={{ $json.url }}", [800, 0], on_error="continueRegularOutput"),
        code_node("Format HN", """
const items = $input.all();
return items.map(item => ({
  json: {
    topic: item.json.title || 'Unknown',
    source: 'hackernews',
    score: Math.min(100, Math.round((item.json.score || 0) / 10)),
    url: item.json.url || ('https://news.ycombinator.com/item?id=' + item.json.id),
    description: ''
  }
}));
""", [1050, 0]),

        # Google News RSS
        http_request("Google News RSS", "https://news.google.com/rss?hl=en-US&gl=US&ceid=US:en", [300, 250], on_error="continueRegularOutput"),
        xml_node("Parse Google News", [550, 250]),
        code_node("Format Google News", """
const items = $input.all();
const results = [];
try {
  const data = items[0].json;
  const entries = data?.rss?.channel?.[0]?.item || data?.channel?.item || [];
  const list = Array.isArray(entries) ? entries : [entries];
  for (const entry of list.slice(0, 10)) {
    results.push({
      json: {
        topic: (entry.title?.[0] || entry.title || 'Unknown').replace(/ - .*$/, ''),
        source: 'google_news',
        score: 70,
        url: entry.link?.[0] || entry.link || '',
        description: entry.description?.[0] || entry.description || ''
      }
    });
  }
} catch(e) { results.push({ json: { topic: 'parse_error', source: 'google_news', score: 0, error: e.message } }); }
return results.length > 0 ? results : [{ json: { topic: 'no_data', source: 'google_news', score: 0 } }];
""", [800, 250]),

        # Product Hunt (RSS)
        http_request("Product Hunt RSS", "https://www.producthunt.com/feed", [300, 500], on_error="continueRegularOutput"),
        xml_node("Parse Product Hunt", [550, 500]),
        code_node("Format Product Hunt", """
const items = $input.all();
const results = [];
try {
  const data = items[0].json;
  const entries = data?.rss?.channel?.[0]?.item || data?.feed?.entry || [];
  const list = Array.isArray(entries) ? entries : [entries];
  for (const entry of list.slice(0, 10)) {
    results.push({
      json: {
        topic: entry.title?.[0] || entry.title || 'Unknown',
        source: 'producthunt',
        score: 60,
        url: entry.link?.[0] || entry.link || '',
        description: entry.description?.[0] || entry.description || ''
      }
    });
  }
} catch(e) { results.push({ json: { topic: 'parse_error', source: 'producthunt', score: 0, error: e.message } }); }
return results.length > 0 ? results : [{ json: { topic: 'no_data', source: 'producthunt', score: 0 } }];
""", [800, 500]),

        # GitHub Trending
        http_request("GitHub Trending", "https://api.github.com/search/repositories?q=created:>={{ new Date(Date.now()-86400000).toISOString().split('T')[0] }}&sort=stars&order=desc&per_page=10", [300, 750],
                      headers={"User-Agent": "n8n-bot/1.0"}, on_error="continueRegularOutput"),
        code_node("Format GitHub", """
const items = $input.all();
const results = [];
try {
  const repos = items[0].json?.items || [];
  for (const r of repos.slice(0, 10)) {
    results.push({
      json: {
        topic: r.name + ': ' + (r.description || 'trending repo'),
        source: 'github_trending',
        score: Math.min(100, Math.round((r.stargazers_count || 0) / 50)),
        url: r.html_url,
        description: r.description || ''
      }
    });
  }
} catch(e) { results.push({ json: { topic: 'parse_error', source: 'github', score: 0, error: e.message } }); }
return results.length > 0 ? results : [{ json: { topic: 'no_data', source: 'github', score: 0 } }];
""", [550, 750]),

        # Merge All
        merge_node("Merge All Sources", [1300, 100], mode="append"),
        code_node("Deduplicate Topics", """
const items = $input.all();
const seen = new Map();
const results = [];

for (const item of items) {
  const topic = (item.json.topic || '').toLowerCase().trim();
  if (!topic || topic === 'no_data' || topic === 'parse_error') continue;
  // Simple dedup by checking if topic words overlap >60%
  let isDuplicate = false;
  const words = new Set(topic.split(/\\s+/).filter(w => w.length > 3));
  for (const [existing, _] of seen) {
    const existingWords = new Set(existing.split(/\\s+/).filter(w => w.length > 3));
    const overlap = [...words].filter(w => existingWords.has(w)).length;
    if (words.size > 0 && overlap / words.size > 0.6) {
      isDuplicate = true;
      break;
    }
  }
  if (!isDuplicate) {
    seen.set(topic, true);
    results.push(item);
  }
}

return results.length > 0 ? results : [{ json: { topic: 'no_trends_found', source: 'none', score: 0 } }];
""", [1550, 100]),

        # Pass pipeline context forward
        code_node("Attach Pipeline Context", """
const items = $input.all();
// Get original webhook data (pipeline_id etc) from the webhook node
const webhookData = $('Webhook').first().json;
return items.map(item => ({
  json: {
    ...item.json,
    pipeline_id: webhookData.pipeline_id || 'unknown',
    config: webhookData.config || {},
    started_at: webhookData.started_at || new Date().toISOString()
  }
}));
""", [1800, 100]),

        # Call next workflow
        http_request(
            "Call Topic Ranking",
            webhook_url("02"),
            [2050, 100],
            method="POST",
            body='={{ JSON.stringify({ pipeline_id: $json.pipeline_id, config: $json.config, started_at: $json.started_at, topics: $input.all().map(i => i.json) }) }}',
        ),
    ]

    eh_nodes, eh_conns = error_handler_nodes(1000)
    nodes.extend(eh_nodes)

    conns = build_connections([
        conn("Webhook", "Google Trends RSS"),
        conn("Webhook", "Reddit Hot"),
        conn("Webhook", "HN Top Stories"),
        conn("Webhook", "Google News RSS"),
        conn("Webhook", "Product Hunt RSS"),
        conn("Webhook", "GitHub Trending"),
        conn("Google Trends RSS", "Parse Google Trends"),
        conn("Parse Google Trends", "Format Google Trends"),
        conn("Reddit Hot", "Format Reddit"),
        conn("HN Top Stories", "Format HN IDs"),
        conn("Format HN IDs", "Fetch HN Items"),
        conn("Fetch HN Items", "Format HN"),
        conn("Google News RSS", "Parse Google News"),
        conn("Parse Google News", "Format Google News"),
        conn("Product Hunt RSS", "Parse Product Hunt"),
        conn("Parse Product Hunt", "Format Product Hunt"),
        conn("GitHub Trending", "Format GitHub"),
        conn("Format Google Trends", "Merge All Sources"),
        conn("Format Reddit", "Merge All Sources"),
        conn("Format HN", "Merge All Sources"),
        conn("Format Google News", "Merge All Sources"),
        conn("Format Product Hunt", "Merge All Sources"),
        conn("Format GitHub", "Merge All Sources"),
        conn("Merge All Sources", "Deduplicate Topics"),
        conn("Deduplicate Topics", "Attach Pipeline Context"),
        conn("Attach Pipeline Context", "Call Topic Ranking"),
    ])
    conns = merge_connection_dicts(conns, eh_conns)

    return build_workflow("01-Trend-Collector", nodes, conns)


# ─── 02: Topic Ranking ──────────────────────
def w02_topic_ranking() -> dict:
    agent_prompt = """You are an elite YouTube growth strategist specializing in YouTube Shorts.

You receive a list of trending topics from multiple sources. Your job is to rank them for YouTube Shorts potential.

For each topic, score on a scale of 0-100 based on:
• Search demand (how many people search for this?)
• Virality potential (will people share this?)
• Curiosity factor (does it create a knowledge gap?)
• Evergreen potential (will it stay relevant?)
• CPM potential (are advertisers interested?)
• Competition (how saturated is this topic?)
• Shorts suitability (can it be told in 35 seconds?)
• Monetization safety (is it advertiser-friendly?)

INPUT TOPICS:
{{ $json.topics ? JSON.stringify($json.topics, null, 2) : 'No topics provided' }}

RULES:
- Never choose pure celebrity gossip unless exceptional viral potential
- Prefer: History, Science, Psychology, AI, Space, Technology, Mystery, Cybersecurity, Interesting facts
- Return ONLY valid JSON array, sorted by score descending

RETURN FORMAT:
[
  {
    "topic": "the topic",
    "score": 85,
    "reason": "why this topic scores well",
    "hook": "an attention-grabbing hook for a Short",
    "category": "Science|Tech|History|Psychology|AI|Space|Mystery|Cybersecurity|Facts",
    "source": "where the topic came from"
  }
]

Return the top 5 topics only."""

    nodes = [
        webhook_trigger("Webhook", WEBHOOKS["02"], [0, 0]),
        ai_agent("AI Topic Ranker", agent_prompt, [300, 0]),
        groq_model("Groq Model", [350, 200], GROQ_MODEL),
        code_node("Parse & Select Best Topic", """
const items = $input.all();
const aiResponse = items[0].json.output || items[0].json.text || JSON.stringify(items[0].json);
let topics;
try {
  // Try to parse JSON from AI response
  const jsonMatch = aiResponse.match(/\\[.*\\]/s);
  topics = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
} catch(e) {
  topics = [{ topic: 'AI parsing failed', score: 0, reason: e.message, hook: '', category: 'Unknown', source: 'error' }];
}

// Sort by score and pick best
topics.sort((a, b) => (b.score || 0) - (a.score || 0));
const best = topics[0] || { topic: 'No topic selected', score: 0 };

// Check duplicate against static data
const staticData = $getWorkflowStaticData('global');
const recentTopics = staticData.recentTopics || [];
const isDuplicate = recentTopics.some(t => t.toLowerCase().includes(best.topic.toLowerCase().split(' ')[0]));

if (!isDuplicate) {
  recentTopics.push(best.topic);
  if (recentTopics.length > 30) recentTopics.shift();
  staticData.recentTopics = recentTopics;
}

// Get pipeline context from webhook
const webhookData = $('Webhook').first().json;

return [{
  json: {
    pipeline_id: webhookData.pipeline_id,
    config: webhookData.config,
    started_at: webhookData.started_at,
    selected_topic: best,
    all_ranked: topics,
    is_duplicate: isDuplicate
  }
}];
""", [600, 0]),
        if_node("IF Not Duplicate", {
            "options": {"caseSensitive": True, "leftValue": "", "typeValidation": "strict"},
            "conditions": [{
                "id": _uid(),
                "leftValue": "={{ $json.is_duplicate }}",
                "rightValue": "false",
                "operator": {"type": "string", "operation": "equals"},
            }],
            "combinator": "and",
        }, [850, 0]),
        http_request("Call SEO Research", webhook_url("03"), [1100, -100], method="POST",
                      body='={{ JSON.stringify($json) }}'),
        noop_node("Skip - Duplicate Topic", [1100, 100]),
    ]

    eh_nodes, eh_conns = error_handler_nodes(400)
    nodes.extend(eh_nodes)

    main_conns = build_connections([
        conn("Webhook", "AI Topic Ranker"),
        conn("AI Topic Ranker", "Parse & Select Best Topic"),
        conn("Parse & Select Best Topic", "IF Not Duplicate"),
        conn("IF Not Duplicate", "Call SEO Research", 0),
        conn("IF Not Duplicate", "Skip - Duplicate Topic", 1),
    ])
    ai_conns = build_ai_connections("Groq Model", "AI Topic Ranker")
    conns = merge_connection_dicts(main_conns, ai_conns, eh_conns)

    return build_workflow("02-Topic-Ranking", nodes, conns)


# ─── 03: SEO Research ───────────────────────
def w03_seo_research() -> dict:
    seo_prompt = """You are a world-class YouTube SEO specialist. You receive a trending topic and keyword research data.

TOPIC: {{ $json.topic }}
GOOGLE AUTOCOMPLETE SUGGESTIONS: {{ $json.google_suggestions }}
YOUTUBE SUGGESTIONS: {{ $json.youtube_suggestions }}

Generate comprehensive SEO metadata optimized for maximum YouTube visibility and click-through rate.

RETURN ONLY VALID JSON in this exact format:
{
  "title": "An irresistible, high-CTR title (under 60 chars, uses power words, numbers, or curiosity gaps)",
  "description": "A compelling 2-3 paragraph description with keywords naturally woven in. Include a call to action. Under 5000 chars.",
  "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5"],
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5", "keyword6", "keyword7", "keyword8"],
  "thumbnail_text": "3-5 words for thumbnail overlay (BIG, BOLD, creates curiosity)",
  "hook": "First 3 seconds script that stops the scroll. Must create immediate curiosity.",
  "youtube_tags": ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6", "tag7", "tag8", "tag9", "tag10"],
  "category": "Science & Technology|Education|Entertainment|News & Politics|People & Blogs",
  "language": "en",
  "estimated_ctr": 8.5,
  "seo_score": 85,
  "pinned_comment": "An engaging question or CTA to boost engagement in comments"
}"""

    nodes = [
        webhook_trigger("Webhook", WEBHOOKS["03"], [0, 0]),
        code_node("Extract Topic", """
const data = $input.all()[0].json;
const topic = data.selected_topic?.topic || 'technology trends';
const encodedTopic = encodeURIComponent(topic);
return [{ json: { ...data, topic, encodedTopic } }];
""", [250, 0]),
        # Google Autocomplete
        http_request("Google Autocomplete", '={{ "https://suggestqueries.google.com/complete/search?client=firefox&q=" + $json.encodedTopic }}',
                      [500, -200], on_error="continueRegularOutput"),
        code_node("Parse Google Suggestions", """
const items = $input.all();
const data = items[0].json;
let suggestions = [];
try {
  if (Array.isArray(data)) suggestions = data[1] || [];
  else if (data[1]) suggestions = data[1];
} catch(e) { suggestions = []; }
return [{ json: { google_suggestions: suggestions.join(', ') } }];
""", [750, -200]),

        # YouTube Suggest
        http_request("YouTube Suggest", '={{ "https://suggestqueries.google.com/complete/search?client=youtube&ds=yt&q=" + $json.encodedTopic }}',
                      [500, 100], on_error="continueRegularOutput"),
        code_node("Parse YouTube Suggestions", """
const items = $input.all();
const data = items[0].json;
let suggestions = [];
try {
  if (Array.isArray(data)) suggestions = (data[1] || []).map(s => Array.isArray(s) ? s[0] : s);
  else suggestions = [];
} catch(e) { suggestions = []; }
return [{ json: { youtube_suggestions: suggestions.join(', ') } }];
""", [750, 100]),

        # Merge SEO data
        merge_node("Merge SEO Data", [1000, 0], mode="append"),
        code_node("Combine SEO Input", """
const items = $input.all();
const webhookData = $('Webhook').first().json;
const googleSuggestions = items.find(i => i.json.google_suggestions)?.json?.google_suggestions || '';
const ytSuggestions = items.find(i => i.json.youtube_suggestions)?.json?.youtube_suggestions || '';
return [{
  json: {
    ...webhookData,
    topic: webhookData.selected_topic?.topic || 'technology',
    google_suggestions: googleSuggestions,
    youtube_suggestions: ytSuggestions
  }
}];
""", [1250, 0]),

        # AI SEO optimization
        ai_agent("AI SEO Optimizer", seo_prompt, [1500, 0]),
        groq_model("Groq Model", [1550, 200], GROQ_MODEL),
        code_node("Parse SEO Output", """
const items = $input.all();
const aiResponse = items[0].json.output || items[0].json.text || JSON.stringify(items[0].json);
let seo;
try {
  const jsonMatch = aiResponse.match(/\\{[\\s\\S]*\\}/);
  seo = jsonMatch ? JSON.parse(jsonMatch[0]) : {};
} catch(e) {
  seo = { title: 'Failed to parse SEO', error: e.message };
}

const webhookData = $('Webhook').first().json;
return [{
  json: {
    pipeline_id: webhookData.pipeline_id,
    config: webhookData.config,
    started_at: webhookData.started_at,
    selected_topic: webhookData.selected_topic,
    seo: seo
  }
}];
""", [1800, 0]),
        http_request("Call Script Generator", webhook_url("04"), [2050, 0], method="POST",
                      body='={{ JSON.stringify($json) }}'),
    ]

    eh_nodes, eh_conns = error_handler_nodes(400)
    nodes.extend(eh_nodes)

    main_conns = build_connections([
        conn("Webhook", "Extract Topic"),
        conn("Extract Topic", "Google Autocomplete"),
        conn("Extract Topic", "YouTube Suggest"),
        conn("Google Autocomplete", "Parse Google Suggestions"),
        conn("YouTube Suggest", "Parse YouTube Suggestions"),
        conn("Parse Google Suggestions", "Merge SEO Data"),
        conn("Parse YouTube Suggestions", "Merge SEO Data"),
        conn("Merge SEO Data", "Combine SEO Input"),
        conn("Combine SEO Input", "AI SEO Optimizer"),
        conn("AI SEO Optimizer", "Parse SEO Output"),
        conn("Parse SEO Output", "Call Script Generator"),
    ])
    ai_conns = build_ai_connections("Groq Model", "AI SEO Optimizer")
    conns = merge_connection_dicts(main_conns, ai_conns, eh_conns)

    return build_workflow("03-SEO-Research", nodes, conns)


# ─── 04: Script Generator ───────────────────
def w04_script_generator() -> dict:
    script_prompt = """You are an elite YouTube Shorts scriptwriter known for creating viral content.

TOPIC: {{ $json.selected_topic?.topic || 'Unknown' }}
HOOK FROM SEO: {{ $json.seo?.hook || 'Create your own hook' }}
CATEGORY: {{ $json.selected_topic?.category || 'Education' }}

PAST LEARNINGS (what worked before):
{{ $json.learnings || 'No historical data yet — use best practices.' }}

Write a complete 35-second YouTube Short script. Include ALL of the following:

RETURN ONLY VALID JSON:
{
  "hook": "First 2-3 seconds. MUST stop the scroll. Use shock, curiosity, or emotion.",
  "curiosity_gap": "Create a knowledge gap that makes viewer NEED to keep watching.",
  "story": "The main content. Must be fascinating, use storytelling, paint vivid pictures.",
  "cta": "Call to action. Ask a question, prompt a like, follow, or comment.",
  "retention_points": ["Moment 1 that keeps viewers watching", "Moment 2", "Moment 3"],
  "full_script": "The complete narration script, word by word. 80-100 words for 35 seconds.",
  "b_roll_suggestions": ["Visual suggestion 1", "Visual suggestion 2", "Visual suggestion 3", "Visual suggestion 4", "Visual suggestion 5"],
  "image_prompts": [
    "Detailed AI image prompt for segment 1 (hook visual). Photorealistic, cinematic, 16:9.",
    "Detailed AI image prompt for segment 2. Photorealistic, cinematic, 16:9.",
    "Detailed AI image prompt for segment 3. Photorealistic, cinematic, 16:9.",
    "Detailed AI image prompt for segment 4. Photorealistic, cinematic, 16:9.",
    "Detailed AI image prompt for segment 5 (CTA visual). Photorealistic, cinematic, 16:9."
  ],
  "subtitle_segments": [
    {"text": "segment 1 text", "start": 0, "end": 7},
    {"text": "segment 2 text", "start": 7, "end": 14},
    {"text": "segment 3 text", "start": 14, "end": 21},
    {"text": "segment 4 text", "start": 21, "end": 28},
    {"text": "segment 5 text", "start": 28, "end": 35}
  ],
  "voice_style": "energetic, conversational, slightly fast-paced",
  "music_mood": "epic|mysterious|upbeat|dramatic|inspiring"
}"""

    nodes = [
        webhook_trigger("Webhook", WEBHOOKS["04"], [0, 0]),
        code_node("Load Learning Data", """
const data = $input.all()[0].json;
const staticData = $getWorkflowStaticData('global');
const learnings = staticData.learnings || 'No historical data yet.';
return [{ json: { ...data, learnings } }];
""", [250, 0]),
        ai_agent("AI Script Writer", script_prompt, [500, 0]),
        groq_model("Groq Model", [550, 200], GROQ_MODEL),
        code_node("Parse Script", """
const items = $input.all();
const aiResponse = items[0].json.output || items[0].json.text || JSON.stringify(items[0].json);
let script;
try {
  const jsonMatch = aiResponse.match(/\\{[\\s\\S]*\\}/);
  script = jsonMatch ? JSON.parse(jsonMatch[0]) : {};
} catch(e) {
  script = { full_script: aiResponse, error: e.message };
}

const webhookData = $('Webhook').first().json;
return [{
  json: {
    pipeline_id: webhookData.pipeline_id,
    config: webhookData.config,
    started_at: webhookData.started_at,
    selected_topic: webhookData.selected_topic,
    seo: webhookData.seo,
    script: script
  }
}];
""", [800, 0]),
        http_request("Call Fact Checker", webhook_url("05"), [1050, 0], method="POST",
                      body='={{ JSON.stringify($json) }}'),
    ]

    eh_nodes, eh_conns = error_handler_nodes(400)
    nodes.extend(eh_nodes)

    main_conns = build_connections([
        conn("Webhook", "Load Learning Data"),
        conn("Load Learning Data", "AI Script Writer"),
        conn("AI Script Writer", "Parse Script"),
        conn("Parse Script", "Call Fact Checker"),
    ])
    ai_conns = build_ai_connections("Groq Model", "AI Script Writer")
    conns = merge_connection_dicts(main_conns, ai_conns, eh_conns)

    return build_workflow("04-Script-Generator", nodes, conns)


# ─── 05: Fact Checker ───────────────────────
def w05_fact_checker() -> dict:
    fact_prompt = """You are a rigorous fact checker. Review this script for a YouTube Short and verify all claims.

SCRIPT: {{ $json.script?.full_script || 'No script provided' }}
TOPIC: {{ $json.selected_topic?.topic || 'Unknown' }}

Check every factual claim in the script. For each claim:
1. Is it verifiable?
2. Is it accurate based on your knowledge?
3. Could it be misleading?

RETURN ONLY VALID JSON:
{
  "overall_verdict": "PASS|WARN|FAIL",
  "confidence": 85,
  "claims_checked": [
    {"claim": "the claim", "verdict": "TRUE|FALSE|UNCERTAIN", "note": "explanation"}
  ],
  "corrections": ["Any corrections needed"],
  "warnings": ["Any potential issues"],
  "safe_for_youtube": true
}"""

    nodes = [
        webhook_trigger("Webhook", WEBHOOKS["05"], [0, 0]),
        ai_agent("AI Fact Checker", fact_prompt, [300, 0]),
        groq_model("Groq Model", [350, 200], GROQ_MODEL),
        code_node("Parse Fact Check", """
const items = $input.all();
const aiResponse = items[0].json.output || items[0].json.text || JSON.stringify(items[0].json);
let factCheck;
try {
  const jsonMatch = aiResponse.match(/\\{[\\s\\S]*\\}/);
  factCheck = jsonMatch ? JSON.parse(jsonMatch[0]) : { overall_verdict: 'WARN' };
} catch(e) {
  factCheck = { overall_verdict: 'WARN', error: e.message };
}

const webhookData = $('Webhook').first().json;
const needsApproval = factCheck.overall_verdict === 'FAIL' || factCheck.confidence < 60;

return [{
  json: {
    pipeline_id: webhookData.pipeline_id,
    config: webhookData.config,
    started_at: webhookData.started_at,
    selected_topic: webhookData.selected_topic,
    seo: webhookData.seo,
    script: webhookData.script,
    fact_check: factCheck,
    needs_approval: needsApproval
  }
}];
""", [600, 0]),
        if_node("IF Facts OK", {
            "options": {"caseSensitive": True, "leftValue": "", "typeValidation": "strict"},
            "conditions": [{
                "id": _uid(),
                "leftValue": "={{ $json.needs_approval }}",
                "rightValue": "false",
                "operator": {"type": "string", "operation": "equals"},
            }],
            "combinator": "and",
        }, [850, 0]),
        # Pass — continue pipeline
        http_request("Call Image Prompt Gen", webhook_url("06"), [1100, -100], method="POST",
                      body='={{ JSON.stringify($json) }}'),
        # Fail — send to Telegram for human review
        http_request("Telegram: Needs Review", '={{ "https://api.telegram.org/bot" + ($json.config?.telegram_bot_token || "YOUR_BOT_TOKEN") + "/sendMessage" }}',
                      [1100, 150], method="POST",
                      body='={{ JSON.stringify({ chat_id: $json.config?.telegram_chat_id || "YOUR_CHAT_ID", text: "⚠️ FACT CHECK FAILED\\n\\nTopic: " + $json.selected_topic?.topic + "\\nVerdict: " + $json.fact_check?.overall_verdict + "\\nConfidence: " + $json.fact_check?.confidence + "%\\n\\nWarnings:\\n" + ($json.fact_check?.warnings || []).join("\\n") + "\\n\\nPipeline paused. Approve at: " + "' + webhook_url("05a") + '?approve=true&pipeline_id=" + $json.pipeline_id, parse_mode: "HTML" }) }}',
                      on_error="continueRegularOutput"),
    ]

    eh_nodes, eh_conns = error_handler_nodes(500)
    nodes.extend(eh_nodes)

    main_conns = build_connections([
        conn("Webhook", "AI Fact Checker"),
        conn("AI Fact Checker", "Parse Fact Check"),
        conn("Parse Fact Check", "IF Facts OK"),
        conn("IF Facts OK", "Call Image Prompt Gen", 0),
        conn("IF Facts OK", "Telegram: Needs Review", 1),
    ])
    ai_conns = build_ai_connections("Groq Model", "AI Fact Checker")
    conns = merge_connection_dicts(main_conns, ai_conns, eh_conns)

    return build_workflow("05-Fact-Checker", nodes, conns)


# ─── 06: Image Prompt Generator ─────────────
def w06_image_prompt_gen() -> dict:
    prompt = """You are a master AI image prompt engineer. Create stunning, photorealistic image prompts from a video script.

SCRIPT: {{ $json.script?.full_script || 'No script' }}
IMAGE PROMPTS FROM SCRIPT: {{ JSON.stringify($json.script?.image_prompts || []) }}
TOPIC: {{ $json.selected_topic?.topic || 'Unknown' }}

For each script segment, create a detailed image generation prompt. Each prompt should be:
- Photorealistic, cinematic quality
- 16:9 aspect ratio
- Rich in detail: lighting, composition, colors, mood
- No text in images
- No copyrighted characters

RETURN ONLY VALID JSON:
{
  "prompts": [
    {
      "segment_index": 0,
      "prompt": "Detailed prompt for Pollinations/FLUX/SD. Include style: cinematic, 8k, photorealistic, dramatic lighting...",
      "negative_prompt": "blurry, low quality, text, watermark, deformed",
      "style": "photorealistic|digital_art|3d_render|illustration"
    }
  ]
}

Generate exactly 5 prompts for a 35-second video (7 seconds per image)."""

    nodes = [
        webhook_trigger("Webhook", WEBHOOKS["06"], [0, 0]),
        ai_agent("AI Image Prompter", prompt, [300, 0]),
        groq_model("Groq Model", [350, 200], GROQ_MODEL),
        code_node("Parse Image Prompts", """
const items = $input.all();
const aiResponse = items[0].json.output || items[0].json.text || JSON.stringify(items[0].json);
let result;
try {
  const jsonMatch = aiResponse.match(/\\{[\\s\\S]*\\}/);
  result = jsonMatch ? JSON.parse(jsonMatch[0]) : { prompts: [] };
} catch(e) {
  // Fallback: use script's image_prompts
  const webhookData = $('Webhook').first().json;
  const scriptPrompts = webhookData.script?.image_prompts || ['cinematic landscape, 8k, dramatic lighting'];
  result = { prompts: scriptPrompts.map((p, i) => ({ segment_index: i, prompt: p, negative_prompt: 'blurry, low quality', style: 'photorealistic' })) };
}

const webhookData = $('Webhook').first().json;
return [{
  json: {
    pipeline_id: webhookData.pipeline_id,
    config: webhookData.config,
    started_at: webhookData.started_at,
    selected_topic: webhookData.selected_topic,
    seo: webhookData.seo,
    script: webhookData.script,
    fact_check: webhookData.fact_check,
    image_prompts: result.prompts
  }
}];
""", [600, 0]),
        http_request("Call Image Generator", webhook_url("07"), [850, 0], method="POST",
                      body='={{ JSON.stringify($json) }}'),
    ]

    eh_nodes, eh_conns = error_handler_nodes(400)
    nodes.extend(eh_nodes)

    main_conns = build_connections([
        conn("Webhook", "AI Image Prompter"),
        conn("AI Image Prompter", "Parse Image Prompts"),
        conn("Parse Image Prompts", "Call Image Generator"),
    ])
    ai_conns = build_ai_connections("Groq Model", "AI Image Prompter")
    conns = merge_connection_dicts(main_conns, ai_conns, eh_conns)

    return build_workflow("06-Image-Prompt-Generator", nodes, conns)


# ─── 07: AI Image Generator ─────────────────
def w07_image_generator() -> dict:
    nodes = [
        webhook_trigger("Webhook", WEBHOOKS["07"], [0, 0]),
        code_node("Setup Image Generation", """
const data = $input.all()[0].json;
const prompts = data.image_prompts || [];
const pipelineId = data.pipeline_id || 'default';
const workDir = (data.config?.work_dir || '/tmp/n8n-youtube') + '/' + pipelineId;

// Create output items for each prompt
return prompts.map((p, i) => ({
  json: {
    prompt_data: p,
    prompt_text: typeof p === 'string' ? p : (p.prompt || 'cinematic landscape'),
    segment_index: typeof p === 'string' ? i : (p.segment_index || i),
    work_dir: workDir,
    pipeline_id: pipelineId,
    image_path: workDir + '/images/img_' + i + '.png'
  }
}));
""", [250, 0]),
        # Ensure directory exists
        execute_command("Create Dirs", '={{ "mkdir -p " + $json.work_dir + "/images" }}', [500, 0]),
        # Try Pollinations (free)
        http_request("Try Pollinations",
                      '={{ "https://image.pollinations.ai/prompt/" + encodeURIComponent($json.prompt_text) + "?width=1920&height=1080&nologo=true&seed=" + Math.floor(Math.random()*999999) }}',
                      [750, 0], on_error="continueRegularOutput"),
        code_node("Check Pollinations Result", """
const items = $input.all();
const item = items[0];
const hasBinary = item.binary && Object.keys(item.binary).length > 0;
const hasData = item.json && !item.json.error;

// If we got image data, save it
if (hasBinary || (hasData && typeof item.json === 'object')) {
  return [{ json: { ...item.json, provider: 'pollinations', success: true, image_path: item.json.image_path || '/tmp/n8n-youtube/default/images/img.png' } }];
}
return [{ json: { ...item.json, provider: 'pollinations', success: false } }];
""", [1000, 0]),
        if_node("IF Pollinations OK", {
            "options": {"caseSensitive": True, "leftValue": "", "typeValidation": "strict"},
            "conditions": [{
                "id": _uid(),
                "leftValue": "={{ $json.success }}",
                "rightValue": "true",
                "operator": {"type": "string", "operation": "equals"},
            }],
            "combinator": "and",
        }, [1250, 0]),
        # Save successful image
        execute_command("Save Image", '={{ "curl -sL \\"https://image.pollinations.ai/prompt/" + encodeURIComponent($json.prompt_text) + "?width=1920&height=1080&nologo=true\\" -o " + $json.image_path }}', [1500, -100]),
        # Fallback: try different prompt
        http_request("Try Pollinations Fallback",
                      '={{ "https://image.pollinations.ai/prompt/" + encodeURIComponent($json.prompt_text + ", high quality, 4k") + "?width=1920&height=1080&nologo=true&seed=" + Math.floor(Math.random()*999999) }}',
                      [1500, 100], on_error="continueRegularOutput"),
        execute_command("Save Fallback Image", '={{ "curl -sL \\"https://image.pollinations.ai/prompt/" + encodeURIComponent($json.prompt_text + ", high quality") + "?width=1920&height=1080&nologo=true\\" -o " + $json.image_path }}', [1750, 100]),

        # After all images done, collect results and call next
        code_node("Collect Image Results", """
const items = $input.all();
const webhookData = $('Webhook').first().json;
const images = items.map((item, i) => ({
  path: item.json.image_path || '/tmp/n8n-youtube/default/images/img_' + i + '.png',
  provider: item.json.provider || 'pollinations',
  segment_index: item.json.segment_index || i
}));

return [{
  json: {
    pipeline_id: webhookData.pipeline_id,
    config: webhookData.config,
    started_at: webhookData.started_at,
    selected_topic: webhookData.selected_topic,
    seo: webhookData.seo,
    script: webhookData.script,
    fact_check: webhookData.fact_check,
    image_prompts: webhookData.image_prompts,
    images: images,
    work_dir: (webhookData.config?.work_dir || '/tmp/n8n-youtube') + '/' + webhookData.pipeline_id
  }
}];
""", [2000, 0]),
        http_request("Call Voice Generator", webhook_url("08"), [2250, 0], method="POST",
                      body='={{ JSON.stringify($json) }}'),
    ]

    eh_nodes, eh_conns = error_handler_nodes(500)
    nodes.extend(eh_nodes)

    main_conns = build_connections([
        conn("Webhook", "Setup Image Generation"),
        conn("Setup Image Generation", "Create Dirs"),
        conn("Create Dirs", "Try Pollinations"),
        conn("Try Pollinations", "Check Pollinations Result"),
        conn("Check Pollinations Result", "IF Pollinations OK"),
        conn("IF Pollinations OK", "Save Image", 0),
        conn("IF Pollinations OK", "Try Pollinations Fallback", 1),
        conn("Try Pollinations Fallback", "Save Fallback Image"),
        conn("Save Image", "Collect Image Results"),
        conn("Save Fallback Image", "Collect Image Results"),
        conn("Collect Image Results", "Call Voice Generator"),
    ])
    conns = merge_connection_dicts(main_conns, eh_conns)

    return build_workflow("07-AI-Image-Generator", nodes, conns)


# ─── 08: Voice Generator ────────────────────
def w08_voice_generator() -> dict:
    nodes = [
        webhook_trigger("Webhook", WEBHOOKS["08"], [0, 0]),
        code_node("Prepare TTS", """
const data = $input.all()[0].json;
const script = data.script?.full_script || 'No script available.';
const workDir = data.work_dir || '/tmp/n8n-youtube/' + (data.pipeline_id || 'default');
const audioPath = workDir + '/audio/voice.mp3';

return [{
  json: {
    ...data,
    full_script: script,
    audio_path: audioPath,
    work_dir: workDir
  }
}];
""", [250, 0]),
        execute_command("Create Audio Dir", '={{ "mkdir -p " + $json.work_dir + "/audio" }}', [500, 0]),
        # Try Edge TTS (free, best quality)
        execute_command("Try Edge TTS",
                        '={{ "edge-tts --voice en-US-GuyNeural --rate=+10% --text \\"" + $json.full_script.replace(/"/g, \'\\\\"\').replace(/\\n/g, " ") + "\\" --write-media " + $json.audio_path + " 2>&1 || echo EDGE_TTS_FAILED" }}',
                        [750, 0]),
        code_node("Check Edge TTS", """
const items = $input.all();
const output = items[0].json.stdout || items[0].json.stderr || '';
const failed = output.includes('EDGE_TTS_FAILED') || output.includes('Error') || output.includes('error');
const webhookData = $('Webhook').first().json;
return [{
  json: {
    ...webhookData,
    tts_provider: 'edge-tts',
    tts_success: !failed,
    audio_path: webhookData.work_dir + '/audio/voice.mp3',
    tts_output: output.slice(0, 200)
  }
}];
""", [1000, 0]),
        if_node("IF Edge TTS OK", {
            "options": {"caseSensitive": True, "leftValue": "", "typeValidation": "strict"},
            "conditions": [{
                "id": _uid(),
                "leftValue": "={{ $json.tts_success }}",
                "rightValue": "true",
                "operator": {"type": "string", "operation": "equals"},
            }],
            "combinator": "and",
        }, [1250, 0]),
        # Success path
        execute_command("Get Audio Duration", '={{ "ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 " + $json.audio_path + " 2>/dev/null || echo 35" }}', [1500, -100]),
        # Fallback: try piper or simple approach
        execute_command("Try Piper TTS",
                        '={{ "which piper > /dev/null 2>&1 && echo \\"" + $json.full_script.replace(/"/g, \'\\\\"\').replace(/\\n/g, " ") + "\\" | piper --model en_US-lessac-medium --output_file " + $json.audio_path + " || echo PIPER_FAILED" }}',
                        [1500, 100]),
        code_node("Finalize Audio", """
const items = $input.all();
const webhookData = $('Webhook').first().json;
const durationStr = items[0].json.stdout || items[0].json.stderr || '35';
const duration = parseFloat(durationStr) || 35;

return [{
  json: {
    pipeline_id: webhookData.pipeline_id,
    config: webhookData.config,
    started_at: webhookData.started_at,
    selected_topic: webhookData.selected_topic,
    seo: webhookData.seo,
    script: webhookData.script,
    fact_check: webhookData.fact_check,
    images: webhookData.images,
    work_dir: webhookData.work_dir,
    audio: {
      path: webhookData.audio_path || webhookData.work_dir + '/audio/voice.mp3',
      duration: duration,
      provider: webhookData.tts_provider || 'edge-tts'
    }
  }
}];
""", [1750, 0]),
        http_request("Call Subtitle Generator", webhook_url("09"), [2000, 0], method="POST",
                      body='={{ JSON.stringify($json) }}'),
    ]

    eh_nodes, eh_conns = error_handler_nodes(500)
    nodes.extend(eh_nodes)

    main_conns = build_connections([
        conn("Webhook", "Prepare TTS"),
        conn("Prepare TTS", "Create Audio Dir"),
        conn("Create Audio Dir", "Try Edge TTS"),
        conn("Try Edge TTS", "Check Edge TTS"),
        conn("Check Edge TTS", "IF Edge TTS OK"),
        conn("IF Edge TTS OK", "Get Audio Duration", 0),
        conn("IF Edge TTS OK", "Try Piper TTS", 1),
        conn("Get Audio Duration", "Finalize Audio"),
        conn("Try Piper TTS", "Finalize Audio"),
        conn("Finalize Audio", "Call Subtitle Generator"),
    ])
    conns = merge_connection_dicts(main_conns, eh_conns)

    return build_workflow("08-Voice-Generator", nodes, conns)


# ─── 09: Subtitle Generator ─────────────────
def w09_subtitle_generator() -> dict:
    nodes = [
        webhook_trigger("Webhook", WEBHOOKS["09"], [0, 0]),
        code_node("Generate SRT Subtitles", """
const data = $input.all()[0].json;
const segments = data.script?.subtitle_segments || [];
const fullScript = data.script?.full_script || '';
const duration = data.audio?.duration || 35;
const workDir = data.work_dir || '/tmp/n8n-youtube/default';

let srt = '';
if (segments.length > 0) {
  segments.forEach((seg, i) => {
    const startH = Math.floor(seg.start / 3600);
    const startM = Math.floor((seg.start % 3600) / 60);
    const startS = Math.floor(seg.start % 60);
    const startMs = Math.round((seg.start % 1) * 1000);
    const endH = Math.floor(seg.end / 3600);
    const endM = Math.floor((seg.end % 3600) / 60);
    const endS = Math.floor(seg.end % 60);
    const endMs = Math.round((seg.end % 1) * 1000);

    const fmt = (h, m, s, ms) => `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')},${String(ms).padStart(3,'0')}`;

    srt += `${i + 1}\\n${fmt(startH, startM, startS, startMs)} --> ${fmt(endH, endM, endS, endMs)}\\n${seg.text}\\n\\n`;
  });
} else {
  // Auto-generate from full script
  const words = fullScript.split(/\\s+/);
  const wordsPerSeg = Math.ceil(words.length / 5);
  const segDuration = duration / 5;
  for (let i = 0; i < 5; i++) {
    const text = words.slice(i * wordsPerSeg, (i + 1) * wordsPerSeg).join(' ');
    const start = i * segDuration;
    const end = (i + 1) * segDuration;
    const fmt = (t) => {
      const h = Math.floor(t / 3600);
      const m = Math.floor((t % 3600) / 60);
      const s = Math.floor(t % 60);
      const ms = Math.round((t % 1) * 1000);
      return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')},${String(ms).padStart(3,'0')}`;
    };
    srt += `${i + 1}\\n${fmt(start)} --> ${fmt(end)}\\n${text}\\n\\n`;
  }
}

return [{
  json: {
    ...data,
    subtitles: {
      srt_content: srt,
      path: workDir + '/subtitles.srt',
      segment_count: segments.length || 5
    }
  }
}];
""", [250, 0]),
        execute_command("Save SRT File", """={{ "mkdir -p " + $json.work_dir + " && cat << 'SRTEOF' > " + $json.subtitles.path + "\\n" + $json.subtitles.srt_content + "SRTEOF" }}""", [500, 0]),
        http_request("Call FFmpeg Video", webhook_url("10"), [750, 0], method="POST",
                      body='={{ JSON.stringify($json) }}'),
    ]

    eh_nodes, eh_conns = error_handler_nodes(300)
    nodes.extend(eh_nodes)

    main_conns = build_connections([
        conn("Webhook", "Generate SRT Subtitles"),
        conn("Generate SRT Subtitles", "Save SRT File"),
        conn("Save SRT File", "Call FFmpeg Video"),
    ])
    conns = merge_connection_dicts(main_conns, eh_conns)

    return build_workflow("09-Subtitle-Generator", nodes, conns)


# ─── 10: FFmpeg Video Assembly ───────────────
def w10_ffmpeg_video() -> dict:
    nodes = [
        webhook_trigger("Webhook", WEBHOOKS["10"], [0, 0]),
        code_node("Build FFmpeg Command", """
const data = $input.all()[0].json;
const workDir = data.work_dir || '/tmp/n8n-youtube/default';
const images = data.images || [];
const audioPath = data.audio?.path || workDir + '/audio/voice.mp3';
const srtPath = data.subtitles?.path || workDir + '/subtitles.srt';
const outputPath = workDir + '/output.mp4';
const duration = data.audio?.duration || 35;
const numImages = images.length || 5;
const segDuration = duration / numImages;

// Build FFmpeg command with Ken Burns effect
let inputs = '';
let filterComplex = '';
let concatInputs = '';

for (let i = 0; i < numImages; i++) {
  const imgPath = images[i]?.path || workDir + '/images/img_' + i + '.png';
  inputs += ' -loop 1 -t ' + segDuration.toFixed(2) + ' -i ' + imgPath;

  // Ken Burns: alternate between zoom-in and zoom-out
  const isZoomIn = i % 2 === 0;
  if (isZoomIn) {
    filterComplex += '[' + i + ':v]scale=2560:1440,zoompan=z=\\'min(zoom+0.0015,1.3)\\':x=\\'iw/2-(iw/zoom/2)\\':y=\\'ih/2-(ih/zoom/2)\\':d=' + Math.ceil(segDuration * 25) + ':s=1080x1920:fps=25[v' + i + '];';
  } else {
    filterComplex += '[' + i + ':v]scale=2560:1440,zoompan=z=\\'if(eq(on,1),1.3,max(zoom-0.0015,1))\\':x=\\'iw/2-(iw/zoom/2)\\':y=\\'ih/2-(ih/zoom/2)\\':d=' + Math.ceil(segDuration * 25) + ':s=1080x1920:fps=25[v' + i + '];';
  }
  concatInputs += '[v' + i + ']';
}

// Concat all segments with crossfade
filterComplex += concatInputs + 'concat=n=' + numImages + ':v=1:a=0[vconcat];';

// Add subtitles
filterComplex += "[vconcat]subtitles=" + srtPath.replace(/'/g, "\\\\'").replace(/:/g, "\\\\:") + ":force_style='FontSize=18,FontName=Arial,PrimaryColour=&H00FFFFFF,OutlineColour=&H00000000,Outline=2,Bold=1,Alignment=2,MarginV=40'[vout]";

// Audio input index
const audioIdx = numImages;
inputs += ' -i ' + audioPath;

const cmd = 'ffmpeg -y' + inputs + ' -filter_complex "' + filterComplex + '" -map "[vout]" -map ' + audioIdx + ':a -c:v libx264 -preset fast -crf 23 -c:a aac -b:a 192k -shortest -movflags +faststart ' + outputPath + ' 2>&1 | tail -5';

return [{
  json: {
    ...data,
    ffmpeg_command: cmd,
    output_path: outputPath,
    work_dir: workDir
  }
}];
""", [300, 0]),
        execute_command("Run FFmpeg", '={{ $json.ffmpeg_command }}', [600, 0]),
        code_node("Verify Video", """
const items = $input.all();
const webhookData = $('Webhook').first().json;
const workDir = webhookData.work_dir || '/tmp/n8n-youtube/default';
const outputPath = workDir + '/output.mp4';
return [{
  json: {
    ...webhookData,
    video: {
      path: outputPath,
      work_dir: workDir
    },
    ffmpeg_output: (items[0].json.stdout || items[0].json.stderr || '').slice(0, 500)
  }
}];
""", [850, 0]),
        execute_command("Check Video File", '={{ "test -f " + $json.video.path + " && ffprobe -v error -show_entries format=duration,size -of json " + $json.video.path + " 2>/dev/null || echo {\\\\"error\\\\":\\\\"video_not_found\\\\"}" }}', [1100, 0]),
        code_node("Parse Video Info", """
const items = $input.all();
const webhookData = $('Webhook').first().json;
let videoInfo;
try {
  videoInfo = JSON.parse(items[0].json.stdout || '{}');
} catch(e) {
  videoInfo = { error: 'parse_failed' };
}

return [{
  json: {
    pipeline_id: webhookData.pipeline_id,
    config: webhookData.config,
    started_at: webhookData.started_at,
    selected_topic: webhookData.selected_topic,
    seo: webhookData.seo,
    script: webhookData.script,
    images: webhookData.images,
    audio: webhookData.audio,
    video: {
      path: webhookData.video?.path || webhookData.work_dir + '/output.mp4',
      duration: videoInfo?.format?.duration || webhookData.audio?.duration || 35,
      size_bytes: videoInfo?.format?.size || 0,
      work_dir: webhookData.work_dir
    }
  }
}];
""", [1350, 0]),
        http_request("Call Thumbnail Gen", webhook_url("11"), [1600, 0], method="POST",
                      body='={{ JSON.stringify($json) }}'),
    ]

    eh_nodes, eh_conns = error_handler_nodes(400)
    nodes.extend(eh_nodes)

    main_conns = build_connections([
        conn("Webhook", "Build FFmpeg Command"),
        conn("Build FFmpeg Command", "Run FFmpeg"),
        conn("Run FFmpeg", "Verify Video"),
        conn("Verify Video", "Check Video File"),
        conn("Check Video File", "Parse Video Info"),
        conn("Parse Video Info", "Call Thumbnail Gen"),
    ])
    conns = merge_connection_dicts(main_conns, eh_conns)

    return build_workflow("10-FFmpeg-Video", nodes, conns)


# ─── 11: Thumbnail Generator ────────────────
def w11_thumbnail_gen() -> dict:
    nodes = [
        webhook_trigger("Webhook", WEBHOOKS["11"], [0, 0]),
        code_node("Create Thumbnail Prompt", """
const data = $input.all()[0].json;
const thumbnailText = data.seo?.thumbnail_text || data.selected_topic?.topic || 'Amazing';
const topic = data.selected_topic?.topic || 'science';
const prompt = `YouTube thumbnail, bold eye-catching design, ${topic}, vibrant colors, professional quality, 1280x720, high contrast, dramatic lighting, cinematic, no text overlay, clean composition, 4k quality`;

return [{
  json: {
    ...data,
    thumbnail_prompt: prompt,
    thumbnail_text: thumbnailText,
    thumbnail_path: (data.video?.work_dir || '/tmp/n8n-youtube/default') + '/thumbnail.png'
  }
}];
""", [250, 0]),
        http_request("Generate Thumbnail",
                      '={{ "https://image.pollinations.ai/prompt/" + encodeURIComponent($json.thumbnail_prompt) + "?width=1280&height=720&nologo=true" }}',
                      [500, 0], on_error="continueRegularOutput"),
        execute_command("Save Thumbnail",
                        '={{ "curl -sL \\"https://image.pollinations.ai/prompt/" + encodeURIComponent($json.thumbnail_prompt) + "?width=1280&height=720&nologo=true\\" -o " + $json.thumbnail_path }}',
                        [750, 0]),
        code_node("Finalize Thumbnail", """
const webhookData = $('Webhook').first().json;
return [{
  json: {
    pipeline_id: webhookData.pipeline_id,
    config: webhookData.config,
    started_at: webhookData.started_at,
    selected_topic: webhookData.selected_topic,
    seo: webhookData.seo,
    script: webhookData.script,
    images: webhookData.images,
    audio: webhookData.audio,
    video: webhookData.video,
    thumbnail: {
      path: webhookData.thumbnail_path || (webhookData.video?.work_dir || '/tmp/n8n-youtube/default') + '/thumbnail.png',
      text: webhookData.seo?.thumbnail_text || '',
      provider: 'pollinations'
    }
  }
}];
""", [1000, 0]),
        http_request("Call YouTube Metadata", webhook_url("12"), [1250, 0], method="POST",
                      body='={{ JSON.stringify($json) }}'),
    ]

    eh_nodes, eh_conns = error_handler_nodes(400)
    nodes.extend(eh_nodes)

    main_conns = build_connections([
        conn("Webhook", "Create Thumbnail Prompt"),
        conn("Create Thumbnail Prompt", "Generate Thumbnail"),
        conn("Generate Thumbnail", "Save Thumbnail"),
        conn("Save Thumbnail", "Finalize Thumbnail"),
        conn("Finalize Thumbnail", "Call YouTube Metadata"),
    ])
    conns = merge_connection_dicts(main_conns, eh_conns)

    return build_workflow("11-Thumbnail-Generator", nodes, conns)


# ─── 12: YouTube Metadata ───────────────────
def w12_youtube_metadata() -> dict:
    meta_prompt = """You are a YouTube metadata optimization expert. Finalize the metadata for a YouTube Short.

TOPIC: {{ $json.selected_topic?.topic || 'Unknown' }}
SEO DATA: {{ JSON.stringify($json.seo || {}) }}
SCRIPT HOOK: {{ $json.script?.hook || '' }}

Create the final, optimized metadata. Make it irresistible for clicks while being accurate.

RETURN ONLY VALID JSON:
{
  "final_title": "Title under 60 chars, power words, numbers or curiosity gaps",
  "final_description": "Full description with:\\n- Hook line\\n- Key points\\n- Hashtags\\n- Social links placeholder\\n- Call to action\\nUnder 5000 chars",
  "final_tags": ["tag1", "tag2", "up to 15 tags"],
  "category_id": "28",
  "default_language": "en",
  "pinned_comment": "An engaging question that drives comments and engagement",
  "privacy_status": "public",
  "made_for_kids": false,
  "shorts": true
}

Category IDs: 22=People&Blogs, 24=Entertainment, 25=News, 27=Education, 28=Science&Tech"""

    nodes = [
        webhook_trigger("Webhook", WEBHOOKS["12"], [0, 0]),
        ai_agent("AI Metadata Finalizer", meta_prompt, [300, 0]),
        groq_model("Groq Model", [350, 200], GROQ_MODEL),
        code_node("Parse Metadata", """
const items = $input.all();
const aiResponse = items[0].json.output || items[0].json.text || JSON.stringify(items[0].json);
let metadata;
try {
  const jsonMatch = aiResponse.match(/\\{[\\s\\S]*\\}/);
  metadata = jsonMatch ? JSON.parse(jsonMatch[0]) : {};
} catch(e) {
  const webhookData = $('Webhook').first().json;
  metadata = {
    final_title: webhookData.seo?.title || 'Amazing Discovery',
    final_description: webhookData.seo?.description || '',
    final_tags: webhookData.seo?.youtube_tags || [],
    category_id: '28',
    pinned_comment: 'What do you think? Comment below!',
    privacy_status: 'public',
    made_for_kids: false,
    shorts: true
  };
}

const webhookData = $('Webhook').first().json;
return [{
  json: {
    pipeline_id: webhookData.pipeline_id,
    config: webhookData.config,
    started_at: webhookData.started_at,
    selected_topic: webhookData.selected_topic,
    seo: webhookData.seo,
    script: webhookData.script,
    video: webhookData.video,
    thumbnail: webhookData.thumbnail,
    audio: webhookData.audio,
    metadata: metadata
  }
}];
""", [600, 0]),
        http_request("Call YouTube Upload", webhook_url("13"), [850, 0], method="POST",
                      body='={{ JSON.stringify($json) }}'),
    ]

    eh_nodes, eh_conns = error_handler_nodes(400)
    nodes.extend(eh_nodes)

    main_conns = build_connections([
        conn("Webhook", "AI Metadata Finalizer"),
        conn("AI Metadata Finalizer", "Parse Metadata"),
        conn("Parse Metadata", "Call YouTube Upload"),
    ])
    ai_conns = build_ai_connections("Groq Model", "AI Metadata Finalizer")
    conns = merge_connection_dicts(main_conns, ai_conns, eh_conns)

    return build_workflow("12-YouTube-Metadata", nodes, conns)


# ─── 13: YouTube Upload ─────────────────────
def w13_youtube_upload() -> dict:
    nodes = [
        webhook_trigger("Webhook", WEBHOOKS["13"], [0, 0]),
        code_node("Check Upload Quota", """
const data = $input.all()[0].json;
const staticData = $getWorkflowStaticData('global');
const today = new Date().toISOString().split('T')[0];

if (staticData.upload_date !== today) {
  staticData.upload_date = today;
  staticData.upload_count = 0;
}

const maxUploads = 6; // YouTube daily limit for new channels
const quotaOk = staticData.upload_count < maxUploads;

return [{
  json: {
    ...data,
    quota_ok: quotaOk,
    uploads_today: staticData.upload_count,
    max_uploads: maxUploads
  }
}];
""", [250, 0]),
        if_node("IF Quota OK", {
            "options": {"caseSensitive": True, "leftValue": "", "typeValidation": "strict"},
            "conditions": [{
                "id": _uid(),
                "leftValue": "={{ $json.quota_ok }}",
                "rightValue": "true",
                "operator": {"type": "string", "operation": "equals"},
            }],
            "combinator": "and",
        }, [500, 0]),
        # Upload placeholder — requires YouTube OAuth2 credential
        code_node("Prepare Upload", """
const data = $input.all()[0].json;
const staticData = $getWorkflowStaticData('global');
staticData.upload_count = (staticData.upload_count || 0) + 1;

// Note: Actual YouTube upload requires YouTube OAuth2 credentials
// This node prepares the upload data. Configure YouTube node in n8n UI.
return [{
  json: {
    ...data,
    upload_status: 'ready',
    upload_data: {
      title: data.metadata?.final_title || 'Untitled',
      description: data.metadata?.final_description || '',
      tags: data.metadata?.final_tags || [],
      category_id: data.metadata?.category_id || '28',
      privacy_status: data.metadata?.privacy_status || 'public',
      video_path: data.video?.path || '',
      thumbnail_path: data.thumbnail?.path || '',
      made_for_kids: false
    },
    note: 'Configure YouTube OAuth2 in n8n UI to enable actual uploads'
  }
}];
""", [750, -100]),
        # Queue for later if quota exceeded
        code_node("Queue Upload", """
const data = $input.all()[0].json;
const staticData = $getWorkflowStaticData('global');
const queue = staticData.upload_queue || [];
queue.push({
  pipeline_id: data.pipeline_id,
  video_path: data.video?.path,
  metadata: data.metadata,
  queued_at: new Date().toISOString()
});
staticData.upload_queue = queue;

return [{
  json: {
    ...data,
    upload_status: 'queued',
    queue_position: queue.length,
    note: 'Upload queued — daily quota exceeded'
  }
}];
""", [750, 150]),
        # Both paths continue to analytics
        code_node("Finalize Upload Status", """
const items = $input.all();
const data = items[0].json;
return [{
  json: {
    pipeline_id: data.pipeline_id,
    config: data.config,
    started_at: data.started_at,
    selected_topic: data.selected_topic,
    seo: data.seo,
    script: data.script,
    video: data.video,
    thumbnail: data.thumbnail,
    audio: data.audio,
    metadata: data.metadata,
    upload: {
      status: data.upload_status || 'unknown',
      uploads_today: data.uploads_today || 0,
      video_id: data.youtube_video_id || null,
      url: data.youtube_video_id ? 'https://youtube.com/shorts/' + data.youtube_video_id : null
    },
    completed_at: new Date().toISOString()
  }
}];
""", [1050, 0]),
        http_request("Call Analytics DB", webhook_url("14"), [1300, 0], method="POST",
                      body='={{ JSON.stringify($json) }}'),
    ]

    eh_nodes, eh_conns = error_handler_nodes(400)
    nodes.extend(eh_nodes)

    main_conns = build_connections([
        conn("Webhook", "Check Upload Quota"),
        conn("Check Upload Quota", "IF Quota OK"),
        conn("IF Quota OK", "Prepare Upload", 0),
        conn("IF Quota OK", "Queue Upload", 1),
        conn("Prepare Upload", "Finalize Upload Status"),
        conn("Queue Upload", "Finalize Upload Status"),
        conn("Finalize Upload Status", "Call Analytics DB"),
    ])
    conns = merge_connection_dicts(main_conns, eh_conns)

    return build_workflow("13-YouTube-Upload", nodes, conns)


# ─── 14: Analytics Database ─────────────────
def w14_analytics_db() -> dict:
    nodes = [
        webhook_trigger("Webhook", WEBHOOKS["14"], [0, 0]),
        code_node("Calculate Costs & Stats", """
const data = $input.all()[0].json;
const now = new Date().toISOString();

// Estimate API costs
const costs = {
  groq_calls: 6, // Approx: ranking, SEO, script, fact-check, image prompts, metadata
  groq_tokens_est: 15000,
  groq_cost_usd: 0, // Groq is free tier
  image_gen_calls: (data.images?.length || 5) + 1, // images + thumbnail
  image_gen_cost: 0, // Pollinations is free
  tts_calls: 1,
  tts_cost: 0, // Edge TTS is free
  total_cost_usd: 0
};

// Pipeline timing
const startedAt = data.started_at ? new Date(data.started_at) : new Date();
const completedAt = new Date(data.completed_at || now);
const durationMs = completedAt - startedAt;
const durationMin = (durationMs / 60000).toFixed(1);

const record = {
  pipeline_id: data.pipeline_id,
  topic: data.selected_topic?.topic || 'Unknown',
  title: data.metadata?.final_title || data.seo?.title || 'Unknown',
  category: data.selected_topic?.category || 'Unknown',
  seo_score: data.seo?.seo_score || 0,
  estimated_ctr: data.seo?.estimated_ctr || 0,
  video_duration: data.video?.duration || 0,
  video_size_bytes: data.video?.size_bytes || 0,
  upload_status: data.upload?.status || 'unknown',
  youtube_url: data.upload?.url || null,
  costs: costs,
  pipeline_duration_min: parseFloat(durationMin),
  started_at: data.started_at,
  completed_at: now,
  sources_used: ['google_trends', 'reddit', 'hackernews', 'google_news', 'producthunt', 'github'],
  image_provider: data.images?.[0]?.provider || 'pollinations',
  tts_provider: data.audio?.provider || 'edge-tts'
};

// Store in static data for history
const staticData = $getWorkflowStaticData('global');
const history = staticData.pipeline_history || [];
history.push(record);
if (history.length > 100) history.shift();
staticData.pipeline_history = history;

return [{
  json: {
    ...data,
    analytics: record,
    costs: costs,
    pipeline_duration_min: parseFloat(durationMin)
  }
}];
""", [300, 0]),
        http_request("Call Telegram Report", webhook_url("15"), [600, 0], method="POST",
                      body='={{ JSON.stringify($json) }}'),
    ]

    eh_nodes, eh_conns = error_handler_nodes(300)
    nodes.extend(eh_nodes)

    main_conns = build_connections([
        conn("Webhook", "Calculate Costs & Stats"),
        conn("Calculate Costs & Stats", "Call Telegram Report"),
    ])
    conns = merge_connection_dicts(main_conns, eh_conns)

    return build_workflow("14-Analytics-Database", nodes, conns)


# ─── 15: Telegram Report ────────────────────
def w15_telegram_report() -> dict:
    nodes = [
        webhook_trigger("Webhook", WEBHOOKS["15"], [0, 0]),
        code_node("Format Report", """
const data = $input.all()[0].json;
const a = data.analytics || {};

const report = `🎬 *YouTube Pipeline Complete*

📌 *Topic:* ${a.topic || 'Unknown'}
🎯 *Title:* ${a.title || 'Unknown'}
📂 *Category:* ${a.category || 'Unknown'}

📊 *Metrics:*
• SEO Score: ${a.seo_score || 0}/100
• Est. CTR: ${a.estimated_ctr || 0}%
• Video Duration: ${a.video_duration || 0}s

📤 *Upload:* ${data.upload?.status || 'unknown'}
${data.upload?.url ? '🔗 ' + data.upload.url : ''}

💰 *Costs:*
• Groq Calls: ${a.costs?.groq_calls || 0} (free)
• Image Gen: ${a.costs?.image_gen_calls || 0} (free)
• TTS: ${a.costs?.tts_calls || 0} (free)
• Total: $${a.costs?.total_cost_usd || 0}

⏱ *Pipeline Time:* ${a.pipeline_duration_min || '?'} minutes
🆔 Pipeline: \`${a.pipeline_id || 'unknown'}\`
📅 ${new Date().toISOString().split('T')[0]}`;

return [{
  json: {
    ...data,
    telegram_message: report
  }
}];
""", [250, 0]),
        # Send Telegram message (requires bot token config)
        http_request("Send Telegram Report",
                      '={{ "https://api.telegram.org/bot" + ($json.config?.telegram_bot_token || "YOUR_BOT_TOKEN") + "/sendMessage" }}',
                      [500, 0], method="POST",
                      body='={{ JSON.stringify({ chat_id: $json.config?.telegram_chat_id || "YOUR_CHAT_ID", text: $json.telegram_message, parse_mode: "Markdown" }) }}',
                      on_error="continueRegularOutput"),
        code_node("Log Report", """
// Log even if Telegram fails
const data = $input.all()[0].json;
console.log('Pipeline report:', data.analytics?.pipeline_id, data.analytics?.topic);
return [{ json: { status: 'pipeline_complete', pipeline_id: data.pipeline_id } }];
""", [750, 0]),
    ]

    main_conns = build_connections([
        conn("Webhook", "Format Report"),
        conn("Format Report", "Send Telegram Report"),
        conn("Send Telegram Report", "Log Report"),
    ])

    return build_workflow("15-Telegram-Report", nodes, main_conns)


# ─── 16: AI Learning Loop ───────────────────
def w16_ai_learning_loop() -> dict:
    learning_prompt = """You are a YouTube analytics expert. Analyze past video performance and generate actionable insights.

PIPELINE HISTORY (recent videos):
{{ $json.history }}

For each video, analyze:
1. What made the topic selection good or bad?
2. What hooks tend to work best?
3. What categories perform best?
4. What SEO patterns lead to higher views?
5. What can be improved in future scripts?

RETURN ONLY VALID JSON:
{
  "top_patterns": ["Pattern 1 that works", "Pattern 2"],
  "avoid_patterns": ["Pattern to avoid 1", "Pattern 2"],
  "best_categories": ["Category1", "Category2"],
  "hook_insights": "What type of hooks work best",
  "script_improvements": "How to improve scripts",
  "recommended_topics": ["Topic suggestion 1", "Topic suggestion 2", "Topic suggestion 3"],
  "overall_score": 75,
  "actionable_tips": ["Tip 1", "Tip 2", "Tip 3"]
}"""

    nodes = [
        schedule_trigger("Nightly Schedule", [0, 0], "0 23 * * *"),
        code_node("Load Pipeline History", """
const staticData = $getWorkflowStaticData('global');
const history = staticData.pipeline_history || [];

// Also check analytics workflow static data
// For now, use what we have
const recentHistory = history.slice(-10);

return [{
  json: {
    history: JSON.stringify(recentHistory, null, 2),
    total_videos: history.length,
    date: new Date().toISOString()
  }
}];
""", [250, 0]),
        if_node("IF Has History", {
            "options": {"caseSensitive": True, "leftValue": "", "typeValidation": "strict"},
            "conditions": [{
                "id": _uid(),
                "leftValue": "={{ $json.total_videos }}",
                "rightValue": "0",
                "operator": {"type": "number", "operation": "gt"},
            }],
            "combinator": "and",
        }, [500, 0]),
        ai_agent("AI Analyzer", learning_prompt, [750, -100]),
        groq_model("Groq Model", [800, 100], GROQ_MODEL),
        code_node("Store Learnings", """
const items = $input.all();
const aiResponse = items[0].json.output || items[0].json.text || '';
let learnings;
try {
  const jsonMatch = aiResponse.match(/\\{[\\s\\S]*\\}/);
  learnings = jsonMatch ? JSON.parse(jsonMatch[0]) : {};
} catch(e) {
  learnings = { raw: aiResponse, error: e.message };
}

// Store learnings for script generator to use
const staticData = $getWorkflowStaticData('global');
staticData.learnings = JSON.stringify(learnings, null, 2);
staticData.last_learning_date = new Date().toISOString();

return [{
  json: {
    learnings: learnings,
    stored: true,
    date: new Date().toISOString()
  }
}];
""", [1050, -100]),
        # Send learning summary via Telegram
        http_request("Telegram Learning Report",
                      '={{ "https://api.telegram.org/bot" + "YOUR_BOT_TOKEN" + "/sendMessage" }}',
                      [1300, -100], method="POST",
                      body='={{ JSON.stringify({ chat_id: "YOUR_CHAT_ID", text: "🧠 *AI Learning Report*\\n\\n📊 Videos analyzed: " + $json.total_videos + "\\n\\n" + JSON.stringify($json.learnings?.actionable_tips || [], null, 2), parse_mode: "Markdown" }) }}',
                      on_error="continueRegularOutput"),
        noop_node("No History Yet", [750, 150]),
    ]

    eh_nodes, eh_conns = error_handler_nodes(400)
    nodes.extend(eh_nodes)

    main_conns = build_connections([
        conn("Nightly Schedule", "Load Pipeline History"),
        conn("Load Pipeline History", "IF Has History"),
        conn("IF Has History", "AI Analyzer", 0),
        conn("IF Has History", "No History Yet", 1),
        conn("AI Analyzer", "Store Learnings"),
        conn("Store Learnings", "Telegram Learning Report"),
    ])
    ai_conns = build_ai_connections("Groq Model", "AI Analyzer")
    conns = merge_connection_dicts(main_conns, ai_conns, eh_conns)

    return build_workflow("16-AI-Learning-Loop", nodes, conns)


# ─── 17: Error Handler ──────────────────────
def w17_error_handler() -> dict:
    nodes = [
        webhook_trigger("Webhook", WEBHOOKS["17"], [0, 0]),
        code_node("Parse Error", """
const data = $input.all()[0].json;
const now = new Date().toISOString();

const error = {
  pipeline_id: data.pipeline_id || 'unknown',
  workflow: data.workflow || 'unknown',
  error_message: typeof data.error === 'string' ? data.error : JSON.stringify(data.error || 'Unknown error'),
  timestamp: data.timestamp || now,
  severity: 'critical', // default
  node: data.node || 'unknown'
};

// Classify severity
const msg = error.error_message.toLowerCase();
if (msg.includes('rate limit') || msg.includes('429')) {
  error.severity = 'warning';
} else if (msg.includes('timeout') || msg.includes('ETIMEDOUT')) {
  error.severity = 'warning';
} else if (msg.includes('parse') || msg.includes('json')) {
  error.severity = 'info';
}

// Store in error log
const staticData = $getWorkflowStaticData('global');
const errorLog = staticData.error_log || [];
errorLog.push(error);
if (errorLog.length > 200) errorLog.shift();
staticData.error_log = errorLog;

return [{ json: error }];
""", [250, 0]),
        if_node("IF Critical", {
            "options": {"caseSensitive": True, "leftValue": "", "typeValidation": "strict"},
            "conditions": [{
                "id": _uid(),
                "leftValue": "={{ $json.severity }}",
                "rightValue": "critical",
                "operator": {"type": "string", "operation": "equals"},
            }],
            "combinator": "and",
        }, [500, 0]),
        # Critical: send Telegram alert
        http_request("Telegram Error Alert",
                      '={{ "https://api.telegram.org/bot" + "YOUR_BOT_TOKEN" + "/sendMessage" }}',
                      [750, -100], method="POST",
                      body='={{ JSON.stringify({ chat_id: "YOUR_CHAT_ID", text: "🚨 *PIPELINE ERROR*\\n\\n❌ Workflow: " + $json.workflow + "\\n📝 Error: " + $json.error_message.slice(0, 500) + "\\n🆔 Pipeline: " + $json.pipeline_id + "\\n⏰ " + $json.timestamp, parse_mode: "Markdown" }) }}',
                      on_error="continueRegularOutput"),
        # Non-critical: just log
        code_node("Log Warning", """
const data = $input.all()[0].json;
console.log('Non-critical error:', data.severity, data.workflow, data.error_message?.slice(0, 200));
return [{ json: { logged: true, severity: data.severity } }];
""", [750, 100]),
    ]

    main_conns = build_connections([
        conn("Webhook", "Parse Error"),
        conn("Parse Error", "IF Critical"),
        conn("IF Critical", "Telegram Error Alert", 0),
        conn("IF Critical", "Log Warning", 1),
    ])

    return build_workflow("17-Error-Handler", nodes, main_conns)


# ═════════════════════════════════════════════
# DEPLOYMENT ORCHESTRATION
# ═════════════════════════════════════════════

WORKFLOW_BUILDERS = [
    ("00", w00_master_scheduler),
    ("01", w01_trend_collector),
    ("02", w02_topic_ranking),
    ("03", w03_seo_research),
    ("04", w04_script_generator),
    ("05", w05_fact_checker),
    ("06", w06_image_prompt_gen),
    ("07", w07_image_generator),
    ("08", w08_voice_generator),
    ("09", w09_subtitle_generator),
    ("10", w10_ffmpeg_video),
    ("11", w11_thumbnail_gen),
    ("12", w12_youtube_metadata),
    ("13", w13_youtube_upload),
    ("14", w14_analytics_db),
    ("15", w15_telegram_report),
    ("16", w16_ai_learning_loop),
    ("17", w17_error_handler),
]

TAGS = [
    "youtube-pipeline",
    "collector",
    "processor",
    "generator",
    "publisher",
    "infrastructure",
]


def deploy():
    client = N8nClient(API_BASE, API_KEY)
    print("=" * 60)
    print("  Enterprise n8n YouTube Automation — Deployment")
    print("=" * 60)
    print(f"  Target: {BASE_URL}")
    print(f"  Workflows: {len(WORKFLOW_BUILDERS)}")
    print()

    # ── Step 1: Create Tags ──
    print("─── Step 1: Creating Tags ───")
    existing_tags = {t["name"]: t["id"] for t in client.list_tags()}
    tag_ids = {}
    for tag_name in TAGS:
        if tag_name in existing_tags:
            print(f"  ✓ Tag '{tag_name}' already exists")
            tag_ids[tag_name] = existing_tags[tag_name]
        else:
            try:
                result = client.create_tag(tag_name)
                tag_ids[tag_name] = result["id"]
                print(f"  ✓ Created tag '{tag_name}'")
            except Exception as e:
                print(f"  ✗ Failed to create tag '{tag_name}': {e}")
    print()

    # ── Step 2: Clean up old pipeline workflows ──
    print("─── Step 2: Checking Existing Workflows ───")
    existing_wfs = client.list_workflows()
    pipeline_wfs = [w for w in existing_wfs if w["name"].startswith(("00-", "01-", "02-", "03-", "04-", "05-", "06-", "07-", "08-", "09-", "10-", "11-", "12-", "13-", "14-", "15-", "16-", "17-"))]
    if pipeline_wfs:
        print(f"  Found {len(pipeline_wfs)} existing pipeline workflows")
        for wf in pipeline_wfs:
            try:
                if wf["active"]:
                    client.deactivate_workflow(wf["id"])
                client.delete(f"/workflows/{wf['id']}")
                print(f"  ✓ Deleted '{wf['name']}' ({wf['id']})")
            except Exception as e:
                print(f"  ✗ Failed to delete '{wf['name']}': {e}")
    else:
        print("  No existing pipeline workflows found")
    print()

    # ── Step 3: Create All Workflows ──
    print("─── Step 3: Creating Workflows ───")
    created_workflows = {}
    for wf_id, builder in WORKFLOW_BUILDERS:
        wf_data = builder()
        try:
            result = client.create_workflow(wf_data)
            created_workflows[wf_id] = {
                "id": result["id"],
                "name": result["name"],
            }
            print(f"  ✓ [{wf_id}] Created '{result['name']}' (ID: {result['id']})")
            time.sleep(0.3)  # Rate limiting
        except Exception as e:
            print(f"  ✗ [{wf_id}] Failed to create '{wf_data['name']}': {e}")
    print()

    # ── Step 4: Activate Trigger Workflows ──
    print("─── Step 4: Activating Trigger Workflows ───")
    trigger_workflows = ["00", "16"]  # Scheduler and Learning Loop
    for wf_id in trigger_workflows:
        if wf_id in created_workflows:
            try:
                client.activate_workflow(created_workflows[wf_id]["id"])
                print(f"  ✓ Activated '{created_workflows[wf_id]['name']}'")
            except Exception as e:
                print(f"  ✗ Failed to activate '{created_workflows[wf_id]['name']}': {e}")
    print()

    # ── Step 5: Verification ──
    print("─── Step 5: Verification ───")
    all_wfs = client.list_workflows()
    pipeline_count = len([w for w in all_wfs if w["name"].startswith(("00-", "01-", "02-", "03-", "04-", "05-", "06-", "07-", "08-", "09-", "10-", "11-", "12-", "13-", "14-", "15-", "16-", "17-"))])
    active_count = len([w for w in all_wfs if w["active"] and w["name"].startswith(("00-", "01-", "02-", "03-", "04-", "05-", "06-", "07-", "08-", "09-", "10-", "11-", "12-", "13-", "14-", "15-", "16-", "17-"))])
    print(f"  Total pipeline workflows: {pipeline_count}/18")
    print(f"  Active workflows: {active_count}")
    print()

    # ── Summary ──
    print("=" * 60)
    print("  DEPLOYMENT COMPLETE")
    print("=" * 60)
    print()
    print("  Webhook endpoints:")
    for key, path in WEBHOOKS.items():
        status = "✓" if key.replace("a", "") in created_workflows or key in created_workflows else "✗"
        print(f"    {status} {WEBHOOK_BASE}/{path}")
    print()
    print("  Next steps:")
    print("    1. Add Telegram Bot Token & Chat ID to workflow configs")
    print("    2. Add YouTube OAuth2 credentials via n8n UI")
    print("    3. Install edge-tts on server: pip install edge-tts")
    print("    4. Ensure FFmpeg is installed on server")
    print("    5. Test with: curl -X POST " + webhook_url("01") + ' -H "Content-Type: application/json" -d \'{"pipeline_id":"test-001","config":{}}\'')
    print()


if __name__ == "__main__":
    deploy()
