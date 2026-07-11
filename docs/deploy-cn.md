# 国内访问部署方案

## 推荐选择

当前项目建议优先使用腾讯 EdgeOne Pages：

- 免费门槛低
- 支持静态网站
- 支持导入 Git 仓库
- 后续修改代码后可以自动部署
- 比 Vercel、Netlify、GitHub Pages 更适合国内访问

## 部署步骤

1. 把当前项目上传到 GitHub、Gitee、GitLab 或 Bitbucket。
2. 打开 EdgeOne Pages。
3. 选择创建项目。
4. 选择导入 Git 仓库。
5. 选择当前作品集仓库。
6. 确认构建配置：

```text
Install Command: npm install
Build Command: npm run pack:deploy
Output Directory: dist
```

7. 点击部署。

项目根目录已经有 `edgeone.json`，正常情况下平台会自动读取这些配置。

## 关于免费和国内访问

如果只是先拿一个链接给别人看，EdgeOne Pages 的免费方案是最合适的起点。

如果希望在中国大陆长期稳定访问，并使用自己的正式域名，通常需要：

- 购买域名
- 完成 ICP 备案
- 绑定自定义域名
- 选择包含中国大陆的加速或托管能力

这是国内访问合规要求，不是网站代码问题。

## 不太推荐作为国内正式链接的方案

- GitHub Pages：免费，但国内访问经常不稳定。
- Vercel：更新体验很好，但国内访问不一定稳定。
- Netlify：适合临时预览，国内访问不一定稳定。
- Cloudflare Pages：免费好用，但默认并不等于中国大陆优化访问。

## 后续修改网站

以后每次优化网站：

1. 修改本地文件。
2. 本地运行 `node server.mjs` 预览。
3. 提交并推送到 Git 仓库。
4. EdgeOne Pages 会自动重新部署。

