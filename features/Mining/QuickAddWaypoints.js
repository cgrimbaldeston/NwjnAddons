import settings from "../../config"
import { PREFIX } from "../../utils/constants"
import { registerWhen } from "../../utils/functions"
import WorldUtil from "../../utils/world"

const data = JSON.parse(FileLib.read("NwjnAddons/features/Mining", "MineshaftWaypointsData.json"))
const routes = JSON.parse(FileLib.read("NwjnAddons/features/Mining","Routes.json"))
let currentRoom;

//Basically the same function as the Mineshaft waypoints.  
function findshaftType() {
    const scoreboard = Scoreboard.getLines()
    const line = scoreboard[scoreboard.length - 1]?.toString()?.removeFormatting()?.slice(-5)
  
    const material = line?.slice(0, -1)
    const type = line?.endsWith("2") ? "Crystal" : line
  
    if (type in data.rooms && material in data.names) {
      currentRoom = data.rooms[type]
      const name = data.names[material]
    
      const formatName = type === "Crystal" ? `${name} Crystal` : name
      ChatLib.chat(`${PREFIX}: ${formatName}`)
      
      const route = routes.rooms[type].Route
      if (!route) {
        ChatLib.chat(`${PREFIX} No route found for ${formatName}`)
        return
      }
      else{
        output()
      }
    }   
}

function output(){
  // Create a message component for copying waypoints
  new TextComponent(`${PREFIX} Click here to copy waypoints for ${formatName} to clipboard`)
  .setClick("run_command", `/ct copy ${JSON.stringify(route)}`)
  .setHover("show_text", "Click to copy waypoints to clipboard")
  .chat()

  //load waypoint button using coleweight.
  new TextComponent(` §8[§bCw Load§8]`)
  .setClick("run_command", `/cw ordered load`)
  .setHover("show_text", "Click to load waypoints")
  .chat()


  //load waypoint button using soopy
  new TextComponent(` §4[§bsoopy Load§4]`)
  .setClick("run_command", `/loadwaypoints`)
  .setHover("show_text", "Click to load waypoints")
  .chat()
}

registerWhen(register("step", () => {
    if (!currentRoom) findshaftType()
}).setDelay(1), () => WorldUtil.worldIs("Mineshaft") && settings.QuickAddWaypoints)


onWorldLeave(() => {
  currentRoom = undefined
})