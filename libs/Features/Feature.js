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
    /** @override Function called when this is registered */ onRegister() {}
    /** @override Function called when this is unregistered */ onUnregister() {}
    /** @override Function called when this is enabled by setting */ onEnabled(previousValue) {}
    /** @override Function called when this is disabled by setting */ onDisabled(previousValue) {}

    /**
     * - Utility that handles registering various events and listeners to make complex, functional, and performative features
     * - Class can be used with or without requiring the settings, worlds, or zones fields depending on the intended functionality
     * 
     * @param {Object|Feature} obj If passed in as a child of this, uses the name of this child and return it
     * @param {String|null} obj.setting The main config name: If null -> Feature is always active, If setting returns false -> all events of this feature will be unregistered
     * @param {String[]|String|null} obj.worlds The world(s) where this feature should activate: If null -> Feature is not world dependent
     * @param {String[]|String|null} obj.zones The zones(s) where this feature should activate: If null -> Feature is not zone dependent
     */
    constructor(obj = {}) {
        if (obj.constructor.name !== "Object") obj.setting = obj.constructor.name
        
        this.setting = obj.setting
        this.worlds = obj.worlds
        this.zones = obj.zones
        this.isRegistered = false

        // Main setting enables/disables entire [Feature]
        if (this.setting in Settings) {
            this.isSettingEnabled = Settings[this.setting]
            // Waits for Features to actually define their listener functions
            Client.scheduleTask(2, () => this.isSettingEnabled ? this.onEnabled(Settings[this.setting]) : this.onDisabled())
    
            Settings.getConfig().registerListener(this.setting, (_, val) => {
                this.isSettingEnabled = val
                this.isSettingEnabled ? this.onEnabled(val) : this.onDisabled()
                this._updateRegister()
            })
        }

        // Will always update on world changes
        Location.onWorldChange(() => this._updateRegister())
        if (this.zones) Location.onZoneChange(() => this._updateRegister())

        Client.scheduleTask(2, () => this._updateRegister())
    }

    /**
     * - Runs the condition function when [Feature] is update and registers if condition passes
     * - Inits subEvent dependencies if called for the first time
     */
    addEvent(triggerType, methodFn, args) {
        if (!("events" in this)) {
            this.events = []
            this.registerEvents = () => this.events.forEach(event => event.register())
            this.unregisterEvents = () => this.events.forEach(event => event.unregister())
        }
        this.events.push(new Event(triggerType, methodFn, args, false))

        this._updateRegister()
        return this
    }

    /**
     * - Runs the condition function when [Feature] is update and registers if condition passes
     * - Inits subEvent dependencies if called for the first time
     */
    addSubEvent(triggerType, methodFn, args, condition = () => true) {
        if (!("subEvents" in this)) {
            this.subEvents = []
            this.updateSubEvents = () => this.subEvents.forEach(([subEvent, condition]) => condition() ? subEvent.register() : subEvent.unregister())
            this.unregisterSubEvents = () => this.subEvents.forEach(([subEvent]) => subEvent.unregister())
        }
        this.subEvents.push([new Event(triggerType, methodFn, args, false), condition])

        this._updateRegister()
        return this
    }

    /**
     * - Updates registers based on setting, world, and zone criteria of this [Feature]
     * - Location#inWorld and Location#inZone return true if param is nullish
     */
    _updateRegister() {
        if (("isSettingEnabled" in this) && !this.isSettingEnabled) return this._unregister()
        if (!(Location.inWorld(this.worlds) && Location.inZone(this.zones))) return this._unregister()
        
        return this._register()
    }

    /** UnRegisters all strung [Events] including [SubEvents] */
    _unregister() {
        if (!this.isRegistered) return this.isRegistered = false
        this.isRegistered = false
        
        this.unregisterEvents?.()
        this.unregisterSubEvents?.()
        this.onUnregister()
    }

    /** Registers all strung [Events] and updates [SubEvents] */
    _register() {
        if (this.isRegistered) return this.isRegistered = true
        this.isRegistered = true
        
        this.registerEvents?.()
        this.updateSubEvents?.()
        this.onRegister()
    }
}