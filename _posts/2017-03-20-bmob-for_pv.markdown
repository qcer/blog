---
layout: post
title:  "Github Page+Bmob实现简单动态功能"
date:   2017-03-20
categories: jekyll update
---

Github Page基于jekyll能够实现简单的静态网站，但是没有提供后端服务。目前国内外也有很多提供后台服务，特别是云服务。譬如国外有AWS，记得好像是注册免费使用一年；再如Heroku，支持Nodejs平台，有免费免费的服务。国内的也不少，譬如百度云服务，按流量计费；新良云服务，需要云豆，阿里云和腾讯云没用过；再如今天要介绍的Bmob。

Bmob本是一个移动应用云服务的后端平台，但不仅限于移动应用，你同样可以用它来做web应用的后端服务。

总的来说，后端需要关注两个方面：数据和处理逻辑。

对于数据，Bmob有自身的云存储，并提供对象关系映射来进行数据封装。

对于处理逻辑，则直接在Bmob控制台中撸处理逻辑的代码，简单粗暴有效。

实现功能：网站访问量（PV）的动态显示。

涉及如下知识：

1、前后端数据交互

2、jsonp跨域访问

### **一、前端**

前端局部代码：

![qc](https://qcer.github.io/blog/images_blog/bmob_for_pv/pv_html.png)

用css实现一个双色圆环，vuejs实现简单的单向数据绑定，很简单是吧。

![qc](https://qcer.github.io/blog/images_blog/bmob_for_pv/pv_js.png)

因为需要请求Bmob后端服务器的数据，必然存在跨域的问题。如果用get或者post的方式（无论是原生的get、post还是jquery封装的get、post方法），均不能成功跨域，但是jquery通过ajax封装了另外的方式，也即是jsonp的方式。

其中url为https://cloud.bmob.cn/fc3679511e55f464/getVisitCount，其中fc3679511e55f464为bmob应用的Secret Key，getVisitCount为云端逻辑的方法。比如我的应用实例中有如下三个方法：

![qc](https://qcer.github.io/blog/images_blog/bmob_for_pv/methods_serve.png)

jsonp只能用GET方式，即使你将type设置为POST也无效。

dataType为jsonp，一旦你将dataType设置成jsonp，意味着这种方式将不同于普通的ajax的方式。

既然是通过GET方式，请求参数必然在url中，callback就指定了参数名，而jsonpCallback指定参数值。

可以通过跟踪请求报文的header来进一步验证：

![qc](https://qcer.github.io/blog/images_blog/bmob_for_pv/header.png)

可以看到，由于没有这顶jsonpCallback值，jquery会用jQuery其后拼接随即字符串组成参数值。同时从响应报文的header中，发现bmob是用express搭建。

### **二、后端**

1、后端数据表

![qc](https://qcer.github.io/blog/images_blog/bmob_for_pv/table.png)

关于ORM封装的详细官网文档请移步：

[http://docs.bmob.cn/data/Android/b_developdoc/doc/index.html#数据类型](http://docs.bmob.cn/data/Android/b_developdoc/doc/index.html#数据类型)

2、后端处理逻辑

![qc](https://qcer.github.io/blog/images_blog/bmob_for_pv/pv_serve2.png)

简单来讲就是查询数据，更新数据，然后发送数据：通过modules.oData获得数据库对象，调用db.findOne()查找数据。需要注意的是，通过oData数据库对象查找出来的data都是string类型，因此需要JSON.parse(data)解析成js对象类型。随后更新数据，调用response.send()发送数据，如果是对象，应该将对象字符串转化，即调用JSON.stringify(sendObj)，如果为简单的string类选择可以直接拼接。

关于后端逻辑的官网文档请移步：

[http://docs.bmob.cn/cloudcode/WEB/b_developdoc/doc/index.html#云端逻辑模块解释](http://docs.bmob.cn/cloudcode/WEB/b_developdoc/doc/index.html#云端逻辑模块解释)

通过跟踪报文，我们也可观察到response报文如下：

![qc](https://qcer.github.io/blog/images_blog/bmob_for_pv/response.png)

其实就是一段调用函数的js代码。

但是这个奇怪的函数jQuery31108369332181040243_1489933475565()并没有在客户端声明和定义，反而是success绑定的回调函数却获得了响应报文中的对象参数{"pageView":76}，何故？因为jquery会默认创建按个奇怪的函数，取得其参数，并将参数传给success绑定的回调函数。

客户端取得数据之后，通过vuejs简单的单项数据绑定，将数据绑定到view层，这样就在Github Page上实现了动态显示网站访问量的功能

其实在Github Page实现动态功能的远不止这样一种方案，譬如直接将后台应用部署到Heroku上，然后跨域为静态网站提供服务，或者将后端服务部署到百度云上，一样是可行的。