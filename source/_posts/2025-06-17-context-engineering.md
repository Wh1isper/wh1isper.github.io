---
layout: post
title: Context Engineering-The Most Important Thing in Agent Development
subtitle: Context Engineering-The Most Important Thing in Agent Development
description: 深入讲解Agent开发中最重要的上下文工程，涵盖上下文压缩、多Agent系统设计、LLM评估等核心议题。
date: 2025-06-17
author: Wh1isper # 作者
banner_img: /img/post-bg-unix-linux.jpg
catalog: true # 是否归档
tags: #标签
  - Agent
  - Context Engineering
  - LLM
category:
  # - 随笔
  #   - 时评
  #   - 读书笔记
  - 技术分享
---

# Context Engineering-The Most Important Thing in Agent Development

> English version is below. Translated by Claude and Wh1isper(Human in the loop).

## What is Context Engineering

前两个月我写了一篇[博客(Agent Design Note)](https://blog.wh1isper.top/2025/04/07/2025-04-08-agent-design-note/)记录我在设计Coding Agent中的一些重点，现在我想完整的阐述一下对其中Context Engineering的理解。我认为这或许是目前构建任何Agent最重要的内容。

## Key Points of Context Engineering

LLM当前最重要的就是上下文窗口，虽然LLM在大海捞针的测试中表现得越来越好，但一旦有任何逻辑相关出现时，LLM通常很难理解这其中的逻辑。Context Engineering就是为了能够更好地管理上下文，让LLM更好地理解问题或完成任务。

这是我目前的思考重点：

- 用Agent的角度思考并提供上下文
  - 通过Tool 的 description、参数、实现和返回值（Observation）
  - 在system prompt中通过few shots替代workflow
  - 其他上下文集成方案（RAG、HyDE、Post prompt等）
- 保护Agent上下文
  - 通过分包子任务的方式（下面会讨论）
  - 通过Compact Context的方式优化上下文
- 保持简单，基建先行
  - 保持简单、原子化的通用工具设计，否则使用few shots+固定工具的工作流
  - 先完成compact等基建，再考虑多agent等复杂系统

## Compact Context

首先我们讨论如何在长任务中管理Agent的上下文。目前，SOTA的模型有200K的上下文长度，Gemini 2.5 Pro甚至有1M的上下文长度，但对于代码工程而言，多轮对话往往很快就能吃光200K的上下文，这时我们就需要上下文压缩。

一种基于策略的上下文压缩方式是，设定一个固定的水位线，比如50%的token消耗，触发一次上下文压缩，在保留N条消息的情况下，对前N条上下文进行总结后，用总结的结果替换这N条消息。这个N可以选择为0（不保留消息），2（最近2条），1/2（一半上下文）或者1/4（25%上下文）。这种情况下主要调整三个方向：
- 上下文压缩模型的prompt和输出结构
- N值：这代表了统计学上有多少最近上下文是重要的
- 水位线：这代表压缩效率

另一种策略是设计一个记忆系统，每次从记忆系统中获取上下文，而不是保留所有上下文。这一记忆系统可以是LLM based，也可以是基于RAG或其他搜索技术的。

二者对比，前者的缓存效率更高，调试重点更明确，更容易做出足够好的实现，后者则更加智能，但目前没有比较通用的实践。我在Cline、Claude code等看到的方式都是前者，而Windsurf据称是二者混合。

## Role Based Multi Agent Systems

针对上下文问题还有一个想法是通过多个Agent协作完成工作，为此，人们设计了工作流或者中心化Agent。其中一种方式是人工或自动地设计各种角色，然后让LLM以一种角色扮演的方式，沉浸于其角色之中，完成指定的任务。

我对这种方式表示怀疑，主要在于：
- 角色扮演是额外的心智负担：对于理解自身角色，再到做出正确行动，本质是基于人类分工，基于个人认知，而LLM通常有非常广的知识，这二者并不能类比转换
- 基于角色的上下文隔离是低效的：人类常常陷入分工过细的“电话地狱”，Agent也不例外
- 基于角色的流程是脆弱的：经常由于某一个角色设计存在缺陷，导致整体处于木桶效应之中

## Task Based Multi Agent Systems

Anthropic（和我）比较倡导的方案是按照任务划分子Agent，从而保护主Agent的上下文。比如在搜索场景中，可以并发多个Agent搜索多个领域，最后汇总成多份报告，再由审查者或主Agent进行分析。

这种方式的优势在于，主Agent从始至终负责用户需求或任务目标，而子Agent仅提供上下文层面的参考，而不是负责整个任务的执行。其次，子Agent不需要理解自身角色，从而可以更加专注自身任务，从而获得更好的性能表现。

但这一模式并不是万能的，我曾尝试分包一些代码编辑任务，但实际上表现并不好，目前来看，这一模式行之有效的只有信息搜集/上下文获取，而不是进行修改。这和单个人类使用各种工具辅助最后完成任务非常相似，或许用超级个体来比喻这种构建方式更加适当。

## LLM-as-judge evaluation

现在我们已经有了足够的经验来构建一个长时间运行的Agent，至少我们可以让他一直跑下去，并知道在某些任务中可以并行或协作。现在，我们还有一个最重要的问题有待解决：如何评估Agent的行动是否正确/恰当/有效。当一次代码编辑操作成功的时候，Agent只能从工具返回中获悉`编辑成功`，而不是真实看到所带来的改变。即使有测试用例，也只能规范代码的“围栏”而不是确认代码的正确。在其他领域，比如报告撰写、个人助手，则可能连测试用例也没有。

目前的一大研究重点是使用LLM进行评价，而其中最重要的是人类在LLM进行自动化评价的过程中，如何为评价Agent构建上下文，这包括：

- 设计工具来观测当前任务状态和主Agent影响
- 设计工作流程来指导Agent进行评测
- 收集欺骗性案例，帮助评测Agent避开欺骗性事实

正如[The Second Half](https://ysymyth.github.io/The-Second-Half/)一文，现在Agent设计已经进入下半场，如何评测Agent将是把强化学习从后训练扩展到推理时的重要研究课题。

## References

- https://ankitmaloo.com/bitter-lesson/
- https://www.anthropic.com/engineering/building-effective-agents
- https://www.anthropic.com/engineering/built-multi-agent-research-system
- https://cognition.ai/blog/dont-build-multi-agents

# English Version

## What is Context Engineering

Two months ago, I wrote a [blog post (Agent Design Note)](https://blog.wh1isper.top/2025/04/07/2025-04-08-agent-design-note/) documenting some key points in designing a Coding Agent. Now I want to provide a complete exposition of my understanding of Context Engineering, which I believe is perhaps the most important aspect of building any Agent today.

## Key Points of Context Engineering

The most crucial aspect of LLMs currently is the context window. While LLMs perform increasingly well in needle-in-haystack tests, they typically struggle to understand logical relationships once any logic-related content appears. Context Engineering aims to better manage context, enabling LLMs to better understand problems or complete tasks.

These are my current focal points:

- Think from an Agent's perspective and provide context
  - Through Tool descriptions, parameters, implementations, and return values (Observations)
  - Replace workflows with few-shots in system prompts
  - Other context integration solutions (RAG, HyDE, Post prompt, etc.)
- Protect Agent context
  - Through task decomposition approaches (discussed below)
  - Through Compact Context methods to optimize context
- Keep it simple, infrastructure first
  - Maintain simple, atomic, general-purpose tool design; otherwise use workflows with few-shots + fixed tools
  - Complete infrastructure like compacting first, then consider complex systems like multi-agent

## Compact Context

First, let's discuss how to manage Agent context in long tasks. Currently, SOTA models have 200K context length, with Gemini 2.5 Pro even reaching 1M context length. However, for code engineering, multi-turn conversations can quickly exhaust 200K context, necessitating context compression.

One policy-based context compression approach sets a fixed watermark, such as 50% token consumption, to trigger context compression. While preserving N messages, it summarizes the previous N contexts and replaces these N messages with the summary. N can be chosen as 0 (preserve no messages), 2 (most recent 2), 1/2 (half the context), or 1/4 (25% of context). This approach mainly adjusts three dimensions:
- Context compression model's prompt and output structure
- N value: represents how many recent contexts are statistically important
- Watermark: represents compression efficiency

Another strategy involves designing a memory system that retrieves context from the memory system rather than preserving all context. This memory system can be LLM-based or based on RAG or other search technologies.

Comparing the two, the former has higher caching efficiency, clearer debugging focus, and is easier to implement well, while the latter is more intelligent but lacks widely adopted practices. I've seen the former approach in Cline, Claude Code, etc., while Windsurf reportedly uses a hybrid of both.

## Role Based Multi Agent Systems

Another approach to address context issues involves multiple Agents collaborating to complete work, leading to the design of workflows or centralized Agents. One method involves manually or automatically designing various roles, then having LLMs engage in role-playing, immersing themselves in their roles to complete designated tasks.

I'm skeptical of this approach, mainly because:
- Role-playing creates additional cognitive burden: Understanding one's role and then taking correct action is essentially based on human division of labor and individual cognition, while LLMs typically have very broad knowledge—these two cannot be analogously converted
- Role-based context isolation is inefficient: Humans often fall into "phone hell" due to overly detailed division of labor, and Agents are no exception
- Role-based processes are fragile: Often, flaws in a single role design cause the entire system to suffer from the barrel effect

## Task Based Multi Agent Systems

Anthropic (and I) advocate for dividing sub-Agents by task to protect the main Agent's context. For example, in search scenarios, multiple Agents can concurrently search different domains, finally consolidating into multiple reports for analysis by a reviewer or main Agent.

This approach's advantage is that the main Agent remains responsible for user needs or task objectives throughout, while sub-Agents only provide contextual reference rather than being responsible for entire task execution. Additionally, sub-Agents don't need to understand their own roles, allowing them to focus more on their tasks and achieve better performance.

However, this model isn't universal. I've attempted to decompose some code editing tasks, but the actual performance wasn't good. Currently, this model seems effective only for information gathering/context acquisition, not for making modifications. This closely resembles a single human using various tools to ultimately complete tasks—perhaps describing this construction method as a "super individual" is more appropriate.

## LLM-as-judge evaluation

Now we have sufficient experience to build a long-running Agent—at least we can keep it running continuously and know it can parallelize or collaborate on certain tasks. Now we face one final crucial question: how to evaluate whether an Agent's actions are correct/appropriate/effective. When a code editing operation succeeds, the Agent can only learn "edit successful" from tool returns, not actually see the changes brought about. Even with test cases, they only regulate code "boundaries" rather than confirm code correctness. In other domains like report writing or personal assistance, there might not even be test cases.

A major current research focus is using LLMs for evaluation, with the most important aspect being how humans construct context for evaluation Agents during automated LLM evaluation processes, including:

- Designing tools to observe current task state and main Agent impact
- Designing workflows to guide Agents in evaluation
- Collecting deceptive cases to help evaluation Agents avoid deceptive facts

As stated in [The Second Half](https://ysymyth.github.io/The-Second-Half/), Agent design has now entered the second half, and how to evaluate Agents will be an important research topic for extending reinforcement learning from post-training to inference time.

## References

- https://ankitmaloo.com/bitter-lesson/
- https://www.anthropic.com/engineering/building-effective-agents
- https://www.anthropic.com/engineering/built-multi-agent-research-system
- https://cognition.ai/blog/dont-build-multi-agents
