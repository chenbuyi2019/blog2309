---
title: "ConEmu: 一次性启动和托管多个控制台程序"
date: 2024-08-25 19:15:48
tags: [code]
---
我写了好多软件都是控制台程序，让它们在 windows 任务栏里晃来晃去不是个好主意。   
在实际工作中，我需要一个软件来托管这些控制台程序。   

我选择了 [ConEmu](https://conemu.github.io/) 来解决这个问题，我用它来实现：   
1. 把各个控制台窗口变成标签页
2. 一次性打开多个控制台程序
3. 防误触关闭窗口，有个关闭前对话框

具体就不展开讲了，非常易用的一个控制台 UI 软件。   

一次性打开多个控制台程序需要使用以下启动参数：   
```cmd
ConEmu64.exe -runlist ^>  cmd /k "D:\a.exe" ^|^|^| cmd /k "D:\b.exe" ^|^|^| cmd /k "D:\c.exe"  
```

`cmd /k ` 的好处是支持在标签页里 ctrl+C 然后保留这个标签页。   

或者不套 cmd 来执行   

```cmd
ConEmu64.exe -runlist ^> "D:\a.exe" ^|^|^| "D:\b.exe" ^|^|^| "D:\c.exe"  
```

你说为什么不用 Windows Terminal ，答案是服务器的 windows 不方便安装 windows store app  。   
