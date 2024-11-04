---
title: 反恐精英2：控制台飘太远了怎么办
date: 2024-11-04 18:33:15
tags: [cs2]
---

该死的 Valve ，如果你在使用 Counter-Strike 2 的控制台的时候，  
不小心拖拽控制台窗口拖到了游戏界面的外面去。   
尤其是最顶上或者最下面。   
你就很可能再也拖拽不回来了。    

解决办法：   
先关闭游戏，   
找到自己的 steam 好友编码，   
然后去 `steam安装目录/userdata/好友编码/730/local/cfg` 这个文件夹，    
找到 `cs2_machine_convars.vcfg` 这个配置文件，用代码编辑器或记事本打开。  

在里面搜索 `panorama_console_position_and_size` ，找到后把这一行删掉，保存修改。   
因为这一行是存储着控制台的位置和大小。   

```cfg
  "panorama_console_position_and_size"		"253.20|-22.80|1052.40|300.00"
```

现在重启游戏，就是恢复默认的控制台大小了。   
