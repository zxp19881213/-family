# 我们家的日记本 — 第二阶段

一个只给自己/家人看的照片 + 视频 + 博客小站。

## 已经做了什么

- 首页：按时间倒序的"日记流"，每条可以是照片、视频或纯文字
- 每条日记下面有真实的评论区，存在 Cloudflare D1 数据库里，永久保存
- "写一条新日记"支持真正上传照片/视频到 Cloudflare R2
- 密码门校验挪到了后端（Cloudflare Functions），不只是前端摆设

## 需要在 Cloudflare Pages 项目里配置的绑定/环境变量

Settings → Functions（或 Bindings）里需要有：

| 类型 | 名字 | 值 |
|---|---|---|
| R2 bucket binding | `MEDIA_BUCKET` | 你建的 R2 存储桶（如 family-media） |
| D1 database binding | `DB` | 你建的 D1 数据库（如 family-db） |
| 环境变量 | `FAMILY_PASSWORD` | 全家共用的密码（建议加密） |
| 环境变量 | `MEDIA_BASE_URL` | R2 存储桶的 Public Development URL，比如 `https://pub-xxxx.r2.dev`（不要加末尾的斜杠） |

改动这些设置后需要重新部署一次才生效。

## D1 数据库表结构

第一次使用前，在 D1 数据库的 Console 里执行 `schema/schema.sql` 里的建表语句。

## 本地运行

```bash
npm install
npm run dev
```

打开终端里显示的地址（通常是 http://localhost:5173）。

默认密码是 `ourfamily`，可以在 `src/components/PasswordGate.jsx` 里的
`SITE_PASSWORD` 改成你自己的。

## 部署到 Cloudflare Pages

1. 把这个项目推到一个 GitHub 仓库（可以设为 private，只有你能看到代码，
   这和网站本身是否公开访问无关）
2. 登录 Cloudflare Dashboard → **Workers & Pages** → **创建应用程序** →
   **Pages** → **连接到 Git**，选这个仓库
3. 构建设置：
   - **构建命令**：`npm run build`
   - **构建输出目录**：`dist`
4. 部署完成后，在 Pages 项目里的 **自定义域** 里绑定你已经托管在 Cloudflare
   的域名，几分钟内就能生效（因为域名本来就在 Cloudflare，DNS 记录会自动建议）

## 接下来的阶段（还没做）

- **第二阶段**：接入 Cloudflare R2 做真实的照片/视频存储，上传表单真正生效
- **第三阶段**：接入 Giscus 做真实的、能持久保存的评论区
- **第四阶段**：把密码门换成更安全的方式（比如 Cloudflare Pages Functions
  校验 + 环境变量存密码，而不是像现在这样明文写在前端代码里）

## 项目结构

```
src/
  components/
    PasswordGate.jsx    密码门
    Entry.jsx           单条日记（标题+正文+媒体+评论）
    MediaPlaceholder.jsx 照片/视频占位符
    Comments.jsx        评论区
    NewEntryForm.jsx     写新日记的表单
  data/
    entries.js          假数据，第二阶段会换成真实数据源
  App.jsx
  styles.css
```
