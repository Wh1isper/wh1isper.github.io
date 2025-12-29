---
layout: post
title: Ergonomics to Agent
subtitle: Ergonomics to Agent
description: 探讨Agent产品的人体工学设计，分析TODO工具如何增强用户对Agent的掌控和理解，让用户在使用中成长
date: 2025-07-05
author: Wh1isper
banner_img: /img/post-bg-unix-linux.jpg
catalog: true
tags:
  - 产品设计
  - Product Design
category:
  - 随笔
  #   - 时评
  #   - 读书笔记
  # - 技术分享
---

# Agent Design - 人体工学

我们提供了一个TODO工具给Agent，让它可以列出TODO项，并在任务过程中对TODO项进行修改，这一过程会完全展示给用户。

> 当我要求制作一个个人博客时，Agent列出了以下TODO：
> ```markdown
> - [] 创建个人博客的HTML结构
> - [] 设计博客样式和布局
> - [] 添加导航和页面内容
> - [] 添加响应式设计
> ```

起初，我对这一功能并不感冒，因为我知道Agent的工作流程，并通常不依赖他进行架构设计和技术方案选择，因此我只需要关注他对Thinking工具的使用就可以了解他的思路。同时，根据我对Agent的了解，我认为TODO工具某种程度上增加Agent在通用任务中的惰性，不利于其自由发挥，不一定适合我们的产品。

但在推出这一功能之后，我发现我错了。

不仅仅是我们的产品经理和最活跃的用户，大部分技术人员也认为这增强了他们对Agent的掌控和理解，这让我意识到，或许我们在追求Agent性能的道路上，忽略了很多人体工学的内容，我们常常想着如何设计一个产品来交付结果，但忽略了人类与工具交互过程中，人类对于工具的控制、学习和理解。

## 让用户在使用中成长

TODO工具最好的地方在于，让用户在使用的过程中成长。通过TODO工具，非技术人员可以了解到Agent对问题的拆解，从而学习到软件开发、架构设计等领域的知识。也许AI会有幻觉做出错误的编码或设计，但用户可以通过进一步地交互，和AI一起解决问题。这为非技术用户构建了一种在使用中学习的可能性，这是以前的工具类产品所不具有的特性。

上个月我曾[讨论](https://blog.wh1isper.top/2025/06/07/2025-06-08-agi-product-design/)了AGI的产品设计，从端到端的来看，“让用户在使用中成长”可能是最重要的设计理念，这比过去美观的界面、易用的UI又或者是更高的付费转化率更为重要。这代表了AI智能的被驱动程度，而在这过程中人类输入-AI输出的方差，或许能够成为“场景为王”的强化学习下半场中重要的数据资产。

# Ergonomics in Agent Design

> English version translated by Claude and Wh1isper(Human in the loop).

We provided a TODO tool for the Agent, allowing it to list TODO items and modify them during the task process, with the entire process fully visible to users.

> When I requested to create a personal blog, the Agent listed the following TODO:
> ```markdown
> - [] Create HTML structure for personal blog
> - [] Design blog styles and layout
> - [] Add navigation and page content
> - [] Add responsive design
> ```

Initially, I wasn't enthusiastic about this feature because I understand the Agent's workflow and typically don't rely on it for architectural design and technical solution selection. Therefore, I only needed to focus on its use of the Thinking tool to understand its thought process. At the same time, based on my understanding of the Agent, I believed the TODO tool would somewhat increase the Agent's laziness in general tasks, hindering its creative freedom and not necessarily suiting our product.

But after launching this feature, I discovered I was wrong.

Not only our product managers and most active users, but also most technical personnel believed this enhanced their control and understanding of the Agent. This made me realize that perhaps in our pursuit of Agent performance, we've overlooked many ergonomic aspects. We often think about how to design a product to deliver results, but ignore human control, learning, and understanding during the human-tool interaction process.

## Enabling Users to Grow Through Usage

The best aspect of the TODO tool is that it enables users to grow through usage. Through the TODO tool, non-technical personnel can understand the Agent's problem decomposition, thereby learning knowledge in areas such as software development and architectural design. AI might have hallucinations leading to incorrect coding or design, but users can work with AI to solve problems through further interaction. This creates a possibility for non-technical users to learn through usage, which is a characteristic that previous tool-based products didn't possess.

Last month I [discussed](https://blog.wh1isper.top/2025/06/07/2025-06-08-agi-product-design/) AGI product design. From an end-to-end perspective, "enabling users to grow through usage" might be the most important design philosophy, more important than past beautiful interfaces, user-friendly UI, or higher paid conversion rates. This represents the degree to which AI intelligence is driven, and the variance in human input-AI output during this process might become an important data asset in the second half of "scenario-driven" reinforcement learning.
