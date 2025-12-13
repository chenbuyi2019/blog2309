---
title: 反恐精英2 各插件平台性能简易测试对比
date: 2025-12-13 11:28:51
tags: [cs2]
---
简单对比一下 Counter-Strike 2 各个插件平台的性能。   
我觉得能逆向能做插件平台的人都好NB。都做出这么多平台了（   

cs2游戏版本：  14128  
Metamod 版本：  2.0.0-dev+1374  

测试的内容很简单，都是制作一个指令，在无人的服务器里，使用 de_inferno 地图。  
只记录cs2启动后的第一次执行数据，因为多次执行有实体信息缓存机制（   

获取每个实体的简要属性并组成一个字符串。  
对每个 info_ 开头的实体 teleport 到目前坐标+一个小 Vector 偏移。  
生成和 Fire 一个 `cs_win_panel_round` GameEvent 。   
以上循环执行 1000 次，计算总需要的时长。    

# 结果比较

![](image/cs2_framework_chart1.jpg)

# Plugify / S2-Launcher
[github](https://github.com/untrustedmodders/)  
我按他们的文档试了，但是没法正常运行，就不管了，   
这包管理做的跟天书一样，感觉好难用。   
虽然在更新却没有一个 issue ，也没有 star，不知道他们的用户在哪里。  

# ModSharp
[github](github.com/Kxnrl/modsharp-public)   
版本： 2.1.88 （2025-11-22）   
```cs
// tt
// time: 628 ms. entityCount: 766. infoEntityCount: 44.
private ECommandAction OnTTCommand(StringCommand command)
{
    var sw = Stopwatch.StartNew();
    string str;
    int entityCount = 0;
    int infoEntityCount = 0;
    var entityManager = _sharedSystem.GetEntityManager();
    var eventManager = _sharedSystem.GetEventManager();
    for (int i = 0; i < 1000; i++)
    {
        entityCount = 0;
        infoEntityCount = 0;
        var posAdd = new Vector(i / 999.0f, i / -999.0f, i / 999.0f);

        IBaseEntity? ent = null;
        while (true)
        {
            ent = entityManager.FindEntityByClassname(ent, "*");
            if (ent != null && ent.IsValid())
            {
                entityCount += 1;
                if (ent.Classname.StartsWith("info_"))
                {
                    ent.Teleport(ent.GetAbsOrigin() + posAdd);
                    infoEntityCount += 1;
                }
                str = $"{ent.Index} {ent.Classname} {ent.Health} {ent.GetAbsOrigin()} {ent.GetAbsAngles()}";
            }
            else
            {
                break;
            }
        }

        if (eventManager.CreateEvent("cs_win_panel_round", true) is IGameEvent e)
        {
            e.SetString("funfact_token", "aaa bbb ccc");
            e.Fire(false);
        }
    }
    sw.Stop();
    Console.WriteLine($"time: {sw.ElapsedMilliseconds:0} ms. entityCount: {entityCount}. infoEntityCount: {infoEntityCount}.");

    return ECommandAction.Stopped;
}
```

# SwiftlyS2
[github](https://github.com/swiftly-solution/swiftlys2)   
版本： 1.0.6-beta.14  （2025-12-13）  
```cs
// sw_tt
// 单纯版：  time: 804 ms. entityCount: 767. infoEntityCount: 44.
// METAMOD 版本： time: 799 ms. entityCount: 767. infoEntityCount: 44.
[Command("tt")]
public void OnTTCommand(ICommandContext context)
{
    if (context.IsSentByPlayer) { return; }
    var sw = Stopwatch.StartNew();
    string str;
    int entityCount = 0;
    int infoEntityCount = 0;
    for (int i = 0; i < 1000; i++)
    {
        entityCount = 0;
        infoEntityCount = 0;
        var posAdd = new Vector(i / 999f, -i / 999f, i / 999f);
        var allEnts = Core.EntitySystem.GetAllEntities();
        foreach (var e in allEnts)
        {
            if (!e.IsValid) { continue; }
            entityCount += 1;
            var ent = e.As<CBaseEntity>();
            if (ent.DesignerName.StartsWith("info_"))
            {
                ent.Teleport(ent.AbsOrigin! + posAdd, null, null);
                infoEntityCount += 1;
            }
            str = $"{ent.Index} {ent.DesignerName} {ent.Health} {ent.AbsOrigin} {ent.AbsRotation}";
        }
        Core.GameEvent.Fire<EventCsWinPanelRound>(ev =>
        {
            ev.FunfactToken = "aaa bbb ccc";
            ev.DontBroadcast = false;
        });
    }
    sw.Stop();
    Console.WriteLine($"time: {sw.ElapsedMilliseconds:0} ms. entityCount: {entityCount}. infoEntityCount: {infoEntityCount}.");
}
```

# CS2fixes
[github](https://github.com/Source2ZE/CS2Fixes)   
严格意义上这不算是个插件平台，给原版 cs2fixes 加了一点代码。  
版本：  v1.16.6  （2025-12-06）   
```c++
// c_tt 
// time: 546 ms. entityCount: 767. infoEntityCount: 44.
CON_COMMAND_CHAT_FLAGS(tt, "test", ADMFLAG_GENERIC)
{
	auto start = std::chrono::high_resolution_clock::now();
	char str[1023];
	int entityCount = 0;
	int infoEntityCount = 0;
	auto prefix = "info_";
	for (size_t i = 0; i < 1000; i++)
	{
		Vector* posAdd = new Vector(i / 999.0f, i / -999.0f, i / 999.0f);

		entityCount = 0;
		infoEntityCount = 0;
		auto iter = new EntityInstanceIter_t();
		while (true)
		{
			auto e = iter->Next();
			if (!e) break;
			auto ent = reinterpret_cast<CBaseEntity*>(e);
			auto origin = ent->GetAbsOrigin();
			auto angle = ent->GetAbsRotation();
			auto cls = ent->GetClassname();
			if (strncmp(cls, prefix, strlen(prefix)) == 0)
			{
				origin.x += posAdd->x;
				origin.y += posAdd->y;
				origin.z += posAdd->z;
				ent->Teleport(&origin, nullptr, nullptr);
				infoEntityCount += 1;
			}
			entityCount += 1;
			V_snprintf(str, sizeof(str), "%d %s %d pos:%f %f %f ang: %f %f %f", ent->GetEntityIndex().Get(), cls, ent->m_iHealth(), origin.x, origin.y, origin.z, angle.x, angle.y, angle.z);
		}

		IGameEvent* pEvent = g_gameEventManager->CreateEvent("cs_win_panel_round");
		if (!pEvent) return;
		pEvent->SetString("funfact_token", "aaa bbb ccc");
		g_gameEventManager->FireEvent(pEvent, false);
	}
	auto end = std::chrono::high_resolution_clock::now();
	auto duration_ms = std::chrono::duration_cast<std::chrono::milliseconds>(end - start);
	Message("time: %d ms. entityCount: %d. infoEntityCount: %d.\n", duration_ms.count(), entityCount, infoEntityCount);
}
```

# CounterStrikeSharp
[github](https://github.com/roflmuffin/CounterStrikeSharp)   
版本： v1.0.349 （2025-12-12）   

```cs
// tt  1.5  -2.5  3.5
// time: 2298 ms. entityCount: 767. infoEntityCount: 44.
[ConsoleCommand("tt")]
public void CommandTT(CCSPlayerController? caller, CommandInfo command)
{
    if (caller != null) { return; }
    var sw = Stopwatch.StartNew();
    string str;
    int entityCount = 0;
    int infoEntityCount = 0;
    for (int i = 0; i < 1000; i++)
    {
        entityCount = 0;
        infoEntityCount = 0;
        var posAdd = new Vector(i / 999.0f, i / -999.0f, i / 999.0f);
        foreach (var e in Utilities.GetAllEntities())
        {
            if (!e.IsValid) { continue; }
            entityCount += 1;
            var ent = e.As<CBaseEntity>();
            if (ent.DesignerName.StartsWith("info_"))
            {
                ent.Teleport(ent.AbsOrigin! + posAdd);
                infoEntityCount += 1;
            }
            str = $"{ent.Index} {ent.DesignerName} {ent.Health} {ent.AbsOrigin} {ent.AbsRotation}";
        }

        var ev = new EventCsWinPanelRound(true);
        ev.FunfactToken = "aaa bbb ccc";
        ev.FireEvent(false);
    }
    sw.Stop();
    Console.WriteLine($"time: {sw.ElapsedMilliseconds:0} ms. entityCount: {entityCount}. infoEntityCount: {infoEntityCount}.");
}
```

