"use strict";
const txtInput = document.getElementById("txtInput");
txtInput.style.resize = "none";
txtInput.style.width = "95%";
txtInput.style.font = "monospace";
txtInput.style.height = "200px";
txtInput.style.margin = "1em 0px";
const divResult = document.getElementById("divResult");
function GetMatch(s, reg, index) {
    const array = reg.exec(s);
    if (array == null || array.length <= index) {
        return "";
    }
    return array[index];
}
const reasonNote = new Map();
reasonNote.set("TIMEDOUT", "超时，可能是炸服、你网断了、防火墙拦截");
reasonNote.set("LOOPDEACTIVATE", "资源包切换");
reasonNote.set("LOOPSHUTDOWN", "循环关闭");
reasonNote.set("DISCONNECT_BY_USER", "主动离线");
reasonNote.set("REJECT_SERVERFULL", "服务器已满");
reasonNote.set("KICKED_IDLE", "挂机太久被踢");
reasonNote.set("KICKED", "踢出去");
reasonNote.set("KICKED_TEAMHURTING", "因过度攻击队友");
reasonNote.set("KICKED_HOSTAGEKILLING", "因杀害了过多人质");
reasonNote.set("KICKED_VOTEDOFF", "已被投票踢出");
reasonNote.set("KICKED_CONVICTEDACCOUNT", "帐户被定罪");
reasonNote.set("KICKED_TEAMKILLING", "因杀害了过多队友");
reasonNote.set("KICKED_SUICIDE", "因自杀次数过多");
reasonNote.set("BANADDED", "你已经被封了 ban");
reasonNote.set("KICKBANADDED", "踢出去+封禁");
reasonNote.set("STEAM_VACBANSTATE", "你的号被 VAC 封禁了");
reasonNote.set("STEAM_LOGON", "没有 Steam 登录");
reasonNote.set("STEAM_BANNED", "STEAM用户ID被封禁");
reasonNote.set("STEAM_VAC_CHECK_TIMEDOUT", "您不能在安全服务器上玩游戏的可能原因...");
reasonNote.set("REJECT_BADPASSWORD", "密码错误");
reasonNote.set("OVERFLOW", "溢出错误");
reasonNote.set("LOST", "连接丢失");
reasonNote.set("SNAPSHOTERROR", "发送快照时出错");
reasonNote.set("CLIENT_NO_MAP", "你缺少所需的地图");
reasonNote.set("CLIENT_CONSISTENCY_FAIL", "客户端一致性检查失败");
reasonNote.set("CLIENT_DIFFERENT_MAP", "你地图版本与服务器不同");
reasonNote.set("REJECT_OLDPROTOCOL", "您的客户端已过期");
reasonNote.set("INTERNAL_ERROR", "内部错误");
reasonNote.set("EXITING", "你关闭了cs2");
function ParseLine(str) {
    if (str.length < 5) {
        return "";
    }
    if (str.startsWith("> ")) {
        let v = str.substring(2).trim();
        if (v.length >= 1) {
            return `手动执行指令 ${v}`;
        }
    }
    if (str.startsWith("[HostStateManager] CHostStateMgr::QueueNewRequest")) {
        let v = GetMatch(str, /Remote Connect \((.+?)\)/, 1);
        if (v.length > 2) {
            return `尝试连接到服务器 ${v}`;
        }
    }
    if (str == "[Client] CL:  Connected to 'loopback:1'") {
        return `进入游戏主菜单`;
    }
    if (str.startsWith("[Client] Map: ")) {
        let v = GetMatch(str, /"(.+)"/, 1);
        if (v.length > 0 && v != "<empty>") {
            return `游戏地图是 ${v}`;
        }
    }
    if (str.startsWith("[Client] CL:  Disconnecting from server:")) {
        let v = str.substring(40).trim();
        if (v.length >= 1) {
            v = v.replace("NETWORK_DISCONNECT_", "");
            let note = reasonNote.get(v);
            if (note == null || note.length < 1) {
                note = "";
            }
            else {
                note = `(${note})`;
            }
            return `断线 ${v} ${note}`;
        }
    }
    if (str.startsWith("[Client] CL:  Server disconnected:")) {
        let v = GetMatch(str, /[0-9]+:(.+)/, 1).trim();
        if (v.length >= 1) {
            v = v.replace("NETWORK_DISCONNECT_", "");
            let note = reasonNote.get(v);
            if (note == null || note.length < 1) {
                note = "";
            }
            else {
                note = `(${note})`;
            }
            return `断线 ${v} ${note}`;
        }
    }
    if (str.startsWith("[EngineServiceManager] Mounting addon")) {
        let v = GetMatch(str, /([0-9]+)/, 0);
        if (v.length > 2) {
            return `挂载资源包 ${v}`;
        }
    }
    return "";
}
const btnParse = document.getElementById("btnParse");
btnParse.addEventListener("click", function () {
    const lines = txtInput.value.trim().split("\n");
    let output = "";
    for (const line of lines) {
        let str = line.trim();
        if (str.length < 1) {
            continue;
        }
        str = ParseLine(str);
        if (str.length > 0) {
            output += str + "\n";
        }
    }
    if (output.length < 1) {
        output = "无";
    }
    divResult.innerText = `分析结果，按从老到新顺序排：\n${output}`;
});
