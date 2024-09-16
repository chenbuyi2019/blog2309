---
title: 反恐精英2：我是怎么掉线的
date: 2024-09-16 17:38:58
tags: [cs2,code]
---
司马 Valve 给 Counter-Strike 2 更新了个啥玩意之后，玩家从服务器掉线就不知道理由了。   
本来应该写掉线理由的框变成了个空白框。   

特地做此工具，用来解析游戏控制台日志，从而知道掉线给的是啥理由。   

请在掉线后，全选复制你的控制台日志，然后粘贴到这里，并点击解析。  

<div>

<textarea id="txtInput">
</textarea>

<button id="btnParse">解析</button>

<div id="divResult">
</div>

<script src="/script/cs2-client-log-parse.js"></script>

</div>

源码[点我](https://github.com/chenbuyi2019/blog2309/blob/master/script/cs2-client-log-parse/main.ts)。   
