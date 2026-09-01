# 嵌入式工作室-STM32方向-暑招

## 目标

**基础**: 以STM32为主控, 使用官方库, 完成联网实时时钟, 以及一些其他有用信息显示 **(满分100分)**

1. LED工作指示灯亮一秒, 灭一秒, 与屏幕刷新同步
2. OLED屏显示实时信息
3. ESP-01s在启动时联网获取实时时间信息, 在正常工作时以一定周期校准时间
4. 使用看门狗保证系统跑死自重启
5. 通过ESP-01s控制屏幕显示内容
6. 其他任何你希望添加的功能

**进阶1**: 在基础功能上做一些改进 **(加分50分)**

2. LED改为呼吸灯效果
3. OLED以图形形式显示时间
4. 获取除时间外的其他信息, 比如天气, 温度, 新闻简讯
5. 人机交互中有可视化操作界面

**进阶2**: 使用自己写的库完成, 而不是官方标准库 **(加分50分)**

1. RCC时钟配置
2. GPIO控制
3. USART收发
4. IIC通讯
5. RTC设置
6. IWDG配置

------

## 材料

你可能需要:

1. STM32F103C8T6最小开发板

    ![1](http://r.photo.store.qq.com/psc?/V106165i0ntKpw/45NBuzDIW489QBoVep5mcSNVQUiJNLRdepTdLpbEOjAP2DOYsRNyLQhLoQkBu8rpnlUN9BIvtvTTg6n30MNqhNrUrvaOV1tV.7AkVFL6pF8!/r)

   ​     [STM32F103C8T6最小系统板](https://item.taobao.com/item.htm?spm=a230r.1.14.30.37e59430SS4LM9&id=538817606142&ns=1&abbucket=13#detail)

2. 0.96寸OLED
    ![2](http://r.photo.store.qq.com/psc?/V106165i0ntKpw/45NBuzDIW489QBoVep5mcSNVQUiJNLRdepTdLpbEOjCO2OqpwsRFiXTMrUtuX0flCc92*uGP216mygwd4qtc1HOgtGcs7WzjDBVBD5VaSL0!/r)

   ​                 [0.96寸OLED](https://detail.tmall.com/item.htm?spm=a230r.1.14.62.46245222NW4Lqi&id=558395483864&ns=1&abbucket=13)

3. ESP-01s模块
   <img src="http://r.photo.store.qq.com/psc?/V106165i0ntKpw/45NBuzDIW489QBoVep5mcSNVQUiJNLRdepTdLpbEOjAJNfbfVYmVUPSks67oPwU0Z9XeWw2zFzPJdzPPN1n3OvIxhv5dxXQhVbcaBBx2B44!/r" alt="3" style="zoom:140%;" />
                       [ESP-01s](https://detail.tmall.com/item.htm?spm=a230r.1.14.16.6f9343202hd0mE&id=41299074894&ns=1&abbucket=13)

4. 其他你需要的模块
   以上三家店都值得选择

-----

## 路标1

学习标准库函数的使用方法, 包括但不限于

1. RCC
2. GPIO
3. USART
4. IIC / SPI
5. RTC
6. IWDG

从参考手册中了解外设模块的操作方法

1. OLED - SSD1306
2. ESP8266

-----

## 路标2

查阅官方参考手册, 了解各个寄存器的作用, 理解标准库函数的实现逻辑

-----

## 路标3

你的库可以**参考**标准库, 你的驱动也可以**参考**其他人的驱动, 这是高效的学习方法, 但是希望看到具有**你自己风格**的代码, 注释和定义

-----

## 截止时间

第一次提交: 8月09日 00:00 前
修改提交:    8月30日 00:00 前
二招题目结果会在开学第一周给出

-----

## 提交

发送压缩文件包邮件到 1019613131@qq.com 

文件包内容:

1. 项目工程文档
2. 项目实机演示视频
3. 项目开发文档
   1. 基本需求分析
   2. 接口函数说明
   3. 流程图
   4. 项目过程中的问题和收获
4. 库函数说明 (进阶2)

