---
layout:     post
title:      PTC是一种端到端的方案
subtitle:   PTC是一种端到端的方案
description: 深入分析Anthropic的Programmatic Tool Calling(PTC)技术，探讨有状态API的环境状态设计理念，以及端到端数据积累对AI Agent发展的价值
date:       2025-12-03
author:     Wh1isper
banner_img: /img/post-bg-unix-linux.jpg
catalog: true
tags:
    - LLM
    - AGI
category:
    # - 随笔
    # - 时评
    # - 读书笔记
    - 技术分享
---

最近在做大模型网关，之前也积累了比较丰富的Coding Agent经验，看了一些针对[Anthropic's Programmatic Tool Calling](https://platform.claude.com/docs/en/agents-and-tools/tool-use/programmatic-tool-calling)的分析，感觉都有一些不到位，技术上来说，Anthropic实现了一个服务端的[CodeAct](https://arxiv.org/pdf/2402.01030)工具，将代码编写和执行都放在服务端进行，并不在API中完全暴露，由此，API的使用者可以在减少token消耗的情况下实现目标。

> 如果在客户端实现，则至少需要编写代码-执行代码两个轮次，甚至更多

下面这张图很好的解释了整个工作流程：

![](https://www.anthropic.com/_next/image?url=https%3A%2F%2Fwww-cdn.anthropic.com%2Fimages%2F4zrzovbb%2Fwebsite%2F65737d69a3290ed5c1f3c3b8dc873645a9dcc2eb-1999x1491.png&w=3840&q=75)

以上基本上是大部分自媒体/公众号/营销号对于它的理解，以下我提供一些不一样的看法，可能不一定成熟。

## 有状态API应该包含环境状态，而不是消息状态

有状态API的起始是OpenAI的Responses API，在我看来其主要目的有二：

1. 允许客户端可以在发起任务之后异步获取结果，以减少服务器压力
2. 更好地在隐藏推理细节的同时，提供连贯推理的服务

但实际上，Responses API只是在性能上稍好，大部分时候OpenAI只享受到其数据安全的部分，因为Responses API实际上无状态模式，而大部分时候，我是使用无状态模式进行交互：实时拉取流，保存thinking signature而非id，完整回填整个消息列表

**PTC提供了一种带有环境状态的API，其编写、执行代码将对其服务端的对应环境造成影响**，简单来说，过去我们让Agent改文件，所有文件状态的更新发生在我的本地，而Agent需要主动获取我本地的环境信息，这依赖于我，确切的说是我所使用的客户端，Claude Code、Codex CLI、Cline等等具体的工具实现，而PTC模式下，这些工具是在服务端沙盒实现的，没有实现者的bias、没有普适性要求、也没有那么多需要考虑的适配和安全问题。

## 端到端的数据积累

过去，模型公司收集到的用户使用数据只能通过消息，我们常说Cursor的价值在于积累了很多用户交互的真实数据，实际上指的就是环境数据和消息数据的结合。现在，PTC展示了一种模型厂直接端到端收集Agent数据的方式，通过一个已经跑通的、需要智能的场景，通过收集这方面的数据，或许能够切实地推进从ReAct到CodeAct的效率和智能提升。

Claude Code Agent SDK远远不够，PTC是Anthropic真正想要的东西。

那么，或许对bun的收购也顺理成章？
