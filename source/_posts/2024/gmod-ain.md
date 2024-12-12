---
title: GMod 中 NPC AI 路径 ain 文件版本控制问题 
date: 2024-12-12 14:51:43
tags: [gmod]
---
半条命2 和 GMod 中的 NPC AI 路径点使用的是 [Nodegraph](https://developer.valvesoftware.com/wiki/Nodegraph) 技术，  
对应的文件是 [.ain](https://developer.valvesoftware.com/wiki/AIN) 文件，保存在 `maps/graphs` 文件夹里。   

当游戏觉得 .ain 文件版本和 .bsp 地图版本不对应的时候，游戏就会自动根据地图内的 `info_node` 系列实体生成新的 .ain 文件。   
就是刚刚进入游戏的时候，会看见 `Node graph out of date. Rebuilding...` 这句话显示在屏幕上。   

有一些 mod 作者做的地图没有在地图里放置对应的 node 实体，导致 NPC 无法正常识路。   
.ain 文件可以脱离于地图内容，直接单独生成。   
比较好用的 gmod 工具是 [Nodegraph Editor Expansion](https://steamcommunity.com/sharedfiles/filedetails/?id=2004023752) 。    

如果是 workshop 订阅来的 bsp 地图，最简单，  
只要 .ain 文件存在，它就认。没有文件版本控制问题。   

如果是裸的 bsp 文件直接放在 maps 文件夹里，  
gmod 就会以 **文件修改时间** 为基准，决定是否重新建立。    
就是这么简单粗暴，我还以为是根据文件内部标注的 hash 决定的，结果只是文件修改时间而已。   

比如我弄了一个 `fff.bsp` ，需要放在服务器 maps 里，它的贴图没有打包进去。   
我们把贴图一并打包进去，然后做成 `fff.bsp.bz2` 放在 CDN 里给玩家下载。   

这里打包好贴图的 `fff.bsp` 的文件修改时间就会是我编辑打包的时间，比如说 12月1日。   
`fff.bsp` 刚好没有 node 实体， `fff.ain` 是第三方作者做的，我下载来的文件是 12KB， 3月1日 。  
我发现一进游戏， gmod 就会自动重建 ain 文件， `fff.ain` 就被覆盖成了一个空白文件，只有 16 Bytes 。   

解决办法有两个：   

第一，关闭游戏自动重建，在 `server.cfg` 或者 `autoexec.cfg` 里加入 `ai_norebuildgraph 1` 参数。   
拆开来读就是  `ai no rebuild graph`   
这样就以后全部的地图都不会主动新建 .ain 文件了。   
对独立服务器来说也还行，因为我们可以用本地单人游戏做好的 .ain 复制到服务器。不需要服务器自己建立。   

第二，修改文件时间。反正时间只是文件系统给文件打的标签而已。  
只要让 gmod 觉得这个 .ain 的修改时间晚于 .bsp 的修改时间即可。   
可以把 .bsp 改早，也可以把 .ain 改晚。   
我们可以用 Powershell 指令快速改时间：   
```pwsh
# 修改为当前电脑时间
(Get-Item ".\fff.ain").LastWriteTime = (Get-Date) 
# 修改为任意指定时间。
(Get-Item ".\fff.ain").LastWriteTime = (Get-Date "2039-12-19") 
```

但是不管怎么做，都意味着，我们需要自己备份 .ain 文件，   
指不定这个游戏又觉得 .bsp 更新了或者没有禁用自动生成参数又给我覆盖了。   
