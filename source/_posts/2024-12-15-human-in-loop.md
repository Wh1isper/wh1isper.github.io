---
layout: post # 使用的布局（不需要改）
title: Human in loop-prompt management and CMS # 标题
subtitle: Human in loop-prompt management and CMS #副标题
date: 2024-12-15 # 时间
author: Wh1isper # 作者
banner_img: /img/post-bg-unix-linux.jpg
catalog: true # 是否归档
tags: #标签
  - Prompt management
  - Prompt CMS
  - CMS
  - LLM
  - Headless CMS
  - Human in loop
category:
  #   - 随笔
  #   - 时评
  #   - 读书笔记
  - 技术分享
---

## What and why prompt management

Recently, I’ve been thinking about how to create a prompt management platform that can interact with programs.

In my vision, a prompt management platform should have the following characteristics:

- **Management Interface**: A user-friendly interface that allows individuals without technical backgrounds to manage prompts with ease.
- **Configuration Center**: A system to distribute prompts, enabling features like A/B testing and gradual updates (gray releases).
- **Integration**: Seamless integration with other platforms or programming languages, such as open-source or self-developed multi-agent systems, as well as LLM observability infrastructure.

I later realized that a Headless CMS might be exactly what I’m looking for—or rather, it could be a good start for building this system.

## Headless CMS

A Headless CMS (Content Management System) is a backend-only system for managing content, which decouples the content creation and management process from the front-end delivery. Instead of rendering web pages directly, it provides an API (e.g., REST or GraphQL) to deliver content to any platform or device, such as websites, mobile apps, or IoT devices.

- **Content Delivery via API**: Content is accessed through APIs, making it flexible for various use cases.
- **Platform Agnostic**: Content can be reused across multiple platforms and devices.
- **Separation of Concerns**: Backend and frontend can be developed independently.
- **Scalability and Performance**: Optimized for delivering content quickly to multiple endpoints.

## Key points for choosing a Headless CMS(for prompt management)

#### Usability

- **Non-technical user interface**: Look for an intuitive admin panel suitable for managing prompts.
- **Customizable schemas**: Ensure you can define prompt-related fields like metadata, versions, and tags. This is more like a key-value store than a relational database, and I beliveve it is a better fit for cms systems too.

#### API Capabilities

- **API-first design**: Supports REST and GraphQL for flexible integration. JSON REST API is my first choice as I can build python/TypeScript client easily.
- **Real-time updates**: Webhooks or real-time API support to synchronize prompts dynamically.
- **Scalability**: Handles high traffic and supports dynamic content fetching.

#### Extensibility and Integration

- **Versioning**: Built-in or easy to implement with plugins, for A/B testing and gray releases.
- **Observability**: Compatibility with logging or analytics tools for monitoring prompt performance. Or I can implement it myself with injecting metadata.
- **Customization**: For advanced features and administration
- **Authorization**: SSO or OAuth for easily managing members and permissions.

#### Open-Source and Community

- **Active community support**: Choose a CMS with a strong developer ecosystem.
- **Easy integration**: Easy integration with other platforms and programming languages.

## Some chooses

#### Strapi

- a clean, user-friendly admin panel that allows non-technical users to manage content easily.
- JSON REST API and GraphQL out of the box.
- Direct logging or integration with external tools like Datadog or custom observability pipelines via middleware.
- Strapi is open-source with a large, vibrant community and frequent updates. And works seamlessly with modern stacks (Next.js, Vue, Python, TypeScript) and is widely adopted in enterprise environments.

#### Directus

- Works as a database wrapper, so it integrates easily with a JSON-like schema.
- Focuses on scalability and flexibility with SQL databases.
- Supports webhooks, custom flows, and JSON REST APIs.

#### Payload CMS

- TypeScript-first with robust support for API customization.
- Excellent versioning and role management.
- Perfect for developers who need deep customizability.

#### KeystoneJS

- GraphQL-first but supports REST.
- Schema-driven with great extensibility.
- Ideal for modern JavaScript ecosystems like Next.js.

### My thoughts

For me, scalability might not be the top priority. What I’m likely to focus on first is faster development efficiency and integration speed. And, I may not need a relational database; instead, I might choose a NoSQL database like MongoDB to gain better operability. For example, we could develop our own system to replace the CMS system.

I plan to start by exploring Payload CMS, a full-stack project based on Next.js. It has a very active community and doesn’t have any paid features, only offering cloud services and paid support. Stay tuned, I will continue to update related progress here!
