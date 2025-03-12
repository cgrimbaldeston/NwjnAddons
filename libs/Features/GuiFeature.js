/** 
 * Adaptation based upon:
 * @author DocilElm
 * @license {GNU-GPL-3} https://github.com/DocilElm/Doc/blob/main/LICENSE
 * @credit https://github.com/DocilElm/Doc/blob/main/shared/DraggableGui.js
 */

import Feature from "./Feature";
import { data } from "../../data/Data";
import ElementUtils from "../../../DocGuiLib/core/Element"
import { CenterConstraint, CramSiblingConstraint, ScrollComponent, UIRoundedRectangle, UIText, OutlineEffect, Window, SubtractiveConstraint, ScaledTextConstraint, UIBlock, ConstantColorConstraint, AlphaAspectColorConstraint, MousePositionConstraint, AspectConstraint, TextAspectConstraint, ScaleConstraint, RelativeConstraint } from "../../../Elementa"
import { addCommand } from "../../utils/Command"
import Settings from "../../data/Settings"

const GuiEditor = new Gui()
const Windex = new Window()
const Features = new Set()

const Overlay = register("renderOverlay", () => Features.forEach(feat => feat.draw()))
GuiEditor.registerOpened(() => Overlay.unregister())
GuiEditor.registerClosed(() => Overlay.register())
GuiEditor.registerClicked((x, y, b) => Windex.mouseClick(x, y, b))
GuiEditor.registerMouseReleased(() => Windex.mouseRelease())
GuiEditor.registerMouseDragged((x, y) => Features.forEach(feat => feat.isEditing && feat.onMouseDrag(x, y)))
GuiEditor.registerScrolled((x, y, d) => Windex.hitTest(x, y)?.mouseScroll(d))
GuiEditor.registerDraw(() => Features.forEach(feat => feat.draw()))

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
            x: Renderer.screen.getWidth() * Math.random() * 0.9, 
            y: Renderer.screen.getHeight() * Math.random() * 0.9, 
            scale: 1.5
        }

        const color = `${this.setting}Color`
        if (color in Settings) {
            this.Color = Settings[color]
            Settings.getConfig().registerListener(color, (_, val) => this.Color = val)
        }

        this.component = new UIRoundedRectangle(3)
            .setX(this.data.x.pixels())
            .setY(this.data.y.pixels())
            .enableEffect(new OutlineEffect(ElementUtils.getJavaColor([255, 255, 255, 80]), 1, true))

            .onMouseClick(_ => this.isEditing = true)
            .onMouseRelease(_ => this.isEditing = false)
            .onMouseScroll((_, {delta}) => this.setScale(this.data.scale + delta * 0.05))
            .setColor(ElementUtils.getJavaColor([0, 0, 0, 160]))
            .setChildOf(Windex)
            
        this.setText(this.defaultText)
        Features.add(this)
    }

    onMouseDrag(x, y) {
        this.setX(x)
        this.setY(y)
    }

    setText(text) {
        this.text = text
        this.setWidth(Renderer.getStringWidth(this.text) * this.data.scale)
        this.setHeight(10 * this.data.scale)
    }

    setScale(number) {
        this.data.scale = number
        this.setWidth(Renderer.getStringWidth(this.text) * this.data.scale)
        this.setHeight(10 * this.data.scale)
    }

    setX(number) {
        this.data.x = number
        this.component.setX(number.pixels())
    }

    setY(number) {
        this.data.y = number
        this.component.setY(number.pixels())
    }

    setWidth(number) {
        this.component.setWidth(number.pixels())
    }

    setHeight(number) {
        this.component.setHeight(number.pixels())
    }

    draw() {
        this.component.draw()
        
        Renderer.translate(
            this.data.x, 
            this.data.y + (this.component.getHeight() - 9) / 5
        )
        Renderer.scale(this.data.scale, this.data.scale)
        if (this.Color) Renderer.colorize(...this.Color)
        Renderer.drawStringWithShadow(this.text, 0, 0)
    }
}

addCommand("gui", "Opens the Editor Gui", () => {
    GuiEditor.open()
})