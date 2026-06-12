# 进度日志 — 心祝-祝福语

## 2026-06-13 — 真机细节修复与项目同步

### 首页、海报、历史页与真机 AI 问题收敛
- **状态：** complete（当前版本保持，不再继续调整海报正文与生成按钮）
- 执行：
  - 首页生成按钮加载态保留随机文案，但改为短句：`正在生成` / `祝福酝酿中` / `灵感加载中` / `马上就好`，避免长句在胶囊按钮内换行或省略。
  - 首页按钮取消原生 `button loading`，改为自定义小 spinner + 单行文字，规避微信原生 loading 占宽导致文字溢出。
  - 真机调试发现 `model hunyuan-v3 not found in definitions` / `model cloudbase not found in definitions`，最终确认根因是手机微信版本过低；升级微信后 AI 生成正常，不是云函数、额度或模型配置问题。
  - `utils/api.js` 保留前端 AI 失败诊断：fallback 时记录 `aiErrorMessage`，开发版/体验版控制台输出具体失败原因，便于后续排查。
  - 历史页列表将 `target` id 映射为中文展示：`elder` → `长辈/父母`、`friend` → `朋友/同事`、`boss` → `领导/客户` 等。
- 验证：
  - `node --check` 覆盖 `pages/index/index.js`、`pages/history/history.js`、`utils/api.js`、`utils/copywriting.js`、`utils/poster.js`，均通过。
  - 首页、历史页相关 WXML/WXSS 红线扫描无 `gap` / 伪元素命中。
  - `git diff --check` 覆盖本次改动文件通过。
- 下一步：
  - 清除开发者工具编译缓存后重新预览；新版微信真机复测：首页生成 AI 文案 → 预览海报 → 历史页中文对象 → 保存海报。
  - 如果准备提审，需要上传小程序前端代码；云函数只在 `generateBlessing/*` 尚未部署最新 prompt/config 时才需要单独部署。

## 2026-06-13 — 海报正文逐行一致与加粗

### Canvas 正文排版修复
- **状态：** complete（海报正文改为直接使用 AI 原文换行，不再抽重点句或重组段落）
- 执行：
  - `poster.js` 去掉正文区的 `highlight/bodyText` 抽取逻辑，避免首行被拆走、后续文字被拼接。
  - 正文按 AI 原始换行逐行保留，只在单行超过海报宽度时内部自动换行。
  - `splitText()` 改用 `Array.from()` 按真实字符切分，避免 emoji 等双码位字符被拆坏。
  - 正文字重统一提升到 `800`，端午浅色主题正文色加深为 `#163225`，并按文字明暗自动选择轻阴影。
- 验证：
  - `node --check miniprogram/utils/poster.js` 通过。
  - fake canvas 用截图同款端午文案验证，5 行正文均完整进入绘制队列。
  - `git diff --check -- miniprogram/utils/poster.js` 通过。
- 下一步：
  - 微信开发者工具清编译缓存后复测预览页海报；重点看正文是否与上方 AI 文案逐行一致、字体是否足够压住浅色背景。

## 2026-06-12 — 提审前兼容性收敛

### Canvas emoji 与相册授权风险处理
- **状态：** complete（已把真机 emoji 渲染风险改为稳定矢量装饰；相册拒权后可引导进入设置）
- 执行：
  - 移除 `app.wxss` 的全局 `::-webkit-scrollbar` 伪元素，避免触发项目 WXSS 兼容性红线。
  - 三个横向选择器 `scroll-view` 改为 `enhanced + show-scrollbar=false`，替代全局伪元素隐藏滚动条。
  - 海报 Canvas 不再 `fillText()` 绘制 emoji，底部与正文装饰改为稳定圆点/线条矢量元素。
  - AI prompt 明确要求不输出 emoji 或特殊符号；父亲节 fallback 去掉 emoji。
  - 海报保存失败时识别相册拒权/取消，弹窗引导用户打开设置页恢复授权。
- 验证：
  - `node --check` 覆盖 `utils/poster.js`、`components/poster-canvas/index.js`、`cloudfunctions/generateBlessing/prompt.js`、`utils/api.js`，均通过。
  - `rg "gap:|::|:before|:after" miniprogram -g "*.wxss" -g "*.wxml"` 无命中。
  - 开发者工具 automator 未连接：`ws://127.0.0.1:9420` 当前没有打开带自动化端口的项目窗口。
