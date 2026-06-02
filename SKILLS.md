# AI祝福工厂 — Skills配置 & 强规则

> 更新：2026-06-02 | 参考：周笺小记 SKILLS.md + CODE_REVIEW + 踩坑复盘

---

## 一、已安装 Skills

### 开发专用

| Skill | 用途 | 调用时机 |
|------|------|------|
| `miniprogram-development` | 页面/组件/云函数/调试/发布 | 写任何代码前 |
| `cloudbase-document-database-in-wechat-miniprogram` | blessings/user_settings 表CRUD | 写云函数/数据库操作前 |
| `auth-wechat-miniprogram` | OPENID获取、wx.cloud身份 | 涉及用户登录 |
| `frontend-design` | UI设计、海报模板 | 改UI/设计前 |
| `code-review-excellence` | 代码审查 | 每日收尾/阶段结束时 |
| `icon-designer` | 图标设计（TabBar SVG） | 做图标前 |

### 项目管理

| Skill | 用途 | 调用时机 |
|------|------|------|
| `planning-with-files-zh` | 任务规划、进度跟踪、会话恢复 | **每次会话开始** |
| `create-prd` | PRD撰写（已完成） | 无需再调 |
| `verify` | 代码改动后验证 | 功能完成后 |
| `simplify` | 代码质量审查 | 每日收尾 |

### 冷启动 & 运营

| Skill | 用途 | 调用时机 |
|------|------|------|
| `cold-start-strategy` | 冷启动策略 | 上线前1周 |
| `copywriting` | 推广文案 | 冷启动阶段 |
| `seo-content-optimizer` | 微信搜一搜关键词 | 上线后 |

---

## 二、⚠️ 强制规则（从周笺小记踩坑复盘）

### 规则1：所有工作必须先调用对应 Skill

> 来源：[[project-rule-skills-mandatory]]

| 做什么 | 先调什么 |
|------|------|
| 写WXML/WXSS/JS | `miniprogram-development` |
| 写云函数/数据库 | `cloudbase-document-database-in-wechat-miniprogram` |
| 改UI/设计 | `frontend-design` |
| 代码审查 | `code-review-excellence` |
| 测试验证 | `verify` |
| 写文案 | `copywriting` |
| 规划任务 | `planning-with-files-zh` |

**Why：** 之前UI修复没调miniprogram-development，忽略了微信兼容性问题，反复踩坑浪费大量时间。

### 规则2：动手前先验证

> 来源：[[verify-before-fixing]]

**不要凭假设行动。** 涉及部署/配置/基础设施时，第一件事是读当前状态：
- 读响应头、配置文件、项目记忆
- 不要假设用了什么平台/什么版本

**Why：** Day 13 假设站点在Netlify，实际在Vercel，浪费1小时。

### 规则3：任务密度控制

> 来源：[[session-task-management]]

- 不超过5件事同时做
- 超过5件→先砍到5件
- 每完成3件→断点检查

**Why：** Day 13 9件事同时做→碎片化→4次错误。

### 规则4：项目文件更新必须全量同步

> 来源：[[project-file-update-rule]]

更新项目文件时：
1. 提取上次更新至今的所有改动
2. 遍历全部项目文件逐一检查
3. 确保文件间数据一致
4. Git push

### 规则5：命名先查商标

> 来源：牛马周记命名踩坑

提交小程序名称审核前：
- 查微信商标注册
- 避开敏感行业词（"周报"触发媒体审核）
- 准备2-3个备选名称

---

## 三、🔴 微信小程序踩坑清单（开发前必读）

> 来源：周笺小记 Day 3-4 踩坑 + 4轮代码审查

### CSS兼容性（最常踩）

| ❌ 不能用 | ✅ 替代方案 |
|------|------|
| `flex gap` | `margin` |
| 组件WXSS中的标签选择器（如`view{}`） | 全部用class选择器 |
| `page::after` / `page::before` 伪元素 | 额外view元素 |
| emoji在TabBar中 | 手绘SVG图标 |
| `position: fixed` 在scroll-view中 | 移出scroll-view |

### 路由 & 导航

| ❌ 不能做 | ✅ 正确做法 |
|------|------|
| `wx.navigateTo` 跳TabBar页面 | `wx.switchTab` |
| TabBar页面中`navigateTo`跳非TabBar页后再返回 | 用非TabBar独立页 |

### 混元AI调用

