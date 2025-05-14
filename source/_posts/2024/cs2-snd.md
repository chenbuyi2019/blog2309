---
title: Counter-Strike 2 音频自定义编写与编译
date: 2024-03-13 12:26:06
tags: [cs2,code]
---
# 文件结构
需要安装 cs2 workshop tools ，然后新建一个空白地图项目，比如叫 `xxxx`。   
源文件放在 `common\Counter-Strike Global Offensive\content\csgo_addons\xxxx` 里。   
其中 `soundevents` 文件夹里存放着声音脚本文件 `.vsndevts` ，可以用，   
`sounds` 文件夹里放着具体的音频源文件，比如 `.mp3 .wav` 。  

看起来起源2引擎依然使用的是和以往一样的 44100 hz 的音频文件。  

后续编译好的文件会在 `common\Counter-Strike Global Offensive\game\csgo_addons\xxxx` 里。  

# 编写声音脚本 vsndevts

空白地图项目自带一个叫 `soundevents_addon.vsndevts` 的声音脚本，里面有飞机音效、鸟叫音效的样例。   

如果你是要在自己的地图里使用，那么就不要改文件名，就在 `soundevents_addon.vsndevts` 里编写。   
如果是要在其他插件里自定义调用，就最好复制出来改个文件名，比如 `abc.vsndevts`      

