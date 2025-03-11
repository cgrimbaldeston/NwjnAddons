/** 
 * Adaptation based upon:
 * @author DocilElm
 * @license {GNU-GPL-3} https://github.com/DocilElm/Doc/blob/main/LICENSE
 * @credit https://github.com/DocilElm/Doc/blob/main/shared/DraggableGui.js
 */

import Feature from "./Feature";
import { data } from "../../data/Data";
import ElementUtils from "../../../DocGuiLib/core/Element"
import HandleGui from "../../../DocGuiLib/core/Gui"
import { CenterConstraint, CramSiblingConstraint, ScrollComponent, UIRoundedRectangle, UIText, OutlineEffect, Window, SubtractiveConstraint, ScaledTextConstraint, UIBlock, ConstantColorConstraint, AlphaAspectColorConstraint, MousePositionConstraint, AspectConstraint, TextAspectConstraint, ScaleConstraint, RelativeConstraint } from "../../../Elementa"
import { addCommand } from "../../utils/Command"
import Settings from "../../data/Settings"

const GuiEditor = new Gui()
const Windex = new Window()
const Overlay = register("renderOverlay", () => Windex.draw())
GuiEditor.registerOpened(() => Overlay.unregister())
GuiEditor.registerClosed(() => Overlay.register())
GuiEditor.registerClicked((x, y, b) => Windex.mouseClick(x, y, b))
GuiEditor.registerMouseReleased(() => Windex.mouseRelease())
GuiEditor.registerScrolled((x, y, d) => {
    const comp = Windex.hitTest(x, y)?.parent
    if (comp && comp !== Windex) comp.mouseScroll(d)
})
GuiEditor.registerDraw(() => Windex.draw())

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

        this.boundingBox = new UIRoundedRectangle(3)
            .setX(this.data.x.pixels())
            .setY(this.data.y.pixels())
            .setWidth((Renderer.getStringWidth(this.defaultText) * this.data.scale * 1.05).pixels())
            .setHeight((10 * this.data.scale).pixels())
            .setColor(ElementUtils.getJavaColor([0, 0, 0, 160]))
            .enableEffect(new OutlineEffect(ElementUtils.getJavaColor([255, 255, 255, 80]), 1))
            .setChildOf(Windex)

        this.text = new UIText(this.defaultText, true)
            .setX(new CenterConstraint())
            .setY(new CenterConstraint())
            .setTextScale(this.data.scale.pixels())
            .setColor(ElementUtils.getJavaColor(this.Color))
            .setChildOf(this.boundingBox)

        this.boundingBox
            .onMouseClick(_ => this.boundingBox.setX(new MousePositionConstraint()).setY(new MousePositionConstraint()))
            .onMouseRelease(_ => this.boundingBox.setX((this.data.x = this.boundingBox.getLeft()).pixels()).setY((this.data.y = this.boundingBox.getTop()).pixels()))
            .onMouseScroll((_, {delta}) => {
                this.data.scale += (delta * 0.05)

                this.boundingBox
                    .setWidth((Renderer.getStringWidth(this.text.getText()) * this.data.scale * 1.05).pixels())
                    .setHeight((10 * this.data.scale).pixels())

                // todo: fix int scaling
                this.text
                    .setTextScale(this.data.scale.pixels())
                    .setText(this.text.getText())
            })
    }

    setText(message) {
        this.boundingBox.setWidth((Renderer.getStringWidth(message) * this.data.scale * 1.05).pixels())
        this.text.setText(message)
    }
}

addCommand("gui", "Opens the Editor Gui", () => {
    GuiEditor.open()
})