- 下一步：
  - 打开微信开发者工具并启用自动化后复测：首页生成 → 预览页 → 保存海报 → 相册授权。
  - 真机复核重点变为海报视觉与保存授权流程，不再依赖 emoji 跨端渲染。

## 2026-06-12 — 白屏编译问题修复

### 编译白屏排查
- **状态：** complete（已修复一个高概率编译白屏原因，并收敛海报脚本兼容风险）
- 执行：
  - 扫描小程序源码文件头，发现 `miniprogram/app.wxss` 被写入 UTF-8 BOM，diff 中表现为注释前有不可见字符，可能导致微信开发者工具 WXSS 编译异常/白屏。
  - 已移除 `app.wxss` 文件头 BOM，并复扫确认 `miniprogram/` 下无 BOM 文件。
  - 将 `poster.js` 中复杂 emoji 字符类正则改成字符串 token 替换，降低微信 JSCore/编译器对 emoji 正则解析的兼容风险。
- 验证：
  - `node --check` 覆盖 `app.js`、首页、预览页、海报组件和 `poster.js`，均通过。
  - 小程序核心 JSON 可解析。
  - fake canvas context 调用 `composePoster()` 通过。
  - `git diff --check -- miniprogram/app.wxss miniprogram/utils/poster.js progress.md` 通过。
- 下一步：
  - 开发者工具中清除编译缓存后重新编译，确认首页不再白屏。

## 2026-06-12 — 海报正文颜色统一

### Canvas 正文视觉简化
- **状态：** complete（正文短句统一使用主文字颜色，不再单独标记重点句）
- 执行：
  - 删除正文区重点句单独高亮/加粗逻辑。
  - 所有正文短句统一使用 `theme.text` 和相同字号/字重。
  - 保留顶部细分割线和底部节日 emoji，减少视觉干扰。
- 验证：
  - `node --check miniprogram/utils/poster.js` 通过。
  - fake canvas context 调用 `composePoster()` 通过。
  - `git diff --check -- miniprogram/utils/poster.js` 通过。

## 2026-06-12 — 海报重点句省略号修复

### Canvas 文案完整显示
- **状态：** complete（重点句不再被截断成省略号）
- 执行：
  - 去掉 `drawVerseBlock()` 中对重点句的 `trimSentence(..., 18)` 截断逻辑。
  - 新增 `splitHighlight()`，重点句过长时自动拆成最多两行并下移分割线和正文。
  - 删除未使用的 `trimSentence()`，避免后续再次走省略号截断路径。
- 验证：
  - `node --check miniprogram/utils/poster.js` 通过。
  - fake canvas context 使用长重点句调用 `composePoster()`，未输出省略号文本。
  - `git diff --check -- miniprogram/utils/poster.js` 通过。

## 2026-06-12 — AI 提示词改为海报短句输出

### 文案生成格式调整
- **状态：** complete（AI 输出形态已改为适配海报排版的短句结构）
- 执行：
  - `generateBlessing/prompt.js` 从“100-200字祝福段落”改为“4-6行海报短句”。
  - 要求 AI 输出 3 条文案，每条内部保留换行，每条之间用单独一行 `---` 分隔。
  - `generateBlessing/index.js` 的 `userPrompt` 同步改为海报祝福短句要求。
  - `utils/api.js` 的 `parseAIText()` 改为优先按 `---` 拆分三条文案，保留每条内部换行。
  - `poster.js` 的 `buildVerseLines()` 优先尊重 AI 已给出的换行短句，不再强行把完整段落硬切成短句。
  - fallback 文案也改成短句换行格式，避免 AI 失败时又回到长段落。
- 验证：
  - `node --check` 覆盖 `api.js`、`poster.js`、`generateBlessing/prompt.js`、`generateBlessing/index.js`，均通过。
  - 本地模拟 `parseAIText()` 能正确把 `---` 分隔的三条海报文案解析为 3 条记录，并保留内部换行。
- 下一步：
  - 重新部署 `generateBlessing` 云函数后再测试生成，旧云函数不包含新 prompt。

## 2026-06-12 — 海报正文改为短句居中版式

