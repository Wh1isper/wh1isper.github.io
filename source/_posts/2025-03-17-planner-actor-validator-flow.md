---
layout: post # 使用的布局（不需要改）
title: Modern Agents-PAV Flow # 标题
subtitle: Planner-Actor-Validator Flow #副标题
date: 2025-03-17 # 时间
author: Wh1isper # 作者
banner_img: /img/post-bg-unix-linux.jpg
catalog: true # 是否归档
tags: #标签
  - LLM
  - Agent
category:
  #   - 随笔
  #   - 时评
  #   - 读书笔记
  - 技术分享
---

> More agents is all you need.

## Architecture

After researching the agent designs of products like [Cline](https://github.com/cline/cline) and [Nanobrowser](https://github.com/nanobrowser/nanobrowser), it is evident that the current state-of-the-art approach involves dividing agent responsibilities to form a fully automated workflow. Drawing inspiration from Cline’s workflow, I aim to retain human-in-the-loop design at the Plan stage, use a validator to make corrections during the Act stage, and finally update and record (possibly revise) the Plan.

![Architecture](../img/2025-03-17-planner-actor-validator-flow/architecture.png)

## Key Points

Some key design considerations:

1. **Plan versioning, readability, and user interaction**
2. **Overall state transitions**
