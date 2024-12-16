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

We often hesitate to recruit new engineers, fearing that they may not quickly contribute to the team's workload and might instead increase communication and training costs. However, continuously delaying the recruitment of new engineers will only worsen the team's situation. As the number of features that need maintenance increases, existing engineers will have to divert their time from developing new features to maintaining old ones. What’s often overlooked is that maintaining legacy features can be a great entry point for new engineers, much like a "good first issue." Those lower-priority bugs and requirements are well-suited for onboarding new engineers.

## What I missed along the way

### Forgot Data Collection and ETL systems

Data collection and analysis are crucial in business decision-making. When a team lacks BI experts, engineers often forget to incorporate the need for data collection and analysis during the design and implementation of systems. I only realized this after our product had been live for a while: the CEO frequently requires various metrics, such as daily active users, monthly active users, and retention rates, but often doesn't know how these metrics should be defined within our product. The backend team also cannot simply provide a statistical answer to an undefined metric.

Looking back, we didn’t have any BI experts involved in the initial system design to address these issues; instead, we relied on some marketing terminology without understanding the actual meanings behind those terms and how to calculate them.

### DID NOT be Granted Authorization for distribution of benefits

As the product evolves and the team continues to collaborate, certain individuals will inevitably step into important roles, whether consciously or unconsciously. Our task is to recognize these individuals' leadership positions and grant them sufficient authority to help them manage the team more effectively. When a person has responsibilities without the corresponding authority (and benefits associated with those responsibilities), they often end up feeling disheartened after their energy is depleted, which can have a very negative impact on the team's operations and morale.

When we identify someone as increasingly important to the team, we should provide them with more opportunities for advancement and support. This approach helps build a tiered engineering team and fosters a sense of unity within the group.

A significant pitfall occurs when the CEO wants to manage every individual but assigns important responsibilities to certain employees without sharing the necessary authority with them. This situation effectively places the overall risk of the company in the hands of those employees, who may not have sufficient incentives to perform well, especially if they are individual contributors with fixed salaries—meaning they lack both the authority and the rewards associated with those responsibilities. **In my view, this scenario often results from the CEO's desire to control everything and their focus on role-playing rather than on the success of the team**. Employees may struggle to recognize this dynamic, often only realizing later that they have been let down.

## Conclusion

- Intergrate CI/CD as early as possible, and leverage the elasticity of public cloud for scaling to reduce operational costs.
- Write tests, including unit tests and integration tests, especially during repid releases.
- Use cloud for scaling. This helps reduce operational costs. But be cautious of vendor lock-in.
- When designing a system, beyond functional requirements, it’s essential to consider non-functional requirements that go beyond just performance and maintenance costs. This includes organizing needs related to data collection, analysis, and tracking.
- Expand the team in a timely manner and assess each member's optimal workload range. This ensures there are sufficient resources for improvement, maintenance, and development as features grow.
- Business is about the distribution of benefits; without sufficient authority to manage that distribution, it becomes impossible to effectively manage a team.
