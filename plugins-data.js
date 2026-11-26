/* 由 website/scripts/sync.py 从 plugins-registry.json 生成，请勿手改 */
window.KIVO_PLUGINS_DATA = {
  "$comment": "Kivo 插件目录。修改后运行 python3 website/scripts/sync.py 生成 plugins-data.js。只收录 contentRating 为 general 的插件；受儿童锁限制的插件不在公开页面展示。",
  "updated": "2026-11-26",
  "categories": [
    {
      "id": "all",
      "name": "全部"
    },
    {
      "id": "vod",
      "name": "点播"
    },
    {
      "id": "live",
      "name": "直播"
    },
    {
      "id": "dev",
      "name": "开发者"
    }
  ],
  "plugins": [
    {
      "id": "bilibili",
      "name": "Bilibili",
      "version": "1.2.1",
      "apiVersion": 1,
      "category": "vod",
      "status": "stable",
      "featured": true,
      "contentRating": "general",
      "author": "Kivo 官方",
      "icon": {
        "type": "text",
        "text": "B",
        "bg": "linear-gradient(150deg, #fb7aa6, #e8517f)"
      },
      "tagline": "番剧目录、账号登录、原生播放与弹幕。",
      "description": "支持番剧 ep 单集与 ss 整季链接。读取真实季目录，正片按集号排列，预告、花絮与其他版本独立收纳；官方页面扫码登录后按账号权限播放，弹幕每 360 秒一段原生叠加。",
      "capabilities": [
        "collection",
        "playback",
        "authentication",
        "danmaku"
      ],
      "links": [
        "bilibili.com/bangumi/play/ep…",
        "bilibili.com/bangumi/play/ss…"
      ],
      "highlights": [
        "ep / ss 链接识别，跟踪参数不影响",
        "正片与附加内容角色分离",
        "内容类型自动归类到动漫、电影、纪录片等",
        "弹幕顶部 / 底部 / 滚动三种模式"
      ],
      "limits": [
        "暂不支持普通 BV / av 视频与短链"
      ],
      "changelog": [
        {
          "version": "1.2.1",
          "notes": "修复 ss 整季链接无法识别。"
        },
        {
          "version": "1.2.0",
          "notes": "统一输出正片与附加内容角色。"
        },
        {
          "version": "1.1.0",
          "notes": "统一内容类型。"
        }
      ],
      "bundled": true,
      "download": "https://github.com/kailous/kivo-download/releases/download/v0.5.0-beta.1/KivoPlugin-bilibili-1.2.1.zip"
    },
    {
      "id": "iqiyi",
      "name": "爱奇艺",
      "version": "0.1.7",
      "apiVersion": 2,
      "category": "vod",
      "status": "experimental",
      "featured": true,
      "contentRating": "general",
      "author": "Kivo 官方",
      "icon": {
        "type": "text",
        "text": "奇",
        "bg": "linear-gradient(150deg, #3ddc6e, #12a84a)"
      },
      "tagline": "官方会话、公开页面目录与普通 HLS。",
      "description": "识别大陆站 v_ / a_ / w_ 页面，逐页读取公开目录并与平台总数核对；综艺按季、年份与期次组织。通过 API v2 内联 HLS 交给原生播放器解码，支持 300 秒分段的滚动弹幕。",
      "capabilities": [
        "collection",
        "playback",
        "authentication",
        "danmaku"
      ],
      "links": [
        "iqiyi.com/v_….html",
        "iqiyi.com/a_….html"
      ],
      "highlights": [
        "电视剧、综艺目录完整读取",
        "去除 qyTrace 等跟踪参数",
        "弹幕复用统一控制器与原生画布"
      ],
      "limits": [
        "加密资源暂不支持",
        "不支持国际站 iq.com",
        "更多画质与广告流程仍在验证"
      ],
      "changelog": [
        {
          "version": "0.1.7",
          "notes": "正片角色与播放序列。"
        },
        {
          "version": "0.1.5",
          "notes": "普通滚动弹幕与综艺目录。"
        },
        {
          "version": "0.1.4",
          "notes": "完整剧集目录、高清封面与简介。"
        }
      ],
      "bundled": true,
      "download": "https://github.com/kailous/kivo-download/releases/download/v0.5.0-beta.1/KivoPlugin-iqiyi-0.1.7.zip"
    },
    {
      "id": "iptv",
      "name": "IPTV",
      "version": "0.1.0",
      "apiVersion": 1,
      "category": "live",
      "status": "experimental",
      "featured": true,
      "contentRating": "general",
      "author": "Kivo 官方",
      "icon": {
        "type": "svg",
        "svg": "<svg viewBox='0 0 24 24'><circle cx='12' cy='13' r='2'/><path d='M8.2 9.2a5.4 5.4 0 0 0 0 7.6M15.8 9.2a5.4 5.4 0 0 1 0 7.6M5.4 6.4a9.4 9.4 0 0 0 0 13.2M18.6 6.4a9.4 9.4 0 0 1 0 13.2'/></svg>",
        "bg": "linear-gradient(150deg, #6aa8ff, #3a63e0)"
      },
      "tagline": "GitHub 或本地 M3U 直播源，按分组浏览并原生播放。",
      "description": "粘贴 GitHub raw / blob 链接、其他 HTTP(S) 播放列表或本地绝对路径。一个播放列表就是一个作品，group-title 作为分区、频道作为条目；播放中上下键直接换台，直播不产生观看进度。",
      "capabilities": [
        "collection",
        "playback"
      ],
      "links": [
        "raw.githubusercontent.com/…/list.m3u",
        "/Users/me/list.m3u8"
      ],
      "highlights": [
        "支持 tvg-logo 频道图标与 EXTGRP 分组",
        "读取 EXTVLCOPT / EXTHTTP 中的 User-Agent、Referer、Origin",
        "非 HTTP(S) 地址自动跳过并计数"
      ],
      "limits": [
        "不含 EPG 节目单、录制与回看",
        "不支持登录与 DRM"
      ],
      "changelog": [
        {
          "version": "0.1.0",
          "notes": "首个实验版本。"
        }
      ],
      "bundled": true,
      "download": "https://github.com/kailous/kivo-download/releases/download/v0.5.0-beta.1/KivoPlugin-iptv-0.1.0.zip"
    },
    {
      "id": "sdk-template",
      "name": "插件模板",
      "version": "SDK 1.1.1",
      "apiVersion": 1,
      "category": "dev",
      "status": "template",
      "featured": false,
      "contentRating": "general",
      "author": "Kivo 官方",
      "icon": {
        "type": "svg",
        "svg": "<svg viewBox='0 0 24 24'><path d='M8.5 7 4 12l4.5 5M15.5 7 20 12l-4.5 5M13.5 4.5l-3 15'/></svg>",
        "bg": "linear-gradient(150deg, #f6c46d, #c98a2c)"
      },
      "tagline": "可编译、可打包的 Swift 插件起点。",
      "description": "复制模板、修改 plugin.json 并实现链接识别、目录与播放三件事，一条 build.sh 即可产出可安装的 .bundle。内置契约校验，打包时自动写入二进制 SHA-256。",
      "capabilities": [
        "collection",
        "playback"
      ],
      "links": [
        "example.invalid/hello/…"
      ],
      "highlights": [
        "四个 C 符号入口已就绪",
        "PluginContract.validate 执行契约校验",
        "必须声明 contentRating"
      ],
      "limits": [
        "仅用于开发，不能播放真实内容"
      ],
      "changelog": [
        {
          "version": "1.1.1",
          "notes": "新增内容分级与儿童锁声明。"
        }
      ],
      "bundled": false,
      "download": "downloads/KivoPluginSDK-1.1.1.zip"
    }
  ]
};
