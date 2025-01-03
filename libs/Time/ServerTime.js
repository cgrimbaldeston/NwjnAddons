import Tick from "./Tick"
import Second from "./Second"

/** @returns {Tick|Second|Number} */
const normalize = (val) => {
    if (val instanceof Tick) return val
    if (val instanceof Second) return Tick.fromSeconds(val)
    else return new Tick(val)
}

/** @type {Map<Symbol, Tick>} */
const scheduledTasks = new Map()
/**
 * @param {Function} onEnd
 * @param {Tick|Second} delay
 */
export const scheduleTask = (onEnd, delay = new Tick(1)) => {
    const id = onEnd.toString()
    const tick = normalize(delay)
        .atTick(0, () => {
            scheduledTasks.delete(id)
            onEnd()
        })
    
    scheduledTasks.set(id, tick)
}


/** @type {Map<Symbol, Tick>} */
const countdowns = new Map()

/**
 * @param {Function} onTick
 * @param {Tick|Second} lifespan
 */
export const addCountdown = (onTick, lifespan) => {
    const id = onTick.toString()
    const tick = normalize(lifespan)
        .onChange(onTick)
        .atTick(0, () => countdowns.delete(id))
    
    countdowns.set(id, tick)
}


/** @type {Map<Symbol, Tick>} */
const timers = new Map()
/**
 * @param {Function} onTick
 * @param {Number} start
 */
export const addTimer = (onTick, start = new Tick(0)) => {
    const id = onTick.toString()
    const tick = normalize(start)
        .onChange(onTick)

    timers.set(id, tick)
}


const history = Array(5)
let tick = 0, lastSec = 0

export const getTPS = () => MathLib.clampFloat(history.reduce((a,b) => a+b) / 5, 0, 20).toFixed(2)
const _updateTPS = () => {
    if (tick++ % 20) return
    const ticked = 20000 / (-lastSec + (lastSec = Date.now()))
    history.push(ticked)
    history.shift()
}

register("packetReceived", (packet) => {
    if (packet.func_148890_d() > 0) return

    scheduledTasks.forEach(tick => tick.value--)
    countdowns.forEach(tick => tick.value--)
    timers.forEach(tick => tick.value++)
    _updateTPS()
}).setFilteredClass(net.minecraft.network.play.server.S32PacketConfirmTransaction)