`soundevents_addon.vsndevts` 文件里写了一些说明，有兴趣可以自己看以下。   
以及可以看看 [Valve 开发者 wiki 里的说明](https://developer.valvesoftware.com/wiki/Counter-Strike_2_Workshop_Tools/Addon_Sounds)。   

起源2 的大部分地方都是使用音频事件 (Sound Event) 来播放的，音频事件里指定了使用什么文件、什么类型、多少音量、什么音效(DSP)。   
每个音频事件都有一个名字 (Sound Event Name)，由编写者指定，在地图或实体播放的时候按音频事件的名字进行使用。   

以前还能在地图里使用直接的音频文件名播放，现在就别想了。实体连音量都改不了，只能在脚本里预先写好。   

一个最简单的音频事件的格式示例：    
```c++
"exgze.cheer" =  // 音频事件的名字，尽量以 a.b 或者 a.b.c 来编写
{
    type = "csgo_music"  // 类型
    volume = 1.0     // 音量
    vsnd_files =   // 使用的文件，如果是多个会在播放的时候随机选其中一个。
    [
        "sounds/exg/cheer/1.vsnd",  // 文件必须是 .vsnd 结尾，不管源文件是什么
        "sounds/exg/cheer/2.vsnd"  // 因为后面我们会编译，把普通格式变成 .vsnd_c
    ]
}
```

声音类型有三种：  
`csgo_mega` 常规3D范围音效。站的越近声音越大。   
`csgo_music` 表示对任何人来说播放都是一样的效果。适合播放UI音效、音乐、音乐盒。   
`csgo_3d` wiki 里说这是环境背景音，然而官方vpk里没有一个脚本是使用了这个。   
而且我发现使用了 `csgo_3d` 之后，连 hammer 都不承认它存在了，说明可能是个被放弃的早期版本。   

需要注意的是， `csgo_music` 使用 `vsnd_files` 来表示音频文件列表，  
而 `csgo_mega` 使用 `vsnd_files_track_01` 来表示。   
这个写反了就当没有音频文件了。   

## 音量

`csgo_music` 类型的音量默认受玩家参数 `snd_musicvolume` 的控制。   
这些声音脚本有很多参数的功能是未知的，我也是在摸索，比如我发现我自己写 `volume_convar` 就不好使。   
可能是因为我们调用这些音频都是来自实体，所以都被游戏认为是 music ，而不是 ui 或者别的音频通道了。   

`volume` 默认是 1 ，可以写比 1 低也可以写比 1 高。（我印象中以前音量都是只能低不能高的）   

## 声音播放范围
`distance_volume_mapping_curve` 指的是距离和音量的映射曲线。   
需要像下面这样写，其实我也不太懂这个曲线到底是个什么种类的曲线。    
映射关系的每个元素有6个数字，就只需要改头两个数字，第一个数字是距离，第二个数字是音量。   
下面的样例代码里表示的是最远到 900 距离开外听见，音量逐步减小。  

如果不写这个的话，貌似默认的 `csgo_mega` 只有 128 距离那么远。   

甚至可以再加入元素使得声音大小起起伏伏（比如站的最近声音小，站中间声音大）。   

如果写一个 99999 距离也是 1.0 音量，则表示全图可以听见，但是这个和 music 还是有区别的。   
玩家听到的声音的左右声道的大小是不一致的，因为他们不一定面向声源。   
```c++
"exgze.test10mega" = 
{
    type = "csgo_mega"
    volume = 1.0 // 这里会被当做标准值，后面曲线会乘以这个数
    vsnd_files_track_01 = "sounds/exg/test10s.vsnd"
    distance_volume_mapping_curve = 
    [
        [
            0.0, 1.0, // 距离声音原点零距离时，音量为1.0
             -0.00394, -0.00394, // 后面4个数字是照抄的，不知道什么意思
            2.0, 3.0,
        ],
        [
            900.0, 0.0, // 距离声音原点距离 900 单位时，音量为零
             -0.002991, -0.002991,
            2.0, 3.0,
        ]
    ]
}
```

## 一些官方示例

一个官方的音乐盒的示例：   
```c++
Music.MVPPreview.halflife_alyx_01 = 
{
    type = "csgo_music"
    volume = 0.800000
    volume_convar = "snd_menumusic_volume"  // 这里是说它同时受玩家设置里的音乐音量的控制
    stop_music = "true"
    vsnd_files = "sounds/music/halflife_alyx_01/roundmvpanthem_01.vsnd"
    vsnd_duration = 16.692245  // 音乐长度，我们一般不写，编译的时候会自动进去
}
```

一个官方的示例，人质受伤（精简过，原文有点长）：   
```c++
Hostage.Pain = 
{
    type = "csgo_mega"
    volume = 0.899902
    pitch = 1.000000
    mixgroup = "VO"
    block_duration = 0.300000
    block_distance = 69.000000
    use_distance_volume_mapping_curve = true
    reverb_wet = 0.300000
    display_broadcast = true
    occlusion_intensity = 0.500000
    occlusion_frequency_scale = 0.500000
    vsnd_files_track_01 =
    [
        "sounds/vo/hostage/hpain/hpain1.vsnd",
        "sounds/vo/hostage/hpain/hpain2.vsnd",
        "sounds/vo/hostage/hpain/hpain3.vsnd"
    ]
    distance_volume_mapping_curve = 
    [
        [
            81.028969,
            1.000000,
            0.000000,
            0.000000,
            2.000000,
            3.000000,
        ],
        [
            211.771500,
            0.634147,
            -0.001725,
            -0.001725,
            2.000000,
            3.000000,
        ],
        [
            1100.000000,
            0.000000,
            -0.000557,
            -0.000557,
            2.000000,
            3.000000,
        ]
    ]
    vsnd_duration = 0.586757
}
```

# 编译脚本与声音
在 `Asserts Browser` 里搜索你的声音文件和脚本文件。   
全部选中，按鼠标右键，选择 `Full Recompile`。   

这样  `.vsndevts` 就会变成 `.vsndevts_c`文件，  
`.mp3 .wav` 就会变成 `.vsnd_c` 文件（内嵌进去）了。   
编译好的文件会在 `common\Counter-Strike Global Offensive\game\csgo_addons\xxxx` 里。  

一般来说如果开着 hammer，对 `.vsndevts` 的编译是全自动的。   

![](/image/vsnd1.png)   

# 试听
如果要试听，可以把要试听的部分编辑到 `soundevents_addon.vsndevts` 里面，   
然后在 hammer 里加个声音实体，打开 `Sound Event Picker` 试听。   
如果 Picker 里找不到，试试重新编译一次，应该是会每次打开 Picker 的时候刷新的。   
如果点击了没有声音预览，说明你写的有问题或者音频文件有问题。   

![](/image/vsnd2.png)   


# 实体兼容性
`snd_event_point` 和 `ambient_generic` 都可以正常播放 mega 和 music 。   
但是在使用 `ambient_generic` 的时候一定要注意正确勾选 `Is NOT Looped(32)` （貌似绝大多数情况下都要勾上，不然不播放）    

`ambient_generic` 实体无法干预声音脚本自己的音量和播放范围。   

# 模板的使用
如果我们加了七八个甚至几十个音频事件，他们的播放距离或者某些特殊参数都是一样的，  
每个音频事件都批量复制 `distance_volume_mapping_curve` 以及一堆参数，如果后续要批量改动，会很麻烦，  
这时候就可以使用 `base` 来制作模板。 比如下面，两个音频事件都引用了同一个模板叫 t1base  

如果是服务器加载了多个不同的 .vsndevts_c ，里面的 base 名字重复了，**会有影响**，可能会互相串参数

```
"t1base" = 
{
    type = "csgo_mega"
    volume = 1.00
    distance_volume_mapping_curve = 
    [
        [
            0.0, 1.0, 0, 0,
            2.0, 3.0,
        ],
        [
            1300, 0, 0, 0,
            2.0, 3.0,
        ]
    ]
}

"vvv.a1"=
{
	base = "t1base"
	vsnd_files_track_01 = "sounds/exg_hero/amstl/b1.vsnd"
}

"vvv.a2"=
{
	base = "t1base"
	vsnd_files_track_01 = "sounds/exg_hero/amstl/b2.vsnd"
}
```
