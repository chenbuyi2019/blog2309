---
title: GMod LUA 武器自动发射子弹的问题
date: 2023-09-04 11:49:43
tags: [code,gmod]
---

我发现我自己写的 LUA 脚本武器 SWEP 有个通病，就是按下左键或者右键能听到ti的一声（HL2没弹药的音效）。   
如果写了 `AmmoType` 并且我不实际发射弹药，也会看见和听见一颗 AR2 子弹射出去，但是没有任何伤害。   

以前我的尝试都没有成功，今天我终于找到了异常的根源。   

原因就是我只在 `SERVER` 里添置了 `SWEP:PrimaryAttack()` ，没有在 `CLIENT` 里添置 `SWEP:PrimaryAttack()` 。   
如果不写 `SWEP:PrimaryAttack()` ， GMod 就会自动按照默认设计，发射一颗子弹（仅仅是客户端的子弹，服务器根本不知道你射了）。同理还有 `SWEP:SecondaryAttack()`。   

为什么今天发现了问题呢，是因为我在 `SHARED` 加了一个 hook ，然后发现只有我的 `CLIENT` 在报告发射。   
```lua
hook.Add(
    "EntityFireBullets",
    "abcdefgh12354895714896",
    function(ent, data)
        if not IsValid(ent) then return end
        print(ent, "发射了子弹")
    end
)
```

为什么以前没有发现，是因为以前我都是 `SWEP.Primary.ClipSize = -1`。   
以前我的子弹数量都是 -1 ，压根没有子弹，就只能听到HL2没弹药的音效。   
然后我还tm不知道在哪里关这个音效。   

为什么别人家的武器都没有这个事情呢。   
是因为别人都喜欢直接写在 `shared.lua` 里面。   
```lua
function SWEP:PrimaryAttack()
    if CLIENT then return end
end
```
可不叫离谱吗。   

气死我了。   
所以特此写下本文。    
