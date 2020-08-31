---
layout:     post                    # 使用的布局（不需要改）
title:      Tornado实战教程-概要设计			   # 标题 
subtitle:   Tornado tutorial intro		 #副标题
date:       2020-08-23              # 时间
author:     Wh1isper                      # 作者
header-img: img/post-bg-2015.jpg    #这篇文章标题背景图片
catalog: true                       # 是否归档
tags:                               #标签
    - Tornado教程
    - python
    - 问卷系统后端
---



# 概要设计



## 0.总体规划

### 功能规划

[![img](https://raw.githubusercontent.com/Wh1isper/QuestionnaireSystemDoc/master/%E5%90%8E%E7%AB%AF%E6%8A%80%E6%9C%AF/img/%E5%8A%9F%E8%83%BD%E8%A7%84%E5%88%92.png)](https://raw.githubusercontent.com/Wh1isper/QuestionnaireSystemDoc/master/后端技术/img/功能规划.png)

### 架构设计

[![img](https://raw.githubusercontent.com/Wh1isper/QuestionnaireSystemDoc/master/%E5%90%8E%E7%AB%AF%E6%8A%80%E6%9C%AF/img/%E5%90%8E%E7%AB%AF%E6%9E%B6%E6%9E%84%E5%9B%BE.png)](https://raw.githubusercontent.com/Wh1isper/QuestionnaireSystemDoc/master/后端技术/img/后端架构图.png)

### 模块组合（整体流程走通）

[![img](https://raw.githubusercontent.com/Wh1isper/QuestionnaireSystemDoc/master/%E5%90%8E%E7%AB%AF%E6%8A%80%E6%9C%AF/img/%E5%90%8E%E7%AB%AF%E6%A8%A1%E5%9D%97%E7%BB%84%E5%90%88.png)](https://raw.githubusercontent.com/Wh1isper/QuestionnaireSystemDoc/master/后端技术/img/后端模块组合.png)

## 1. 用户管理模块

### 1.1 需求描述

1. 用户可以使用邮箱来注册账号，账号有性别、出生日期、昵称项，其中昵称项必填
2. 用户发布问卷之前需要先登入账号
3. 用户可以注销自己的账号
4. 用户有性别、出生日期、昵称项可进行修改

对应需求：用户注册、用户登录、用户注销、用户信息修改

### 1.2 方案设计

用户鉴权：通过cookie存储用户名进行用户鉴权（1day过期）

邮箱验证：通过发送邮箱验证码进行验证，通过cookie暂存（10min过期）

登录验证码：通过cookie暂存登录验证码（10min过期）

提供用户信息修改API

提供用户注册API

提供邮箱验证码获取API

提供登录验证码获取API

提供用户登录API

提供用户注销API

#### 1.2.1 用户注册UML时序图

[![img](https://raw.githubusercontent.com/Wh1isper/QuestionnaireSystemDoc/master/%E5%90%8E%E7%AB%AF%E6%8A%80%E6%9C%AF/img/%E7%94%A8%E6%88%B7%E6%B3%A8%E5%86%8CUML%E6%97%B6%E5%BA%8F.png)](https://raw.githubusercontent.com/Wh1isper/QuestionnaireSystemDoc/master/后端技术/img/用户注册UML时序.png)

#### 1.2.2 用户登录/注销UML时序图

[![img](https://raw.githubusercontent.com/Wh1isper/QuestionnaireSystemDoc/master/%E5%90%8E%E7%AB%AF%E6%8A%80%E6%9C%AF/img/%E7%94%A8%E6%88%B7%E7%99%BB%E5%85%A5_%E6%B3%A8%E9%94%80UML%E6%97%B6%E5%BA%8F.png)](https://raw.githubusercontent.com/Wh1isper/QuestionnaireSystemDoc/master/后端技术/img/用户登入_注销UML时序.png)

### 1.3 接口设计

[用户注册API](https://github.com/Wh1isper/QuestionnaireSystemDoc/blob/master/接口定义/接口设计-2020.05.17-V1.0.md#用户注册api)

[用户登录API](https://github.com/Wh1isper/QuestionnaireSystemDoc/blob/master/接口定义/接口设计-2020.05.17-V1.0.md#用户登录api)

[邮箱验证码API](https://github.com/Wh1isper/QuestionnaireSystemDoc/blob/master/接口定义/接口设计-2020.05.17-V1.0.md#邮箱验证码api)

[登录验证码API](https://github.com/Wh1isper/QuestionnaireSystemDoc/blob/master/接口定义/接口设计-2020.05.17-V1.0.md#登录验证码api)

[用户注销API](https://github.com/Wh1isper/QuestionnaireSystemDoc/blob/master/接口定义/接口设计-2020.05.17-V1.0.md#用户注销api)

[用户信息修改API](https://github.com/Wh1isper/QuestionnaireSystemDoc/blob/master/接口定义/接口设计-2020.05.17-V1.0.md#用户信息修改api)

[用户密码修改API](https://github.com/Wh1isper/QuestionnaireSystemDoc/blob/master/接口定义/接口设计-2020.05.17-V1.0.md#用户密码修改api)

[用户问卷列表API](https://github.com/Wh1isper/QuestionnaireSystemDoc/blob/master/接口定义/接口设计-2020.05.17-V1.0.md#用户问卷列表api)

[用户修改问卷名API](https://github.com/Wh1isper/QuestionnaireSystemDoc/blob/master/接口定义/接口设计-2020.05.17-V1.0.md#用户修改问卷名api)

## 2. 问卷管理模块

### 2.1 需求描述

用户通过浏览器编辑创建问卷并发布

问卷状态有三种：未发布、发布、停止，对于未发布问卷，仅用有人可见；对于已发布问卷，对所有人可见；对停止问卷，所有人都不能修改，但可见。

问卷题型有：单选题、多选题、填空题，问卷有结束时间：最长为一个月，可手动设置、手动停止，停止后不能再发布

题目关联：当选择某选项之后才会出现

题目跳转：当选择某选项之后自动跳转至下一选项

对应需求：创建问卷、删除问卷、发布问卷

### 2.2 方案设计

提供问卷创建API

提供删除问卷API

提供发布问卷API

提供停用问卷API

[![img](https://raw.githubusercontent.com/Wh1isper/QuestionnaireSystemDoc/master/%E5%90%8E%E7%AB%AF%E6%8A%80%E6%9C%AF/img/%E9%97%AE%E5%8D%B7%E5%88%9B%E5%BB%BA%E3%80%81%E5%8F%91%E5%B8%83%E3%80%81%E5%81%9C%E7%94%A8%E6%B5%81%E7%A8%8B.png)](https://raw.githubusercontent.com/Wh1isper/QuestionnaireSystemDoc/master/后端技术/img/问卷创建、发布、停用流程.png)

注:问卷删除流程分为两步

1. 修改问卷状态
2. 闲时执行问卷创建流程的反向操作

可看作是上图两个流程的结合

**问卷修改方式需要调研**，初步设想是每次清理问题、选项，再重新创建问题和选项，或者发布时进行创建，未发布时仅保存页面结构（每次保存覆盖，由前端复原）

### 2.3 接口设计

[问卷创建API](https://github.com/Wh1isper/QuestionnaireSystemDoc/blob/master/接口定义/接口设计-2020.05.17-V1.0.md#问卷创建api)

[问卷发布API](https://github.com/Wh1isper/QuestionnaireSystemDoc/blob/master/接口定义/接口设计-2020.05.17-V1.0.md#问卷发布api)

[问卷保存API](https://github.com/Wh1isper/QuestionnaireSystemDoc/blob/master/接口定义/接口设计-2020.05.17-V1.0.md#问卷保存api)

[问卷删除API](https://github.com/Wh1isper/QuestionnaireSystemDoc/blob/master/接口定义/接口设计-2020.05.17-V1.0.md#问卷删除api)

[问卷停用API](https://github.com/Wh1isper/QuestionnaireSystemDoc/blob/master/接口定义/接口设计-2020.05.17-V1.0.md#问卷停用api)

[问卷内容获取API](https://github.com/Wh1isper/QuestionnaireSystemDoc/blob/master/接口定义/接口设计-2020.05.17-V1.0.md#问卷内容获取api)

## 3. 答卷及统计模块

### 3.1 需求描述

每个问卷有每个问卷有专门的回答页面，任何人都可以进行回答，对填写人的信息进行保存

用户需要实时查看目前回答情况，统计信息，支持导出

问卷时间结束，或人为结束之后，用户可以导出所有问卷（以表格形式）

对应需求：问卷提交、问卷结果统计

### 3.2 方案设计

提供针对问卷的答题API

提供针对问卷答题情况查询、统计的API

[![img](https://raw.githubusercontent.com/Wh1isper/QuestionnaireSystemDoc/master/%E5%90%8E%E7%AB%AF%E6%8A%80%E6%9C%AF/img/%E7%AD%94%E5%8D%B7%E6%B5%81%E7%A8%8B.png)](https://raw.githubusercontent.com/Wh1isper/QuestionnaireSystemDoc/master/后端技术/img/答卷流程.png)

### 3.3 接口设计

[问卷内容获取API](https://github.com/Wh1isper/QuestionnaireSystemDoc/blob/master/接口定义/接口设计-2020.05.17-V1.0.md#问卷内容获取api)

[问卷提交API](https://github.com/Wh1isper/QuestionnaireSystemDoc/blob/master/接口定义/接口设计-2020.05.17-V1.0.md#问卷提交api)

[问卷结果全量API](https://github.com/Wh1isper/QuestionnaireSystemDoc/blob/master/接口定义/接口设计-2020.05.17-V1.0.md#问卷结果全量api)

[问卷结果统计API](https://github.com/Wh1isper/QuestionnaireSystemDoc/blob/master/接口定义/接口设计-2020.05.17-V1.0.md#问卷结果统计api)

## 4. 管理员模块

### 4.1 需求描述

为管理员提供MIS（管理信息系统），使得管理员可以查看所有用户信息，用户发布的问卷，以及问卷详细信息

管理员可以对不当问卷进行停用、对不当用户进行封禁

### 4.2 方案设计

针对用户、问卷的封禁，设立标志位

提供管理员登录API

提供管理员针对用户封禁、问卷封禁API

提供管理员查看问卷API

当用户被封禁 用户创建的问卷也将被封禁

当用户被解封 用户创建的问卷也将被解封

[![img](https://raw.githubusercontent.com/Wh1isper/QuestionnaireSystemDoc/master/%E5%90%8E%E7%AB%AF%E6%8A%80%E6%9C%AF/img/%E7%AE%A1%E7%90%86%E5%91%98%E6%B5%81%E7%A8%8B.png)](https://raw.githubusercontent.com/Wh1isper/QuestionnaireSystemDoc/master/后端技术/img/管理员流程.png)

### 4.3 接口设计

[管理员登录API](https://github.com/Wh1isper/QuestionnaireSystemDoc/blob/master/接口定义/接口设计-2020.05.17-V1.0.md#管理员登录api)

[管理员封禁/解封用户API](https://github.com/Wh1isper/QuestionnaireSystemDoc/blob/master/接口定义/接口设计-2020.05.17-V1.0.md#管理员封禁解封用户api)

[管理员封禁/解封问卷API](https://github.com/Wh1isper/QuestionnaireSystemDoc/blob/master/接口定义/接口设计-2020.05.17-V1.0.md#管理员封禁解封问卷api)

[管理员获取用户列表API](https://github.com/Wh1isper/QuestionnaireSystemDoc/blob/master/接口定义/接口设计-2020.05.17-V1.0.md#管理员获取用户列表api)

[管理员获取问卷列表API](https://github.com/Wh1isper/QuestionnaireSystemDoc/blob/master/接口定义/接口设计-2020.05.17-V1.0.md#管理员获取问卷列表api)

