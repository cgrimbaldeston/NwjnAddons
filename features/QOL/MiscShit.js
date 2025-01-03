import Feature from "../../core/Feature";
import Settings from "../../data/Settings";

/** 
 * @see {https://github.com/Marcelektro/MCP-919/blob/1717f75902c6184a1ed1bfcd7880404aab4da503/src/minecraft/net/minecraft/entity/EntityTrackerEntry.java} ctrl-f S0EPacketSpawnObject
 * @type {Map<Number, ?() => Boolean>} 
 */
const blacklist = new Map()

new Feature({setting: "miscShit"})
    .addEvent("spawnObject", (entityType, event) => {
        const value = blacklist.get(entityType)

        if (typeof(value) !== "function" || value()) cancel(event)
    })

    .addEvent("cancelPacket", "S10PacketSpawnPainting")
    .addEvent("cancelPacket", "S11PacketSpawnExperienceOrb")

/* [Always Enabled] */
blacklist.set(1)  // Boat
blacklist.set(10) // MineCart
blacklist.set(61) // Snowball
blacklist.set(62) // Egg
blacklist.set(63) // Fireball
blacklist.set(64) // SmallFireball
blacklist.set(66) // WitherSkull
blacklist.set(72) // EnderEye
blacklist.set(73) // Potion
blacklist.set(75) // ExpBottle
blacklist.set(75) // Rocket
blacklist.set(77) // Leash

/* [Optional] */
blacklist.set(60, () => Settings().removeArrows) // Arrow (Who's not shooting?)
blacklist.set(70, () => Settings().removeFallingBlocks) // FallingBlock