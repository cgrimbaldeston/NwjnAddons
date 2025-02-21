/**
 * ! Currently commented out because its current test code is considerably cheating
 */

import MathUtil from "../../core/static/MathUtil"
import EntityUtil from "../../core/static/EntityUtil"
import RenderUtil from "../../libs/Render/RenderUtil"
import Feature from "../../libs/Features/Feature"
import { notify } from "../../core/static/TextUtil"
import Settings from "../../data/Settings"

const MOB_TYPES = ["monster", "passive", "boss"];
function getClassOfEntity(name, index = 0) {
    try {
        // recurses if #toString() throws error
        return java.lang.Class.forName(`net.minecraft.entity.${ MOB_TYPES[index] }.Entity${ name }`)
    } catch(err) {
        if (index++ < MOB_TYPES.length) return getClassOfEntity(name, index)

        notify(`&cEntity class called &e'${name}'&r &cdoesn't exist. Make sure to use Mob Class Name not SkyBlock name. &3@see https://github.com/nwjn/NwjnAddons/wiki/Bestiary-Entries`)
        return
    }
}

/** @type {HashMap<JavaTClass, Set<Number>?} */
const mobsHighlight = new HashMap()
/** @type {WeakHashMap<MCTEntity, () => AxisAlignedBB>} */
const renderThese = new java.util.WeakHashMap()
/**
 * @see https://github.com/nwjn/NwjnAddons/wiki/Bestiary-Entries
 */
function setMobHighlight() {
    mobsHighlight.clear(), renderThese.clear()
    
    if (!Settings().mobList) return

    Settings().mobList.split(/,\s?/g).forEach(entry => {
        const [mob, hpParam] = entry.split("-")

        // Check if entry is valid
        if (!mob) return
        const clazz = getClassOfEntity(mob)
        if (!clazz) return

        const hps = hpParam?.split("|")?.map(MathUtil.convertToNumber)

        mobsHighlight.put(
            clazz,
            hps ? new Set(hps) : null
        )
    })
}
setMobHighlight()
Settings().getConfig().onCloseGui(setMobHighlight)

function validate(entity) {
    const hps = mobsHighlight.getOrDefault(entity.class, true)
    if (!hps || hps?.has(EntityUtil.getMaxHP(entity))) renderThese.put(entity, true)
}

new class MobHighlight extends Feature {
    constructor() {
        super({setting: "mobList"}), this
            .addEvent("interval", () => World.getAllEntities().forEach(({entity}) => mobsHighlight.containsKey(entity.class) && validate(entity)), 1)

            .addEvent("postRenderEntity", ({entity}) => {
                const whitelisted = renderThese.get(entity)
                if (!whitelisted) return
        
                const [r, g, b, a] = Settings().mobHighlightColor
                // todo: expand by height and width is less
                RenderUtil.drawOutlinedAABB(entity.func_174813_aQ(), r, g, b, a, true, 3, false)
            })
        
            .addEvent(net.minecraftforge.event.entity.living.LivingDeathEvent, ({entity}) => renderThese.remove(entity))
    }
}