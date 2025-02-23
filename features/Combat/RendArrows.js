import Feature from "../../libs/Features/Feature";
import ItemUtil from "../../core/static/ItemUtil";
import { scheduleTask } from "../../libs/Time/ServerTime";
import Ticks from "../../libs/Time/Ticks";

let arrows = 0

new Feature({setting: "rendArrows"})
    .addEvent("worldSound", () => {
        const held = Player.getHeldItem()
        if (held && !ItemUtil.getExtraAttribute(Player.getHeldItem())?.enchantments?.ultimate_rend) return
        
        arrows++
        if (arrows !== 1) return
        scheduleTask(() => {
            ChatLib.chat(`Rend Arrows: ${ arrows - 1 }`);
            arrows = 0
        }, Ticks.of(5))
    }, "game.neutral.hurt")