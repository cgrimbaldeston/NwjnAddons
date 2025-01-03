/**
 * Cleans up dead entities by: 
 * 1. Removing them on death and canceling their death animation
 * 2. Removing their armorstand nametag that stays for multiple ticks after death
 */

import Feature from "../../core/Feature"
import EntityUtil from "../../core/static/EntityUtil"

new Feature({setting: "noDeathAnimation"})
    .addEvent(net.minecraftforge.event.entity.living.LivingDeathEvent, (event) => event.entity["setDead", "func_70106_y"]())

new Feature({setting: "noDeadArmorStands"})
    .addEvent(
        register("packetReceived", (packet, event) => {
            const watchers = packet["getWatchers", "func_149376_c"]()
            if (watchers?.length !== 1) return

            const nameWatcher = watchers[0]
            if (nameWatcher["getObjectType", "func_75674_c"]() !== ("String", 4)) return
            const text = nameWatcher["getObject", "func_75669_b"]().removeFormatting()

            if (!/ 0(\/|❤)/.test(text)) return

            const entity = EntityUtil.getEntityByID(packet["getEntityID", "func_149375_d"]())
            if (!entity) return

            cancel(event)
            entity["setDead", "func_70106_y"]()
        }).setFilteredClass(net.minecraft.network.play.server.S1CPacketEntityMetadata)
    )