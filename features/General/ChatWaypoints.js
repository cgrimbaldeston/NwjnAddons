import Feature from "../../libs/Features/Feature";
import TextUtil from "../../core/static/TextUtil";
import Settings from "../../data/Settings";
import Waypoint from "../../libs/Render/TempWaypoint";
import { isBlacklisted } from "../../utils/Profile";

new class ChatWaypoints extends Feature {
    constructor() {
        super({setting: "waypoint"}), this
            .addEvent("serverChat", (displayName, x, y, z, text = "", event, formatted) => {
                const ign = TextUtil.getSenderName(displayName).toLowerCase()
                
                if (isBlacklisted(ign)) return TextUtil.append(event.func_148915_c(), "§cBlacklisted")
                
                const [mainText] = TextUtil.getMatches(/^(.+)§.:/, formatted)
                if (!mainText) return
        
                this.waypoints.set(ign, new Waypoint(mainText, text, x, y, z, 5, Settings().wpTime))
                this.updateSubEvents()
            }, /^(?:[\w\-]{5} > )?(?:\[\d{1,3}\] .? ?)?(?:\[\w+\+*\] )?(\w{1,16})(?: .? ?)?: x: (-?[\d\.]+), y: (-?[\d\.]+), z: (-?[\d\.]+) ?(.+)?$/)
        
            .addSubEvent("interval", () => 
                this.waypoints.forEach((v, k) => 
                    v.dirty ? this.waypoints.delete(k) && this.updateSubEvents() : v.update()
                ), 
            1 / 5, () => this.waypoints?.size)
        
            .addSubEvent("renderWorld", () => {
                this.waypoints.forEach(it => 
                    !it.dirty && it.render(this.Color)
                )
            }, null, () => this.waypoints?.size)

        Settings().getConfig().registerListener("wpColor", (_, val) => this.Color = val)
    }

    onEnabled() {
        this.waypoints = new Map()
        this.Color = Settings().wpColor
    }

    onDisabled() {
        this.waypoints = null
        this.Color = null
    }
}