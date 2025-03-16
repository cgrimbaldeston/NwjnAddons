import Feature from "../../libs/Features/Feature";
import TextUtil from "../../core/static/TextUtil";

const SkyblockXP = new Feature({setting: "SkyblockXP"})
    .addEvent("actionBarChange", (xp, category, progress) => {
        const hashCode = 30000 + (~~xp + ~~progress)
        
        ChatLib.deleteChat(hashCode)
        new Message(`${TextUtil.NWJN} §7>§r §b+${xp} SkyBlock XP §7${category} §b(${progress}/100)`).setChatLineId(hashCode).chat()
    }, /\s{5}\+(\d{1,3}) SkyBlock XP (\(.+\)) \((\d{1,2})\/100\)\s{5}/)

SkyblockXP.init()