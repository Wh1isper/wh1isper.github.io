---
layout: post # 使用的布局（不需要改）
title: LLM只是计算，Context才是内存 # 标题
subtitle: LLM只是计算，Context才是内存 #副标题
date: 2025-09-02 # 时间
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

LLM并非一台计算机，LLM目前只是一个处理器，人们通常将记忆、RAG等外置存储手段作为内存看待，但实际上，只有Context才能被看做内存，而这些外挂的存储手段，可以看作是一种“虚拟内存”，LLM通过工具调用或者工程师通过工程化的手段进行“换页”，人们将此称为Context Engineering。

我之前介绍过[工程上的Context Engineering](https://blog.wh1isper.top/2025/06/16/2025-06-17-context-engineering/)策略，而LLM进行工具调用的方式，目前看分为两种模式：

1. 检索模式：通过向量检索、搜索引擎等方式进行搜索，理解返回结果
2. 阅读模式：通过直接阅读文档进行理解

显而易见，检索模式效率更高，但容易受限于RAG等技术，精确度低，工程难度大，这种方式流行的原因其实是因为简单，而非性能。

目前看，阅读模式的性能更优，但实现上需要有更多考虑：一方面，上下文长度的控制和对应工具实现很重要，通常会提供类似grep、glob等工具来进行代码搜索；另一方面，通过sub-agent的方式进行上下文隔离，可以减少context的消耗。

## 未来如何

我们看到从输入的Prompt Engineering到Context Engineering，我们已经将对LLM应用从简单的汇编语言操作寄存器（仅有输入的prompt）进化到C语言类似的，可进行内存管理的高级语言模式，更进一步地看，下一步或许是发明更高效的编译器技术，让用户的自然语言能够更好地被高级语言所理解和编译，也就是说，Agent（LLM+工程）能够根据用户的输入来更加自主、智能地控制上下文。这是我认为的，除去预训练和记忆模式以外的另一种Learning实现。
