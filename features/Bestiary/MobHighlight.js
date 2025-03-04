import MathUtil from "../../core/static/MathUtil"
import EntityUtil from "../../core/static/EntityUtil"
import RenderUtil from "../../libs/Render/RenderUtil"
import Feature from "../../libs/Features/Feature"
import TextUtil from "../../core/static/TextUtil"
import Settings from "../../data/Settings"
import RenderHelper from "../../libs/Render/RenderHelper"

new class MobHighlight extends Feature {
    constructor() {
        super({setting: "mobList"}), this
            .addEvent("entityRendered", ({entity}) => {
                const shouldRender = this.RenderList?.get(entity)
                if (!shouldRender) return

                if (entity./* isInvisible */func_82150_aj()) return

                const [r, g, b, a] = this.Color
                RenderUtil.drawOutlinedAABB(entity./* getEntityBoundingBox */func_174813_aQ(), r, g, b, a, false, 3, false)
            })
        
            .addEvent(net.minecraftforge.event.entity.living.LivingEvent.LivingUpdateEvent, ({entity}) => 
                RenderHelper.isEntityInFrustum(entity) && this?.validate(entity)
            )
                
            .addEvent(net.minecraftforge.event.entity.living.LivingDeathEvent, ({entity}) => this.RenderList?.remove(entity))

        Settings().getConfig()
            .registerListener("mobHighlightColor", (_, val) => this.Color = val)
            .onCloseGui(() => this?.updateWhitelist())
    }
    
    onEnabled(previousValue) {
        if ("updateWhitelist" in this && previousValue) return this.updateWhitelist()
            
        const Whitelist = new HashMap()
        const EntityList = net.minecraft.entity.EntityList
        const StringToClassMapField = EntityList.class.getDeclaredField(/* stringToClassMapping */"field_75625_b")
        StringToClassMapField.setAccessible(true)
        const StringToClassMap = StringToClassMapField.get(EntityList)
        StringToClassMap.forEach((k, v) => StringToClassMap.put(k.toLowerCase(), v))

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

            Settings().mobList.split(/,\s?/g).forEach((entry, index) => {
                const [name, hpParam] = entry.split("-")

                if (!name) return
                const clazz = StringToClassMap.get(name.toLowerCase())
                if (!clazz) return new Message(`${TextUtil.NWJNADDONS} &cEntity class called &e'${name}'&r &cdoesn't exist. Make sure to use Mob Class Name not SkyBlock name. &3@see https://github.com/nwjn/NwjnAddons/wiki/Bestiary-Entries`).setChatLineId(28500 + index).chat()
                ChatLib.deleteChat(28500 + index)

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
        delete this.updateWhitelist
    }

    onUnregister() {
        this.RenderList.clear()
    }
}