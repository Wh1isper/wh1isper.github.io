---
layout: post # 使用的布局（不需要改）
title: evals is misleading? # 标题
subtitle: evals is misleading? #副标题
date: 2025-09-10 # 时间
author: Wh1isper # 作者
banner_img: /img/post-bg-unix-linux.jpg
catalog: true # 是否归档
tags: #标签
  - 随笔
  - LLM
category:
  # - 随笔
  # - 时评
  # - 读书笔记
  - 技术分享
---

最近看了一些LLM评估的文章，很明显有两个倾向

- 使用LLM进行评估（LLM-as-Judge）是一种AI-Native的方式，或许在Human alignement（对齐）上可以做到比较好，但仍然受限于简单任务，对于复杂任务人们很难模拟并自动化评估
- 由于复杂性，大多数产品不使用自动评估方法，而是通过研究员/工程师的自主洞见，或者设计信号（Signal），进行A/B实验来判断模型是否变好。Claude code“降智”事件可以看做是一次大型的量化模型A/B实验（有人有证据证明某些时间sonnet和opus是使用量化模型进行serve的，anthropic声称是Bug）

从我的理解上看，没有办法通过一个同等智能的模型评估另一个模型的思考过程，就如同使用AI检测AI一样，如果能被检测，那就一定能骗过检测，而当我们有更高级的智能来评估时，谁又来评估这个“更高级”的智能给我们带来了多少提升？最终我们只能达到两个结果：

1. 做了很多的事，得到了当前结果的算法验证，证明了目前的方法有用，可能产出一些对于当前方法为什么有用的洞见，仅此而已，并不对接下来的技术路线有指导意义
2. 仍然通过人类来探索新方向，评估永远滞后

既然评估只能解决一部分问题，我们应该做什么？**或许我们不应该在现在开始研究评估，或许我们评估的目标并非中间产物**

这一观察可能与我们目前正在AI Coding的前沿有关，我们很明显的碰到了LLM的能力边界，因此开始研究各种Context Engineering的方式，以及思考Context和LLM如何协作。因此我更倾向于将模块拿出来进行评估，衡量每个模块在任务过程中的成本和性能，而非优化出某种想要的结果。简单说，我们应该衡量我们驱动LLM的方式，通过A/B实验捕捉信号、还是通过定性定量分析，都是可以尝试的。

> 世界上大部分人没有用过AI Coding，以后的AI Coding也不会是现在这个样子

**警惕局部最优**

## 参考阅读

- X上的一些讨论：https://x.com/justinstorre/status/1964029634796015685
- A/B测试平台表示没有auto judge，全是监控：https://www.raindrop.ai/blog/thoughts-on-evals
- 系统性的评估是有益的：https://www.sh-reya.com/blog/in-defense-ai-evals/
