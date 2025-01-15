import Feature from "../../libs/Features/Feature";
import RenderUtil from "../../core/static/RenderUtil";
import TextUtil from "../../core/static/TextUtil";
import { data } from "../../data/Data";
import Settings from "../../data/Settings";
import { scheduleTask } from "../../libs/Time/ServerTime";
import Second from "../../libs/Time/Second";

/** @type {Map<String, Waypoint>} */
const waypoints = new Map()

const ChatWaypoints = new Feature({setting: "waypoint"})
    .addEvent("serverChat", (displayName, x, y, z, text = "", event, formatted) => {
        const ign = TextUtil.getSenderName(displayName).toLowerCase()
        
        if (ign in data.blacklist) return TextUtil.append(event.func_148915_c(), "§cBlacklisted")
        
        const [title] = TextUtil.getMatches(/^(.+)§.:/, formatted)

        new Waypoint(ign, title, x, y, z, text)
    }, /^(?:[\w\-]{5} > )?(?:\[\d{1,3}\] .? ?)?(?:\[\w+\+*\] )?(\w{1,16})(?: .? ?)?: x: (-?[\d\.]+), y: (-?[\d\.]+), z: (-?[\d\.]+) ?(.+)?$/)

    .addSubEvent("tick", () => waypoints.forEach(it => it.update()))

    .addSubEvent("renderWorld", () => {
        const [r, g, b, a] = Settings().wpColor
        waypoints.forEach(it => {
            const {x, y, z} = it.loc
            /** todo: isboundingboxinfrustrum */
            RenderUtil.renderWaypoint(it.text, x, y, z, r, g, b, a, true)
        })
    })

class Waypoint {
    constructor(key, title, x, y, z, extraText = "", lifespan = Settings().wpTime) {
        this.key = key
        this.title = title
        this.loc = new Vec3i(~~x - 0.5, ~~y, ~~z - 0.5)
        this.dist = ~~this.loc.distance(Player.asPlayerMP().getPos())
        this.extraText = (extraText = extraText.trim()) && `\n${extraText}`
        this.text = this.formatText()

        waypoints.set(key, this)
        scheduleTask(() => this.remove(), new Second(lifespan))

        ChatWaypoints.register()
    }

    remove() {
        ChatWaypoints.unregister()

        if (waypoints.delete(this.key) && waypoints.size) ChatWaypoints.register()
    }

    update() {
        if (this.dist < 5) return this.remove()

        this.dist = ~~this.loc.distance(Player.asPlayerMP().getPos())
        this.text = this.formatText()
    }

    formatText() {
        return `${this.title} §b[${ this.dist }m]${this.extraText}`
    }
}