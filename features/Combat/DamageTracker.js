import Feature from "../../libs/Features/Feature";

new class DamageTracker extends Feature {
    constructor() {
        super({setting: "damageTracker"}), this
            .addEvent("packetReceived", (packet) => {
                if (packet./* getEntityType */func_149025_e() !== 30) return

                const WatcherList = packet./* getWatcherList */func_149027_c()
                const Nametag = WatcherList.find(object => object./* getObjectType */func_75674_c() === 4)?./* getObject */func_75669_b()

                if (Nametag && !Nametag.includes(" ")) ChatLib.chat(Nametag)
            }, net.minecraft.network.play.server.S0FPacketSpawnMob)
    }
}