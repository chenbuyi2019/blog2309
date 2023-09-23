---
title: 使用 VSCode+SSH 实现Windows远程写代码
date: 2023-08-14
tags: [code,ssh]
---
我的情况：经常要在远程 Windows 上执行修改 LUA 的操作。我自己又没有好的宽带，使用 RDP 经常会和其他人起冲突。   

解决方案：在服务器上安装 OpenSSH 然后在本地用 vscode 远程进去进行写代码。   

# 在服务器安装 OpenSSH
先下载[Win32-OpenSSH 的 MSI 安装包](https://github.com/PowerShell/Win32-OpenSSH/releases)，然后安装到服务器。    
（直接下最新版就行，我找不到它的正式版 release）   

## 如果服务器是 Administrator 用户
如果服务器运行的是**真高级管理员** `Administrator` 用户，   
就这样操作：    

在服务端上找到文件夹 `C:\ProgramData\ssh\`   
建立一个空白文件 `administrators_authorized_keys` ，在里面填上一行自己的公钥。   
如果需要多个公钥就一行一个。   

## 如果服务器是普通的管理员用户
还是找到 `C:\ProgramData\ssh\sshd_config` 配置文件   
在里面注释掉最后两行：   
```
#Match Group administrators
#       AuthorizedKeysFile __PROGRAMDATA__/ssh/administrators_authorized_keys
```

其次是去 `C:\Users\用户名\.ssh` 文件夹，新建一个空白文件叫 `authorized_keys` ，在里面填上一行自己的公钥。   
如果需要多个公钥就一行一个。   

## 禁用密码登录
如果需要彻底禁用密码登录 ，需要修改配置文件 `C:\ProgramData\ssh\sshd_config` 。   
里面找到并修改设置为 `PasswordAuthentication no` 。   

如果没有禁用密码访问，可能每次连接的时候都要输入服务端上对应用户的 Windows 登录密码。    

# 重启服务
接下来用服务端的任务管理器重启 `sshd` 服务。    
每次修改配置之后都应该重启一次服务。   

# 连接
在自己的电脑上运行命令行指令： `ssh username@ip`   
需要加端口就是 `ssh username@ip -p1234`   
username 指的是目标服务器上的用户，比如 `Administrator` 或者 `abc` ，不是本机用户名。   

如果连接成功，则可以进入下一步。   

# VSCode Remote
安装 vscode 扩展：`ms-vscode-remote.remote-ssh`   
安装之后点击 vscode 左下角的按钮，就可以 `Connect To Host` 了。   
他默认读取的是 `C:\Users\用户名\.ssh\config` 这个配置文件。   
可以在里面给你的连接起备注名。   

连接之后如果需要经常重新打开指定的文件夹，可以 `Save Workspace As ` 然后选择 `To Local` 。   
这样从本地就可以直接双击打开 `.code-workspace` 文件进入远程环境了。   

连接完成之后， vscode 会在远程服务器安装 code-server 作为一个后台辅助。   
也就意味着可以安装vscode扩展到服务器上，并且扩展数据还是保存在服务器上的。   

# 系统要求
VSCode Remote 需要 `Windows 10 / Server 2016/2019 (1803+) ` 。   
老版本上的 windows 无法安装 code server ，但是部分版本依然可以安装 Win32-OpenSSH 。   

# 垃圾
vscode 有时候会抽风，在服务器电脑里留下大量重复的垃圾文件，可能占据C盘十几GB。   
检测一下C盘的 `C:\Users\用户名\.vscode-server\bin` 文件夹。   
code server 会把老版本全部留在里面。   

以及 `C:\Users\用户名\AppData\Local\Temp` 文件夹。  
code server 会把老版本、以及时不时抽风重装的文件全部留在里面，以七八个字母加一个小数点再加三个字母作为文件夹名字。   
比如 `jy4wbtpz.qef` ，里面你能找到 `node.exe` 。   

# 其他
如果遇到其他麻烦，请参阅： 
- [微软官网说明](https://learn.microsoft.com/zh-cn/windows-server/administration/openssh/openssh_server_configuration) 
- [Github wiki](https://github.com/PowerShell/Win32-OpenSSH/wiki)   
- [VSCode 扩展说明](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-ssh)

或者也可以开启 ssh 的日志。   
找到 `sshd_config` 的 `# Logging` 下面两行，改成这样：   
```
SyslogFacility LOCAL0
LogLevel DEBUG3
```
日志会输出在 `C:\ProgramData\ssh\logs` 里面。   
问题解决了之后最好把日志注释掉，不然浪费C盘空间。   
 