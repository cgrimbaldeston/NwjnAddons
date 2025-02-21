/** 
 * Virtually entire class taken from:
 * @author DocilElm
 * @license {GNU-GPL-3} https://github.com/DocilElm/Doc/blob/main/LICENSE
 * @credit https://github.com/DocilElm/Doc/blob/main/shared/Location.js
 */

import Event from "../libs/Events/Event"
import TextUtil from "../core/static/TextUtil"

export default new class Location {
  constructor() {
    this.worldListeners = []
    this.zoneListeners = []

    new Event("tabAdd", (world) => this._triggerWorldEvents(world), /^(?:Area|Dungeon): (.+)$/)
    new Event("sidebarChange", (zone) => this._triggerZoneEvents(zone), /^ [⏣ф] (.+)$/)
    new Event("worldUnload", () => this._triggerWorldEvents(), this._triggerZoneEvents())

    // For CT Reload while playing
    if (World.isLoaded()) {
      TabList.getNames().find(it => {
        [it] = TextUtil.getMatches(/^(?:Area|Dungeon): (.+)$/, it.removeFormatting())
        return it ? this._triggerWorldEvents(it) : false
      })
      Scoreboard.getLines().find(it => {
        [it] = TextUtil.getMatches(/^ [⏣ф] (.+)$/, it.getName().removeFormatting().replace(/[^\w\s]/g, "").trim())
        return it ? this._triggerZoneEvents(it) : false
      })
    }
  }

  onWorldChange = (fn) => this.worldListeners.push(fn)
  
  onZoneChange = (fn) => this.zoneListeners.push(fn)

  /** @returns {Boolean} */
  inWorld(world) {
    if (Array.isArray(world)) return world.includes(this.world)
    if (typeof(world) === "string") return world === this.world
    return true
  }

  /** @returns {Boolean} */
  inZone(zone) {
    if (Array.isArray(zone)) return zone.includes(this.zone)
    if (typeof(zone) === "string") return zone === this.zone
    return true
  }

  _triggerWorldEvents(world) {
    this.world = world
    this.worldListeners.forEach(fn => fn(world))
  }

  _triggerZoneEvents(zone) {
    this.zone = zone
    this.zoneListeners.forEach(fn => fn(zone))
  }
}