# 项目管理平台

一个基于 Vue 3 + Element Plus 构建的现代化后台管理系统。

## 📋 项目简介


## ✨ 主要功能

- 🔐 **用户认证系统**
  - 登录/注册功能
  - 角色权限管理（Admin/User）
  - 表单验证与错误提示
  - 加载动画效果

- 📊 **数据看板**
  - 控制台概览
  - 数据分析
  - 电商数据统计

- 🎨 **界面特性**
  - 响应式布局设计
  - 暗黑/亮色主题切换
  - 侧边栏折叠/展开
  - 平滑的路由过渡动画
  - 全屏加载动画

- 🛠️ **技术亮点**
  - 组件化开发
  - Pinia 状态管理
  - Vue Router 路由管理
  - Element Plus UI 组件库

## 🚀 技术栈

- **前端框架：** Vue 3.5+ (Composition API)
- **构建工具：** Vite 8.0+
- **UI 组件库：** Element Plus 2.13+
- **状态管理：** Pinia 3.0+
- **路由管理：** Vue Router 5.0+
- **HTTP 客户端：** Axios 1.14+
- **开发语言：** JavaScript (ES6+)

## 📦 安装与运行

### 环境要求

- Node.js: ^20.19.0 或 >=22.12.0
- npm 或 yarn

### 安装步骤

1. **克隆项目**
   ```bash
   git clone <your-repository-url>
   cd myvue3
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **启动开发服务器**
   ```bash
   npm run dev
   ```
   访问 http://localhost:5173 查看应用

4. **构建生产版本**
   ```bash
   npm run build
   ```

5. **预览生产构建**
   ```bash
   npm run preview
   ```

## 📁 项目结构

```
myvue3/
├── src/
│   ├── components/          # 公共组件
│   │   ├── Header.vue      # 顶部导航栏
│   │   ├── Sidebar.vue     # 侧边栏菜单
│   │   └── MainLayout.vue  # 主布局组件
│   ├── views/              # 页面视图
│   │   ├── auth/           # 认证相关页面
│   │   │   ├── Login.vue
│   │   │   ├── Register.vue
│   │   │   └── AuthLayout.vue
│   │   ├── dashboard/      # 数据看板
│   │   │   ├── console.vue
│   │   │   ├── analysis.vue
│   │   │   └── ecommerce.vue
│   │   └── template/       # 模板页面
│   ├── router/             # 路由配置
│   ├── stores/             # Pinia 状态管理
│   │   ├── menu.js         # 菜单状态
│   │   ├── tabs.js         # 标签页状态
│   │   └── theme.js        # 主题状态
│   ├── App.vue             # 根组件
│   └── main.js             # 入口文件
├── public/                 # 静态资源
├── index.html              # HTML 模板
├── vite.config.js          # Vite 配置
└── package.json            # 项目依赖
```

## 🎯 使用说明

### 默认账号

- **管理员账号**
  - 用户名：admin
  - 密码：123456

- **普通用户账号**
  - 用户名：user
  - 密码：123456

### 主题切换

点击右上角的主题切换按钮，可在亮色和暗色主题之间切换。

### 侧边栏控制

点击侧边栏顶部的折叠按钮，可以展开或收起侧边栏菜单。

## 🌐 部署到 GitHub Pages

### 1. 修改 Vite 配置

在 `vite.config.js` 中添加 `base` 配置：

```javascript
export default defineConfig({
  base: '/myvue3/', // 替换为你的仓库名
  // ...其他配置
})
```

### 2. 使用 Hash 路由模式

在 `src/router/index.js` 中：

```javascript
import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(), // 使用 Hash 模式
  routes: [...]
})
```

### 3. 构建并部署

```bash
npm run build
```

使用 GitHub Actions 自动部署或手动上传 `dist` 文件夹到 `gh-pages` 分支。

## 📝 开发说明

### 添加新页面

1. 在 `src/views/` 目录下创建新的 Vue 组件
2. 在 `src/router/index.js` 中添加路由配置
3. 如需在菜单中显示，更新对应的菜单配置

### 状态管理

使用 Pinia 进行全局状态管理，主要包含：
- `menu`: 侧边栏折叠状态
- `theme`: 主题模式（亮色/暗色）
- `tabs`: 标签页管理

### 样式定制

项目使用 Element Plus 的默认主题，可以通过 CSS 变量进行自定义：

```css
:root {
  --el-color-primary: #409eff;
  /* 其他自定义变量 */
}
```

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

本项目仅供学习交流使用。

