---
layout:     post                    # 使用的布局（不需要改）
title:      小无相功：利用Fairing实现一处代码云上本地两处运行	# 标题 
subtitle:   Kubeflow Fairing  tutorial 	 #副标题
date:       2020-09-10              # 时间
author:     Wh1isper                      # 作者
header-img: img/post-bg-2015.jpg    #这篇文章标题背景图片
catalog: true                       # 是否归档
tags:                               #标签
    - 机器学习平台
    - python
    - Kubeflow
---



# 小无相功：利用Fairing实现一处代码云上本地两处运行

随着深度学习所需要的算力越来越多，本地服务器越来越难以满足需求，同时随着Kubeflow框架的开源、完善，越来越多的企业、高校转向使用云端环境对模型进行训练。而分布式训练对于未曾接触过的数据分析师而言，无疑是痛苦的，需要重新学习一套分布式训练的工具，再将自己原来在本地良好运行的代码改的面目全非。这显然不符合快速开发、快速迭代的需求，增加了学习成本的同时也降低了效率。

幸好，Kubeflow推出了fairing！

# Fairing是什么

Kubeflow Fairing简化了在混合云环境中构建、训练和部署机器学习（ML）**训练任务**的过程，通过使用Fairing SDK并添加几行代码，即可从Python代码或Jupyter Notebook中，**本地**或在**云端**运行ML的**训练任务**。在训练任务结束后，可以**直接**或**借助KFServing**将训练过的模型部署为预测接口。