### Canvas 正文排版替换
- **状态：** complete（将正文从左对齐文章段落改为居中短句海报版式）
- 执行：
  - 新增 `buildVerseLines()`，把 AI 文案按标点拆成 3-5 条短句。
  - 删除“引用框 + 左对齐正文段落”的呈现方式，改为重点句加书名号、细分割线、短句居中排布。
  - 关键句使用稍大字号和更高对比度，普通句用弱化颜色，降低正文像聊天/文章段落的感觉。
  - 保留底部自然脚注和节日装饰。
- 验证：
  - `node --check miniprogram/utils/poster.js` 通过。
  - fake canvas context 调用 `composePoster()` 通过。
  - `git diff --check -- miniprogram/utils/poster.js` 通过。
- 下一步：
  - 重新生成海报确认正文是否更像海报文案；如果仍不理想，下一步改 AI 输出结构化短句。

## 2026-06-12 — 海报无意义装饰清理

### Canvas 海报语义优化
- **状态：** complete（去掉无意义印章和后台标签感元素）
- 执行：
  - 右上角“祝”印章改为抽象角标装饰，避免像一个没有语义的按钮/贴纸。
  - 底部“温暖/感恩/健康”关键词标签改为自然脚注文案，例如“愿岁月从容，也愿您多些轻松”。
  - 删除未使用的 `drawSeal()`，避免后续误用。
- 验证：
  - `node --check miniprogram/utils/poster.js` 通过。
  - fake canvas context 调用 `composePoster()` 通过。
  - `git diff --check -- miniprogram/utils/poster.js` 通过。

## 2026-06-12 — 海报排版降噪

### Canvas 海报视觉收敛
- **状态：** complete（根据预览截图，将海报从“元素堆叠”收敛为更清晰的层级排版）
- 执行：
  - 去掉正文首字放大效果，避免正文第一字突兀、破坏阅读流。
  - 引用框降低高度和字号，保留重点句但减少压迫感。
  - 正文限制为最多 6 行，给关键词和底部水印留出稳定空间。
  - 父亲节山形纹样下移到主文字卡片下方，并移除落在正文区域的星点，避免背景线条穿过文字。
  - 背景大圆装饰向画面边缘移动，降低与标题/正文抢层级的问题。
- 验证：
  - `node --check miniprogram/utils/poster.js` 通过。
  - fake canvas context 调用 `composePoster()` 通过。
  - `git diff --check -- miniprogram/utils/poster.js` 通过。
- 下一步：
  - 开发者工具重新生成海报，检查视觉是否从“乱”变成“有层次但干净”。

## 2026-06-12 — 海报智能排版试验版

### Canvas 海报视觉升级
- **状态：** complete（不改 AI/数据库链路，先用本地 Canvas 将纯祝福文案转成更有层次的海报排版）
- 执行：
  - `poster.js` 新增本地文案拆解层：从纯文案中提取标题、重点句、正文和关键词标签。
  - 海报头部改为品牌说明 + 节日胶囊 + 大标题渐变字 + 印章。
  - 正文区域改为重点句引用框、正文首字强调、关键词标签和收束文案，不再只是单一卡片内平铺文字。
  - 节日和风格会影响标题与关键词，保留原有多节日主题背景和纹样。
- 验证：
  - `node --check miniprogram/utils/poster.js` 通过。
  - 使用 fake canvas context 调用 `composePoster()` 通过，未发现缺失方法导致的运行时异常。
- 下一步：
  - 在微信开发者工具/真机预览海报视觉效果，如方向可行，再考虑让 AI 输出结构化海报文案进一步提升稳定性。

## 2026-06-12 — 正式名称统一为心祝-祝福语

### 文案统一
- **状态：** complete（小程序内用户可见品牌展示名、备案/认证口径和项目文档已统一为“心祝-祝福语”）
- 执行：
  - 用户确认备案和微信认证的小程序名称均为“心祝-祝福语”。
  - 首页主标题改为“心祝-祝福语”。
  - 导航栏标题、分享标题、我的页关于入口/版本文案、关于弹窗标题、海报水印同步改为“心祝-祝福语”。
  - 项目计划、PRD、README、功能清单、技术实现路线、SKILLS、发现记录、进度日志中的正式名称同步为“心祝-祝福语”。
