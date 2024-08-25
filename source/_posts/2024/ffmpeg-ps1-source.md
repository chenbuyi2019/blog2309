---
title: "PowerShell 脚本: ffmpeg 批量压缩音频"
date: 2024-07-14 21:20:03
tags: [code,cs2]
---
前置需求：   
- 在环境 PATH 路径里有 [ffmpeg](https://ffmpeg.org/) 程序  
- 使用 [PowerShell 7+](https://github.com/PowerShell/PowerShell)  
- 我自己是在 Windows 11 运行， Linux 应该也能跑   

我自己经常会遇到打包在不同文件夹结构里的各式音频文件，   
需要将它们压缩为统一格式的起源、起源2引擎适用的音频格式。   
所以写了这个脚本。   

把需要转换的音频文件放入一个文件夹里，   
把文件夹路径作为脚本的第一个参数执行。一般就是拖入控制台窗口或者拖到ps1图标上直接执行。   
压缩好的 MP3 会输出到输入文件夹上层的 compress_xxx 文件夹里。   
里面的子文件夹结构和文件名会保留下来。   

不得不说，这一下 shell 语法，一下 c# 语法感觉就是怪。  

```ps1
$dir = $args[0]

$ErrorActionPreference = 'Stop'

if (-not (Test-Path $dir -PathType Container)) {
    Write-Error "你输入的文件夹不存在 $dir"
}

$dir = [System.IO.Path]::GetFullPath($dir)
Write-Host "输入文件夹 $dir"
$tm = Get-Date -Format "HH-mm-ss"
$dir2 = [System.IO.Path]::Combine($dir, "../", "compress_$tm")
$dir2 = [System.IO.Path]::GetFullPath($dir2)
Write-Host "输出文件夹 $dir2"
if (Test-Path $dir2 -PathType Container) {
    Write-Error "输出文件夹已经存在了，需要更换 $dir2"
}

$allowedExt = @(".wav", ".mp3", ".m4a", ".mp4", ".ogg")

$inputs = Get-ChildItem $dir -Filter "*" -Recurse
$count = 0

foreach ($input in $inputs) {  
    $ext = $input.Extension.ToLower()
    if (!$allowedExt.Contains($ext)) { continue }
    $relPath = [System.IO.Path]::GetRelativePath($dir, $input.FullName)
    $outputFile = [System.IO.Path]::Combine($dir2, $relPath)
    $outputFile = [System.IO.Path]::ChangeExtension($outputFile, ".mp3")
    $dir3 = [System.IO.Path]::GetDirectoryName($OutputFile)
    if (-not (Test-Path $dir3 -PathType Container)) {
        New-Item $dir3 -ItemType Directory
    }
    Write-Host $outputFile 
    ffmpeg -i $input.FullName -y -c:a libmp3lame -ar 44100 -b:a 96k $outputFile 
    if (-not(Test-Path $outputFile -PathType Leaf)) {
        Write-Error "找不到压缩的音频文件 $outputFile"
    }
    $count += 1
}

Write-Host "工作完成，一共 $count 个文件 "
Write-Host "输出文件夹 $dir2"

# 批量修改音量： -filter: "volume = 8dB"  
```
