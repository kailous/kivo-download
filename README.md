# Kivo 官网

纯静态零依赖的 Kivo 产品官网（`index.html`、`plugins.html`、`sdk.html`），采用与 Kivo 原生界面同源的影院暗场与暖金焦点视觉语言，可直接部署到 Vercel、Cloudflare Pages 或 GitHub Pages。

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
git subtree push --prefix=website https://github.com/kailous/download.git main
```

Vercel 的 `kivo-download` 项目跟踪 `kailous/download` 的 `main` 分支。生产站点为 <https://kivo-download.vercel.app/>。
