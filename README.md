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

## 一键生成发布文件

```powershell
npm run pack:deploy
```

命令执行后会生成 `dist/` 文件夹，里面只包含线上发布需要的文件：

- `index.html`
- `portfolio.html`
- `project.html`
- `styles.css`
- `script.js`
- `assets/`

## 推荐发布方式

### 方式 1：Netlify Drop，最快

1. 执行 `npm run pack:deploy`
2. 打开 [Netlify Drop](https://app.netlify.com/drop)
3. 把 `dist/` 文件夹拖进去
4. 等待上传完成，Netlify 会自动生成一个公开链接

适合先快速发给招聘方、朋友或同事查看。

### 方式 2：Vercel，适合长期维护

1. 把项目推送到 GitHub
2. 打开 [Vercel](https://vercel.com/new)
3. 导入 GitHub 仓库
4. Framework Preset 选择 `Other`
5. Build Command 留空
6. Output Directory 填 `.`
7. 点击 Deploy

项目里已经包含 `vercel.json`，Vercel 会按静态站点处理。

### 方式 3：GitHub Pages，免费稳定

1. 把项目推送到 GitHub
2. 进入仓库 `Settings -> Pages`
3. Source 选择 `Deploy from a branch`
4. Branch 选择 `main`，目录选择 `/root`
5. 保存后等待部署完成

项目里已经包含 `.nojekyll`，可以避免 GitHub Pages 处理静态资源时出现额外限制。

