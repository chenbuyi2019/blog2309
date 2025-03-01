---
title: 反恐精英2 mdmp 文件里内嵌日志的解读
date: 2025-03-01 19:39:04
tags: [cs2]
---
cs2.exe 崩溃之后，有概率生成 mdmp 文件，之前我只用 Visual Studio 和 windbg 去打开 mdmp 文件。   
都没有发挥出 mdmp 文件的真实价值。   

与其打开 Visual Studio 或 windbg 在那瞎猜，不如直接用代码编辑器打开（甚至记事本）。  
然后搜索文本 `Console History (reversed)` ，这样就可以看到一大段明文日志。   
这个日志是新的在前面，老的在后面进行排布的。 

```log
Console History (reversed)

2852(200.822541):  FATAL ERROR: attempting to render with error material for 'materials/error.vmat'
2851(200.822512):  FATAL ERROR: attempting to render with error material for 'materials/error.vmat'
2850(200.822495):  FATAL ERROR: attempting to render with error material for 'materials/error.vmat'
2849(200.822487):  FATAL ERROR: attempting to render with error material for 'materials/error.vmat'
2848(200.822467):  FATAL ERROR: attempting to render with error material for 'materials/error.vmat'
2847(200.822231):  Sending Steam API content notification
2846(200.822209):  C:\buildworker\csgo_rel_win64\build\src\filesystem\basefilesystem.cpp (7062) : AssertMsg Failed in function CBaseFileSystem::MarkContentCorrupt():
Content being marked corrupt.  bMissingFilesOnly = false, pFile specified as 'NULL', reason: 'FATAL ERROR: attempting to render with error material for 'materials/error.vmat''
2845(200.822203):  Sending Steam API content notification
```

如上文我们遇到的是 `materials/error.vmat`  
这是个非常司马的难题，因为 cs2 遇到丢失的 vmat 贴图它不会忽略、也不会在 UI 里告诉你丢失了什么，
它只会弹出这个该死的弹窗。 
然后强制启动 steam 的验证游戏完整性，逼你等上几分钟才能重启游戏。
在这里有个比较快的定位丢失文件的办法，就是从 mdmp 提供的日志里查看。  
从日志的文本里搜索正则 `Failed loading resource .+\.vmat_c` 就可以直接看见到底哪个 `.vmat_c` 丢失了。

```log
2252(194.518007):   [ExG积分商城] 你得到了 4 积分：僵尸通关
2251(193.816209):  Failed loading resource "knif/kukri_beast.vmat_c" (ERROR_FILEOPEN: File not found)
```

在实战中，这个办法的用途也没有想象中的大，针对 error.vmat 难题是够用了。
可以快速从玩家闪退提供的文件里找到问题来源。以及一些可能的地图 IO 类导致的服务器崩溃。
使用插件特地实现的一些崩溃， mdmp 日志能提供的帮助反而较少。
