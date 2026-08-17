# Git 操作指南

本项目的远程仓库：`https://github.com/TkYYYY1514/myvue3.git`

---

## 📦 日常开发流程

### 提交并推送代码

```bash
# 1. 查看当前改动
git status

# 2. 暂存所有改动（也可指定文件：git add src/xxx.vue）
git add .

# 3. 提交，写明本次修改内容
git commit -m "描述你的修改"

# 4. 推送到远程（main 分支）
git push origin main
```

> 推送后如配置了 GitHub Actions，会自动触发构建部署，等待 2-5 分钟生效。

### 拉取远程最新代码

```bash
git pull origin main
```

---

## 🚀 首次配置

### 方式一：从远程克隆（推荐新环境）

```bash
git clone https://github.com/TkYYYY1514/myvue3.git
cd myvue3
```

### 方式二：本地已有项目，关联远程

```bash
# 1. 初始化仓库
git init

# 2. 提交本地代码
git add .
git commit -m "initial commit"

# 3. 关联远程仓库
git remote add origin https://github.com/TkYYYY1514/myvue3.git

# 4. 设置主分支名
git branch -M main

# 5. 首次推送并设置上游（之后可直接 git push）
git push -u origin main
```

---

## 🧩 后端地址配置（重要）

后端服务地址统一在 **`public/config.js`** 中维护（默认 `121.41.23.8:3000`）：

```js
window.APP_CONFIG = {
  API_HOST: '121.41.23.8',  // 后端主机
  API_PORT: '3000'           // 后端端口
}
```

- 前端代码统一通过 `src/config/index.js` 读取，`vite.config.js` 的代理目标也读取同一文件。
- **换后端地址只需修改该文件**，本地刷新页面即生效；部署到服务器后替换该文件并重新构建推送即可。

> ⚠️ `.env` / `backend/.env` 等敏感文件已被 `.gitignore` 忽略，不会提交到仓库，无需担心泄露。

---

## ⚠️ 常见问题

### 1. 推送被拒绝（Updates were rejected）

远程有本地没有的提交，先拉取合并再推送：

```bash
git pull origin main --allow-unrelated-histories
git push origin main
```

### 2. 提示需要认证 / 输入用户名密码

GitHub 已不支持密码推送，需使用 **Personal Access Token** 或已配置的凭据管理器：

- 生成 Token：GitHub → Settings → Developer settings → Personal access tokens
- 推送时用户名填 GitHub 用户名，密码填 Token
- 或安装 [Git Credential Manager](https://github.com/git-ecosystem/git-credential-manager) 缓存凭据

### 3. GitHub Actions 失败

- **Node 版本错误：** 修改 `.github/workflows/deploy.yml` 中的 `node-version: 20`
- **权限错误（403）：** Settings → Actions → General → 选择 "Read and write permissions"

### 4. 误改了代码想回退

```bash
# 撤销暂存（保留改动）
git reset HEAD

# 丢弃工作区某个文件的改动
git checkout -- 文件名

# 回退到上一个提交（谨慎，会丢失改动）
git reset --hard HEAD~1
```

---

## 🌐 访问部署后的网站

```
https://tkyyyy1514.github.io/myvue3/
```

**注意：** 推送后需要等待 2-5 分钟（GitHub Actions 构建完成）才能看到更新。

---

## 📌 常用命令速查

| 操作 | 命令 |
| ---- | ---- |
| 查看状态 | `git status` |
| 查看提交记录 | `git log --oneline` |
| 暂存全部 | `git add .` |
| 提交 | `git commit -m "说明"` |
| 推送 | `git push origin main` |
| 拉取 | `git pull origin main` |
| 查看远程 | `git remote -v` |
