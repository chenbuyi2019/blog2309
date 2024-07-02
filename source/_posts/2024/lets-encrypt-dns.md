---
title: 使用 DNS 记录通过 certbot 认证
date: 2024-07-02 20:33:35
tags: 
---
由于我自己写的一些网站都没法直接兼容 Let's Encrypt [certbot](https://certbot.eff.org/) 的普通的认证方式。   
我更倾向于使用 DNS TXT 认证来完成域名验证过程。   
好处就是根本不需要一台公网服务器，有台电脑就行。也不用干预正在运行的服务器。   
坏处就是每次等 DNS 解析有点难等，一旦时机没把握好就得重来。    

```
certbot certonly --preferred-challenges dns -d "*.abcd.com" -d "abcd.com" --manual
```

（其实更多是因为我要申请 *.abcd.com 这样的证书，而我不好直接操作 abcd.com 主页服务器。   
