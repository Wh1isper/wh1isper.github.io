---
layout: post # 使用的布局（不需要改）
title: 🤔Some Note about Building a System from Scratch in startup # 标题
subtitle: Some Note about Building a System from Scratch in startup #副标题
date: 2024-11-05 # 时间
author: Wh1isper # 作者
banner_img: /img/post-bg-coffee.jpeg
catalog: true # 是否归档
tags: #标签
  - Architecture
  - 架构师
  - Startup
  - 初创公司
category:
  - 随笔
  # - 时评
  # - 读书笔记
  - 技术分享
---

Here, I want to share some key takeaways from building a backend and inference system from scratch at Morph Studio. This includes what I did right, where I went wrong, and what I missed along the way, concluding with a checklist that captures these insights as comprehensively as possible.

## What I did right

### Intergrate CI/CD ASAP

CI/CD has significantly improved our efficiency during development. With GitHub Actions, we've implemented unit testing, integration testing, automated deployment, and code review, which has minimized rework on the backend and ensured code quality and stability.

This has enabled each developer to deploy both the development and production environments, even in the early stages when we lacked dedicated operations and deployment personnel.

**Unit testing and Integration testing is very important**, even when rapidly releasing new features or changing existing ones. This ensures that we don't break the system or introduce bugs critically, effectively acting as a safety barrier.

### Model and segment the business

Analyzing the business and abstracting it is essential. Initially, I intended to design the backend as a monolith, but I later realized that there were many reusable functionalities and modules, along with varying update and release cycles for each module. 

As a result, I divided the system into three distinct parts: **infrastructure** (including user management, storage, subscriptions, etc.), **business systems** (covering canvas business, social business, and AI tool business), and **inference systems** (encompassing queue connectors, schedulers, and inference clusters across different cloud regions). These three systems have clear boundaries and dependencies, allowing developers to quickly identify and resolve issues while also clearly delineating development responsibilities.

### Use cloud for scaling

Using public cloud services, especially cloud-hosted Kubernetes, significantly reduces operational costs. We don't have to manage bare metal machines or carefully plan how many servers to purchase; we can simply use the elastic resources provided by the public cloud. However, it’s crucial to avoid vendor lock-in, such as relying on vendor-specific secret management, certificate management, and various SDKs embedded in the code. One lesson I've learned is to use common technologies for system construction, such as using Boto3 for S3 connections, which minimizes issues when switching from AWS S3 to GCS.

## Where I went wrong

### Expand the team too late



## What I missed along the way

### Forgot Data Collection and ETL systems

### DID NOT be Granted Authorization for distribution of benefits

## Conclusion

- Intergrate CI/CD as early as possible, and leverage the elasticity of public cloud for scaling to reduce operational costs.
- Write tests, including unit tests and integration tests, especially during repid releases.
- Use cloud for scaling. This helps reduce operational costs. But be cautious of vendor lock-in.
- When designing a system, beyond functional requirements, it’s essential to consider non-functional requirements that go beyond just performance and maintenance costs. This includes organizing needs related to data collection, analysis, and tracking.
- Expand the team in a timely manner and assess each member's optimal workload range. This ensures there are sufficient resources for improvement, maintenance, and development as features grow.
- Business is about the distribution of benefits; without sufficient authority to manage that distribution, it becomes impossible to effectively manage a team.
