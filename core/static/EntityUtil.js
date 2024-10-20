export default class EntityUtil {
    /**
     * @param {MCTEntity|Entity} entity 
     * @returns {MCTEntity} the mcEntity
     */
    static getEntity = (entity) => entity?.entity ?? entity

    /**
     * - Credit: SkyHanni
     * - Gets the correspond armor stand tag of the entity
     * @param {MCTEntity|Entity} entity 
     * @returns {MCTEntity} The armor stand entity
     */
    static getMobStandTag(entity) {
        entity = EntityUtil.getEntity(entity)

        const tagEntity =
            World.getWorld().func_73045_a( // getEntityByID
                entity.func_145782_y() + 1 // getEntityID, + 1 gets next entity
            )

        return (
            tagEntity instanceof net.minecraft.entity.item.EntityArmorStand
            &&
            /§r §[^a]0(§f\/|§c❤)/g.test(tagEntity.func_95999_t()) // tests if the nametag of the stand is hp tag
        ) ? tagEntity : null
    }

    /**
     * Credit: PerseusPotter
     * Gets the Max HP of the entity
     * @param {MCTEntity|Entity} entity 
     * @returns {?Number} maxhealth int
     */
    static getMaxHP = (entity) => ~~EntityUtil.getEntity(entity)
        ?.func_110140_aT()?.func_111152_a('generic.maxHealth')?.func_111125_b()

    /**
     * Gets the current HP of the entity
     * @param {MCTEntity|Entity} entity 
     * @returns {?Number} hp int
     */
    static getHP = (entity) => ~~EntityUtil.getEntity(entity)
        ?.func_110143_aJ() // getHealth

    /**
     * Checks if the player entity is a real user
     * @param {PlayerMP} player 
     * @returns {Boolean}
     */
    static isRealPlayer = (player) => player.getPing() === 1
}