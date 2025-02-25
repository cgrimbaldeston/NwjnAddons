import Feature from "../../libs/Features/Feature";
import { notify } from "../../core/static/TextUtil";
import Settings from "../../data/Settings";
import Waypoint from "../../libs/Render/TempWaypoint";

/** @todo make a quick check for vang which immediately checks for a gold block at a coord relative to the player's location */
new class MineshaftWaypoints extends Feature {
    constructor() {
        super({
            setting: "mineshaftWaypoints",
            zones: "Glacite Mineshafts"
            // Does not use Mineshaft as world because the scoreboard check is always triggered before it
        })

        this
            .addEvent("sidebarChange", (id, material, type) => {
                if (this.hasChecked) return
                if (type != 2 && !(id in this.data.rooms)) return
                this.hasChecked = true

                const room = this.data.rooms[type == 2 ? type : id]
                room.corpses.forEach(([x, y, z]) => 
                    this.waypoints.add(
                        new Waypoint("§cGuess", null, x, y, z, 5, null)
                    )
                )

                const [ex, ey, ez] = room.exit
                this.waypoints.add(
                    new Waypoint("§bExit", null, ex, ey, ez, null, null)
                )
                
                const name = this.data.names[material]
                const formatName = type == 2 ? `${name} Crystal` : name
        
                notify(formatName)
                this.updateSubEvents()
            }, / (([A-Z]{4})(1|2))$/)
        
            .addSubEvent("interval", () => 
                this.waypoints.forEach(it => 
                    it.dirty ? this.waypoints.delete(it) : it.update()
                ), 
            1 / 5)
            
            .addSubEvent("renderWorld", () => 
                this.waypoints.forEach(it => 
                    !it.dirty && it.render([255, 0, 0, 255])
                )
            )
    }

    onEnabled() {
        this.data = JSON.parse(FileLib.read("NwjnAddons", "features/Mining/MineshaftWaypointsData.json"))
    }

    onDisabled() {
        this.data = null
    }

    onRegister() {
        this.waypoints = new Set()
    }

    onUnregister() {
        this.hasChecked = null
        this.waypoints = null
    }
}