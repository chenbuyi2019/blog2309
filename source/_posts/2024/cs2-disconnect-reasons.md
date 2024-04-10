---
title: Counter-Strike 2 玩家离线理由对照表
date: 2024-04-10 08:56:22
tags: [cs2]
---
注释里的文本大部分来自 `csgo/pak01_dir.vpk` 里的 `resource/csgo_schinese.txt`    
参考原文： [hl2sdk-cs2](https://github.com/alliedmodders/hl2sdk/blob/cs2/common/network_connection.proto)   

```c#
/// <summary>
/// 玩家掉线的理由
/// </summary>
public enum PlayerDisconnectReason
{
    /// <summary>
    /// （无弹窗）
    /// </summary>
    INVALID = 0,

    /// <summary>
    /// （无弹窗）
    /// </summary>
    SHUTDOWN = 1,

    /// <summary>
    /// （无弹窗，玩家主动离开）
    /// </summary>
    DISCONNECT_BY_USER = 2,

    /// <summary>
    /// 服务器断开连接。
    /// </summary>
    DISCONNECT_BY_SERVER = 3,

    /// <summary>
    /// 连接丢失。
    /// </summary>
    LOST = 4,

    /// <summary>
    /// 溢出错误
    /// </summary>
    OVERFLOW = 5,

    /// <summary>
    /// STEAM 用户 ID 被封禁
    /// </summary>
    STEAM_BANNED = 6,

    /// <summary>
    /// STEAM 用户 ID 已在此服务器上使用
    /// </summary>
    STEAM_INUSE = 7,

    /// <summary>
    /// 来自 STEAM 用户 ID 的工单无效
    /// </summary>
    STEAM_TICKET = 8,

    /// <summary>
    /// 需要 Steam 以加入游戏。请检查您到 Steam 的连接并重试。
    /// </summary>
    STEAM_LOGON = 9,

    /// <summary>
    /// 没有 Steam 登录
    /// </summary>
    STEAM_AUTHCANCELLED = 10,

    /// <summary>
    /// 没有 Steam 登录
    /// </summary>
    STEAM_AUTHALREADYUSED = 11,

    /// <summary>
    /// 没有 Steam 登录
    /// </summary>
    STEAM_AUTHINVALID = 12,

    /// <summary>
    /// VAC 已被安全服务器封禁
    /// </summary>
    STEAM_VACBANSTATE = 13,

    /// <summary>
    /// 此帐户当前正在另一台机器上登录到 Steam。\n请稍后再试。
    /// </summary>
    STEAM_LOGGED_IN_ELSEWHERE = 14,

    /// <summary>
    /// 您不能在安全服务器上玩游戏的可能原因如下：•您的电脑出现问题，阻止了 VAC 系统。•您无法与 VAC 系统保持稳定连接。•您运行的软件在修改游戏或与 VAC 不兼容。更多信息，请参见 https://support.steampowered.com/kb_article.php?ref=2117-ILZV-2837
    /// </summary>
    STEAM_VAC_CHECK_TIMEDOUT = 15,

    /// <summary>
    /// Steam 认证失败。您必须连接到 Steam 才能初始化到游戏服务器。
    /// </summary>
    STEAM_DROPPED = 16,

    /// <summary>
    /// 这个 Steam 帐户并未拥有该游戏。请用正确的 Steam 帐户登录。
    /// </summary>
    STEAM_OWNERSHIP = 17,

    /// <summary>
    /// 信息数据溢出
    /// </summary>
    SERVERINFO_OVERFLOW = 18,

    /// <summary>
    /// 
    /// </summary>
    TICKMSG_OVERFLOW = 19,

    /// <summary>
    /// 
    /// </summary>
    STRINGTABLEMSG_OVERFLOW = 20,

    /// <summary>
    /// 
    /// </summary>
    DELTAENTMSG_OVERFLOW = 21,

    /// <summary>
    /// 
    /// </summary>
    TEMPENTMSG_OVERFLOW = 22,

    /// <summary>
    /// 
    /// </summary>
    SOUNDSMSG_OVERFLOW = 23,

    /// <summary>
    /// 可靠的快照溢出错误
    /// </summary>
    SNAPSHOTOVERFLOW = 24,

    /// <summary>
    /// 发送快照时出错
    /// </summary>
    SNAPSHOTERROR = 25,

    /// <summary>
    /// 可靠的缓冲溢出错误
    /// </summary>
    RELIABLEOVERFLOW = 26,

    /// <summary>
    /// 客户端增量标记故障
    /// </summary>
    BADDELTATICK = 27,

    /// <summary>
    /// 没有更多的扩散槽位
    /// </summary>
    NOMORESPLITS = 28,

    /// <summary>
    /// 无法与游戏服务器建立连接。
    /// </summary>
    TIMEDOUT = 29,

    /// <summary>
    /// 远程主机关闭了连接。
    /// </summary>
    DISCONNECTED = 30,

    /// <summary>
    /// 扩散槽位已断开
    /// </summary>
    LEAVINGSPLIT = 31,

    /// <summary>
    /// 服务器端使用不同的类表。
    /// </summary>
    DIFFERENTCLASSTABLES = 32,

    /// <summary>
    /// 中继密码错误
    /// </summary>
    BADRELAYPASSWORD = 33,

    /// <summary>
    /// 观察者密码错误
    /// </summary>
    BADSPECTATORPASSWORD = 34,

    /// <summary>
    /// SourceTV 服务器仅限本地观察者（C类）
    /// </summary>
    HLTVRESTRICTED = 35,

    /// <summary>
    /// 比赛不允许观战。
    /// </summary>
    NOSPECTATORS = 36,

    /// <summary>
    /// 没有可用的 SourceTV 中继站
    /// </summary>
    HLTVUNAVAILABLE = 37,

    /// <summary>
    /// SourceTV 停止
    /// </summary>
    HLTVSTOP = 38,

    /// <summary>
    /// 被服务器踢出。
    /// </summary>
    KICKED = 39,

    /// <summary>
    /// 已加入封禁名单
    /// </summary>
    BANADDED = 40,

    /// <summary>
    /// 已被踢出并封禁
    /// </summary>
    KICKBANADDED = 41,

    /// <summary>
    /// SourceTV 无法直接连接至游戏。
    /// </summary>
    HLTVDIRECT = 42,

    /// <summary>
    /// 纯服务器：客户端加载了额外文件。
    /// </summary>
    PURESERVER_CLIENTEXTRA = 43,

    /// <summary>
    /// 纯服务器：客户端文件与服务器不匹配。 https://support.steampowered.com/kb_article.php?ref=8285-YOAZ-6049
    /// </summary>
    PURESERVER_MISMATCH = 44,

    /// <summary>
    /// 解析用户指令错误。
    /// </summary>
    USERCMD = 45,

    /// <summary>
    /// 连接被游戏拒绝。
    /// </summary>
    REJECTED_BY_GAME = 46,

    /// <summary>
    /// 解析消息失败。
    /// </summary>
    MESSAGE_PARSE_ERROR = 47,

    /// <summary>
    /// 消息无效。
    /// </summary>
    INVALID_MESSAGE_ERROR = 48,

    /// <summary>
    /// 服务器密码错误
    /// </summary>
    BAD_SERVER_PASSWORD = 49,

    /// <summary>
    /// （这会在客户端留下一个空白的确认窗口）
    /// </summary>
    DIRECT_CONNECT_RESERVATION = 50,

    /// <summary>
    /// 连接失败
    /// </summary>
    CONNECTION_FAILURE = 51,

    /// <summary>
    /// 缺少连接对等组
    /// </summary>
    NO_PEER_GROUP_HANDLERS = 52,

    /// <summary>
    /// （这会在客户端留下一个空白的确认窗口）
    /// </summary>
    RECONNECTION = 53,

    /// <summary>
    /// 循环关闭。
    /// </summary>
    LOOPSHUTDOWN = 54,

    /// <summary>
    /// 循环已失效。
    /// </summary>
    LOOPDEACTIVATE = 55,

    /// <summary>
    /// 游戏由主机结束。
    /// </summary>
    HOST_ENDGAME = 56,

    /// <summary>
    /// 循环等级加载已生效。
    /// </summary>
    LOOP_LEVELLOAD_ACTIVATE = 57,

    /// <summary>
    /// 创建服务器失败。
    /// </summary>
    CREATE_SERVER_FAILED = 58,

    /// <summary>
    /// 关闭游戏。 （玩家quit指令会触发）
    /// </summary>
    EXITING = 59,

    /// <summary>
    /// 主机空闲中。
    /// </summary>
    REQUEST_HOSTSTATE_IDLE = 60,

    /// <summary>
    /// 主机是中继站。
    /// </summary>
    REQUEST_HOSTSTATE_HLTVRELAY = 61,

    /// <summary>
    /// 客户端一致性检查失败。
    /// </summary>
    CLIENT_CONSISTENCY_FAIL = 62,

    /// <summary>
    /// 客户端地图验证失败。
    /// </summary>
    CLIENT_UNABLE_TO_CRC_MAP = 63,

    /// <summary>
    /// 您的客户端上缺少所需的地图。
    /// </summary>
    CLIENT_NO_MAP = 64,

    /// <summary>
    /// 您的地图版本与服务器不同。
    /// </summary>
    CLIENT_DIFFERENT_MAP = 65,

    /// <summary>
    /// 客户端和服务器必须连接到 Steam。
    /// </summary>
    SERVER_REQUIRES_STEAM = 66,

    /// <summary>
    /// 服务器连接被 Steam 拒绝。
    /// </summary>
    STEAM_DENY_MISC = 67,

    /// <summary>
    /// 服务器连接被 VAC 拒绝。
    /// </summary>
    STEAM_DENY_BAD_ANTI_CHEAT = 68,

    /// <summary>
    /// 从游戏服务器断开。游戏服务器正在关机。
    /// </summary>
    SERVER_SHUTDOWN = 69,

    /// <summary>
    /// 不兼容回放。
    /// </summary>
    REPLAY_INCOMPATIBLE = 71,

    /// <summary>
    /// 无法与游戏服务器建立连接。
    /// </summary>
    CONNECT_REQUEST_TIMEDOUT = 72,

    /// <summary>
    /// 服务器版本不兼容。
    /// </summary>
    SERVER_INCOMPATIBLE = 73,

    /// <summary>
    /// 连接断开，此前已尝试连接不同地区的多个中继服务器，您的网络连接很可能出现问题。
    /// </summary>
    LOCALPROBLEM_MANYRELAYS = 74,

    /// <summary>
    /// 游戏服务器与客户端使用的主中继服务器失去连接。
    /// </summary>
    LOCALPROBLEM_HOSTEDSERVERPRIMARYRELAY = 75,

    /// <summary>
    /// 请检查网络连接。无法从CDN下载网络配置文件。
    /// </summary>
    LOCALPROBLEM_NETWORKCONFIG = 76,

    /// <summary>
    /// 已断开连接。可能是本地的网络连接出现问题。
    /// </summary>
    LOCALPROBLEM_OTHER = 77,

    /// <summary>
    /// 游戏已停止从远程主机接收通讯。
    /// </summary>
    REMOTE_TIMEOUT = 79,

    /// <summary>
    /// 已数次尝试连接，但服务器没有响应。
    /// </summary>
    REMOTE_TIMEOUT_CONNECTING = 80,

    /// <summary>
    /// 已数次尝试连接，但服务器没有响应。
    /// </summary>
    REMOTE_OTHER = 81,

    /// <summary>
    /// 远程主机的证书不正确或配置错误。
    /// </summary>
    REMOTE_BADCRYPT = 82,

    /// <summary>
    /// 远程主机的证书不能用于验证。
    /// </summary>
    REMOTE_CERTNOTTRUSTED = 83,

    /// <summary>
    /// 已断开连接。出现特殊情况。控制台可能会有更多详情。
    /// </summary>
    UNUSUAL = 84,

    /// <summary>
    /// 由于内部错误，已断开连接。控制台可能会有更多详情。
    /// </summary>
    INTERNAL_ERROR = 85,

    /// <summary>
    /// 服务器拒绝了错误的挑战数据包。
    /// </summary>
    REJECT_BADCHALLENGE = 128,

    /// <summary>
    /// 服务器没有托管游戏大厅。
    /// </summary>
    REJECT_NOLOBBY = 129,

    /// <summary>
    /// 服务器正在运行背景图。
    /// </summary>
    REJECT_BACKGROUND_MAP = 130,

    /// <summary>
    /// 服务器正在运行单人游戏。
    /// </summary>
    REJECT_SINGLE_PLAYER = 131,

    /// <summary>
    /// 服务器正在运行隐藏游戏。
    /// </summary>
    REJECT_HIDDEN_GAME = 132,

    /// <summary>
    /// 服务器仅限局域网游戏。
    /// </summary>
    REJECT_LANRESTRICT = 133,

    /// <summary>
    /// 密码错误被服务器拒绝。
    /// </summary>
    REJECT_BADPASSWORD = 134,

    /// <summary>
    /// 服务器已满。
    /// </summary>
    REJECT_SERVERFULL = 135,

    /// <summary>
    /// 服务器预留无效。
    /// </summary>
    REJECT_INVALIDRESERVATION = 136,

    /// <summary>
    /// 网络信道不良被服务器拒绝。
    /// </summary>
    REJECT_FAILEDCHANNEL = 137,

    /// <summary>
    /// 服务器需要客户端从游戏大厅连接。
    /// </summary>
    REJECT_CONNECT_FROM_LOBBY = 138,

    /// <summary>
    /// 服务器已预留给游戏大厅。
    /// </summary>
    REJECT_RESERVED_FOR_LOBBY = 139,

    /// <summary>
    /// 无效游戏序列号被服务器拒绝。
    /// </summary>
    REJECT_INVALIDKEYLENGTH = 140,

    /// <summary>
    /// 您的客户端已过期。
    /// </summary>
    REJECT_OLDPROTOCOL = 141,

    /// <summary>
    /// 服务器已过期。
    /// </summary>
    REJECT_NEWPROTOCOL = 142,

    /// <summary>
    /// 无效连接被服务器拒绝。
    /// </summary>
    REJECT_INVALIDCONNECTION = 143,

    /// <summary>
    /// 无效的客户端证书被服务器拒绝。
    /// </summary>
    REJECT_INVALIDCERTLEN = 144,

    /// <summary>
    /// 无效的 Steam 证书被服务器拒绝。
    /// </summary>
    REJECT_INVALIDSTEAMCERTLEN = 145,

    /// <summary>
    /// Steam 拒绝了您与服务器的连接。
    /// </summary>
    REJECT_STEAM = 146,

    /// <summary>
    /// 服务器认证已禁用。
    /// </summary>
    REJECT_SERVERAUTHDISABLED = 147,

    /// <summary>
    /// 游戏序列号验证被服务器拒绝。
    /// </summary>
    REJECT_SERVERCDKEYAUTHINVALID = 148,

    /// <summary>
    /// 您的客户端不允许加入此服务器。
    /// </summary>
    REJECT_BANNED = 149,

    /// <summary>
    /// 因杀害了过多队友
    /// </summary>
    KICKED_TEAMKILLING = 150,

    /// <summary>
    /// 因在开局时击杀了一名队友
    /// </summary>
    KICKED_TK_START = 151,

    /// <summary>
    /// 帐户处于“不可信”状态
    /// </summary>
    KICKED_UNTRUSTEDACCOUNT = 152,

    /// <summary>
    /// 帐户被定罪
    /// </summary>
    KICKED_CONVICTEDACCOUNT = 153,

    /// <summary>
    /// 玩家处于竞技匹配冷却状态
    /// </summary>
    KICKED_COMPETITIVECOOLDOWN = 154,

    /// <summary>
    /// 因过度攻击队友
    /// </summary>
    KICKED_TEAMHURTING = 155,

    /// <summary>
    /// 因杀害了过多人质
    /// </summary>
    KICKED_HOSTAGEKILLING = 156,

    /// <summary>
    /// 已被投票踢出
    /// </summary>
    KICKED_VOTEDOFF = 157,

    /// <summary>
    /// 玩家处于空闲状态
    /// </summary>
    KICKED_IDLE = 158,

    /// <summary>
    /// 因自杀次数过多
    /// </summary>
    KICKED_SUICIDE = 159,

    /// <summary>
    /// 无效的用户登录
    /// </summary>
    KICKED_NOSTEAMLOGIN = 160,

    /// <summary>
    /// 游戏验证失败
    /// </summary>
    KICKED_NOSTEAMTICKET = 161
}
```