- 验证：
  - 全项目已无未加横杠的旧名称残留。
  - `git diff --check` 通过。

## 2026-06-12 — 首页选择区块统一横向选择

### 首页 UI 改版
- **状态：** complete（已将“发给谁？”、“想要什么风格？”改为与“选择节日”一致的横向单选卡片）
- 执行：
  - 将 `target-picker` 从三列网格改为 `scroll-view` 横向卡片列表。
  - 将 `style-picker` 从三列网格改为 `scroll-view` 横向卡片列表，保留风格说明文案。
  - 三个首页选择区现在统一为“横向滑动 + 单选高亮”的选择逻辑，减少视觉和交互差异。
- 验证：
  - `git diff --check -- miniprogram/components/target-picker/index.wxml miniprogram/components/target-picker/index.wxss miniprogram/components/style-picker/index.wxml miniprogram/components/style-picker/index.wxss` 通过。
- 下一步：
  - 真机复核首页三段选择区块滑动体验和选中态。

## 2026-06-12 — 备案审核与微信认证提交

### 阶段 3：提审与上线流程启动
- **状态：** in_progress（备案审核和微信认证已提交，等待平台/主管部门审核结果）
- 执行：
  - 已提交小程序备案审核信息。
  - 已提交微信认证。
  - 当前上线链路从“开发联调/提审准备”切换为“审核等待 + 真机复核 + 代码审核准备”。
- 下一步：
  - 等待备案审核结果和微信认证结果。
  - 继续真机复核海报 Canvas 视觉、emoji 渲染和相册授权。
  - 备案/认证无阻塞后提交代码审核并准备上线发布。

## 2026-06-12 — 跨会话进展同步

### 项目文件同步检查
- **状态：** complete（已核对 Codex 其他会话、规划文件和 git 变更）
- 执行：
  - 检查 `.codex/sessions` 中关联 `C:\Users\Administrator\ai-blessing-factory` 的 4 个会话。
  - 确认 2026-06-12 18:47 会话是本项目最新有效开发会话，关键进展已经写入项目文件：`hunyuan-v3 / hy3-preview` provider 修复、`streamText({ data })` 调用格式、`eventStream` SSE 解析、`source=ai` 首页完整链路通过、海报装饰尝试上线（后续已改为矢量装饰）。
  - 确认 2026-06-12 22:15 会话虽在同目录启动，但内容是“小微 B 端 AI 需求调研”，输出文件位于 `Documents/Codex/.../smartpetguide/outputs`，不属于心祝小程序进展，本次不写入产品计划。
  - 对照 `git diff --stat`，当前未提交变更集中在 AI 链路、海报生成、云函数配置、项目规划文件和依赖文件；没有发现规划文件遗漏关键开发结论。
  - 已修正 `task_plan.md` 当前阶段表述和父亲节倒计时，明确主线从“AI 联调”切到“真机验证 → 提审”。
- 下一步：
  - 真机复核海报 Canvas 视觉和相册授权。
  - 真机通过后进入微信代码审核提交。

## 2026-06-12 — AI 生成链路修复 & 海报装饰尝试

