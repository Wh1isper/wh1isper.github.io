---
layout:     post                    # 使用的布局（不需要改）
title:      Tornado实战教程-以协程的方式做用户认证			   # 标题 
subtitle:   Tornado tutorial Coroutine user management		 #副标题
date:       2020-08-23              # 时间
author:     Wh1isper                      # 作者
header-img: img/post-bg-2015.jpg    #这篇文章标题背景图片
catalog: true                       # 是否归档
tags:                               #标签
    - Tornado教程
    - python
    - 问卷系统后端
---





# 用户管理

用户管理的需求分析可见：[Tornado实战教程-需求分析]([https://wh1isper.github.io/2020/08/21/questionnaire02/#%E4%B8%80%E7%94%A8%E6%88%B7%E6%B3%A8%E5%86%8C](https://wh1isper.github.io/2020/08/21/questionnaire02/#一用户注册))

用户管理的概要设计可见：[Tornado实战教程-概要设计]([https://wh1isper.github.io/2020/08/23/questionnaire03/#1-%E7%94%A8%E6%88%B7%E7%AE%A1%E7%90%86%E6%A8%A1%E5%9D%97](https://wh1isper.github.io/2020/08/23/questionnaire03/#1-用户管理模块))

本篇我们来介绍如何使用协程实现用户管理模块功能，本篇教程相当于文档中的详细设计。

# 详细设计

## 数据库设计

首先我们介绍数据库设计，首先给出数据库设计的模型图，用户管理模块位于此图的左侧（看不清请右键打开放大）

![img](https://raw.githubusercontent.com/Wh1isper/QuestionnaireSystemDoc/master/%E5%90%8E%E7%AB%AF%E6%8A%80%E6%9C%AF/img/DataBaseV1.jpg)

用户信息表（UserInfo）：系统使用唯一的自增ID代表用户，表中存储了用户注册信息，包括邮箱、昵称、性别、出生年月及用户状态。用户状态共有2种，0为正常，1为被禁用。

用户密码表（UserPwd）：SHA256加密，存储16进制字符串，利用用户ID与用户信息关联

用户登记记录表（UserLoginRecord）：异变表，用以记录上次用户登录时间和IP，便于分析用户登录情况

## 数据库流程

用户信息创建流程

1. 用户信息建立
2. 用户密码加密存入
3. 初始化用户登录记录

## 代码

### 用户登录的主流程

首先介绍用户登录主流程的代码（注释详尽，就不过多说明了），可以看出，协程方式和非协程方式只有await关键字的区分，这和方法的内部实现有关。

```python
class LoginHandler(BaseHandler):
    ...
    @xsrf
    async def post(self, *args, **kwargs):
        # 获取post请求数据 访问数据库进行用户验证并记录登录
        # 接口约定：https://github.com/Wh1isper/QuestionnaireSystemDoc/blob/master/%E6%8E%A5%E5%8F%A3%E5%AE%9A%E4%B9%89/%E6%8E%A5%E5%8F%A3%E8%AE%BE%E8%AE%A1-2020.05.17-V1.0.md#%E7%94%A8%E6%88%B7%E7%99%BB%E5%BD%95api
        # 成功将set-cookie:user 存有加密后的用户id
        
        json_data = self.get_json_data()
        if not json_data:
            return self.raise_HTTP_error(403, self.MISSING_DATA)
        email = json_data.get('email')
        pwd = json_data.get('pwd')
        check_code = json_data.get('check_code')
        # 必填项确认
        
        if not (email and pwd and check_code):
            return self.raise_HTTP_error(403, self.MISSING_DATA)
        # 验证码确认
        
        if not self.valid_checkcode(check_code):
            return self.raise_HTTP_error(403, self.CHECK_CODE_ERROR)
        # 用户鉴权
        
        # 非协程方式
        
        # user_id = self.valid_user(email, pwd)
        
        # 协程方式
        
        user_id = await self.valid_user(email, pwd)
        if not user_id:
            return self.raise_HTTP_error(403, self.USER_PWD_ERROR)
        # 登录记录
        
        # 非协程方式
        
        # self.login_record(user_id)
        
        # 协程方式
        
        await self.login_record(user_id)
        # 发放权限
        
        self.set_secure_cookie("user", user_id, 				 expires_days=USER_AUTH_EXPIRE_DAY)
        ...
```

### 用同步的方式进行用户登录

下面我们先介绍大家熟悉的用户登录流程，再给出协程方式的用户登录流程作为对比

```python
class LoginHandler(BaseHandler):
    ...
    def valid_user(self, email: Text, pwd: Text) -> Text or None:
        # 验证用户
        
        # 第一步验证邮箱是否注册，返回用户ID
        
        # 第二步验证用户ID与密码是否对应
        
        def valid_email(email: Text) -> Text or None:
            engine = self.get_engine()
            with engine.acquire() as conn:
                result = conn.execute(
                    UserInfoTable.select()
                        .where(UserInfoTable.c.U_Email == email)
                        .where(UserInfoTable.c.U_State == self.USER_STATE_NORMAL))
                userinfo = result.fetchone()
            if userinfo:
                return userinfo.U_ID
            else:
                return None

        def valid_pwd(uid: Text, pwd: Text) -> bool:
            engine = self.get_engine()
            secure_pwd = password_encrypt(pwd, self.PWD_SALT)
            with engine.acquire() as conn:
                result = conn.execute(UserPwdTable.select()
                                            .where(UserPwdTable.c.U_ID == u_id)
                                            .where(UserPwdTable.c.U_Pwd == secure_pwd))
                userinfo = result.fetchone()
            return bool(userinfo)

        u_id = valid_email(email)
        if not u_id:
            return None
        isvalid = valid_pwd(u_id, pwd)
        if not isvalid:
            return None
        return str(u_id)
```



### 用协程的方式进行用户登录

需要注意：

1. 作为协程函数，在里面有协程调用时，需要使用async关键字
2. 将协程看作是：async（我/函数 将准备延迟返回一个数据），await（我/变量 将要接收一个延迟返回的数据）

```python
class LoginHandler(BaseHandler):
    ...
    async def valid_user(self, email: Text, pwd: Text) -> Text or None:
        # 验证用户
        
        # 第一步验证邮箱是否注册，返回用户ID
        
        # 第二步验证用户ID与密码是否对应
        
        async def valid_email(email: Text) -> Text or None:
            engine = await self.get_engine()
            async with engine.acquire() as conn:
                result = await conn.execute(
                    UserInfoTable.select()
                        .where(UserInfoTable.c.U_Email == email)
                        .where(UserInfoTable.c.U_State == self.USER_STATE_NORMAL))
                userinfo = await result.fetchone()
            if userinfo:
                return userinfo.U_ID
            else:
                return None

        async def valid_pwd(uid: Text, pwd: Text) -> bool:
            engine = await self.get_engine()
            secure_pwd = password_encrypt(pwd, self.PWD_SALT)
            async with engine.acquire() as conn:
                result = await conn.execute(UserPwdTable.select()
                                            .where(UserPwdTable.c.U_ID == u_id)
                                            .where(UserPwdTable.c.U_Pwd == secure_pwd))
                userinfo = await result.fetchone()
            return bool(userinfo)

        u_id = await valid_email(email)
        if not u_id:
            return None
        isvalid = await valid_pwd(u_id, pwd)
        if not isvalid:
            return None
        return str(u_id)
```

### 为什么使用协程——这样做的好处

从代码中可以发现，我们主要的开销在于向数据库请求数据，再与用户输入的数据进行对比；而非协程方法在等待数据库期间，CPU是处于阻塞状态的，也就是说，CPU啥也不干，干等着数据库返回信息。而协程方法能够在数据库还未返回之时，主动放出CPU给其他线程（用户线程），等待数据库返回时再进行通知。如此交换地使用CPU，可以极大的减少CPU空等的时间，允许同时服务更多的访问。

