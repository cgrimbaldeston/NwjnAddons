// import GuiFeature from "../../libs/Features/GuiFeature";
// import ItemUtil from "../../core/static/ItemUtil";
// import { data } from "../../data/Data";
// import { addCountdown } from "../../libs/Time/ServerTime";
// import Seconds from "../../libs/Time/Units/Seconds";

// const prefix = "Reaper:"
// const ReaperOverlay = new GuiFeature({
//     setting: "reaperTimer",

//     name: "Reaper",
//     dataObj: data.Reaper,
//     baseText: `${prefix} 0.00s`
// })
//     .addEvent("worldSound", () => {
//         if (
//             ItemUtil.getSkyblockItemID(Player.armor.getChestplate())
//             !==
//             "REAPER_CHESTPLATE"
//         ) return
        
//         addCountdown(
//             (time) => ReaperOverlay.text = time ? `${prefix} ${time.toFixed(2)}s` : null, 
//             Seconds.of(6)
//         )
//     }, "mob.zombie.remedy")