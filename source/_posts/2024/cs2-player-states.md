---
title: Counter-Strike 2 玩家进服退服时的状态一览
date: 2024-07-21 13:16:06
tags: [cs2]
---
本文使用的是 CounterStrikeSharp 和 CS2Fixes 搭配进行的研究。   
用于确定反恐精英2里玩家进出服务器时候的状态。   

主要还是因为玩家的状态太迷惑了。    
从连接服务器到进入服务器，再到完成 steam 验证，再到退出服务器，再到重新连接服务器。   
（玩家退服之后 Controller 实体还在，就很神奇）   

合理识别这些玩家状态很重要，因为对状态不正常的玩家进行操作会导致出错甚至崩溃。   

<style>
    .green {
        color: green;
    }
    .red {
        color: red;
    }
</style>

注意，下表中的 `OnClientAuthorized` 的顺序位置仅供参考，因为实际中网络不畅时，玩家验证可能很迟才发生。   

<table style="font-size:small;">
    <thead>
    <tr>
        <td>情况</td>
        <td>Controller</td>
        <td>Connected</td>
        <td>UserId</td>
        <td>PrintToConsole</td>
        <td>PlayerPawn</td>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>第1次进<br>OnClientConnect</td>
        <td>null</td>
        <td>无</td>
        <td>无</td>
        <td>不测试</td>
        <td>null</td>
    </tr>
    <tr>
        <td>第1次进<br>OnClientConnected</td>
        <td>Valid</td>
        <td>PlayerConnecting</td>
        <td>0</td>
        <td>OK</td>
        <td>null</td>
    </tr>
    <tr>
        <td>第1次进<br>OnClientAuthorized</td>
        <td>Valid</td>
        <td>PlayerConnecting</td>
        <td>0</td>
        <td>OK</td>
        <td>null</td>
    </tr>
    <tr>
        <td>第1次进<br>OnClientPutInServer</td>
        <td>Valid</td>
        <td>PlayerConnecting</td>
        <td>0</td>
        <td>OK</td>
        <td>Valid</td>
    </tr>
    <tr>
        <td>第1次进<br>OnClientPutInServer<br>之后第1帧</td>
        <td>Valid</td>
        <td class="green">PlayerConnected</td>
        <td>0</td>
        <td>OK</td>
        <td>Valid</td>
    </tr>
    <tr>
        <td>第1次退<br>OnClientDisconnect</td>
        <td>Valid</td>
        <td class="green">PlayerConnected</td>
        <td>0</td>
        <td>执行，但玩家收不到</td>
        <td>Valid</td>
    </tr>
    <tr>
        <td>第1次退<br>OnClientDisconnectPost</td>
        <td>Valid</td>
        <td>PlayerDisconnected</td>
        <td>0</td>
        <td>执行，但玩家收不到</td>
        <td>Valid</td>
    </tr>
    <tr>
        <td>第1次退<br>OnClientDisconnectPost<br>之后第1帧</td>
        <td>Valid</td>
        <td>PlayerDisconnected</td>
        <td>65535</td>
        <td>执行后服务端崩溃</td>
        <td>可能是null</td>
    </tr>
    <tr>
        <td>第2次进<br>OnClientConnect</td>
        <td>Valid</td>
        <td>PlayerDisconnected</td>
        <td>0</td>
        <td>OK</td>
        <td>Valid</td>
    </tr>
    <tr>
        <td>第2次进<br>OnClientConnected</td>
        <td>Valid</td>
        <td>PlayerReconnecting</td>
        <td>0</td>
        <td>OK</td>
        <td>Valid</td>
    </tr>
    <tr>
        <td>第2次进<br>OnClientAuthorized</td>
        <td>Valid</td>
        <td>PlayerReconnecting</td>
        <td>0</td>
        <td>OK</td>
        <td>Valid</td>
    </tr>
    <tr>
        <td>第2次进<br>OnClientPutInServer</td>
        <td>Valid</td>
        <td>PlayerReconnecting</td>
        <td>0</td>
        <td>OK</td>
        <td>Valid</td>
    </tr>
    <tr>
        <td>第2次进<br>OnClientPutInServer<br>之后第1帧</td>
        <td>Valid</td>
        <td class="green">PlayerConnected</td>
        <td>0</td>
        <td>OK</td>
        <td>Valid</td>
    </tr>
    <tr>
        <td>第2次退<br>OnClientDisconnect</td>
        <td>Valid</td>
        <td class="green">PlayerConnected</td>
        <td>0</td>
        <td>执行，但玩家收不到</td>
        <td>Valid</td>
    </tr>
    <tr>
        <td>第2次退<br>OnClientDisconnectPost</td>
        <td>Valid</td>
        <td>PlayerDisconnected</td>
        <td>0</td>
        <td>执行，但玩家收不到</td>
        <td>Valid</td>
    </tr>
    <tr>
        <td>第2次退<br>OnClientDisconnectPost<br>之后第1帧</td>
        <td>Valid</td>
        <td>PlayerDisconnected</td>
        <td>65535</td>
        <td>执行后服务端崩溃</td>
        <td>可能是null</td>
    </tr>
    </tbody>
</table>

`PrintToConsole` 的服务端崩溃表现为：   
```cmd
Fatal error. System.AccessViolationException: Attempted to read or write protected memory. This is often an indication that other memory is corrupt.

   at CounterStrikeSharp.API.Core.Helpers.InvokeNative(IntPtr)
 
   at CounterStrikeSharp.API.Core.ScriptContext.InvokeNativeInternal()
   at CounterStrikeSharp.API.Core.ScriptContext.Invoke()
   at CounterStrikeSharp.API.Core.NativeAPI.PrintToConsole(Int32, System.String)
   at CounterStrikeSharp.API.Core.CCSPlayerController.PrintToConsole(System.String)
```

总结：  
1. 玩家控制器就算是 `.IsValid` ，依然不可靠，需要检测 `.Connected` 和 `.UserId` 。  
2. `.PrintToConsole` 需要特别小心的使用，BOT 玩家和离线玩家使用这个函数都会导致崩服。   
3. `OnClientPutInServer` 可以在大部分情况下使用，作为玩家进服的检测点，但是里面的玩家状态依然不是 `PlayerConnected` ，它的下一帧才是。   