| ❌ 不能做 | ✅ 正确做法 |
|------|------|
| 云函数中使用`cloud.ai` | `wx.cloud.extend.AI`（前端调用） |
| 基础库版本<3.7.1 | `project.config.json`中设libVersion为`3.15.1` |
| 一次生成无频控 | 云函数加30秒频控（防烧Token） |

### 数据安全（代码审查强制项）

| 规则 | 说明 |
|------|------|
| **所有删除/更新操作必须校验所有权** | 查`userId`是否匹配，不匹配返回FORBIDDEN |
| **生成类云函数必须加频控** | 同一用户30秒内最多调1次 |
| **所有用户输入必须msgSecCheck** | 文案生成后审核，不通过→回退重生成 |
| **日期统一用本地时间** | 云函数中`new Date()`不用UTC（时区偏移Bug） |

### 异步 & 状态

| ❌ 问题 | ✅ 修复 |
|------|------|
| `wx.setStorage`异步→先执行了后续逻辑 | 改用`wx.setStorageSync`同步读写 |
| TabBar组件状态不自同步 | 每个页面`onShow`中调TabBar同步方法 |
| Pick选项硬编码在JS和WXML各一份 | 统一放在`utils/config.js`维护 |

### 数据库

| 规则 | 说明 |
|------|------|
| 创建复合索引 | blessings表：`{userId: 1, createdAt: -1}` |
| 云函数中`_openid`不会自动设置 | 需要手动写入`userId: wxContext.OPENID` |

---

## 四、代码审查强制检查项（每次review必过）

> 来源：周笺小记 4轮审查累计32项发现

| # | 检查项 | 说明 |
|------|------|------|
| 1 | 🔴 所有权校验 | 所有delete/update操作是否校验了userId |
| 2 | 🔴 频控 | generateBlessing是否有单用户频控 |
| 3 | 🔴 内容审核 | 生成内容是否走过msgSecCheck |
| 4 | 🟡 时区 | 云函数日期计算是否用了本地时间 |
| 5 | 🟡 Prompt单一源 | Prompt逻辑是否只在一个地方维护 |
| 6 | 🟡 CSS兼容性 | 是否用了gap/tag selector/page::after |
| 7 | 🟡 TabBar同步 | 页面跳转后TabBar高亮是否更新 |
| 8 | 🟢 选项集中管理 | 所有选项文案是否在config.js维护 |
| 9 | 🟢 代码结构 | 方法是否拆分合理，回调是否提取 |

---

## 五、项目文件索引

| 文件 | 角色 | 状态 |
|------|------|------|
| PRD-祝福工厂.md | 产品需求文档（8段式） | ✅ |
| 小程序介绍.md | 审核文案 | ✅ |
| 功能清单.md | 50个功能点 | ✅ |
| 技术实现路线.md | 技术栈/架构/开发排期 | ✅ |
| task_plan.md | 5阶段执行计划 | ✅ |
| findings.md | 市场调研数据 | ✅ |
| progress.md | 进度日志 | ✅ |
| SKILLS.md | 本文件 | ✅ |
| README.md | 项目说明 | ✅ |
| .gitignore | Git忽略配置 | ✅ |
| miniprogram/ | 小程序代码 | ⏳ 待开发 |

### 待创建（后续阶段）

| 文件 | 阶段 |
|------|------|
| 冷启动指标体系.md | 阶段4冷启动 |
| 冷启动推广素材.md | 阶段4冷启动 |
| miniprogram/CODE_REVIEW.md | 开发完成后 |

---

## 六、开发前检查清单

开始写代码前，逐项确认：

- [ ] 调了 `miniprogram-development` skill
- [ ] 确认项目名/类目/商标没问题
- [ ] `project.config.json` 中 libVersion ≥ 3.7.1
- [ ] 云开发环境已就绪（或复用周笺小记环境）
- [ ] 混元API可用（`wx.cloud.extend.AI`已验证）
- [ ] 数据库已建表（blessings / user_settings）
- [ ] 读了一遍踩坑清单（本文档第三节）
- [ ] 读了一遍 task_plan.md 知道当前阶段

---

## 七、不相关 Skill（排除）

| Skill | 排除理由 |
|------|------|
| a-stock-data, fund-screener | 金融相关 |
| affiliate-marketing | 联盟营销 |
| agent-browser | 浏览器自动化 |
| baoyu-imagine, baoyu-infographic | 图像/信息图生产（可用混元替代） |
| blog-writing-guide | Sentry专用 |
| pinterest-posts | Pinterest不相关 |
| image-optimization | 无图片SEO需求 |
| skill-creator | 不创建新skill |
| loop, claude-api, update-config | 不需要 |
