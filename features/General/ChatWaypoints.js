import Feature from "../../core/Feature";
import { Event } from "../../core/Event";
import EventEnums from "../../core/EventEnums";
import { scheduleTask, secondsToTick } from "../../utils/Ticker";
import Settings from "../../data/Settings";
import RenderUtil from "../../core/static/RenderUtil";
import TextUtil from "../../core/static/TextUtil";
import { data } from "../../data/Data";
import { addCommand } from "../../utils/Command";

const waypoints = new Map()
const feat = new Feature("waypoint")
  .addEvent(
    new Event(EventEnums.SERVER.CHAT, (prefix, x, y, z, text, event, msg) => {
      const ign = TextUtil.getSenderName(prefix).toLowerCase()
      
      if (data.blacklist.includes(ign)) return TextUtil.append(event.func_148915_c(), "&cBlacklisted")
        
        const title = msg.substring(0, msg.indexOf(":"))
        text = text ? `\n${text}` : ""
        
        const wp = [title, ~~x, ~~y, ~~z, text]
        waypoints.set(ign, wp)
        feat.update()
        
        scheduleTask(() => {
          waypoints.delete(ign)
          feat.update()
        }, secondsToTick(Settings().wpTime))
      
      // Credit: https://github.com/DocilElm/Doc/blob/main/features/misc/ChatWaypoint.js for regex
    }, /^(?:[\w\-]{5})?(?: > )?(?:\[\d+\] .? ?)?(?:\[[^\]]+\] )?(\w{1,16}): x: ([\d\-\.]+), y: ([\d\-\.]+), z: ([\d\-\.]+) ?(.+)?$/)
  )
  .addSubEvent(
    new Event("renderWorld", () => {
      waypoints.forEach(([title, x, y, z, text]) => {
        const distance = ~~Player.asPlayerMP().distanceTo(x, y, z)

        RenderUtil.renderWaypoint(`${ title } §b[${ distance }m]${text}`, x, y, z, ...Settings().wpColor, true)
      })
    }),
    () => waypoints.size
  )
  .onUnregister(() => {
    waypoints.clear()
  })

addCommand("clearwaypoints", "Stops rendering current waypoints", () => {
  waypoints.clear()
  feat.update()
})