### 阶段 2.8：AI 生成全线贯通 + 海报视觉升级
- **状态：** complete（AI 生成链路已贯通；当时尝试过海报 emoji 装饰，后续已改为稳定矢量装饰）
- 执行：
  - **根因定位：** `createModel('cloudbase')` 是付费资源包路径，小程序成长计划的免费 Token（`pkg-mz4yrwoo-ai-inspire-free`）必须走 `createModel('hunyuan-v3')` provider。
  - **AI 调用修复（api.js）：**
    - 改为 `wx.cloud.extend.AI.createModel('hunyuan-v3').streamText({ data: { model: 'hy3-preview', messages } })`
    - 参数必须包在 `data` 字段里，响应通过 `eventStream` SSE 流解析，读取 `choices[0].delta.content`
    - Provider 优先级：`hunyuan-v3` (hy3-preview，成长计划 Token) → `cloudbase` (deepseek-v4-flash，付费备用)
  - **CloudBase AI+ 开通路径：** 控制台 → 左侧「AI+」（不是「扩展能力」）→ 快速接入 → 立即开通
  - **自动化测试：** 通过 `miniprogram-automator` 连接 IDE WebSocket（端口 9420），验证了完整的生成链路：首页 → 云函数 prepare → AI 流式生成 → 云函数 save (msgSecCheck) → 预览页展示
  - **AI 生成验证通过：** `hunyuan-v3` + `hy3-preview` 返回 438 字高质量父亲节祝福文案，3 条各不相同，有具体生活细节
  - **海报 emoji 装饰尝试（poster.js，后续已替换为矢量装饰）：**
    - 头部标题加节日 emoji（如 🎁 父亲节）
    - 祝福卡片顶部加节日 emoji + 装饰线
    - 卡片底部加 💝
    - 底部文案加 emoji 包裹
  - **AI Prompt 更新（prompt.js）：** 当时新增「适当使用1-2个与节日或情感相关的emoji点缀」指令，后续因真机兼容性已改为禁止 emoji。
  - **IDE 缓存问题：** 修改代码后需清除编译缓存（菜单 → 清除缓存 → 清除编译缓存）并重新编译，否则 IDE 加载旧版代码
  - 云函数 `generateBlessing` 已重新部署，Prompt emoji 指令当时已生效；后续版本已改为海报短句且不输出 emoji。
- 下一步：
  - 真机复核海报 Canvas 视觉和相册授权
  - 父亲节（6/21）前提交审核

## 2026-06-12 — generateBlessing fallback 调试

### 阶段 2.8：内容安全 fallback 分支修复
- **状态：** complete（内容安全权限已通过云函数配置解决；AI 生成与 fallback 主链路均已通过开发者工具自动化验证）
- 执行：
  - 定位到 `generateBlessing/index.js` 在 AI 内容被 `msgSecCheck` 全部过滤后会调用未定义的 `buildFallbackList()`，导致 fallback 入库前直接运行时异常。
  - 已补齐 `buildFallbackList()`，提供 3 条中性 fallback 文案，避免再次返回空内容。
  - 已把 30 秒频控前移到 prepare/save 共同入口，避免客户端直接带 `content` 调 save 绕过频控。
  - 已将 save 入参的 `source` 限定为 `ai/fallback`，并把 `errorMessage` 截断到 300 字，避免异常日志污染历史数据。
  - 已给首页生成和预览页“换一批”透传云函数 `message`，方便联调区分 `TOO_FREQUENT`、`CONTENT_BLOCKED`、`DB_ERROR`。
  - 本地 Node mock 验证通过：prepare 返回 `READY`；模拟 AI 文案被安全审核拦截后，fallback save 返回 `{ code: "OK", source: "fallback", blessingId: "mock-id" }`，并写入 3 条文案。
  - 本地 Node mock 频控补测通过：模拟 30 秒内已有记录时，prepare 和直接 save 都返回 `TOO_FREQUENT`。
  - 已通过微信开发者工具 CLI/automator 连接 IDE：CLI HTTP 端口 `16464`，自动化 WebSocket 端口 `9420`。
  - 云函数状态确认：`generateBlessing/getBlessing/listHistory/trackShare/getStats` 均为 `Active`，运行时 `Nodejs16.13`。
  - 线上根因确认：`msgSecCheck` 报 `-604101 function has no permission to call this API`，不是文案敏感导致。
  - 已改为“安全 API 不可用时仅保存内置 fallback，不保存未审核 AI 内容”，并增量部署 `generateBlessing/index.js`。
  - 已修复通用 fallback 文案，避免出现“通用祝福快乐”，并增量部署 `generateBlessing/prompt.js`。
  - 自动化验证通过：首页点击生成 → 进入预览页 → 返回 `blessingId` → 预览页显示 3 条父亲节文案。
  - 自动化验证通过：历史页能读到最新记录；预览页分享埋点接入后 `shareCount` 从 0 增至 1；海报保存逻辑可生成 `savedPosterPath`。
  - 自动化截图显示 canvas 区域未被截图工具采集，但组件 `ready=true` 且 `canvasToTempFilePath` 能生成临时图片路径，需真机视觉复核。
  - 用户在公众平台“接口权限”页面未找到内容安全接口；确认该问题应通过云函数 `config.json` 声明 `permissions.openapi = ["security.msgSecCheck"]` 解决。
  - 已新增并部署 `generateBlessing/config.json`，直接调用 save 阶段验证 `source=ai` + `msgSecCheck` 已成功入库。
  - 前端 AI 直接调用返回 `EXCEED_TOKEN_QUOTA_LIMIT`，完整首页生成因此仍走 fallback；已修复前端 AI 响应解析，后续会记录真实错误而不是“AI returned empty content”。
  - 复读项目日志后确认额度绑定在 `hunyuan-v3 / hy3-preview` provider，不是 `cloudbase / hunyuan-turbo`。
  - 已清除开发者工具编译缓存，重新开启 automator；直接调用 `hunyuan-v3.streamText` 验证返回正常 SSE 文本。
  - 完整首页链路最终验证通过：首页生成 → `hunyuan-v3` AI 文案 → `msgSecCheck` → 入库 → 预览页，最新记录 `source=ai`，`errorMessage=""`。
