import Feature from "../../libs/Features/Feature";
import Settings from "../../data/Settings";

new class SpawnClutter extends Feature {
    constructor() {
        super({setting: this.constructor.name})
            .addEvent("spawnObject", (typeId, event) => this.blacklist?.has(typeId) && cancel(event))
            .addEvent("packetReceived", (_, event) => cancel(event), net.minecraft.network.play.server.S10PacketSpawnPainting)
            .addEvent("packetReceived", (_, event) => cancel(event), net.minecraft.network.play.server.S11PacketSpawnExperienceOrb)

        Settings.getConfig()
            .registerListener("SpawnClutterArrows", (_, val) => this?.updateOptionals(val, 60))
            .registerListener("SpawnClutterFallingBlocks", (_, val) => this?.updateOptionals(val, 70))

        this.init()
    }

    onEnabled() {
        /** 
         * Check link for type list, notify me on discord if any of these types not to be edited or changed to have a setting
         * @see {https://github.com/Marcelektro/MCP-919/blob/1717f75902c6184a1ed1bfcd7880404aab4da503/src/minecraft/net/minecraft/entity/EntityTrackerEntry.java} ctrl-f S0EPacketSpawnObject
         * @type {Set<Number>} 
         */
        this.blacklist = new Set([
            1,  // Boat
            10, // MineCart
            61, // Snowball
            62, // Egg
            63, // Fireball
            64, // SmallFireball
            66, // WitherSkull
            72, // EnderEye
            73, // Potion
            75, // ExpBottle
            76, // Rocket
            77 // Leash
        ])

        if (Settings.SpawnClutterArrows) this.blacklist.add(60)
        if (Settings.SpawnClutterFallingBlocks) this.blacklist.add(70)

        this.updateOptionals = (bool, id) => {
            if (bool) this.blacklist.add(id)
            else this.blacklist.delete(id)
        }
    }

    onDisabled() { 
        delete this.blacklist
        delete this.updateOptionals
    }
}