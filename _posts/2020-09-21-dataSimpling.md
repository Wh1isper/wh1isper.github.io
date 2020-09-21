---
layout:     post                    # 使用的布局（不需要改）
title:      数据抽样相关笔记	# 标题 
subtitle:   Data Simpling Note 	 #副标题
date:       2020-09-21              # 时间
author:     Wh1isper                      # 作者
header-img: img/post-bg-2015.jpg    #这篇文章标题背景图片
catalog: true                       # 是否归档
tags:                               #标签
    - 数据抽样
    - 大数据
    - spark
---



# 数据抽样相关笔记



## [抽样]([https://zh.wikipedia.org/wiki/%E6%8A%BD%E6%A8%A3](https://zh.wikipedia.org/wiki/抽樣))

### 定义

在[统计学](https://zh.wikipedia.org/wiki/统计学)中，**抽样**（Sampling）是一种[推论统计](https://zh.wikipedia.org/wiki/推論統計學)方法，它是指从目标[总体](https://zh.wikipedia.org/wiki/总体_(统计学))（Population，或称为母体）中抽取一部分个体作为[样本](https://zh.wikipedia.org/wiki/樣本_(統計學))（Sample），通过观察样本的某一或某些属性，依据所获得的数据对总体的数量特征得出具有一定可靠性的估计判断，从而达到对总体的认识。

### 抽样过程

抽样过程主要包括以下几个阶段：

1. 定义总体（母体）
2. 确定[抽样框](https://zh.wikipedia.org/w/index.php?title=抽样框&action=edit&redlink=1)
3. 确定[抽样方法](https://zh.wikipedia.org/w/index.php?title=抽样方法&action=edit&redlink=1)
4. 决定[样本量](https://zh.wikipedia.org/w/index.php?title=样本量&action=edit&redlink=1)
5. 实施抽样计划
6. 抽样与数据收集
7. 回顾抽样过程

### 抽样方法

#### 简单随机抽样

[![img](https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Simple_random_sampling.PNG/300px-Simple_random_sampling.PNG)](https://zh.wikipedia.org/wiki/File:Simple_random_sampling.PNG)

<div align = "center">选择简单随机样本的示意图</div>

**简单随机抽样**（simple random sampling），也叫纯随机抽样。从总体N个单位中随机地抽取n个单位作为样本，使得每一个容量为样本都有相同的概率被抽中。特点是：每个样本单位被抽中的概率相等，样本的每个单位完全独立，彼此间无一定的关联性和排斥性。简单随机抽样是其它各种抽样形式的基础。通常只是在总体单位之间差异程度较小和数目较少时，才采用这种方法[[1\]](https://zh.wikipedia.org/wiki/抽樣#cite_note-1)。

#### 系统抽样

[![img](https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Systematic_sampling.PNG/350px-Systematic_sampling.PNG)](https://zh.wikipedia.org/wiki/File:Systematic_sampling.PNG)

<div align = "center">使用系统抽样技术选择随机样本的示意图</div>

**系统抽样**（systematic sampling），也称等距抽样。将总体中的所有单位按一定顺序排列，在规定的范围内随机地抽取一个单位作为初始单位，然后按事先规定好的规则确定其他样本单位。先从数字1到k之间随机抽取一个数字r作为初始单位，以后依次取r+k、r+2k……等单位。这种方法操作简便，可提高估计的精度。

#### 分层抽样

[![img](https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Stratified_sampling.PNG/300px-Stratified_sampling.PNG)](https://zh.wikipedia.org/wiki/File:Stratified_sampling.PNG)

<div align = "center">使用分层抽样技术选择随机样本的示意图</div>

**[分层抽样](https://zh.wikipedia.org/wiki/分层抽样)**（stratified sampling）。将抽样单位按某种特征或某种规则划分为不同的层，然后从不同的层中独立、随机地抽取样本。从而保证样本的结构与总体的结构比较相近，从而提高估计的精度。难点是如何按照特征划分为不同的层。

#### 整群抽样

**整群抽样**（cluster sampling）。将总体中若干个单位合并为组，抽样时直接抽取群，然后对中选群中的所有单位全部实施调查。抽样时只需群的抽样框，可简化工作量，缺点是估计的精度较差[[2\]](https://zh.wikipedia.org/wiki/抽樣#cite_note-2)。比如美国总统选举，直接抽取某个郡的选民，则可能出现明显的倾向。





## 数据抽样技术

在当前数据搜集和存储技术不断发展、数据量激增的背景下，数据抽样技术可以在稍微降低准确性的情况下经济、快速地得到预测、估计和有代表性的结果，在众多领域都发挥着重要作用。

### 聚合查询

聚合查询操作根据聚合函数的复杂程度可以分为简单聚合查询和复杂聚合查询。

简单聚合查询：求sum、max、avg

复杂符合查询：TopK，KNN，KMeans

传统的聚合查询采用精确查询的方式，对所有数据都进行聚合操作。比如遍历所有数据才能得到sum。然而在满足应用可靠性要求的前提下，实际应用为了能在短时间内得到查询结果，可以容忍一定误差。可以通过数据抽样的方法，在聚合查询之前得到数据总体的子集。只要抽样的样本代表性足够，则可大幅度提高聚合查询的效率。

### 数据保护

数据抽样技术能够使分析师操作数据的子集，而不会损害到原数据。数据抽样的过程中可以添加其他操作，如数据脱敏等，让敏感信息不外泄，做到安全的数据抽样。