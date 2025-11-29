---
layout:     post
title:      Free from the coding language
subtitle:   Free from the coding language
date:       2025-11-29
author:     Wh1isper
banner_img: /img/tag-bg-o.jpg
catalog: true
tags:
    - 随笔
category:
    - 随笔
    # - 时评
    # - 读书笔记
    # - 技术分享
---

一篇碎碎念，好久没更新了。

最近花了很多时间在研究各个模型之间的差别，同一个prompt下面，不同的厂商的模型所表现出的trajectory差别巨大。同时，随着年末大家的混战，我们惊喜的发现OpenAI、Anthropic、Google三足鼎立的局面似乎正在形成。当我们觉得GPT-5 Codex横扫四方时，Sonnet 4.5的出色表现让我感觉Anthropic并未落后，而Gemini 3 Pro非常惊喜地让我们看到一个经济、速度、性能都非常均衡的选择。

最近我在使用Claude Opus 4.5来进行Rust项目的编写（构建一个LLM网关来进行智能路由，等我完成后会有博客来介绍），明显感觉到与Sonnet 4.5相比，Opus更加谦逊且精准，就我而言，目前最佳的使用方式仍然是与AI讨论设计，输出技术架构和详细设计文档，然后在手动控制上下文长度的前提下（大部分时候是控制每次的任务大小），让Agent能够通过编写测试或其他方式验证实现的情况下，来完成代码编写工作。这一次更不一样的是，我选择了我没有那么熟悉，但是编译器和工具链都非常成熟的Rust语言，结果也非常令人满意。这表明，随着模型能力的提升，我们或许可以更加激进地探索和学习新的技术栈，而不必过于担心自己Debug的能力不足，相反，架构设计、可测试性、可维护性等软实力将变得更加重要。
