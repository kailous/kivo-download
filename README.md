# Kivo 官网

纯静态零依赖的 Kivo 产品官网（`index.html`、`plugins.html`、`sdk.html`）。macOS 安装包、SDK 和公开插件都可从 [GitHub Releases](https://github.com/kailous/kivo-download/releases) 获取。

## 本地预览

```sh
python3 -m http.server 8765 --directory website
```

访问 <http://localhost:8765/>。

## 同步数据与文档

修改 `website/plugins-registry.json` 或仓库内的 `SDK/KivoPluginSDK/README.md`、`docs/plugins/v1/README.md`、`docs/plugins/v2/README.md` 后，运行：

```sh
python3 website/scripts/sync.py
```

该脚本会重新生成 `website/plugins-data.js` 与 `website/sdk-docs-data.js`。

## 发布官网

在 `kailous/kivo` 的项目根目录提交 `website/` 的改动后，运行：

```sh
git subtree push --prefix=website https://github.com/kailous/kivo-download.git main
```

Vercel 的 `kivo-download` 项目跟踪 `kailous/kivo-download` 的 `main` 分支。生产站点为 <https://kivo.rainforest.org.cn/>。
