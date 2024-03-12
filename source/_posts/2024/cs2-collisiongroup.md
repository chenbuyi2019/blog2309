---
title: Collision Groups In Counter-Strike 2
date: 2024-03-12 13:39:19
tags: [cs2]
---

I tested every collision group to see how they behave with player/world.  

# Test setup:   
```text
cs2 version: 13995 
CounterStrikeSharp v193
Entity: prop_physics_override  CBaseModelEntity
Model: models/dev/error.vmdl
SolidType: SolidType_t.SOLID_VPHYSICS (6)
```

# Test result:   

Collide with player and the world: `0, 2, 3, 4, 7, 8, 9, 10, 11, 12, 18, 20, 21, 22, 24`   
Collide with player but not the world: `5, 6, 14, 16, 19`   
Collide with no player and no world: `1, 13, 15, 17, 23, 25, 26`   

Maybe the specific group can collide with another specific group. I didnt test that.  

The most strange group is `20`, it makes the prop can be eailsy pushed by player.   
And it only collide with the ground underneath it, players can push the prop through the wall and it usually drop out of the world.   

![](/image/cs2_collision_grop_20.gif)

I was looking at [CounterStrikeSharp's CollisionGroup](https://github.com/roflmuffin/CounterStrikeSharp/blob/main/managed/CounterStrikeSharp.API/Modules/Entities/Constants/CollisionGroup.cs) and I found it was wrong.   
The correct one should be [alliedmodders/hl2sdk cs2](https://github.com/alliedmodders/hl2sdk/blob/cs2/public/const.h)   `enum Collision_Group_t`.   

At least, i thought WEAPON should not collide with player.   
But CounterStrikeSharp set WEAPON to 11, and hl2sdk-cs2 set WEAPON to 14.   
