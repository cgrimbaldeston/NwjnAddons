export default class EntityUtil {
    /**
     * Used for general removing
     * @param {MCTEntity} entity 
     */
    static removeEntity = (entity) => World.getWorld()./* removeEntity */func_72900_e(entity)
    
    /** 
     * Same as removeEntity but param is entity id
     * @param {Number} id
     * @returns {MCTEntity}
    */
    static removeEntityByID = (id) => World.getWorld()./* removeEntityFromWorld */func_73028_b(id)

    /**
     * Used for removing if entity is known to not be a player entity
     */
    static setDead = (entity) => entity./* setDead */func_70106_y()

    static getEntityByID = (id) => World.getWorld()./* getEntityByID */func_73045_a(id)

    /**
     * Credit: PerseusPotter
     * Gets the Max HP of the entity
     * @param {MCTEntity} entity 
     * @returns {Number} maxhealth int
     */
    static getMaxHP = (entity) => ~~entity?./* getAttributeMap */func_110140_aT()?./* getAttributeInstanceByName */func_111152_a('generic.maxHealth')?./* getBaseValue */func_111125_b()

    /**
     * Gets the current HP of the entity
     * @param {MCTEntity} entity 
     * @returns {?Number} hp int
     */
    static getHP = (entity) => ~~entity./* getHealth */func_110143_aJ() // getHealth

    /**
     * Checks if the player entity is a real user
     * @param {PlayerMP} player 
     * @returns {Boolean}
     */
    static isRealPlayer = (player) => player.getPing() === 1
}