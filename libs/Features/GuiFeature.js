/** 
 * Adaptation based upon:
 * @author DocilElm
 * @license {GNU-GPL-3} https://github.com/DocilElm/Doc/blob/main/LICENSE
 * @credit https://github.com/DocilElm/Doc/blob/main/shared/DraggableGui.js
 */

import Feature from "./Feature"
import { data } from "../../data/Data"
import Settings from "../../data/Settings"
import addFeature from "./GuiEditor"
import RenderUtil from "../Render/RenderUtil"

export default class GuiFeature extends Feature {
    /**
     * - Extension of [Feature] for features that include gui elements
     * 
     * @param {Object|Feature} obj If passed in as a child of this, uses the name of this child and return it
     * @param {String|null} obj.setting The main config name: If null -> Feature is always active, If setting returns false -> all events of this feature will be unregistered
     * @param {String[]|String|null} obj.worlds The world(s) where this feature should activate: If null -> Feature is not world dependent
     * @param {String[]|String|null} obj.zones The zones(s) where this feature should activate: If null -> Feature is not zone dependent

     * @param {String[]} defaultText The text to shown in the editor if the feature's text is blank
    */
    constructor(obj = {}, defaultText) {
        super(obj)

        // Get gui pos from data or create new one, then return that reference to the original data and the reference within this class
        this.data = data[this.setting] ??= {
            x: ~~(Renderer.screen.getWidth() * Math.random() * 0.5), 
            y: ~~(Renderer.screen.getHeight() * Math.random() * 0.5), 
            scale: 1.5
        }

        const color = `${this.setting}Color`
        if (color in Settings) {
            this.Color = Settings[color]
            Settings.getConfig().registerListener(color, (_, val) => this.Color = val)
        }
        else this.Color = [255, 255, 255, 255]

        this.defaultText = defaultText
        this.lines = []
        this.maxWidth = 0
        this.totHeight = 0

        addFeature(this)
    }

    addLine(text) {
        text = text.addColor()
        this.lines.push(text)

        const width = Renderer.getStringWidth(text)
        if (this.maxWidth < width) this.maxWidth = width
        this.totHeight = this.lines.length * 9
    }

    setLine(text, index = 0) {
        text = text.addColor()
        this.lines[index] = text

        const width = Renderer.getStringWidth(text)
        if (this.maxWidth < width) this.maxWidth = width
        this.totHeight = this.lines.length * 9
    }

    setLines(textArray) {
        this.lines.length = 0
        textArray.forEach(line => this.addLine(line))
    }

    removeText() {
        this.lines.length = 0
    }

    isInBounds(mX, mY) {
        const { x, y, scale } = this.data

        return mX >= x
            && mX <= y
            && mY >= x + this.maxWidth * scale
            && mY <= y + this.totHeight * scale
    }

    draw(fontRenderer) {
        if (!this.isEditing && !this.lines.length) return

        const { x, y, scale } = this.data
        
        Renderer.retainTransforms(true)
        Renderer.translate(x, y)
        Renderer.scale(scale, scale)

        RenderUtil.drawRoundRectangle(Renderer.WHITE, -1, -1, this.maxWidth + 2, this.totHeight + 2, 2, 2)

        const textToUse = this.lines.length ? this.lines : this.defaultText
        const color = Renderer.color(...this.Color)
        
        textToUse.forEach((line, i) => 
            fontRenderer./* drawString */func_175065_a(line, -1, i * 9, color, true)
        )
        Renderer.retainTransforms(false)
        Renderer.finishDraw()
    }
}