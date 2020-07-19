---
layout:     post                    # 使用的布局（不需要改）
title:      从零到一：Tornado问卷后端实战教程01——基本介绍    # 标题 
subtitle:   Python Tornado tutorial intro	 #副标题
date:       2020-07-19             # 时间
author:     Wh1isper                      # 作者
header-img: img/post-bg-2015.jpg    #这篇文章标题背景图片
catalog: true                       # 是否归档
tags:                               #标签
    - Tornado教程
	- python
    - 问卷系统后端
---

# 什么是Tornado

[Tornado](http://www.tornadoweb.org/) is a Python web framework and asynchronous networking library, originally developed at [FriendFeed](http://friendfeed.com/). By using non-blocking network I/O, Tornado can scale to tens of thousands of open connections, making it ideal for [long polling](http://en.wikipedia.org/wiki/Push_technology#Long_polling), [WebSockets](http://en.wikipedia.org/wiki/WebSocket), and other applications that require a long-lived connection to each user.

[Tornado](http://www.tornadoweb.org/)是一个Python Web框架和异步网络库，最初由[FriendFeed](http://friendfeed.com/)开发。通过使用非阻塞网络I / O，Tornado可以扩展到成千上万的开放连接，使其非常适合 [长时间轮询](http://en.wikipedia.org/wiki/Push_technology#Long_polling)， [WebSocket](http://en.wikipedia.org/wiki/WebSocket)和其他需要与每个用户建立长期连接的应用程序。

--以上内容摘自官方文档

关键词：异步、非阻塞

Tornado有着优异的性能。它试图解决C10k问题，即处理大于或等于一万的并发，下表是和一些其他Web框架与服务器的对比（引用于维基百科：https://zh.wikipedia.org/wiki/Tornado）:

**处理器为 AMD Opteron, 主频2.4GHz, 4核**

|                             服务                             |                             部署                             | 请求/每秒 |
| :----------------------------------------------------------: | :----------------------------------------------------------: | :-------: |
|                           Tornado                            |     [nginx](https://zh.wikipedia.org/wiki/Nginx), 4进程      |   8213    |
|                           Tornado                            |                        1个单线程进程                         |   3353    |
|        [Django](https://zh.wikipedia.org/wiki/Django)        | Apache/[mod_wsgi](https://zh.wikipedia.org/w/index.php?title=Mod_wsgi&action=edit&redlink=1) |   2223    |
|                            web.py                            |                       Apache/mod_wsgi                        |   2066    |
| [CherryPy](https://zh.wikipedia.org/w/index.php?title=CherryPy&action=edit&redlink=1) |                             独立                             |    785    |

# 这篇教程的意义

通过这篇教程，我将手把手带你搭建一个高性能的tornado问卷调查系统后端，以此熟悉tornado框架，入门Python异步编程。本教程基于本人在大三期间的软件设计实践课程项目，以下是本教程的文档仓库：https://github.com/Wh1isper/QuestionnaireSystemDoc。

这篇教程的适用人群：有一定Python基础，想要入门Python异步编程/Tornado框架。

你可以使用Windows环境或Linux环境完成本教程的全部内容，本篇教程要求Python3.5以上，使用新的await以及async关键字。本教程假设已有前端，前端代码可以在上面的文档仓库下载到，教程内容仅关于后端实现。

# Hello World！

Here is a simple “Hello, world” example web app for Tornado:

```
import tornado.ioloop
import tornado.web

class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.write("Hello, world")

def make_app():
    return tornado.web.Application([
        (r"/", MainHandler),
    ])

if __name__ == "__main__":
    app = make_app()
    app.listen(8888)
    tornado.ioloop.IOLoop.current().start()
```

This example does not use any of Tornado’s asynchronous features; for that see this [simple chat room](https://github.com/tornadoweb/tornado/tree/stable/demos/chat).

本教程不涉及使用tornado渲染前端页面，如果想要了解这方面的知识，请参考[simple chat room](https://github.com/tornadoweb/tornado/tree/stable/demos/chat)

# 可供参考的学习资料

tornado官方文档：https://www.tornadoweb.org/en/stable/

