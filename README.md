# EmoSpark-FE

EmoSpark 前端应用，面向儿童、家长和心理咨询师提供情绪记录、沟通、成长查看及咨询协作能力。

[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](./LICENSE)

## 功能概览

- 儿童端：情绪互动、聊天、音乐和成长相关页面。
- 家长端：儿童管理、成长记录、沟通及咨询医生。
- 心理咨询师端：工作台、儿童管理、咨询记录、远程治疗和面对面治疗页面。

## 技术栈

Vue 3、TypeScript、Vite、Vue Router、Pinia、Naive UI、Axios、ECharts、Chart.js 和 D3。

## 开始使用

```bash
npm install
npm run dev
```

生产构建与预览：

```bash
npm run build
npm run preview
```

## 目录结构

```text
src/
├── children-client/       # 儿童端
├── parents-client/        # 家长端
├── psychologist-client/   # 心理咨询师端
├── api/                   # 接口调用
└── router/                # 分角色路由
```

## 相关仓库

- [EmoSpark-BE](https://github.com/FrancesscaWY/EmoSpark-BE)

## 许可证

本项目采用 [Apache License 2.0](./LICENSE) 开源。版权所有者：FrancesscaWY。

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about the recommended Project Setup and IDE Support in the [Vue Docs TypeScript Guide](https://vuejs.org/guide/typescript/overview.html#project-setup).
