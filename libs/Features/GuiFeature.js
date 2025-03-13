/** 
 * Adaptation based upon:
 * @author DocilElm
 * @license {GNU-GPL-3} https://github.com/DocilElm/Doc/blob/main/LICENSE
 * @credit https://github.com/DocilElm/Doc/blob/main/shared/DraggableGui.js
 */

import Feature from "./Feature"
import { data } from "../../data/Data"
import Settings from "../../data/Settings"
import { createOverlayForFeature } from "./GuiEditor"

export default class GuiFeature extends Feature {
    /**
     * - Extension of [Feature] for features that include gui elements
     * 
     * @param {Object|Feature} obj If passed in as a child of this, uses the name of this child and return it
     * @param {String|null} obj.setting The main config name: If null -> Feature is always active, If setting returns false -> all events of this feature will be unregistered
     * @param {String[]|String|null} obj.worlds The world(s) where this feature should activate: If null -> Feature is not world dependent
     * @param {String[]|String|null} obj.zones The zones(s) where this feature should activate: If null -> Feature is not zone dependent

     * @param {String?} obj.defaultText The text to shown in the editor if the feature's text is blank
    */
    constructor(obj = {}) {
        super(obj)

        // Get gui pos from data or create new one, then return that reference to the original data and the reference within this class
        this.data = data[this.setting] ??= {
            x: ~~(Renderer.screen.getWidth() * Math.random() * 0.9), 
            y: ~~(Renderer.screen.getHeight() * Math.random() * 0.9), 
            scale: 1.5
        }

        const color = `${this.setting}Color`
        if (color in Settings) {
            this.Color = Settings[color]
            Settings.getConfig().registerListener(color, (_, val) => this.Color = val)
        }

        createOverlayForFeature(this)
    }
}