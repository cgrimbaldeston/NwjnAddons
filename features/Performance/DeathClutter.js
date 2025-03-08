import Feature from "../../libs/Features/Feature"
import EntityUtil from "../../core/static/EntityUtil"

/**
 * Cleans up dead entities by: 
 * 1. Removing them on death and canceling their death animation
 * 2. Removing their armorstand nametag that stays for multiple ticks after death
 */

new class DeathClutter extends Feature {
    constructor() {
        super(this)
            .addEvent(net.minecraftforge.event.entity.living.LivingDeathEvent, ({entity}) => EntityUtil.removeEntity(entity))
            .addEvent("packetReceived", (packet) => {
                // Nametag changes always have only one watcher
                const WatchList = packet./* getWatcherList */func_149376_c()
                if (WatchList?.length !== 1) return
                
                const object = WatchList[0]./* getObject */func_75669_b()
                if (this?.isNametag(object)) EntityUtil.removeEntityByID(packet./* getEntityId */func_149375_d())
            }, net.minecraft.network.play.server.S1CPacketEntityMetadata)
    }

    onEnabled() {
        const NAMETAG_REGEX = / (§.)*0(§.)*[\/❤]/
        const JavaString = java.lang.String

        this.isNametag = (object) => object instanceof JavaString && NAMETAG_REGEX.test(object)
    }

    onDisabled() {
        delete this.isNametag
    }
}