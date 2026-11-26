#!/usr/bin/env python3
"""
Kivo 官网数据同步脚本（仅依赖 Python 3 标准库）
1. 从 website/plugins-registry.json 生成 website/plugins-data.js
2. 从仓库内 SDK/KivoPluginSDK/README.md、docs/plugins/v1/README.md、docs/plugins/v2/README.md
   生成 website/sdk-docs-data.js
"""
from __future__ import annotations

import html
import json
import re
from pathlib import Path

SITE_DIR = Path(__file__).resolve().parent.parent
REPO_DIR = SITE_DIR.parent


def render_inline(text: str) -> str:
    out = html.escape(text, quote=True)
    out = re.sub(r"`([^`]+)`", lambda m: f"<code>{m.group(1)}</code>", out)
    out = re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", out)

    def _link(m: re.Match[str]) -> str:
        label, href = m.group(1), m.group(2)
        if re.match(r"^https?://", href):
            return f'<a href="{href}" target="_blank" rel="noopener">{label}</a>'
        return f"<code>{label}</code>"

    out = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", _link, out)
    return out


def md_to_html(md: str, prefix: str) -> tuple[str, list[dict]]:
    lines = md.replace("\r\n", "\n").split("\n")
    out: list[str] = []
    toc: list[dict] = []
    i = 0
    heading_seq = 0
    n = len(lines)

    while i < n:
        line = lines[i]

        if line.startswith("```"):
            code: list[str] = []
            i += 1
            while i < n and not lines[i].startswith("```"):
                code.append(lines[i])
                i += 1
            i += 1
            out.append(f"<pre><code>{html.escape(chr(10).join(code), quote=True)}</code></pre>")
            continue

        hm = re.match(r"^(#{1,3})\s+(.+)$", line)
        if hm:
            level = len(hm.group(1))
            raw = hm.group(2).strip()
            heading_seq += 1
            hid = f"{prefix}-h-{heading_seq}"
            if level >= 2:
                toc.append({"id": hid, "level": level, "text": re.sub(r"`([^`]+)`", r"\1", raw)})
            out.append(f'<h{level} id="{hid}">{render_inline(raw)}</h{level}>')
            i += 1
            continue

        if (
            line.strip().startswith("|")
            and i + 1 < n
            and re.match(r"^\s*\|[-:\s|]+\|\s*$", lines[i + 1])
        ):
            def parse_row(row: str) -> list[str]:
                s = row.strip()
                if s.startswith("|"):
                    s = s[1:]
                if s.endswith("|"):
                    s = s[:-1]
                return [c.strip() for c in s.split("|")]

            headers = parse_row(line)
            i += 2
            rows: list[list[str]] = []
            while i < n and lines[i].strip().startswith("|"):
                rows.append(parse_row(lines[i]))
                i += 1
            thead = "<thead><tr>" + "".join(f"<th>{render_inline(c)}</th>" for c in headers) + "</tr></thead>"
            tbody = (
                "<tbody>"
                + "".join(
                    "<tr>" + "".join(f"<td>{render_inline(c)}</td>" for c in r) + "</tr>"
                    for r in rows
                )
                + "</tbody>"
            )
            out.append(f'<div class="table-wrap"><table>{thead}{tbody}</table></div>')
            continue

        if re.match(r"^-\s+", line):
            items: list[str] = []
            while i < n and re.match(r"^-\s+", lines[i]):
                item_text = re.sub(r"^-\s+", "", lines[i])
                items.append(f"<li>{render_inline(item_text)}</li>")
                i += 1
            out.append("<ul>" + "".join(items) + "</ul>")
            continue

        if re.match(r"^\d+\.\s+", line):
            items = []
            while i < n and re.match(r"^\d+\.\s+", lines[i]):
                item_text = re.sub(r"^\d+\.\s+", "", lines[i])
                items.append(f"<li>{render_inline(item_text)}</li>")
                i += 1
            out.append("<ol>" + "".join(items) + "</ol>")
            continue

        if re.match(r"^>\s*", line):
            quote: list[str] = []
            while i < n and re.match(r"^>\s*", lines[i]):
                quote.append(re.sub(r"^>\s*", "", lines[i]))
                i += 1
            joined_quote = " ".join(quote)
            out.append(f"<blockquote><p>{render_inline(joined_quote)}</p></blockquote>")
            continue

        if not line.strip():
            i += 1
            continue

        para: list[str] = []
        while (
            i < n
            and lines[i].strip()
            and not re.match(r"^(#{1,3}\s+|```|-\s+|\d+\.\s+|>\s*|\|)", lines[i])
        ):
            para.append(lines[i].strip())
            i += 1
        out.append(f"<p>{render_inline(' '.join(para))}</p>")

    return "\n".join(out), toc


def main() -> None:
    registry = json.loads((SITE_DIR / "plugins-registry.json").read_text(encoding="utf-8"))
    (SITE_DIR / "plugins-data.js").write_text(
        "/* 由 website/scripts/sync.py 从 plugins-registry.json 生成，请勿手改 */\n"
        f"window.KIVO_PLUGINS_DATA = {json.dumps(registry, ensure_ascii=False, indent=2)};\n",
        encoding="utf-8",
    )

    doc_sources = {
        "sdk": "SDK/KivoPluginSDK/README.md",
        "v1": "docs/plugins/v1/README.md",
        "v2": "docs/plugins/v2/README.md",
    }
    docs: dict[str, dict] = {}
    for key, rel in doc_sources.items():
        md = (REPO_DIR / rel).read_text(encoding="utf-8")
        rendered, toc = md_to_html(md, key)
        docs[key] = {"source": rel, "html": rendered, "toc": toc}

    zip_path = SITE_DIR / "downloads" / "KivoPluginSDK-1.1.1.zip"
    zip_kb = round(zip_path.stat().st_size / 1024) if zip_path.exists() else 44

    sdk_data = {
        "version": "1.1.1",
        "zipSizeKB": zip_kb,
        "files": [
            {"path": "include/videohub_plugin.h", "desc": "C ABI 声明与回调类型，定义四个标准导出入口。"},
            {"path": "VideoHubPluginSDK/", "desc": "SwiftPM 契约库，包含公共 DTO、内容分级枚举与 PluginContract.validate。"},
            {"path": "Template/", "desc": "可直接复制编译的 Swift 插件模板，内置 build.sh 打包与 SHA-256 校验。"},
            {"path": "docs/plugins/v1/", "desc": "API v1 统一输出契约、JSON Schema 与测试样例。"},
            {"path": "docs/plugins/v2/", "desc": "API v2 内联 HLS 扩展规范与样例。"},
            {"path": "README.md", "desc": "SDK 安装、签名边界、儿童锁与内容分级完整说明。"},
        ],
        "docs": docs,
    }
    (SITE_DIR / "sdk-docs-data.js").write_text(
        "/* 由 website/scripts/sync.py 从仓库 Markdown 文档生成，请勿手改 */\n"
        f"window.KIVO_SDK_DOCS = {json.dumps(sdk_data, ensure_ascii=False, indent=2)};\n",
        encoding="utf-8",
    )

    print(
        f"Synced {len(registry['plugins'])} plugins and {len(docs)} SDK docs (zip {zip_kb} KB)."
    )


if __name__ == "__main__":
    main()
