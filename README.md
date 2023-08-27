# GenshinCloudPlayHelpper

每天帮你获取15分钟云原神时间~

## ⚠️请不要进行宣传，谢谢！

## 一旦发现宣传就删库跑路！

## 配置教程

### 全局配置 global.json

```
{
    "sendMail": true,
    "mailConfig": {
        "user":"",
        "pass":"",
        "mailto":"",
        "smtpServer":"",
        "smtpPort":"",
        "smtpSecure": true
    }
}
```

> sendMail   一个bool 代表是否在运行结束后将结果发送至指定邮箱，false时mailConfig内的内容可不填
> mailConfig 具体配置
> 
> > user 发送方邮箱
> > 
> > pass 有授权码的填授权码，没有的填密码，填了密码报错了找授权码
> > 
> > mailto 接收方邮箱
> > 
> > smtpServer 发送邮件时使用的 smtp 服务器地址
> > 
> > smtpPort smtp 服务器端口
> > 
> > smtpSecure 如果smtp服务器使用SSL/TLS，那么为true，如果使用STARTTLS或不使用加密，那么为false

对于常用的邮件而言，配置列举如下

| 服务    | server       | port    | secure |
|:-----:|:------------:|:-------:|:------:|
| QQ 邮箱 | smtp.qq.com  | 465/587 | true   |
| 网易邮箱  | smtp.163.com | 465     | true   |
| ...   | ...          | ...     | ...    |

其余邮箱服务的配置可以在对应服务商的帮助文档中找到

### 用户配置

先放一个配置模板

```
{
    "token":"",
    "client_type":"",
    "device_name":"",
    "device_model":"",
    "device_id":"",
    "sys_version":"",
    "channel":""
}
```

具体数据 请看“抓包”环节

> token 是在云原神登录后用于验证的标记
> client_type 1代表ios设备 2代表android&鸿蒙设备
> device_name 设备名称
> device_model 设备型号
> device_id 在米哈游服务器中注册的uuid
> sys_version 系统版本 android&鸿蒙中为系统版本 ios设备中为ios版本
> channel 下载渠道 ios设备填"app store" android&鸿蒙填"mihoyo"(以抓包为准，我也不知道渠道服是不是这个)

### 抓包

> > # ios
> > 
> > App Store中下载应用Stream（用于抓包）
> > 然后看视频吧
> > 看不了/不显示的点右边 https://hzsj.coding.net/p/ayakaturtleshop/d/PublicResource/git/raw/master/c9f1a9b91951b0f1c2da8f3817274074.mp4?download=false
> > <video src="https://hzsj.coding.net/p/ayakaturtleshop/d/PublicResource/git/raw/master/c9f1a9b91951b0f1c2da8f3817274074.mp4?download=false"></video>
> 
> # android&鸿蒙
> 
> > (来自https://bili33.top/posts/MHYY-AutoCheckin-Manual)
> > 因为云原神是在手机上运行的，所以你需要安装一个手机上的抓包软件（例如HttpCanary，或者如果你能够用fiddler电脑运行去抓也行）
> > [![看就完了](https://cdn.bilicdn.tk/gh/Vikutorika/assets@master/img/Github/MHYY-AutoCheckin/HTTPCANARY-Result.jpg?download=false)]
> > 一定要记得装抓包软件提供的证书，要不然解不了SSL连接，一定要先登录并成功进去了再启动抓包软件！！！
> > [![看就完了](https://cdn.bilicdn.tk/gh/Vikutorika/assets@master/img/Github/MHYY-AutoCheckin/HTTPS-REQUEST-RESULT.png?download=false)]
> > 这里面只要是个HTTP链接，随便一个里面都有我们所需要的东西，这里我就点开了一个链接，在请求里面有所有我们需要的东西，而解释我都写在图片里面了

二者抓到的包差不多，抓到包之后有以下对应关系

```-
{
    "token":"x-rpc-combo_token",
    "client_type":"x-rpc-client_type",
    "device_name":"x-rpc-device_name",
    "device_model":"x-rpc-device_model",
    "device_id":"x-rpc-device_id",
    "sys_version":"x-rpc-sys_version",
    "channel":"x-rpc-channel"
}
```

对着填进去就完了
接着在configs文件夹里创建任意一个json文件，将配置填进去
如果想一次性签到n个用户，创建不同的json文件即可，程序会自动扫描configs文件夹下面的文件

## 另外

程序会自动获取最新的云原神版本，确保数据与用户一样