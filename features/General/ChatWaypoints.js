import Feature from "../../core/Feature";
import { Event } from "../../core/Event";
import EventEnums from "../../core/EventEnums";
import { scheduleTask } from "../../core/CustomRegisters";
import Settings from "../../Settings";
import { RenderHelper } from "../../utils/RenderHelper";
import { getPlayerName } from "../../utils/functions";
import { TextHelper } from "../../utils/TextHelper";
import { data } from "../../utils/data/Data";

const waypoints = new Map()
const feat = new Feature("waypoint")
  .addEvent(
    new Event(EventEnums.CLIENT.CHAT, (prefix, x, y, z) => {
      prefix = prefix.addColor()
      const ign = getPlayerName(prefix.removeFormatting()).toLowerCase()
      
      if (data.blacklist.includes(ign)) return scheduleTask(() => ChatLib.chat(`${TextHelper.PREFIX} &4Blacklisted waypoint from &c${ign}`))

      const coords = [parseInt(x), parseInt(y), parseInt(z)]
      waypoints.set(prefix, coords)

      feat.update()

      scheduleTask(() => {
        waypoints.delete(prefix)
        feat.update()
      }, Settings().wpTime * 20)
    }, /^(.+):.+x: ([\-\d\.]+), y: ([\-\d\.]+), z: ([\-\d\.]+)(?: .+)?&r$/)
  )
  .addSubEvent(
    new Event("renderWorld", () => {
      waypoints.forEach(([x, y, z], prefix) => {
        const distance = ~~Player.asPlayerMP().distanceTo(x, y, z)

        RenderHelper.renderWaypoint(`${prefix} §b[${distance}m]`, x, y, z, ...Settings().wpColor, true)
      })
    }),
    () => waypoints.size
  )
  .onUnregister(() => {
    waypoints.clear()
  })