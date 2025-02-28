import MathUtil from "../../core/static/MathUtil"
import EntityUtil from "../../core/static/EntityUtil"
import RenderUtil from "../../libs/Render/RenderUtil"
import Feature from "../../libs/Features/Feature"
import { notify } from "../../core/static/TextUtil"
import Settings from "../../data/Settings"
import RenderHelper from "../../libs/Render/RenderHelper"

new class MobHighlight extends Feature {
    constructor() {
        super({setting: "mobList"}), this
            .addEvent("postRenderEntity", ({entity}) => {
                const shouldRender = this.RenderList?.get(entity)
                if (!shouldRender) return

                const [r, g, b, a] = this.Color
                RenderUtil.drawOutlinedAABB(entity./* getEntityBoundingBox */func_174813_aQ(), r, g, b, a, true, 3, false)
            })
        
            .addEvent(net.minecraftforge.event.entity.living.LivingEvent.LivingUpdateEvent, ({entity}) => 
                RenderHelper.inFrustum(entity./* getEntityBoundingBox */func_174813_aQ()) && this?.validate(entity)
            )
                
            .addEvent(net.minecraftforge.event.entity.living.LivingDeathEvent, event => this.RenderList?.remove(event.entity))

        Settings().getConfig()
            .registerListener("mobHighlightColor", (_, val) => this.Color = val)
            .onCloseGui(() => this?.updateWhitelist())
    }
    
    onEnabled() {
        const Whitelist = new HashMap()
        const EntityList = net.minecraft.entity.EntityList
        const StringToClassMap = EntityList.class.getDeclaredField(/* stringToClassMapping */"field_75625_b").get(EntityList)
        this.RenderList = new java.util.WeakHashMap()
        this.Color = Settings().mobHighlightColor

        this.validate = (entity) => {
            const healthList = Whitelist.get(entity.class)
            if (!healthList) return
            
            const maxHP = EntityUtil.getMaxHP(entity)
            if (!maxHP) return

            if (typeof(healthList) === "boolean" || healthList?.includes(maxHP)) this.RenderList.put(entity, true)
        }

        this.updateWhitelist = () => {
            Whitelist.clear(), this.RenderList.clear()

            Settings().mobList.split(/,\s?/g).forEach(entry => {
                const [name, hpParam] = entry.split("-")

                const clazz = StringToClassMap.get(name)
                if (!clazz) return notify(`&cEntity class called &e'${name}'&r &cdoesn't exist. Make sure to use Mob Class Name not SkyBlock name. &3@see https://github.com/nwjn/NwjnAddons/wiki/Bestiary-Entries`)

                const hps = hpParam?.split("|")?.map(MathUtil.convertToNumber)

                Whitelist.put(
                    clazz,
                    hps ?? true
                )
            })
        }

        this.updateWhitelist()
    }

    onDisabled() {
        this.Whitelist = null
        this.RenderList = null
        this.Color = null

        this.validate = null
        this.updateWhitelist = null
    }

    onUnregister() {
        this.RenderList.clear()
    }
}