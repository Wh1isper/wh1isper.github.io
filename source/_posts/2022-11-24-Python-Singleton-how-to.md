---
layout:     post                    # 使用的布局（不需要改）
title:      🚀Python单例类Singleton样例	# 标题
subtitle:   Python Singleton Example	 #副标题
date:       2022-11-14              # 时间
author:     Wh1isper                      # 作者
banner_img: /img/post-bg-unix-linux.jpg    #技术分享-编程
catalog: true                       # 是否归档
tags:                               #标签
    - Singleton
    - Python
    - OOP
    - 面向对象
category:
    # - 随笔
    # - 时评
    # - 读书笔记
    - 技术分享
---
# 简单直接

发现很多朋友不知道单例如何实现，如果你想要求一个类一定是一个单例，那么最好的方式应该是用metaclass的方式，如下

```python
class Singleton(type):
    _instances = {}
    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            cls._instances[cls] = super(Singleton, cls).__call__(*args, **kwargs)
        return cls._instances[cls]
```

用法如下：

```python
#Python2
class MyClass(BaseClass):
    __metaclass__ = Singleton

#Python3
class MyClass(BaseClass, metaclass=Singleton):
    pass
```

如果你不确定，但是在使用中需要缓存，那你最好写一个manager，缓存实例化的类，而不是在类这里定义一个单例

```python

class Manager(object):
    _cache = dict()
    _class_map = dict()

    @classmethod
    def get(cls, name, *arg, **kwargs)
        return cls._cache.setdefault(name, cls._class_map[name](*arg, **kwargs))

```

# 遇见多线程

> 感谢[@MansfieldLee](https://github.com/MansfieldLee)提到这个问题

一般来说，Python程序不太在乎多线程性能（因为GIL），人们通常利用协程+进程的方式解决问题。在协程中，以下代码块没有 `await`，可以认为是同步的，因此单例的实现也是线程安全的

```python
    # 这个方法没有await，是线程安全的
    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            cls._instances[cls] = super(Singleton, cls).__call__(*args, **kwargs)
        return cls._instances[cls]
```

但是如果你需要在多线程中使用单例，那么你需要考虑线程安全的问题，这里给出一个线程安全的单例实现

```python
import threading

class Singleton(type):
    _instances = {}
    _lock = threading.Lock()
    def __call__(cls, *args, **kwargs):
        # 这里采用if-lock-if的方式，在大部分情况下，不需要加锁，因此性能更好
        if cls not in cls._instances:
            with cls._lock:
                if cls not in cls._instances:
                    cls._instances[cls] = super(Singleton, cls).__call__(*args, **kwargs)
        return cls._instances[cls]
```
