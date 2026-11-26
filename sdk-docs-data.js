/* 由 website/scripts/sync.py 从仓库 Markdown 文档生成，请勿手改 */
window.KIVO_SDK_DOCS = {
  "version": "1.1.1",
  "zipSizeKB": 44,
  "files": [
    {
      "path": "include/videohub_plugin.h",
      "desc": "C ABI 声明与回调类型，定义四个标准导出入口。"
    },
    {
      "path": "VideoHubPluginSDK/",
      "desc": "SwiftPM 契约库，包含公共 DTO、内容分级枚举与 PluginContract.validate。"
    },
    {
      "path": "Template/",
      "desc": "可直接复制编译的 Swift 插件模板，内置 build.sh 打包与 SHA-256 校验。"
    },
    {
      "path": "docs/plugins/v1/",
      "desc": "API v1 统一输出契约、JSON Schema 与测试样例。"
    },
    {
      "path": "docs/plugins/v2/",
      "desc": "API v2 内联 HLS 扩展规范与样例。"
    },
    {
      "path": "README.md",
      "desc": "SDK 安装、签名边界、儿童锁与内容分级完整说明。"
    }
  ],
  "docs": {
    "sdk": {
      "source": "SDK/KivoPluginSDK/README.md",
      "html": "<h1 id=\"sdk-h-1\">Kivo 插件 SDK 1.1.1</h1>\n<p>在 Kivo 内开发视频源插件的最小发行包。插件以进程内 C ABI + UTF-8 JSON 运行，只输出目录、播放资源、账号与弹幕数据；影视库、播放器和 libmpv 由宿主统一提供。</p>\n<ul><li>平台：macOS 14+，Swift 6</li><li>插件 API：v1，内联 HLS 为 v2</li><li>宿主版本：Kivo 0.5.0 及更新版本。受儿童锁限制的插件仅面向实现儿童锁与内容分级的宿主。</li><li>不包含：宿主源码、播放器、WebView UI、mpv、任何第三方平台实现</li></ul>\n<h2 id=\"sdk-h-2\">包内容</h2>\n<pre><code>KivoPluginSDK-1.1.1/\n  README.md                     本文件\n  include/videohub_plugin.h     C ABI 声明\n  VideoHubPluginSDK/            可被 SwiftPM 依赖的契约库\n  Template/                     可编译、可打包的插件模板\n  docs/plugins/v1/              接口规范、JSON Schema、示例\n  docs/plugins/v2/              内联 HLS 扩展</code></pre>\n<p><code>VideoHubPluginSDK</code> 包含公共 DTO、内容分级枚举、C 回调类型与 <code>PluginContract.validate</code>。打包时从 Kivo 当前接口源复制。</p>\n<h2 id=\"sdk-h-3\">快速开始</h2>\n<pre><code>cp -R Template MyPlugin\ncd MyPlugin\n# 编辑 plugin.json 的 id、name、version、summary 和 contentRating\n# 编辑 Sources/PluginSource/TemplateSource.swift：识别链接、目录、播放\nbash build.sh</code></pre>\n<p>产物为 <code>build/&lt;id&gt;.bundle</code>。在 Kivo 的插件设置中选择安装；安装后添加一个能被 <code>can_handle</code> 识别的链接。替换二进制前需要重启 Kivo。</p>\n<p><code>Template/Package.swift</code> 通过相对路径 <code>../VideoHubPluginSDK</code> 依赖 SDK，因此模板必须与 <code>VideoHubPluginSDK/</code> 放在同一目录下。复制到其他位置时同步复制或改写依赖路径。</p>\n<h2 id=\"sdk-h-4\">必须实现的约定</h2>\n<p>插件动态库导出四个 C 符号，参数与所有权规则不能改变：</p>\n<pre><code>void *videohub_plugin_create_v1(void);\nint32_t videohub_plugin_can_handle_v1(void *instance, const char *link);\nvoid *videohub_plugin_data_store_v1(void *instance);\nvoid videohub_plugin_request_v1(void *instance, const char *operation,\n    const char *payload_json, void *context, videohub_plugin_reply reply);</code></pre>\n<p>Swift 模板把这四个入口函数声明为 <code>public</code>。release 构建会内部化未导出的符号，导致动态库中看不到 C 符号；不要改成 <code>private</code> 或 <code>internal</code>。</p>\n<ul><li><code>create</code> 在主线程同步调用，不能发起网络请求；返回的实例在进程内保持有效。</li><li><code>can_handle</code> 只做链接识别，不联网，返回 1 或 0。</li><li><code>data_store</code> 返回未转移所有权的 <code>WKWebsiteDataStore</code>；没有登录能力时返回 <code>NULL</code>。</li><li><code>request</code> 先复制输入字符串，再异步处理，并且每次恰好回调一次。取消只让宿主丢弃结果，插件仍须回调。</li><li>成功：<code>reply(context, resultJSON, NULL)</code>；失败：<code>reply(context, NULL, errorJSON)</code>。错误必须是 <code>PluginFailureDTO</code>，不得包含媒体 URL、Cookie 或请求头。</li></ul>\n<p><code>operation</code> 与请求/响应类型：</p>\n<div class=\"table-wrap\"><table><thead><tr><th>operation</th><th>请求</th><th>响应</th></tr></thead><tbody><tr><td><code>collection</code></td><td>URL 的 JSON 字符串</td><td><code>PluginCollectionDTO</code></td></tr><tr><td><code>playback</code></td><td><code>PluginPlaybackRequest</code></td><td><code>PluginPlaybackDTO</code></td></tr><tr><td><code>danmaku</code></td><td><code>PluginDanmakuRequest</code></td><td><code>[PluginDanmakuDTO]</code></td></tr><tr><td><code>account</code></td><td><code>null</code></td><td><code>PluginAccountDTO</code></td></tr><tr><td><code>logout</code></td><td><code>null</code></td><td><code>null</code></td></tr></tbody></table></div>\n<p>只声明实际实现的能力。<code>collection</code> 与 <code>playback</code> 必需；<code>authentication</code>、<code>danmaku</code> 可选。v2 插件必须导出对应的 <code>_v2</code> 四个符号。</p>\n<p>直播频道在剧集上设置 <code>isLive: true</code>：宿主跳过续播进度、关闭自动连播，并允许播放器用上/下键切换相邻直播条目。不要用 URL、标题或插件 ID 判断直播。</p>\n<p>完整字段与跨字段约束见 <code>docs/plugins/v1/README.md</code>、<code>docs/plugins/v2/README.md</code> 与 <code>VideoHubPluginSDK/Sources/VideoHubPluginSDK/PluginContract.swift</code>。SDK 中的 <code>PluginContract.validate</code> 是执行契约，JSON Schema 只描述字段形状。</p>\n<h2 id=\"sdk-h-5\">插件包结构</h2>\n<pre><code>&lt;id&gt;.bundle/\n  Contents/\n    Info.plist\n    manifest.json\n    MacOS/&lt;executable&gt;</code></pre>\n<p><code>manifest.json</code> 由 <code>Template/build.sh</code> 从 <code>plugin.json</code> 生成，并写入签名后二进制的 SHA-256。先改二进制再算摘要；不能先算摘要再修改文件。SHA-256 只用于完整性校验，不是发布者签名，宿主也不是隔离沙箱，只安装可信代码。</p>\n<h2 id=\"sdk-h-6\">内容分级与儿童锁</h2>\n<p>新插件包必须在 <code>plugin.json</code> 和最终 <code>Contents/manifest.json</code> 的顶层声明 <code>contentRating</code>。模板会在编译前检查，Kivo 会在安装和加载插件代码前校验。</p>\n<div class=\"table-wrap\"><table><thead><tr><th>值</th><th>适用范围</th></tr></thead><tbody><tr><td><code>&quot;general&quot;</code></td><td>仅提供普通内容的插件</td></tr><tr><td><code>&quot;adult&quot;</code></td><td>能提供不宜儿童观看的内容的插件，包括混合目录和可切换到此类内容的源</td></tr></tbody></table></div>\n<p>如果插件能提供不宜儿童观看的内容，请把模板默认值改为 <code>&quot;contentRating&quot;: &quot;adult&quot;</code>。<code>儿童锁插件清单样例</code></p>\n<p>Kivo 每次启动都锁定儿童锁。锁定时，受儿童锁限制的插件会从可用插件列表、已安装插件列表和侧栏隐藏，且无法安装或启用。影视库也会隐藏不宜儿童观看的内容。解锁后恢复原有插件开关状态。重新锁定会停止对应播放、撤销源注册，并丢弃在途插件结果。分级由开发者如实声明，适用于整个插件。</p>\n<p>已安装的旧普通插件可继续使用原清单。重新安装或分发时，请补上分级。SDK 1.1.1 仍使用原有 <code>apiVersion: 1/2</code> 及 C ABI 符号。</p>\n<h2 id=\"sdk-h-7\">安全与隐私</h2>\n<ul><li>不返回或打印媒体 URL、短期签名、Cookie、令牌和请求头。</li><li><code>sourceData</code> 只放插件自用的稳定标识，不得放凭证或整份平台响应。</li><li>只访问用户账号和平台允许的资源；不绕过 DRM、付费、地区或访问控制。</li><li>媒体请求头只放在播放输出的 <code>headers</code>，不修改宿主全局状态。</li><li>模板中的 <code>example.invalid</code> 只用于展示接口形状，不会联网。</li></ul>\n<h2 id=\"sdk-h-8\">版本策略</h2>\n<p><code>apiVersion</code> 是兼容边界。可在既有 DTO 上新增可选字段；已有字段的名称、类型和含义不得改变。破坏性变更会提升 API 版本并更换 C 符号后缀，旧宿主会拒绝不支持的版本。</p>\n<h2 id=\"sdk-h-9\">限制</h2>\n<ul><li>当前构建面向本机 macOS / arm64，使用 ad-hoc 签名；跨架构分发需要自行编译并签名。</li><li>插件在宿主进程权限内运行，没有单独沙箱。</li><li>已加载的模块在同一进程内保持映射；替换不同二进制必须重启 Kivo。</li><li>停用与卸载不会删除影视库、进度或 WebKit 账号数据。</li></ul>",
      "toc": [
        {
          "id": "sdk-h-2",
          "level": 2,
          "text": "包内容"
        },
        {
          "id": "sdk-h-3",
          "level": 2,
          "text": "快速开始"
        },
        {
          "id": "sdk-h-4",
          "level": 2,
          "text": "必须实现的约定"
        },
        {
          "id": "sdk-h-5",
          "level": 2,
          "text": "插件包结构"
        },
        {
          "id": "sdk-h-6",
          "level": 2,
          "text": "内容分级与儿童锁"
        },
        {
          "id": "sdk-h-7",
          "level": 2,
          "text": "安全与隐私"
        },
        {
          "id": "sdk-h-8",
          "level": 2,
          "text": "版本策略"
        },
        {
          "id": "sdk-h-9",
          "level": 2,
          "text": "限制"
        }
      ]
    },
    "v1": {
      "source": "docs/plugins/v1/README.md",
      "html": "<h1 id=\"v1-h-1\">VideoHub Plugin API v1</h1>\n<p>本接口用于独立本地视频源插件。目标是新增平台只交付插件包，影视库、播放 UI 与 libmpv 后端继续使用统一数据，不针对平台新增分支。</p>\n<ul><li>开发 Agent 入口：<code>Plugins/AGENTS.md</code></li><li>可编译 SDK：<code>PluginContract.swift</code></li><li>已实现插件：<code>BilibiliSource</code></li><li>机器可读描述：<code>schemas</code></li><li>仅供测试的标准样例：<code>examples</code></li></ul>\n<p>SDK 与宿主运行校验是执行契约，JSON Schema 描述字段形状；跨字段约束（ID 唯一、过期时间、DASH 音频、媒体信息等）由 SDK 校验。示例域名为 example.invalid，不是产品作品或可播放资源。</p>\n<h2 id=\"v1-h-2\">运行模型与版本</h2>\n<p>插件是动态库包，当前构建面向 macOS 14+ / Apple Silicon，随应用提供的是本机构建的 arm64 包。包放到设置中安装，宿主验证清单、接口版本、路径和二进制 SHA-256，再加载四个 <code>_v1</code> C 符号。SHA-256 只防损坏，不构成发布者签名或隔离。插件拥有进程权限，当前不支持运行不受信任的代码。</p>\n<p>成功加载的模块在本次进程内保持有效，避免异步回调指向卸载代码。停用和卸载立即移出视频源注册表并停止对应播放；卸载删除插件包而不删影视库、进度或 WebKit 账号数据。替换不同二进制需重启。插件安装目录是 <code>~/Library/Application Support/VideoHub/Plugins</code>；启用状态保存在该目录的 state.json。</p>\n<p><code>apiVersion: 1</code> 是兼容性边界。可新增可选字段，不改已有字段含义或类型。破坏性变更升级 API 与 C 符号后缀，宿主拒绝不支持的版本。清单必须声明 collection/playback；只声明实际实现的 authentication/danmaku 可选能力，未知能力在当前版本会拒绝安装。</p>\n<h2 id=\"v1-h-3\">C ABI</h2>\n<pre><code>typedef void (*Reply)(void *context, const char *result_json, const char *error_json);\nvoid *videohub_plugin_create_v1(void);\nint32_t videohub_plugin_can_handle_v1(void *instance, const char *url);\nvoid *videohub_plugin_data_store_v1(void *instance);\nvoid videohub_plugin_request_v1(void *instance, const char *operation,\n    const char *payload_json, void *context, Reply reply);</code></pre>\n<p>同步入口在主线程调用；请求入口立即复制 UTF-8 输入，后台完成后恰好回调一次。成功 result 非空/error 为空；失败反之。输出指针在 callback 返回前有效，宿主同步复制。instance 与 WKWebsiteDataStore 必须在模块本次生命周期内保持有效，data_store 返回未转移所有权的 WebKit 对象；无认证插件仍导出此符号但返回 null。</p>\n<p>取消操作会让宿主忽略返回结果，不保证底层网络立即中断；插件仍应正确回调，且设置网络超时。不跨 ABI 传递 Swift Codable 对象或自定义类。JSON 与错误都不得直接打印日志。</p>\n<h2 id=\"v1-h-4\">操作与输入输出</h2>\n<div class=\"table-wrap\"><table><thead><tr><th>operation</th><th>请求 payload</th><th>结果</th></tr></thead><tbody><tr><td>collection</td><td>URL 的 JSON 字符串，例如 <code>&quot;https://example.invalid/watch/1&quot;</code></td><td>PluginCollectionDTO</td></tr><tr><td>playback</td><td><code>{ &quot;episode&quot;: PluginEpisodeDTO, &quot;quality&quot;: 80 }</code></td><td>PluginPlaybackDTO</td></tr><tr><td>danmaku</td><td><code>{ &quot;episode&quot;: PluginEpisodeDTO, &quot;segment&quot;: 1 }</code></td><td>PluginDanmakuDTO 数组</td></tr><tr><td>account</td><td><code>null</code></td><td><code>{ &quot;authenticated&quot;: false }</code> 或带 displayName 的已登录状态</td></tr><tr><td>logout</td><td><code>null</code></td><td><code>null</code>，完成本平台退出后才返回</td></tr></tbody></table></div>\n<p>未知 operation 应返回 UNSUPPORTED_OPERATION。未声明的可选能力宿主不调用，不要用空数组或假账号伪造成功。</p>\n<h2 id=\"v1-h-5\">稳定标识与目录</h2>\n<p>作品和剧集 id 都是稳定字符串；宿主用 <code>(pluginID, kind, externalID)</code> 建立 SQLite 映射。不同插件相同原始 ID 不会共享进度。映射与影视库一起备份。旧 Bilibili 库的正整数 ID 有显式迁移兼容规则，其他源使用独立的本地标识，不应依赖宿主内部数字。</p>\n<p>分区 id 在作品内唯一；同分区剧集 id 不重复，平台顺序就是播放顺序。不同分区可以引用同一剧集。<code>duration</code> 统一为秒，未知可为 0，不用毫秒。<code>cover</code>、<code>backdrop</code>、<code>canonicalURL</code> 可省略；作品与剧集标题不能省略。</p>\n<p><code>sourceData</code> 是插件不透明的稳定标识字典，宿主原样传回，用于 aid/cid、版本或资源键等。不存凭证、Cookie、令牌、短期 URL 或整份 API 响应。播放器和 UI 不解释 sourceData，不认识平台内部 JSON。</p>\n<h2 id=\"v1-h-6\">内容分类（兼容性可选字段）</h2>\n<p><code>PluginCollectionDTO.contentType</code> 可为 movie、series、animation、variety、documentary 或 unknown。平台适配器根据真实频道类型映射；无可靠字段返回 unknown 或省略。不用片名和集数猜测。宿主保留独立手动覆盖值，刷新目录不会改掉手动选择；旧插件无需升级 ABI。</p>\n<h2 id=\"v1-h-7\">直播标记（兼容性可选字段）</h2>\n<p><code>PluginEpisodeDTO.isLive</code> 为 true 表示持续播出的直播流。宿主据此跳过续播进度（不写入、不出现在继续观看），关闭播完自动连播，并允许播放器用上/下方向键切换同一目录内的相邻直播条目：跨分区按目录顺序前进、跳过非直播和不可播放项、首尾不循环。直播播放时上/下不再调节音量或唤出控制栏，Tab 聚焦播放控制。只对真实直播流设置 true，点播、回看和付费单片保持省略或 false。旧插件省略该字段按点播处理，无需升级 ABI。</p>\n<h2 id=\"v1-h-8\">播放输出</h2>\n<ul><li><code>video</code>：当前有权访问的主媒体 URL；HLS 是播放列表，HTTP 可为直连单文件。</li><li><code>audio</code>：分离 DASH 的音频 URL；MPD 自带音频时可为空，单轨 DASH 必须提供音频。</li><li><code>format</code>：DASH、HLS 或 HTTP；<code>duration</code> 为秒。</li><li><code>qualities</code>：实际可用的整数质量 ID 和展示标签；<code>qualityID</code> 必须在列表中。不伪造用户无权访问的清晰度。</li><li><code>preview</code>：当前是否仅获得试看。当前宿主会明确提示试看权限，不把试看当完整正片。</li><li><code>headers</code>：本次播放需要的 HTTP 请求头，最多 32 项，不允许换行/NUL，值不超过 8192 UTF-8 字节。每次加载清空旧源请求头，再设置当前资源头部。媒体请求与元数据/登录请求头不能混用。</li><li><code>expiresAt</code>：可选 Unix 秒，明确过期的地址被拒绝并提示重试。当前仍以手动重试重新解析，尚无自动到期刷新承诺。</li></ul>\n<p>清晰度切换再次调用 playback。初次请求的 quality 可能是宿主默认值 80；插件不认识该值时选择实际可用的默认质量，并在 qualityID 中返回选中项。媒体地址、请求头和广告策略不写入影视库、备份或复制入口。认证、目录和媒体只走平台允许接口，不尝试移除 DRM、解锁付费或改变地区权限。</p>\n<p>现有音轨/字幕选择来自原生引擎识别的容器/清单轨道。API v1 尚不接受单独外部字幕清单、多组外部音频或插件自定义播放后端。需要这些能力时按版本扩展；不要改播放器去识别平台字段。</p>\n<h2 id=\"v1-h-9\">广告：播放优先的可选扩展</h2>\n<p><code>adPolicy</code> 可省略，默认未知，不阻断已有合法媒体播放；无法识别或时间段异常的广告元数据按未知处理，原始媒体流不被删改；不能因为广告信息缺失就假定用户有免广告权限，也不自动过滤媒体流中的广告。</p>\n<pre><code>{\n  &quot;mode&quot;: &quot;embedded&quot;,\n  &quot;canSkip&quot;: false,\n  &quot;breaks&quot;: [{ &quot;id&quot;: &quot;pre-1&quot;, &quot;start&quot;: 0, &quot;end&quot;: 15, &quot;canSkip&quot;: false }]\n}</code></pre>\n<ul><li>mode 支持 unknown / none / embedded / clientSide；breaks 使用整段媒体的秒数，按时间排序、不重叠。</li><li>embedded 表示广告已经在平台返回的完整流中。已知不可跳过段限制 seek、续播起点和倍速；只有账号权限和该段都允许时才可跳过。</li><li>Bilibili 当前未可靠获得统一广告政策，明确输出 unknown，沿用原平台授权媒体，不伪造“无广告”或免广告权益。</li><li>clientSide 独立广告素材、SDK、曝光/完成上报与 VAST/VMAP 是第二版后续兼容项，目前没有实现。字段存在不等于流程已支持。不得制造广告完成回调或绕过平台必须完成的授权前置步骤。</li></ul>\n<h2 id=\"v1-h-10\">错误与隐私</h2>\n<p>error_json 为 PluginFailureDTO：<code>code</code>、<code>message</code>、<code>retryable</code>。建议稳定使用 INVALID_REQUEST / AUTH_REQUIRED / ACCESS_DENIED / NOT_FOUND / NETWORK_ERROR / SOURCE_ERROR / UNSUPPORTED_OPERATION。宿主保留错误码，展示去除 URL 后的消息；当前 retryable 是语义提示，不代表已实现自动重试。</p>\n<p>客户端不提供真实媒体 URL 的显示、复制或导出，原生播放器关闭终端输出。临时媒体只在插件调用和播放器内存中使用。纯本地程序不能保证抵抗进程检查、抓包或调试；隐藏 UI 不等于 DRM 或绝对防提取。不要向用户承诺“无法下载/分发”。</p>\n<h2 id=\"v1-h-11\">验证</h2>\n<p>先执行 <code>bash scripts/build-app.sh</code> 生成真实安装包，再用 README 的缓存环境运行 Swift tests。集成测试实际安装、动态加载、识别、通过 C 回调传回结构化错误、停用、重新启用、卸载和重启读取状态；没有网络时不伪造真实播放成功。原生音频测试验证独立音轨和媒体头部数组。实时登录、有声播放、平台广告流程及外部插件仍需实机验收。</p>\n<p>内联 HLS 与不完整目录扩展参见 <code>API v2</code>，v1 Bilibili 包继续兼容。</p>\n<p>弹幕 size 是字号倍率，1 表示默认字号；时间为整集秒数。episode.number 为展示用字符串，可以是数字、日期、期次或上下集标签；顺序以插件 sections/episodes 数组为准。</p>\n<h2 id=\"v1-h-12\">正片目录扩展（宿主0.4.2，可选字段，ABI兼容）</h2>\n<ul><li><code>PluginSectionDTO.role</code> / <code>PluginEpisodeDTO.role</code>：main、trailer、extra、alternate、unknown。剧集值优先，否则继承所在分区；均缺失则 unknown。未来未知字符串也解码为 unknown，不默认正片。</li><li>role 是编辑内容角色，与VIP、购买等播放权益分离；VIP正片仍为main。平台没有明确信息时保留unknown，不能让宿主按平台ID或片名猜测。</li><li>同一作品内正片按平台分区与剧集顺序展开、按稳定剧集ID去重。<code>section.playbackGroupID</code> 相同且非空明确表示可跨分区连续播放（例如同一专辑的年份段）。缺失时不跨分区自动连播，不能用它拼接不同季。</li><li><code>episode.availability</code>：released、unreleased、unavailable、unknown；是发布/可用状态，不代表用户有会员权益。缺失/unknown仍可请求真实播放授权，unreleased/unavailable不会成为自动下一集。</li><li>旧插件、旧数据库的可选值仍可解码；保留原有单集播放和进度，未分类内容不进入正片自动连播链。旧宿主忽略新增可选字段，无需更换C符号。</li><li>完整目录仍输出全部内容，不能为了让选集只显示正片而删掉花絮、其他版本或未知条目。宿主在详情页独立展示附加内容。</li></ul>\n<h2 id=\"v1-h-13\">内容分级与自动目录</h2>\n<p>新插件包必须在清单顶层声明 <code>contentRating</code>。只提供普通内容时填 <code>&quot;general&quot;</code>。只要能提供不宜儿童观看的内容，即使混在普通目录里或通过分类切换提供，也要填 <code>&quot;adult&quot;</code>。分级适用于整个插件。SDK 模板会在编译前校验，宿主安装会拒绝缺少分级的包。宿主启动时兼容此前已安装且未声明分级的普通插件。重新安装需补齐。<code>儿童锁插件清单样例</code></p>\n<p>受儿童锁限制的插件仅面向支持儿童锁的宿主。儿童锁每次启动默认锁定，设置和侧栏隐藏受限插件，影视库隐藏不宜儿童观看的内容。重新锁定会停止对应播放、停用源并丢弃在途插件结果。解锁按原有启用开关恢复插件。</p>\n<p>如需提供免手工添加的目录，在清单的 <code>sidebar</code> 中声明 <code>catalogURL</code>（HTTPS）。宿主打开侧栏时向插件发送原有 <code>collection</code> 请求，并附加从 1 起的 <code>page</code> 参数。选中类型时附加 <code>category</code> 参数，值为插件返回的类型 ID。对应插件实现 <code>catalogFilters</code> 操作（输入 <code>null</code>，输出 <code>[{ &quot;id&quot;: &quot;category-id&quot;, &quot;title&quot;: &quot;类型名&quot; }]</code>）。目录与类型只在当前浏览会话使用，条目继续通过现有 <code>playback</code> 操作播放。</p>\n<p>声明 <code>sidebar.catalogSearch: true</code> 后，宿主将整站搜索关键词作为 <code>search</code> 查询参数与 <code>category</code>、<code>page</code> 一起传给 <code>collection</code>。插件返回当前搜索结果页，修改关键词时宿主回到第一页。</p>\n<p><code>sidebar.recommendationsURL</code> 可为自动目录声明推荐页的 HTTPS 地址。宿主用同一个 <code>collection</code> 操作获取推荐视频，并按返回顺序在首屏轮播最多 10 条。收藏保存在 Kivo 的本地影视库备份中，以插件与剧集标识区分，不需要平台账号。</p>\n<p>自动目录可以用 <code>sidebar.catalogActions</code> 声明目录操作（<code>favorite</code>、<code>filter</code>、<code>refresh</code>）。宿主依据声明渲染顶部工具栏，遥控器菜单键在目录右侧打开对应的上下文操作。省略时沿用自动目录原有操作。</p>",
      "toc": [
        {
          "id": "v1-h-2",
          "level": 2,
          "text": "运行模型与版本"
        },
        {
          "id": "v1-h-3",
          "level": 2,
          "text": "C ABI"
        },
        {
          "id": "v1-h-4",
          "level": 2,
          "text": "操作与输入输出"
        },
        {
          "id": "v1-h-5",
          "level": 2,
          "text": "稳定标识与目录"
        },
        {
          "id": "v1-h-6",
          "level": 2,
          "text": "内容分类（兼容性可选字段）"
        },
        {
          "id": "v1-h-7",
          "level": 2,
          "text": "直播标记（兼容性可选字段）"
        },
        {
          "id": "v1-h-8",
          "level": 2,
          "text": "播放输出"
        },
        {
          "id": "v1-h-9",
          "level": 2,
          "text": "广告：播放优先的可选扩展"
        },
        {
          "id": "v1-h-10",
          "level": 2,
          "text": "错误与隐私"
        },
        {
          "id": "v1-h-11",
          "level": 2,
          "text": "验证"
        },
        {
          "id": "v1-h-12",
          "level": 2,
          "text": "正片目录扩展（宿主0.4.2，可选字段，ABI兼容）"
        },
        {
          "id": "v1-h-13",
          "level": 2,
          "text": "内容分级与自动目录"
        }
      ]
    },
    "v2": {
      "source": "docs/plugins/v2/README.md",
      "html": "<h1 id=\"v2-h-1\">Plugin API v2：内联 HLS</h1>\n<p>v2 保留 v1 的目录、账号、错误、广告策略和 C ABI 参数布局，新增可选 <code>PluginPlaybackDTO.inlineHLS</code>。适用于平台直接返回播放列表文本、而非可再次请求的 m3u8 URL 的场景。它是平台无关的播放输入能力，不是爱奇艺专用播放器。</p>\n<h2 id=\"v2-h-2\">版本协商</h2>\n<ul><li>包清单设置 <code>apiVersion: 2</code>。</li><li>导出 create / can_handle / data_store / request 四个 <code>videohub_plugin_*_v2</code> 符号，参数和所有权规则同 v1。</li><li>新宿主同时支持 v1 与 v2。旧宿主会拒绝 apiVersion 2，避免忽略内联列表后加载错误的资源。</li><li>Bilibili 继续使用 v1，不需要迁移。只使用直连 URL 的插件也可继续交付 v1。</li></ul>\n<h2 id=\"v2-h-3\">输出</h2>\n<p>除原有播放字段外，增加：</p>\n<pre><code>{\n  &quot;video&quot;: &quot;https://example.invalid/first-segment.ts&quot;,\n  &quot;audio&quot;: null,\n  &quot;format&quot;: &quot;HLS&quot;,\n  &quot;duration&quot;: 120,\n  &quot;qualityID&quot;: 500,\n  &quot;qualities&quot;: [{&quot;id&quot;:500,&quot;label&quot;:&quot;720p&quot;}],\n  &quot;preview&quot;: false,\n  &quot;headers&quot;: {},\n  &quot;inlineHLS&quot;: &quot;#EXTM3U\\n#EXT-X-TARGETDURATION:4\\n#EXTINF:4,\\nhttps://example.invalid/first-segment.ts\\n#EXT-X-ENDLIST\\n&quot;\n}</code></pre>\n<p>这是只用于字段示例的无效域名。内联模式下 video 为平台真实返回的首个媒体分段地址，用于维持资源标识及格式校验；宿主实际加载完整 inlineHLS，而不是只播放这个分段。</p>\n<p>列表必须以 #EXTM3U 开头、不超过 2 MiB、无 NUL；普通 URI 行以及 URI=&quot;...&quot; 标签引用必须是完整 HTTP(S) 地址。插件必须先把可明确解析的相对引用规范化，不能猜测签名 URL，也不能过滤、重排广告或媒体片段。</p>\n<p>宿主通过 libmpv memory:// 输入加载文本，并使用 FFmpeg HLS demuxer。文本不写到磁盘、不建立本地 HTTP 代理、不提供下载/复制入口。媒体请求头仍从 headers 设置，后续加载非 HLS 输入时会清除强制格式，避免影响其他视频源。</p>\n<p>DRM 及专用授权 SDK 不因增加内联列表而得到支持。插件必须识别并报告无法适配的保护类型，不能把解密或权限绕过当成格式兼容。广告规则沿用 v1：未知策略不阻断现有合法播放，不主动过滤广告或伪造完成。</p>\n<h2 id=\"v2-h-4\">验证</h2>\n<ul><li><code>bash scripts/test-inline-hls.sh</code>：真实 libmpv 在内存加载测试 HLS，验证视频与 48kHz 音频解码，不使用代理。</li><li>原有 v1 插件回归测试必须继续通过。</li><li>爱奇艺真实链接验证是单独的 opt-in 网络测试，默认不会自动联网。具体执行和结果见插件 README。</li></ul>\n<h2 id=\"v2-h-5\">不完整目录</h2>\n<p><code>PluginCollectionDTO.isComplete</code> 可选。false 表示只返回已读取到的部分目录；宿主合并已知剧集，不能用这一页覆盖并删除先前读取的剧集。true 或缺失沿用完整目录替换语义。插件必须如实标记，不能把当前一集冒充全集目录。规范播放页使用 episode.canonicalURL，不能强行从平台数字 ID 拼出不适用的网页 slug。</p>\n<p>正片角色、availability、playbackGroupID 可选扩展与 v1 共用，参见 <code>v1 正片目录扩展</code>。不影响 inlineHLS 或已授权媒体，旧字段含义不变。</p>\n<p>内容分级和自动目录沿用 <code>v1 清单及操作定义</code>。</p>",
      "toc": [
        {
          "id": "v2-h-2",
          "level": 2,
          "text": "版本协商"
        },
        {
          "id": "v2-h-3",
          "level": 2,
          "text": "输出"
        },
        {
          "id": "v2-h-4",
          "level": 2,
          "text": "验证"
        },
        {
          "id": "v2-h-5",
          "level": 2,
          "text": "不完整目录"
        }
      ]
    }
  }
};
