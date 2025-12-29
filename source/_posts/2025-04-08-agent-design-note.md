---
layout: post
title: Agent Design Note
subtitle: Agent Design Note
description: 分享构建Coding Agent的实践经验，包括Tool设计、上下文保护、Thinking Tool应用以及Meta Agent研究方向。
date: 2025-04-08
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

基于最近对 Claude code 的一些复现和[构建 Agent 的相关演讲](https://www.bilibili.com/video/BV1yyZVYYEF9)，总结一下学到的经验

### 用 Agent 角度思考并提供上下文

上下文的提供包括：

- Tool 的 description、参数、实现和错误提醒
- System prompt 和 User prompt 如何提供上下文

用 Agent 的角度思考是指人类仅通过上下文来完成任务，发现 prompt 和 tool 的设计不足之处。当 Tool 设计的不好的时候，很容易导致任务失败。同时，我个人感觉 Tool 的使用对于 AI 也是一种心智负担，如果多次重试，AI 的注意力会被分散到 Tool 的使用上，而不是任务本身。

**对比 mcp-toolbox 和 claude code 实现，会发现 claude code 的实现更加严格、更加原子化**

另一个角度：让 AI 来为 AI 设计 prompt 和 tool，可以问 AI：

- 这个 prompt 是否有冲突？是否够明确？还要补充什么？
- 这个 tool 的描述是否清晰，你会如何使用？

> 这里有复现 claude code 的 tool 和我设计的其他 tool：https://github.com/ai-zerolab/lightblue-ai/tree/main/lightblue_ai/tools

### 保护 Agent 上下文

当前的注意力模型和上下文窗口受限，如果有大量信息获取的任务，可以用 sub-agent 的方式保护主 Agent 的上下文，可以看做是主 Agent 把任务分包出去。

这种方式需要 Tool 有明确的定义，教导 Agent 什么时候进行任务分包。

### 保持简单，苦涩的教训

从[AI System 苦涩的教训](https://ankitmaloo.com/bitter-lesson/)中我们可以看到，人类的过度限制（规则）和对算力的过分控制导致了我们和 AI 一起成长，分享模型能力增长的红利。反而我们编写的各种规则、限制和约束让下一代的 AI 的能力无法得到充分发挥。从 gpt 3.5 到 gpt4，再到 sonnet 3.5, 3.7 可以非常明显看出，基于规则的 AI 设计所带来的性能提升会迅速被下一代模型的能力提升远远超越，在使之前的努力付诸东流的同时，很可能导致下一代 AI 表现比裸模型更差。

> 我们应当建造赛道，而非规定每一个运动员的跑步姿势！

### 一些当前的问题

> 例如，在IT自动化基准测试ITBench中，代理在高达25.2%的网络安全场景中错误地标记任务为“已解决”

当前LLM被上下文影响很容易认为自己确实解决了问题。类似于人类的[motivated reasoning](https://en.wikipedia.org/wiki/Motivated_reasoning)问题

> 难以一次编写出可以编译通过的代码

通常都需要多轮对话进行错误修复，这导致了非常长的响应时间。


### Thinking Tool更适合Agent

在过程中，LLM可以调用Thinking Tool进行“思考”，这比Extended Think和Deep-Claude的模式更加“本质”和自然，我们经常可以看到模型在任务执行过程中进行Thinking。

通常我们可以通过引导多轮对话的方式明确需求，但在执行过程中的发现的问题，通过Thinking工具可以让AI更好地发散思路，达到更好的效果。

并非说Reasoning无用，而是二者可以有机结合，互为补充，Thinking Tool可以通过外挂的方式赋予非Reasoning在任务开始和过程中思考的能力。

> 我观察到任务开始和进行中都有Thinking的调用。特别是在信息收集的Tool调用前后，比如搜索前后用Thinking来整理思路和搜索到的结果

### Meta Agent：进一步研究方向

当我们调整 tool 和 prompt 的时候，我们或许可以让 AI 来为 AI 设计 tool 和 prompt。通过一个 Meta Agent（或 Meta Tool），对 Tool 进行自动化设计和优化。

其中有两个可以优化的方向：

- ReAct: Tool 的 Description 和参数设计
- CodeAct: Tool 的实现和错误处理

这种方式可以避免 AI 根据人类分工来进行 Agent 划分，而是针对不同的任务对工具进行特化，从而更符合 AI 工程学和任务的特点。回顾之前的 Meta Agent 设计，人们常常想把人类的分工强加在 AI 上，设计出类似 CEO、产品经理的职位 Agent，这导致了上下文的剥离、角色扮演的规则限制，是[多 Agent 系统失败的重要原因](https://arxiv.org/abs/2503.13657)。

**我们更应该从上下文的角度来思考问题，这也是 LLM 最本质的原理：自回归模型。**而让 AI 设计针对上下文的工具，也可以看做是一种 RL 手段。

### 预算控制：如何在工具调用链中控制预算

另一个课题是如何在工具调用链中控制预算，Jina 在 deep research 的相关分享中提到，当快要超预算的时候，可以让 AI 尽快得出结论，而不是更进一步进行搜索研究。但我们仍然很难让 AI 理解如何在一个任务中对任务的各个步骤进行基于预算的规划和分配，这可能需要模型能力的进一步提升。
