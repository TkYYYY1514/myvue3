# Git 常用操作

## 📦 日常开发流程

### 提交代码

```bash
# 1. 查看更改
git status

# 2. 添加所有更改
git add .

# 3. 提交
git commit -m "描述你的修改"

# 4. 推送（自动触发部署）
git push
```

---

## 🚀 首次推送

```bash
# 初始化
git init
git add .
git commit -m "initial commit"

# 关联远程仓库
git remote add origin https://github.com/你的用户名/myvue3.git
git branch -M main

# 推送
git push -u origin main
```

---

## ⚠️ 常见问题

### 1. 连接失败

**错误：** `Failed to connect to hub.fastgit.org`

**解决：**
```bash
# 删除错误的镜像配置
git config --global --unset url.https://hub.fastgit.org.insteadof

# 检查远程地址
git remote -v
```

### 2. 推送被拒绝

**错误：** `Updates were rejected`

**解决：**
```bash
git pull origin main --allow-unrelated-histories
git push
```

### 3. GitHub Actions 失败

- **Node 版本错误：** 修改 `.github/workflows/deploy.yml` 中的 `node-version: 20`
- **权限错误（403）：** Settings → Actions → General → 选择 "Read and write permissions"

---

## 🌐 访问部署后的网站

```
https://你的用户名.github.io/myvue3/
```

**注意：** 推送后需要等待 2-5 分钟才能看到更新。
