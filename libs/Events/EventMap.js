/** 
 * Virtually entire file taken from:
 * @author DocilElm
 * @license {GNU-GPL-3} https://github.com/DocilElm/Doc/blob/main/LICENSE
 * @credit https://github.com/DocilElm/Doc/blob/main/core/EventEnums.js
 */

import TextUtil from "../../core/static/TextUtil"

const S38PacketPlayerListItem = net.minecraft.network.play.server.S38PacketPlayerListItem

/** @type {HashMap<String, Function>} */
const map = new HashMap()

const createEvent = (triggerType, method) => map.put(triggerType.toUpperCase(), method)

createEvent("interval", (fn, interval) => {
    const reg = register("step", fn)

    if (interval >= 1) return reg.setDelay(interval)
    return reg.setFps(1 / interval)
})

createEvent("packetSent", (fn, clazz) => register("packetSent", fn).setFilteredClass(clazz))
createEvent("packetReceived", (fn, clazz) => register("packetReceived", fn).setFilteredClass(clazz))

createEvent("serverTick", (fn) => 
    register("packetReceived", (packet) => packet./* getWindowId */func_148890_d() <= 0 && fn())
        .setFilteredClass(net.minecraft.network.play.server.S32PacketConfirmTransaction)
)

createEvent("spawnObject", (fn) =>
    register("packetReceived", (packet, event) => 
        fn(packet.func_148993_l(), event)
    ).setFilteredClass(net.minecraft.network.play.server.S0EPacketSpawnObject)
)

createEvent("serverChat", (fn, criteria = "") => 
    register("packetReceived", (packet, event) => {
        // Check if the packet is for the actionbar
        if (packet.func_148916_d()) return

        const chatComponent = packet.func_148915_c()        
        const formatted = chatComponent?.func_150254_d()
        const unformatted = formatted?.removeFormatting()
    
        if (!unformatted) return
        
        TextUtil.matchesCriteria(fn, criteria, unformatted, event, formatted, chatComponent)
    }).setFilteredClass(net.minecraft.network.play.server.S02PacketChat)
)

createEvent("actionBarChange", (fn, criteria) => 
    register("packetReceived", (packet, event) => {
        if (!packet["isChat", "func_148916_d"]()) return

        const chatComponent = packet["getChatComponent", "func_148915_c"]()
        const formatted = chatComponent["getFormattedText", "func_150254_d"]()
        const unformatted = formatted.removeFormatting()
        
        if (!unformatted) return
        
        TextUtil.matchesCriteria(fn, criteria, unformatted, event, formatted, chatComponent)
    }).setFilteredClass(net.minecraft.network.play.server.S02PacketChat)
)

createEvent("sideBarChange", (fn, criteria) => 
    register("packetReceived", (packet, event) => {
        const channel = packet.func_149307_h()

        if (channel !== 2) return

        const teamStr = packet.func_149312_c()
        const teamMatch = teamStr.match(/^team_(\d+)$/)

        if (!teamMatch) return

        const formatted = packet.func_149311_e().concat(packet.func_149309_f())
        const unformatted = formatted.removeFormatting()

        if (!unformatted) return
        
        TextUtil.matchesCriteria(fn, criteria, unformatted, event, formatted)
    }).setFilteredClass(net.minecraft.network.play.server.S3EPacketTeams)
)

createEvent("tabAdd", (fn, criteria) => 
    register("packetReceived", (packet, event) => {
        const players = packet.func_179767_a() // .getPlayers()
        const action = packet.func_179768_b() // .getAction()

        if (action !== S38PacketPlayerListItem.Action.ADD_PLAYER) return

        players.forEach(addPlayerData => {
            const name = addPlayerData.func_179961_d() // .getDisplayName()
            
            if (!name) return
            const formatted = name.func_150254_d() // .getFormattedText()
            const unformatted = formatted.removeFormatting()
        
            if (action !== S38PacketPlayerListItem.Action.ADD_PLAYER) return

            TextUtil.matchesCriteria(fn, criteria, unformatted, event, formatted)
        })
    }).setFilteredClass(S38PacketPlayerListItem)
)

createEvent("worldSound", (fn, criteria) => 
    register("packetReceived", (packet, event) => {
        const name = packet.func_149212_c()

        TextUtil.matchesCriteria(fn, criteria, name, event)
    }).setFilteredClass(net.minecraft.network.play.server.S29PacketSoundEffect)
)

createEvent("containerClick", (fn) => 
    register("packetSent", (packet) => {
        // Container name, Slot clicked
        fn(Player.getContainer().getName(), packet.func_149544_d())
    }).setFilteredClass(net.minecraft.network.play.client.C0EPacketClickWindow)
)

export const getEvent = (triggerType, method, args) => {
    if (triggerType instanceof com.chattriggers.ctjs.triggers.Trigger) return triggerType.unregister()

    const type = typeof(triggerType) === "string" ? triggerType.toUpperCase() : triggerType

    const trigger =
        map.containsKey(type) ?
        map.get(type)(method, args) :
        register(type, method)
    
    return trigger.unregister()
}