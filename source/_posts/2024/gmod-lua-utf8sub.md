---
title: GMod Lua utf8.sub 性能问题
date: 2024-08-05
tags: [gmod,code]
---
我本来在做一个简易的日志输出，日志字符串达到一定长度之后，就把字符串裁切只留下后面一半。   
我不经意间使用了 `utf8.sub()` 来裁，然后我发现游戏过程中莫名其妙就卡顿几十秒，然后就恢复，也不像是我哪里有逻辑死循环。   
经过反复 `print()` 来找卡顿的实际位置，我终于找到了原因，就是这个 log 裁切的问题。  

Gmod Wiki 里说 [utf8.sub()](https://wiki.facepunch.com/gmod/utf8.sub) 比较吃性能，不要在逐帧运行的部分里使用。   
可我没想到你这性能问题这么大啊。   

下面是测试代码和测试结果：   
```lua
concommand.Add(
    "test1",
    function()
        local t1 = SysTime()
        print("start")
        local str1 = ""
        for i = 1, 199 do
            str1 = str1 .. "甲甲甲abc abc== 123456123 甲甲甲 abc 123456123甲甲"
        end

        local t2 = SysTime()
        print(Format("拼字符串 用时 %.3f  文本长度: %d %d", t2 - t1, #str1, utf8.len(str1)))
        local str2 = string.sub(str1, 9999)
        local t3 = SysTime()
        print(Format("string.sub 用时 %.3f  文本长度: %d", t3 - t2, #str2))
        local str3 = utf8.sub(str1, 5000)
        local t4 = SysTime()
        print(Format("utf8.sub 用时 %.3f  文本长度: %d", t4 - t3, #str3))
    end
)

-- 本地单人游戏 intel i7-12650H
-- start
-- 拼字符串 用时 0.000  文本长度: 11542 8358
-- string.sub 用时 0.000  文本长度: 1544
-- utf8.sub 用时 10.642  文本长度: 4637
```

8358 个字符（11542 字节）的字符串裁掉一半就要花 10 秒。   
这也 tmd 太慢了吧。   

`string.sub()` 是像切割 byte[] 一样切割字符串， `utf8.sub()` 是先把字符串拆成一个个 utf8 字符，然后再组。   
非必要不使用，还是老老实实用 `string.sub` 吧，开头有两个乱码字符没什么大不了的（   
