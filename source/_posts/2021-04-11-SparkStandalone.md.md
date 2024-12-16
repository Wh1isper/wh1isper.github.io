---
layout:     post                    # 使用的布局（不需要改）
title:      🔧Spark部署教程	# 标题
subtitle:   Deploy Spark in a simple way	 #副标题
date:       2021-04-11              # 时间
author:     Wh1isper                      # 作者
catalog: true                       # 是否归档
banner_img: /img/post-bg-unix-linux.jpg    #技术分享-编程
category:
    # - 随笔
    # - 时评
    # - 读书笔记
    - 技术分享
tags:                               #标签
    - 大数据
    - spark
---

# Update 2023年9月18日

Spark的最新部署脚本和教程我放在了这个仓库下：https://github.com/Wh1isper/spark-build

同时有打好的docker镜像可以使用：

- For PySpark app: [wh1isper/pyspark-app-base](https://hub.docker.com/r/wh1isper/pyspark-app-base)
- For Spark Connect Server: [wh1isper/spark-executor](https://hub.docker.com/r/wh1isper/spark-executor)
- For Spark on k8s(Spark executor): [wh1isper/spark-connector-server](https://hub.docker.com/r/wh1isper/spark-connector-server)

最新的教程中，JDK11和17都是经过测试的

--------------

# 下载Spark

选择一个spark版本下载：https://spark.apache.org/downloads.html

然后下载并安装对应的scala版本

Note that, Spark 2.x is pre-built with Scala 2.11 except version 2.4.2, which is pre-built with Scala 2.12. Spark 3.0+ is pre-built with Scala 2.12.

这里使用Spark-3.0.1进行开发

# 配置spark

首先解压spark，然后设置SPARK_HOME，以下内容仅跟用户选择把spark放在哪里有关，实际上，你可以放在任何地方

```bash
tar -zxvf spark-3.0.1-bin-hadoop3.2.tgz -C /opt
mv /opt/spark-3.0.1-bin-hadoop3.2/ /opt/spark-3.0.1
# 在~/.bashrc添加，或存在另外一个文件里、需要的时候source
export SPARK_HOME=/opt/spark-3.0.1
export PATH=${SPARK_HOME}/bin:${SPARK_HOME}/sbin:$PATH
```

## 配置hadoop yarn

让spark使用hadoop资源，只需要配置conf/spark-env.sh中的HADOOP_CONF_DIR为$HADOOP_HOME/etc/hadoop文件夹

如果使用本仓库提供的单机版hadoop教程，则HADOOP_CONF_DIR=/home/hadoop/hadoop/etc/hadoop/

```bash
cd /opt/spark-3.0.1
cp conf/spark-env.sh.template conf/spark-env.sh
echo "export HADOOP_CONF_DIR=/home/hadoop/hadoop/etc/hadoop/" >> conf/spark-env.sh
```

## 启动

local启动：

```bash
spark-shell --master local
```

yarn启动：

```bash
spark-shell --master yarn --deploy-mode client
```

# pysaprk搭建

创建虚拟环境

```bash
conda create -n {your_env_name} python=3.7
# centos
conda activate {your_env_name}
# ubuntu
source activate {your_env_name}
```

安装pyspark，注意版本对应

```bash
conda install pyspark==3.0.0
```

# 本地搭建时需要hadoop包

如果要使用hadoop s3 client之类的，本地部署的情况下需要手动把jar拷过去，要下载与spark pre-build相同版本的hadoop

如果你需要知道是什么版本，可以通过以下命令查看，hadoop-...-3.2.0.jar代表着pre-build为hadoop-3.2.0

```bash
ls ${SPARK_HOME}/jars/ | grep hadoop
```



以下这个命令拷贝了所有的，实际上你可以选择你需要的

如s3 client只需要aws和s3相关的几个包

```bash
cp ${HADOOP_HOME}/share/hadoop/tools/lib/* ${SPARK_HOME}/jars/
```

# Troubleshooting

## NoSuchMethod

注意pyspark版本，spark 3.0.1可以尝试pyspark 3.0.0或pyspark 3.0.1

## NoSuch...（没有这个类、对象等）

注意jdk版本，建议更新到最新java8u25x

注意scala版本，在保证spark版本和scala版本对应的前提下，使用最新2.12.1x或2.11.1x
