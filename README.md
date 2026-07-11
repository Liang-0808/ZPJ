# 刘彦美个人作品集网站

这是一个纯静态个人作品集网站，入口文件是 `index.html`，素材集中在 `assets/` 目录。发布到线上时不需要后端服务。

## 本地预览

```powershell
node server.mjs
```

然后访问：

```text
http://localhost:8000
```

## 生成发布文件

```powershell
npm.cmd run pack:deploy
```

命令执行后会生成 `dist/` 文件夹，里面只包含线上发布需要的文件：

- `index.html`
- `portfolio.html`
- `project.html`
- `styles.css`
- `script.js`
- `assets/`

## 国内访问推荐方案

优先推荐：

```text
腾讯 EdgeOne Pages + Git 自动部署
```

原因：

- 适合静态作品集网站
- 有免费方案
- 可以连接 Git 仓库，后续修改后自动部署
- 相比 Vercel、Netlify、GitHub Pages，更适合面向国内访问

项目已经添加 `edgeone.json`。部署时选择导入 Git 仓库即可，平台会自动执行：

```powershell
npm run pack:deploy
```

更多步骤见：

```text
docs/deploy-cn.md
```

## 后续更新流程

每次修改网站后：

1. 本地确认页面效果
2. 提交并推送代码到 Git 仓库
3. EdgeOne Pages 自动重新构建并发布

如果只是临时预览，也可以执行 `npm.cmd run pack:deploy` 后，把 `dist/` 文件夹拖到 Netlify Drop。
