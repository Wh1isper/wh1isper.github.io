---
layout:     post                    # 使用的布局（不需要改）
title:      二分法求解方程根               # 标题 
subtitle:   Bisection     #副标题
date:       2019-02-24              # 时间
author:     Wh1isper                      # 作者
header-img: img/post-bg-coffee.jpeg    #这篇文章标题背景图片
catalog: true                       # 是否归档
tags:                               #标签
    - 计算方法
    - 二分法求根
---


# 二分法求根 #

作者：Wh1isper 

日期：2019.2.24

## 题目 ##

> 使用二分法求![](https://i.imgur.com/JH4Kml0.gif)在区间上[2,3]的根，要求误差不超过![](https://i.imgur.com/3cqFYZN.gif)

## 解法 ##


> ![](https://i.imgur.com/gIXVzi0.jpg)
>
> 摘自《数值分析》吴勃英——P10

根据书P11页公式，可知给定精度预先确定二分的次数n

![](https://i.imgur.com/KzuWQy4.gif)

## 代码 ##

用C++实现

	#include <iostream>
	#include <fstream>
	#include <cmath>
	
	using namespace std;
	
	double f(double &x) {//计算函数
	    return x * x * x - 2 * x - 5;
	}
	
	double bisection(double left, double right, double deviation) {
	    //利用二分法求解方程根，输出求结过程，返回得到的解
	    //参数含义：left--左边界，right--右边界，deviation--误差值
	    double l = left, r = right;
	    double x;
	
	    const char *filename = "result.txt";//输出文件名
	    ofstream resultFile;
	    resultFile.open(filename, ios::out);
	
	    // 若左右边界与根足够接近，则直接得出结论
	    if (abs(f(l)) < 1e-5)
	        return l;
	    if (abs(f(r)) < 1e-5)
	        return r;
	    //利用公式计算二分次数
	    int n = static_cast<int>((log(right - left) - log(deviation)) / log(2));
	    //循环求解
	    for (int i = 0; i < n; ++i) {
	        x = (l + r) / 2;
	        resultFile << "x:" << x << "\tf(x):" << f(x) << endl;
	        if (f(x) * f(l) > 0)
	            l = x;
	        else if (f(x) * f(l) < 0)
	            r = x;
	        else
	            break;
	    }
	    resultFile.close();
	    return x;
	}
	
	int main() {
	    double result = bisection(2.0, 3.0, 0.5 * 1e-3);
	    const char *filename = "result.txt";
	    ofstream resultFile;
	    // 输出最后结果
	    resultFile.open(filename, ios::out | ios::app);
	    resultFile << "result:" << result << endl;
	    resultFile.close();
	    return 0;
	}

## 结果 ##

结果保存在result.txt中

> x:2.5	f(x):5.625
> 
> x:2.25	f(x):1.89062
> 
> x:2.125	f(x):0.345703
> 
> x:2.0625	f(x):-0.351318
> 
> x:2.09375	f(x):-0.00894165
> 
> x:2.10938	f(x):0.166836
> 
> x:2.10156	f(x):0.0785623
> 
> x:2.09766	f(x):0.0347143
> 
> x:2.0957	f(x):0.0128623
> 
> x:2.09473	f(x):0.00195435
> 
> result:2.09473


