import Feature from "../../libs/Features/Feature";
import TextUtil from "../../core/static/TextUtil";
import Settings from "../../data/Settings";
import Waypoint from "../../libs/Render/TempWaypoint";
import { isBlacklisted } from "../../utils/Profile";
import { ColorContainer } from "../../libs/Render/ColorContainer";

new class ChatWaypoints extends Feature {
    constructor() {
        super({setting: "ChatWaypoints"})

        this.Color = ColorContainer.registerListener(Settings, "ChatWaypointsColor")
        this.addEvent("serverChat", (displayName, x, y, z, text = "", event, formatted) => {
                const ign = TextUtil.getSenderName(displayName).toLowerCase()
                
                if (isBlacklisted(ign)) return TextUtil.append(event./* getChatComponent */func_148915_c(), "§cBlacklisted")
                
                const [mainText] = TextUtil.getMatches(/^(.+)§.:/, formatted)
                if (!mainText) return
        
                this.waypoints.set(ign, new Waypoint(mainText, text, x, y, z, 5, Settings.ChatWaypointsTime))
                this.updateSubEvents()
            }, /^(?:[\w\-]{5} > )?(?:\[\d{1,3}\] .? ?)?(?:\[\w+\+*\] )?(\w{1,16})(?: .? ?)?: x: (-?[\d\.]+), y: (-?[\d\.]+), z: (-?[\d\.]+) ?(.+)?$/)
        
            .addSubEvent("interval", () => 
                this.waypoints.forEach((v, k) => 
                    v.dirty ? this.waypoints.delete(k) && this.updateSubEvents() : v.update()
                ), 
            1 / 5, () => this.waypoints.size)
        
            .addSubEvent("renderWorld", () => {
                this.waypoints.forEach(it => {
                    !it.dirty && it.render(this.Color)
            })
            }, null, () => this.waypoints.size)

        this.init()
    }

    onEnabled() {
        this.waypoints = new Map()
    }

    onDisabled() {
        delete this.waypoints
    }
}