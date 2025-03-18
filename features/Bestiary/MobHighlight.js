import MathUtil from "../../core/static/MathUtil"
import EntityUtil from "../../core/static/EntityUtil"
import RenderUtil from "../../libs/Render/RenderUtil"
import Feature from "../../libs/Features/Feature"
import TextUtil from "../../core/static/TextUtil"
import Settings from "../../data/Settings"
import RenderHelper from "../../libs/Render/RenderHelper"
import { getField } from "../../utils/Reflect"

new class MobHighlight extends Feature {
    constructor() {
        super({setting: this.constructor.name})
            .addColorListener()
            .addEvent("entityRendered", ({entity}) => {
                const shouldRender = this.RenderList?.get(entity)
                if (!shouldRender) return

                if (entity./* isInvisible */func_82150_aj()) return
                RenderUtil.drawOutlinedAABB(entity./* getEntityBoundingBox */func_174813_aQ(), this.Color, false, 4, false)
            })
        
            .addEvent(net.minecraftforge.event.entity.living.LivingEvent.LivingUpdateEvent, ({entity}) => 
                RenderHelper.isEntityInFrustum(entity) && this?.validate(entity)
            )
                
            .addEvent(net.minecraftforge.event.entity.living.LivingDeathEvent, (event) => this.RenderList?.remove(event.entity))

        Settings.getConfig().onCloseGui(() => this?.updateWhitelist(Settings.MobHighlight))

        // Weird hardcoding update because it wasn't working normally
        // Client.scheduleTask(20, () => {
        //     const val = this.isSettingEnabled
        //     Settings.getConfig().setConfigValue("Bestiary", "MobHighlight", val + " ")
        //     Settings.getConfig().setConfigValue("Bestiary", "MobHighlight", val)
        // })
        this.init()
    }
    
    onEnabled(newValue) {
        if ("updateWhitelist" in this) return this.updateWhitelist(newValue)
            
        this.Whitelist = new HashMap()
        this.StringToClassMap = new Map()
        const EntityList = net.minecraft.entity.EntityList
        getField(EntityList, /* stringToClassMapping */"field_75625_b").get(EntityList).forEach((k, v) => this.StringToClassMap.set(k.toLowerCase(), v))

        this.RenderList = new java.util.WeakHashMap()

        this.validate = (entity) => {
            const healthList = this.Whitelist.get(entity.class)
            if (!healthList) return
            
            const maxHP = EntityUtil.getMaxHP(entity)
            if (!maxHP) return
            
            if (typeof(healthList) === "boolean" || healthList?.includes(maxHP)) this.RenderList.put(entity, true)
        }

        this.updateWhitelist = (newValue) => {
            this.Whitelist.clear()
            this.RenderList.clear()

            newValue.split(/,\s?/g).forEach((entry, index) => {
                const [name, hpParam] = entry.split("-")

                if (!name) return
                const clazz = this.StringToClassMap.get(name.toLowerCase())
                if (!clazz) return new Message(`${TextUtil.NWJNADDONS} &cEntity class called &e'${name}'&r &cdoesn't exist. Make sure to use Mob Class Name not SkyBlock name. &3@see https://github.com/nwjn/NwjnAddons/wiki/Bestiary-Entries`).setChatLineId(28500 + index).chat()
                ChatLib.deleteChat(28500 + index)

                const hps = hpParam?.split("|")?.map(MathUtil.convertToNumber)

                this.Whitelist.put(
                    clazz,
                    hps ?? true
                )
            })
        }
    }

    onDisabled() {
        delete this.Whitelist
        delete this.StringToClassMap
        delete this.RenderList

        delete this.validate
        delete this.updateWhitelist
    }

    onUnregister() {
        this.RenderList?.clear()
    }
}