---
layout:     post                    # 使用的布局（不需要改）
title:      Tornado实战教程-基本介绍			   # 标题 
subtitle:   Tornado tutorial intro		 #副标题
date:       2020-07-19              # 时间
author:     Wh1isper                      # 作者
header-img: img/post-bg-2015.jpg    #这篇文章标题背景图片
catalog: true                       # 是否归档
tags:                               #标签
    - Tornado教程
    - python
    - 问卷系统后端
---

# 什么是Tornado

> [Tornado](http://www.tornadoweb.org/) is a Python web framework and asynchronous networking library, originally developed at [FriendFeed](http://friendfeed.com/). By using non-blocking network I/O, Tornado can scale to tens of thousands of open connections, making it ideal for [long polling](http://en.wikipedia.org/wiki/Push_technology#Long_polling), [WebSockets](http://en.wikipedia.org/wiki/WebSocket), and other applications that require a long-lived connection to each user.
>
> [Tornado](http://www.tornadoweb.org/)是一个Python Web框架和异步网络库，最初由[FriendFeed](http://friendfeed.com/)开发。通过使用非阻塞网络I / O，Tornado可以扩展到成千上万的开放连接，使其非常适合 [长时间轮询](http://en.wikipedia.org/wiki/Push_technology#Long_polling)， [WebSocket](http://en.wikipedia.org/wiki/WebSocket)和其他需要与每个用户建立长期连接的应用程序。
>
> --以上内容摘自官方文档

**关键词：非阻塞,  [long polling](http://en.wikipedia.org/wiki/Push_technology#Long_polling), [WebSockets](http://en.wikipedia.org/wiki/WebSocket)**

Tornado有着优异的性能。它试图解决C10k问题，即处理大于或等于一万的并发，下表是和一些其他Web框架与服务器的对比（引用于维基百科：[https://zh.wikipedia.org/wiki/Tornado](https://zh.wikipedia.org/wiki/Tornado)）:

**处理器为 AMD Opteron, 主频2.4GHz, 4核**

|                             服务                             |                             部署                             | 请求/每秒 |
| :----------------------------------------------------------: | :----------------------------------------------------------: | :-------: |
|                           Tornado                            |     [nginx](https://zh.wikipedia.org/wiki/Nginx), 4进程      |   8213    |
|                           Tornado                            |                        1个单线程进程                         |   3353    |
|        [Django](https://zh.wikipedia.org/wiki/Django)        | Apache/[mod_wsgi](https://zh.wikipedia.org/w/index.php?title=Mod_wsgi&action=edit&redlink=1) |   2223    |
|                            web.py                            |                       Apache/mod_wsgi                        |   2066    |
| [CherryPy](https://zh.wikipedia.org/w/index.php?title=CherryPy&action=edit&redlink=1) |                             独立                             |    785    |

# 这篇教程的意义

通过这篇教程，我将手把手带你搭建一个高性能的tornado问卷调查系统后端，以此熟悉tornado框架，入门Python异步编程。本教程基于本人在大三期间的软件设计实践课程项目，以下是本教程的文档仓库：[https://github.com/Wh1isper/QuestionnaireSystemDoc](https://github.com/Wh1isper/QuestionnaireSystemDoc)

这篇教程的适用人群：有一定Python基础，想要入门Python异步编程/Tornado框架。

你可以使用Windows环境或Linux环境完成本教程的全部内容，本篇教程要求Python3.5以上，使用新的await以及async关键字。本教程假设已有前端，前端代码可以在上面的文档仓库下载到，教程内容仅关于后端实现。

# 你需要了解的前置知识 or 底层原理

以下内容选读，你可以选择边学边了解，也可以直接看完，后面慢慢领会

## 什么是异步

想要了解异步，首先要了解同步的概念。

这里我们所说的同步，是同步处理而不是时钟同步。所谓同步处理，即同一时间内只执行一个任务，任务处理完之后再执行第二个任务。以做饭的过程举例，可能有买菜、切菜、烧水、煮菜这四个过程，那么同步操作就是严格的执行买菜-切菜-烧水-煮菜这样的顺序。

相反，异步处理不用阻塞当前线程来等待处理完成，而是允许后续操作，直至其它线程将处理完成，并回调通知此线程。仔细观察上面提到的做饭的流程，可以发现，或许在切菜的过程中就可以开始烧水，水烧开之后关火即可省去一部分等待的时间，而切菜的同时烧水，这就是异步！

实际上，这里将人当作了一个单核的CPU，同一时间只能执行一项任务，需要注意的是，切菜是一项持续性任务，需要从头到尾的占用人（从头到尾占用CPU，CPU密集），而烧水则只需要人开火，并在水烧开之后关火，这之间不需要持续占用人，人可以转去做别的事（让出CPU），只需要在水烧开之后通知人即可（任务完成后通知CPU）

我们生活中有许多这样的例子，如等待洗衣机洗衣服、等待水烧开、等待外卖送达，人不会傻等，我们也没有理由让CPU傻等，因此，通过异步操作，可以大幅减少CPU傻等的时间。如登录流程中，后端需要访问数据库来验证用户名密码，等待数据库返回的时间，CPU就可以去做一些别的事情，以此压榨出更多的性能。

一句话总结：异步就是在一项任务阻塞时（水还没开），主动让出CPU，让CPU执行其他任务，等待这项任务的阻塞状态结束时（水烧开了），通知CPU返回处理

![](https://raw.githubusercontent.com/Wh1isper/wh1isper.github.io/master/img/questionnaire/tbyb.png)

## I/O多路复用

这里不多赘述，有太多博文网站已经聊过这个技术：[I/O多路复用技术（multiplexing）是什么？](https://www.zhihu.com/question/28594409)

## 事件循环（event loop）

[事件循环](https://docs.python.org/zh-cn/3.7/library/asyncio-eventloop.html)

事件循环是asyncio的核心，异步任务的运行、任务完成之后的回调、网络IO操作、子进程的运行，都是通过事件循环完成的。更详细的内容，结合下面的[理解 Python asyncio](https://lotabout.me/2017/understand-python-asyncio/ )学习

## GIL锁

**在Python多线程下，每个线程的执行方式：**
1.获取GIL
2.执行代码直到sleep或者是python虚拟机将其挂起。
3.释放GIL

**可见，某个线程想要执行，必须先拿到GIL，我们可以把GIL看作是“通行证”，并且在一个python进程中，GIL只有一个。拿不到通行证的线程，就不允许进入CPU执行。**



在python2.x里，GIL的释放逻辑是当前线程遇见IO操作或者ticks计数达到100（ticks可以看作是python自身的一个计数器，专门做用于GIL，每次释放后归零，这个计数可以通过 sys.setcheckinterval 来调整），进行释放。

而每次释放GIL锁，线程进行锁竞争、切换线程，会消耗资源。并且由于GIL锁存在，python里一个进程永远只能同时执行一个线程(拿到GIL的线程才能执行)，这就是为什么在多核CPU上，python的多线程效率并不高。

[cookbook的分析](https://python3-cookbook.readthedocs.io/zh_CN/latest/c12/p09_dealing_with_gil_stop_worring_about_it.html)

## Python异步解决方案：协程

这篇博文已经讲的非常详细了：[理解 Python asyncio](https://lotabout.me/2017/understand-python-asyncio/ )

如果上面的文章太过于深入，无法理解，可以先阅读本教程后面的章节

# Hello World！

Here is a simple “Hello, world” example web app for Tornado:

```python
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

tornado官方文档：[https://www.tornadoweb.org/en/stable/](https://www.tornadoweb.org/en/stable/)

Python 进阶 协程 Async 异步编程原理和应用： [https://www.bilibili.com/video/BV1qJ411a7kZ](https://www.bilibili.com/video/BV1qJ411a7kZ)

