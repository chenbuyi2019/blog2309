---
title: 在 CMD 里复制文件夹
date: 2023-11-11 20:05:56
tags: [code,.net]
---
要把一个文件夹及里面的子文件、子文件夹、子文件夹里的子文件、子文件夹全部复制到另外一个地方。   
用 cmd 要怎么实现？    

第一反应是 `copy` ，然而它只能复制文件夹里的文件，不能复制文件夹里的文件夹。   
```cmd
>copy t1/* t2 /y
The syntax of the command is incorrect.

>copy t1\* t2" /y
t1\a.txt
        1 file(s) copied.
```

经过一番搜索，正确的做法是：   
```cmd
>xcopy t1 t2 /y/c/s/e
t1\a.txt
t1\t9\New Text Document - Copy (2).txt
t1\t9\New Text Document - Copy (3).txt
t1\t9\New Text Document - Copy.txt
t1\t9\New Text Document.txt
t1\t9 - Copy\New Text Document - Copy (2).txt
t1\t9 - Copy\New Text Document - Copy (3).txt
t1\t9 - Copy\New Text Document - Copy.txt
t1\t9 - Copy\New Text Document.txt
9 File(s) copied
```
`/s` 参数是复制目录和子目录，除非它们是空的。   
`/e` 复制所有子目录，即使它们是空的。    

xcopy 的微软官方文档：[点我](https://learn.microsoft.com/zh-cn/windows-server/administration/windows-commands/xcopy)   

而且 cmd 还有一个不一样的地方，就是很多cmd指令只承认 `\` 字符作为路径分隔符，它不承认 `/` 字符。   

为什么我要用 cmd 复制个文件夹呢，因为我发现 .NET C# 的 `System.IO` 里没有复制文件夹的功能（但是它居然有 Move 整个文件夹的功能）。    
官方是给了个[示例函数](https://learn.microsoft.com/zh-cn/dotnet/standard/io/how-to-copy-directories)来做这个事情。   
我以为用 cmd 能简单一些，结果也这么多麻烦事情。   

但是 .NET VB 可真就简单多了。   
`Microsoft.VisualBasic.FileIO` 里就有直接复制整个文件夹的功能：`FileSystem.CopyDirectory(src,dest)`   

Powershell 也简单：   
```powershell
Copy-Item .\t1\* .\t2 -Recurse -Force
```
