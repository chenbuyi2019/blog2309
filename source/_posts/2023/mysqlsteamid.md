---
title: Mysql 函数实现的 Steam id64/id32 转好友编码
date: 2023-12-17 14:06:23
tags: [MYSQL,code]
---
直接上代码：   

# 定义
```sql
delimiter $$
CREATE function `GetSteamId3FromId32`(str CHAR(50)) returns bigint DETERMINISTIC
COMMENT '把 STEAM_0:1:2 的格式转换为好友代码'
BEGIN
    declare middleStr CHAR(5);
    declare rightStr CHAR(20);
    declare num1 int;
    declare num2 int;
    if CHAR_LENGTH(str) < 3 then
        return 0;
    end if;
    set rightStr = SUBSTRING_INDEX(str, ':', -1);
    set middleStr = MID(str, CHAR_LENGTH(str) - CHAR_LENGTH(rightStr)- 1, 1);
    set num1 = CAST(rightStr as SIGNED);
    set num2 = CAST(middleStr as SIGNED);
    RETURN num1 * 2 + num2;
END $$
delimiter ;

delimiter $$
CREATE function `GetSteamId3FromId64`(old bigint) returns bigint DETERMINISTIC
COMMENT '把17位steam id64的数字转换为好友代码'
BEGIN
    declare num bigint;
    if old < 76000000000000000 then
        return 0;
    end if;
    set num = old << 32;
    set num = num >> 32;
    if num < 1 then
        return 0;
    end if;
    return num;
END $$
delimiter ;
```

# 使用
```sql
-- 第1个例子，我自己的 steam id
select GetSteamId3FromId32('STEAM_0:1:69600329') as `a`,
  GetSteamId3FromId32('abcd1:69600329') as `b`, 
  GetSteamId3FromId32('1:69600329') as `c`,
  GetSteamId3FromId64(76561198099466387) as `d`,
  GetSteamId3FromId64('76561198099466387') as `e`;

-- 第2个例子，批量转换
SELECT `authid`, GetSteamId3FromId32(`authid`) AS `fcode` 
  FROM `xxx` LIMIT 10;
```
![](/image/mysqlsteam1.png)   

![](/image/mysqlsteam2.png)   

# 卸载
```sql
drop function if exists `GetSteamId3FromId32`;
drop function if exists `GetSteamId3FromId64`;
```
