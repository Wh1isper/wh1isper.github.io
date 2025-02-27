---
layout: post # 使用的布局（不需要改）
title: Two import things for AGI # 标题
subtitle: Two import things for AGI #副标题
date: 2025-02-27 # 时间
author: Wh1isper # 作者
banner_img: /img/post-bg-coffee.jpeg
catalog: true # 是否归档
tags: #标签
  - AGI
  - LLM
  - 技术思考
category:
  # - 随笔
  # - 时评
  # - 读书笔记
  - 技术分享
---

现在的LLM变革就像从地图到自动驾驶，以前AI尝试给用户以指引，所有操作和判断仍需要人类进行。当导航技术逐渐发展时，人们基本可以按照导航行事。但自动驾驶非常不同，他需要AI主动地感知道路状况以作出判断。最初，自动驾驶使用专家系统，通过规则来实现智能的下限和响应时间要求，LLM之前的AI发展也是如此，人们通过规则设计，实现了一整套大数据Pipeline，通过数学建模来实现AI决策。现在越来越多企业转向端到端方案，通过视觉、雷达等方式为模型提供信息，由模型直接进行驾驶决策，这于神经网络端到端方案在其他领域的应用是一致的。

[《苦涩的教训》](http://www.incompleteideas.net/IncIdeas/BitterLesson.html)一文中，Rich Sutton指出依赖计算能力的方法在过去七十年中总会获胜，因为摩尔定律和人们的持续优化下，计算能力的提升将击败人类强加的逻辑，因为这些逻辑很大程度受到当时算力的制约，无法享受到算力提升的优势。在LLM领域，人们将这一观察结论的实践推向高潮：想方设法地将算力投入进大模型，并优化其效率，最终推动模型能力的非线性增长。

回顾我们之前在[基于LLM的AIOS](https://blog.wh1isper.top/2024/12/22/2024-12-23-llm-as-os/)的讨论，我们认为Context和Agent(Autonomous)是两个最重要的概念，通过它们实现Code Generation，从而将AIOS建立在目前的计算机系统之上。其中，Agent(Autonomous)的本质是通过工程化的设计，将更多的LLM算力投入到实现一个目标中，这于测试时计算[(1)](https://arxiv.org/abs/2408.03314)的概念不谋而合，我们将此作为“使用更多算力，获得更多智能”的工程化手段。

第二则是Context，我们曾设想用一个Apple Vision之类的硬件来收集上下文，投入到某个设计好的Agent之中，而这几乎要求一个封闭而完整的生态体系，有很大的实施难度。不过目前我们从[MCP](https://modelcontextprotocol.io/introduction)中获得了灵感，通过Agent设计来驱动模型自主获得上下文，各个厂商或个人开发提供自身上下文的服务，将这个领域从封闭转向开放，或许Agent设计中一个重大的部分就是如何设计Agent、模型、MCP Server三方的交互和驱动。[cline](https://github.com/cline/cline)项目给我们做了一个很好的例子，虽然有很多不完善的地方，但是其精细的Prompt控制、代码上下文管理、MCP交互让我们看到了Coding Agent的更高上限。
