/** 
 * Adaptation based upon:
 * @author DocilElm
 * @license {GNU-GPL-3} https://github.com/DocilElm/Doc/blob/main/LICENSE
 * @credit https://github.com/DocilElm/Doc/blob/main/core/Feature.js
 */

import Settings from "../../data/Settings";
import Location from "../../utils/Location"
import Event from "../Events/Event";

export default class Feature {
    /** @override Listener function that's called when this [Feature] is registered */ onRegister;
    /** @override Listener function that's called when this [Feature] is registered */ onUnregister;

    /**
     * - Utility that handles registering various events and listeners to make complex, functional, and performative features
     * - Class can be used with or without requiring the settings, worlds, or zones fields depending on the intended functionality
     * 
     * @param {Object} obj
     * @param {String} obj.setting The main config name: If null -> Feature is always active, If setting returns false -> all events of this feature will be unregistered
     * @param {String[]|String} obj.worlds The world(s) where this feature should activate: If null -> Feature is not world dependent
     * @param {String[]|String} obj.zones The zones(s) where this feature should activate: If null -> Feature is not zone dependent
     */
    constructor({
        setting = null,
        worlds = null,
        zones = null
    } = {}) {
        // Feature should listen for setting changes if required
        if (setting in Settings()) {
            this.setting = setting
            this.settingValue = Settings()[setting]
    
            Settings().getConfig().registerListener(setting, (_, val) => {
                this.settingValue = val
                this._updateRegister()
            })
        }

        // Feature should be updated when the area changes
        if (worlds) this.worlds = Array.isArray(worlds) ? worlds : Array(worlds)
        Location.registerWorldChange(() => this._updateRegister())

        if (zones) {
            this.zones = Array.isArray(zones) ? zones : Array(zones)
            Location.registerWorldChange(() => this._updateRegister())
        }
    }

    /**
     * - Adds an [Event] that is registered as long as the Feature is
     * @param {String|com.chattriggers.ctjs.triggers.Trigger|net.minecraftforge.fml.common.eventhandler.Event} triggerType
     * @param {Function} methodFn
     * @param {any} args
     * @returns {this} meth chain
     */
    addEvent(triggerType, methodFn, args) {
        if (!("events" in this)) this.events = []
        this.events.push(new Event(triggerType, methodFn, args, false))

        return this
    }

    /**
     * - Adds a (conditional Event) aka [SubEvent] that is (un)registered by the main events
     * @param {String} triggerType
     * @param {(...args) => void} methodFn
     * @param {any} args
     * @param {() => Boolean} condition The function to check if this subEvent should be (un)registered
     * @returns {this} meth chain
     */
    addSubEvent(triggerType, methodFn, args, condition = () => true) {
        if (!("subEvents" in this)) {
            this.subEvents = []
            this.updateSubEvents = () => this.subEvents.forEach(([subEvent, condition]) => condition() ? subEvent.register() : subEvent.unregister())
            this.unregisterSubEvents = () => this.subEvents.forEach(([subEvent]) => subEvent.unregister())
        }

        this.subEvents.push([new Event(triggerType, methodFn, args, false), condition])
        return this
    }

    /**
     * - Updates the Feature based on the setting, world, and zone criteria
     * @note Location#inWorld and Location#inZone return true if param is nullish
     * @returns {this} meth chain
     */
    _updateRegister() {
        if (this.setting && !this.settingValue) return this._unregister()
        if (!(Location.inWorld(this.worlds) && Location.inZone(this.zones))) return this._unregister()
        
        return this._register()
    }

    /**
     * - UnRegisters all strung [Events] including subEvents
     * @returns {this} meth chain
     */
    _unregister() {
        if (!this.isRegistered) return this
        this.isRegistered = false
        
        this.events?.forEach(event => event.unregister())
        this.unregisterSubEvents?.()
        this.onUnregister?.()
    
        return this
    }

    /**
     * - UnRegisters all strung [Events] including subEvents
     * @returns {this} meth chain
     */
    _register() {
        if (this.isRegistered) return this
        this.isRegistered = true
        
        this.events?.forEach(event => event.register())
        this.updateSubEvents?.()
        this.onRegister?.()
    
        return this
    }
}