- 下一步：
  - 真机复核海报视觉与相册授权弹窗。

## 2026-06-06 — 正式环境切换 & AI链路联调

### 阶段 2.8：正式 AppID / 云环境 / AI生成链路
- **状态：** in_progress（下次继续从内容安全/fallback联调接上）
- 执行：
  - 正式 AppID 已替换为 `wxbd821527de589cb9`
  - 正式云开发环境已替换为 `xinzhu-d7gtsc4pz7a9fa09b`
  - 小程序头像已生成统一视觉版：`miniprogram/images/app-avatar-xinzhu-unified-512.png` + `app-avatar-xinzhu-unified.svg`
  - 已提交正式配置：`252e9d1 chore: switch to official mini program config`
  - 用户已在正式环境部署云函数并创建数据库集合：`blessings`、`share_events`，权限为“仅创建者可读写”
  - `generateBlessing` 曾使用 `cloud.openapi.hunyuan.chatCompletions`，云端报错 `-604100 API not found`
  - 改用 CloudBase Node SDK 后出现 `429` / 网络错误，不适合作为当前主链路
  - 对照周笺小记，确认稳定链路为：云函数 prepare prompt → 前端 `wx.cloud.extend.AI` 调混元 → 云函数 save + `msgSecCheck` + 入库
  - 已将心祝迁移到同款双阶段链路：`generateBlessing` 云函数 prepare/save 双模式，`utils/api.js` 前端调用 AI
  - 当前最新问题：云函数返回 `CONTENT_BLOCKED`，已改为 AI 内容安全不通过时自动降级为内置 fallback 文案并入库
- 下次继续：
  - 重新部署 `generateBlessing`
  - 真机/开发者工具再次点击生成
  - 预期返回：`{ code: "OK", source: "fallback" 或 "ai", blessingId: "..." }`
  - 如果仍 `CONTENT_BLOCKED`，将 fallback 文案进一步改为更中性、短句、无亲属称谓敏感表达
- Git状态：
  - 已提交至 `252e9d1`
  - 当前 AI联调改动未提交，涉及 `app.js`、`utils/api.js`、`generateBlessing/*`、`trackShare/index.js`

## 2026-06-04 — UI图标体系 & 节日海报模板

### 阶段 2.7：中式图标与多节日海报
- **状态：** complete
- 执行：
  - 名称策略：正式展示名确定为“心祝-祝福语”，兼顾品牌与“祝福语”搜索关键词
  - 图标体系：新增35个SVG图标，采用金色线描+小红印点缀，替换首页section、节日/对象/风格选择器、预览页操作按钮、历史页、我的页、空状态中的主emoji图标
  - 配置同步：`holidays.js` / `theme.js` 增加 `icon` 字段，历史页通过节日名映射图标
  - 海报模板：`poster.js` 改为按节日选择主题，覆盖父亲节、端午、七夕、中秋、教师节、春节/新年、生日、通用/感谢
  - Canvas规格：统一为750×1334海报逻辑尺寸，预览层按340宽等比显示，修复坐标系不一致风险
  - 兼容性：移除剩余 `button::after` 伪元素处理，保持无gap/无伪元素
  - 验证：JS语法检查通过，WXSS红线扫描通过
- Git提交：待提交

## 2026-06-03 — 海报修复 & 项目文件同步