![](https://raw.githubusercontent.com/Wh1isper/wh1isper.github.io/master/img/fairing/image2020-8-24_15-23-49.png)

Fairing在机器学习工作流中的位置



## Why Fairing？

- 更轻松地打包ML训练任务：使机器学习工程师能将他们的训练模型、代码，以及依赖项打包为Docker映像
- 在混合云环境中更轻松地训练ML模型：为训练ML模型提供高级API，以便在云中轻松地运行训练任务，而不需要了解底层基础设施
- 简化从训练到部署的流程：是机器学习工程师能够轻松地将模型部署到混合云环境中

## Fairing的基本原理

Fairing的基本实现原理，是将.ipynb文件、Python函数或者Python文件打包为Docker映像，然后在Kubeflow或AI平台上部署和运行训练任务。处理流程则是按照Preprocessor，Builder，以及Deployer三个类的处理顺序进行处理。

目前支持的预处理代码形式：这将把下列文件（函数）作为上下文打包进docker

- Python文件
- notebook代码/文件
- Python函数

目前支持的docker builder：

- append：在原有docker上封装新的压缩包，不需要docker环境
- docker：用本地docker环境打包
- cluster：在k8s集群中打包docker
- podman：使用podman打包docker

目前支持的job：

- fairing-job（训练）：原生k8s job
- tf-job（训练）：派生自fairing-job，对应使用tf-operator
- pytorch-job（训练）：派生自fairing-job，对应使用pytorch-operator
- gcp-job（训练）：向GCP平台提交job
- Serving（预测）：原生k8s部署服务
- KFServing（预测）：Kubeflow KFServing部署服务

![](https://raw.githubusercontent.com/Wh1isper/wh1isper.github.io/master/img/fairing/maxresdefault.jpg)

Fairing的基本架构

## 云平台支持

- Fairing已默认支持[Google AI Platform](https://cloud.google.com/ml-engine/docs/)，[Azure Kubernetes Service (AKS)](https://azure.microsoft.com/en-in/services/kubernetes-service/)，无需配置直接使用
  - GCP案例请看：[https://github.com/GoogleCloudPlatform/professional-services/tree/master/examples/kubeflow-fairing-example](https://github.com/GoogleCloudPlatform/professional-services/tree/master/examples/kubeflow-fairing-example)

# 实战演示

## Hello World实验

### 配置你的notebook

这里省略了kubeflow的配置流程，如果需要配置单机版请看这里：[https://developer.aliyun.com/article/758776](https://developer.aliyun.com/article/758776)

首先，需要一个docker registry，这里可以使用阿里云镜像镜像，也可以使用docker hub。笔者这里使用了自搭的环境

接着在k8s环境中设置secret，以用于镜像的推送和拉取

```bash
kubectl create secret docker-registry <secret_name> --docker-server=<registry> --docker-username=<username> --docker-password=<password> -n <namespace>
# 加上下面这行之后不用mount secret
kubectl patch serviceaccount default -p '{"imagePullSecrets": [{"name": "<secret_name>"}]}' -n <namespace>
```

接着启动notebook容器，将主机login之后的docker密钥拷进来（这一步可以在docker映像打包时就完成，这里是使用了官方镜像所以缺少）

```bash
# 目的是将主机login之后的密钥放到jupyter notebook里，使得notebook可以推送新的映像
# 生产环境中应该在notebook镜像里包含这个config.json
# under docker client environ.
docker login <private_registry>
# 获取认证信息
cat ~/.docker/config.json
```

 把认证信息复制进来

```bash
# in notebook console
mkdir /home/jovyan/.docker
# 把认证信息复制进来
vi /home/jovyan/.docker/config.json
```

默认的，从kubeflow启动的notebook应该已有k8s集群权限，可以通过以下命令查看，应当返回当前notebook所在的namespace

```bash
cat /var/run/secrets/kubernetes.io/serviceaccount/namespace
```

![](https://raw.githubusercontent.com/Wh1isper/wh1isper.github.io/master/img/fairing/config.png)

以上，我们完成了对notebook和k8s环境的预先配置，下面我们进行hello world实验

### Hello World！

首先确定你的python版本，这里的python版本为3.7.8

```bash
python --version
```

接着在notebook中安装fairing

```bash
pip install kubeflow-fairing -i https://pypi.tuna.tsinghua.edu.cn/simple --user
```

![](https://raw.githubusercontent.com/Wh1isper/wh1isper.github.io/master/img/fairing/install.png)

配置fairing，这里只使用了builder，我们提供了registry.cn-hangzhou.aliyuncs.com/wh1isper/fairing:py36和registry.cn-hangzhou.aliyuncs.com/wh1isper/fairing:py37两个fairing镜像，是依据官方镜像进行构建的，里面包含了tensorflow，xgboost等常用机器学习库。

```python
from kubeflow import fairing
from kubeflow.fairing.kubernetes.utils import volume_mounts, get_resource_mutator
 
SECRET_NAME = 'fairing'
# 这里使用了本地仓库，如果没有，可以使用阿里云容器镜像服务

DOCKER_REGISTRY = 'docker.airange.cn/kubeflow'
fairing.config.set_builder('append',
                           base_image='docker.airange.cn/kubeflow/fairing:py37',
                           registry=DOCKER_REGISTRY, push=True)
fairing.config.set_deployer('job', pod_spec_mutators=[
    volume_mounts(volume_type='secret', volume_name=SECRET_NAME, mount_path='~/.docker/'), ])
```

Hello World代码

```python
def train():
    print("hello world!")
 
 
remote_train = fairing.config.fn(train)
remote_train()
```

接着你会看到builder将你的代码打包进docker并推送到仓库，供node拉取使用。

![](https://raw.githubusercontent.com/Wh1isper/wh1isper.github.io/master/img/fairing/helloworld.png)

## 第一次训练：XGBoost

有了以上基础，我们直接进行XGBoost的训练，让大家直观感受一处代码，两处运行的方便之处！

首先，我们对fairing进行配置

``` python
from kubeflow import fairing
from kubeflow.fairing.kubernetes.utils import volume_mounts, get_resource_mutator
 
SECRET_NAME = 'fairing'
DOCKER_REGISTRY = 'docker.airange.cn/kubeflow'
fairing.config.set_builder('append',
                           base_image='docker.airange.cn/kubeflow/fairing:py37',
                           registry=DOCKER_REGISTRY, push=True)
fairing.config.set_deployer('job', pod_spec_mutators=[
    volume_mounts(volume_type='secret', volume_name=SECRET_NAME, mount_path='~/.docker/'), ])

```

接着我们引入训练代码

```python
# Copyright 2018 Google Inc. All Rights Reserved.

#

# Licensed under the Apache License, Version 2.0 (the "License");

# you may not use this file except in compliance with the License.

# You may obtain a copy of the License at

#

#     http://www.apache.org/licenses/LICENSE-2.0

#

# Unless required by applicable law or agreed to in writing, software

# distributed under the License is distributed on an "AS IS" BASIS,

# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.

# See the License for the specific language governing permissions and

# limitations under the License.

 
import argparse
import logging
import pandas as pd
from sklearn.metrics import mean_absolute_error
from sklearn.model_selection import train_test_split
from xgboost import XGBRegressor
import urllib.request
from sklearn.impute import SimpleImputer as Imputer
 
# rawgithub被墙，使用代理加速

# TRAINING_URL="https://raw.githubusercontent.com/kubeflow/examples/master/xgboost_ames_housing/ames_dataset/train.csv"

TRAINING_URL="https://g.ioiox.com/https://raw.githubusercontent.com/kubeflow/examples/master/xgboost_ames_housing/ames_dataset/train.csv"
TRAINING_FILE="train.csv"
 
ESTIMATORS=1000
LEARNING_RATE=0.1
TEST_FRACTION_SIZE=0.25
EARLY_STOPPING_ROUNDS=50
 
def run_training_and_eval():

    (train_X, train_y), (test_X, test_y) = read_input()
    model = train_model(train_X,
                        train_y,
                        test_X,
                        test_y,
                        ESTIMATORS,
                        LEARNING_RATE)
 
    eval_model(model, test_X, test_y)
 
def download(url, file_name):
    with urllib.request.urlopen(url) as response, open(file_name, "wb") as file:
        file.write(response.read())
 
def read_input(test_size=TEST_FRACTION_SIZE):
    """Read input data and split it into train and test."""
    download(TRAINING_URL, TRAINING_FILE)
    data = pd.read_csv(TRAINING_FILE)
    data.dropna(axis=0, subset=['SalePrice'], inplace=True)
 
    y = data.SalePrice
    X = data.drop(['SalePrice'], axis=1).select_dtypes(exclude=['object'])
 
    train_X, test_X, train_y, test_y = train_test_split(X.values,
                                                        y.values,
                                                        test_size=test_size,
                                                        shuffle=False)
 
    imputer = Imputer()
    train_X = imputer.fit_transform(train_X)
    test_X = imputer.transform(test_X)
 
    return (train_X, train_y), (test_X, test_y)
 
def train_model(train_X,
                train_y,
                test_X,
                test_y,
                n_estimators,
                learning_rate):
    """Train the model using XGBRegressor."""
    model = XGBRegressor(n_estimators=n_estimators,
                      learning_rate=learning_rate)
 
    model.fit(train_X,
              train_y,
              early_stopping_rounds=EARLY_STOPPING_ROUNDS,
              eval_set=[(test_X, test_y)])
 
    logging.info("Best RMSE on eval: %.2f with %d rounds",
                 model.best_score,
                 model.best_iteration+1)
    return model
 
def eval_model(model, test_X, test_y):
    """Evaluate the model performance."""
    predictions = model.predict(test_X)
    logging.info("mean_absolute_error=%.2f", mean_absolute_error(predictions, test_y))
```

可以在本地运行看看效果！

```python
run_training_and_eval()
```

![](https://raw.githubusercontent.com/Wh1isper/wh1isper.github.io/master/img/fairing/local.png)

将代码上传到云端运行！

```python
from kubeflow import fairing
run_training_and_eval_f = fairing.config.fn(run_training_and_eval)
run_training_and_eval_f()
```

![](https://raw.githubusercontent.com/Wh1isper/wh1isper.github.io/master/img/fairing/cloud.png)

# 总结

以上，我们介绍了fairing的基本原理以及架构，走通了fairing的训练流程，如果想更加深入的了解fairing的使用，可以查阅[官方教程](https://github.com/kubeflow/fairing/blob/master/examples/mnist/mnist_e2e_on_prem.ipynb)，里面还包含了无缝对接KFServing的部署教程。

# 参考文档

github: [https://github.com/kubeflow/fairing](https://github.com/kubeflow/fairing)

官方文档：[https://www.kubeflow.org/docs/components/fairing/fairing-overview/](https://www.kubeflow.org/docs/components/fairing/fairing-overview/)