### 阶段 2.6：海报5项修复
- **状态：** complete
- 执行：
  - 组件查找：preview.wxml `<poster-canvas>` 添加 `id="posterCanvas"`
  - 分享按钮：改为 `open-type="share"`，绑定 `onShareAppMessage`
  - Canvas缩放：去掉错误双重scale，改为标准 `dpr` 缩放 + 340×604显示尺寸
  - 海报视觉重写：完全对齐星云夜幕品牌——深色渐变底+金色光斑+星光点阵+半透明玻璃卡片+金色边框+品牌区+底部扫码引导
  - 文案截断：6行→12行上限，150字以上自动缩小字号，超出加省略号
- Git提交：`278131c` fix: 海报5项问题修复

### 阶段 2.5：商业策略修正
- **状态：** complete
- 执行：确认个人主体无微信支付→变现改4阶段（纯免费→广告→B端→企业主体）、设止损线DAU<500
- Git提交：`2e9f0bd` fix: 商业策略修正

### 阶段 2.3：代码审查修复
- **状态：** complete
- 执行：数据权限+msgSecCheck+频控+AI统一+伪元素改view+工程化
- Git提交：`d2d5fb4` fix: 代码审查问题修复

### 阶段 2.2：UI改版 — 星云夜幕
- **状态：** complete
- 执行：暗色玻璃拟态设计系统+6个SVG图标+命名改为心祝（后续正式展示名调整为心祝-祝福语）
- Git提交：`13167bf`、`c638677`、`8a84e7b`、`a7efd8c`

### 阶段 2.1：项目文件同步（多次）
- Git提交：`4d20f6b`、`ef3c2e9`、`8a84e7b`

### 阶段 2：MVP开发（代码）
- **状态：** complete
- 执行：创建全部代码文件、npm依赖、GitHub仓库
- Git提交：`081da6b`

### 阶段 1：规划 & 文档
- **状态：** complete
- 执行：PRD、功能清单、技术路线、小程序介绍、README、SKILLS、强规则录入

### 阶段 0：方向调研
- **状态：** complete

---

## 当前状态

| 维度 | 值 |
|------|------|
| 总文件数 | 127 |
| miniprogram/ | 118文件（4页+8组件+5云函数+7工具库+35个SVG图标+统一头像素材） |
| Git提交 | 14次（最新已提交：`252e9d1` 正式小程序配置；当前AI联调改动待提交） |
| GitHub | https://github.com/muchengxian-lab/ai-blessing-factory |
| 安全 | ✅ 红线清零 |
| 兼容性 | ✅ 无gap/伪元素 |
| 海报 | ✅ 多节日主题模板 |
| GUI | ✅ 云函数已部署，AI 生成链路已贯通；真机微信版本问题已排除；海报正文逐行版已确认 |

---

## 关键时间节点

| 日期 | 里程碑 |
|------|------|
| 6/2 | 规划+代码+UI |
| 6/3 | 审查修复+商业修正+海报修复 |
| 6/4 | 图标体系+节日海报模板 |
| 6/6 | 正式AppID/云环境切换 + 云函数/数据库部署 + AI链路联调 |
| 6/7 | 完成真机预览与提交审核准备 |
| 6/7-6/8 | 提交微信审核 |
| 6/8-6/14 | 审核期 |
| **6/21** | **父亲节首发 🎯** |
| 6/25 | 端午节 |

---

## 五问重启检查

| 问题 | 答案 |
|------|------|
| 我在哪里？ | 阶段 2.8 完成：AI 生成链路已贯通；海报正文逐行版、按钮加载态、历史页中文映射已修复 |
| 我要去哪里？ | 阶段 3 提审与上线 |
| 目标是什么？ | 6/21父亲节前上线，免费传播验证 |
| 我学到了什么？ | 成长计划 Token 走 `hunyuan-v3` 不是 `cloudbase`；streamText 参数要包在 `data` 里；SSE 流解析走 `eventStream`；真机微信版本过低会导致 AI definitions 缺失；IDE 改代码后要清编译缓存 |
| 我做了什么？ | AI 调用链路根因修复、海报正文逐行一致、按钮加载态收敛、历史页对象中文映射、CloudBase AI+ 开通、自动化测试验证 |

---

*每个阶段完成后或遇到错误时更新此文件*
