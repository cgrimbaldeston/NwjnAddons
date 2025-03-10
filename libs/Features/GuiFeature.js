/** 
 * Adaptation based upon:
 * @author DocilElm
 * @license {GNU-GPL-3} https://github.com/DocilElm/Doc/blob/main/LICENSE
 * @credit https://github.com/DocilElm/Doc/blob/main/shared/DraggableGui.js
 */

import Feature from "./Feature";
import Event from "../Events/Event";
import { data } from "../../data/Data";
import ElementUtils from "../../../DocGuiLib/core/Element"
import HandleGui from "../../../DocGuiLib/core/Gui"
import { CenterConstraint, CramSiblingConstraint, ScrollComponent, UIRoundedRectangle, UIText, OutlineEffect, Window, SubtractiveConstraint, ScaledTextConstraint, UIBlock, ConstantColorConstraint, AlphaAspectColorConstraint, MousePositionConstraint, AspectConstraint, TextAspectConstraint, ScaleConstraint } from "../../../Elementa"
import { addCommand } from "../../utils/Command"
import Settings from "../../data/Settings"

const Editor = new Window()

const GuiFeatures = new Set()

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
            x: Renderer.screen.getWidth() / (GuiFeatures.size + 1), 
            y: Renderer.screen.getHeight() / (GuiFeatures.size + 1), 
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
            .setWidth((Renderer.getStringWidth(this.defaultText) * this.data.scale).pixels())
            .setHeight((9 * this.data.scale).pixels())
            .setColor(ElementUtils.getJavaColor([0, 0, 0, 160]))
            .enableEffect(new OutlineEffect(ElementUtils.getJavaColor([255, 255, 255, 80]), 1))
            .setChildOf(Editor)

        this.text = new UIText(this.defaultText, true)
            .setX(new CenterConstraint())
            .setY(new CenterConstraint())
            .setWidth((Renderer.getStringWidth(this.defaultText) * this.data.scale * 0.95).pixels())
            .setHeight((9 * this.data.scale * 0.9).pixels())
            .setColor(ElementUtils.getJavaColor(this.Color))
            .setChildOf(this.boundingBox)

        this.addSubEvent("renderOverlay", () => this.isSettingEnabled && this.boundingBox.draw())
        // this.boundingBox
        //     .onMouseEnter(() => {
        //         this.boundingBox
        //             .setColor(new ConstantColorConstraint(ElementUtils.getJavaColor(255, 255, 255, 80)))
        //             .enableEffect(new OutlineEffect(ElementUtils.getJavaColor(0, 0, 0, 160), 3))
        //     })
        //     .onMouseLeave(() => {
        //         this.boundingBox
        //             .setColor(new ConstantColorConstraint(ElementUtils.getJavaColor(0, 0, 0, 160)))
        //             .enableEffect(new OutlineEffect(ElementUtils.getJavaColor(255, 255, 255, 80), 3))
        //     })
        //     .onMouseDrag((comp, x, y) => {
        //         this.text
        //             .setX(x)
        //             .setY(y)
        //     })
    }

    /** Automatically un(register) the render event when setting the text */
    setText(message) {
        this.boundingBox.setWidth((Renderer.getStringWidth(message) * this.data.scale).pixels())
        this.text.setText(message)
        
        this.message = message
    }
}


const handler = new HandleGui("data/Scheme.json", "NwjnAddons")
const scheme = handler.getColorScheme()

const bgBox = new UIRoundedRectangle(scheme.Amaterasu.background.roundness)
    .setX(new CenterConstraint())
    .setY(new CenterConstraint())
    .setWidth((30).percent())
    .setHeight((50).percent())
    .setColor(ElementUtils.getJavaColor(scheme.Amaterasu.background.color))
    .enableEffect(new OutlineEffect(ElementUtils.getJavaColor(scheme.Amaterasu.background.outlineColor), scheme.Amaterasu.background.outlineSize))

const bgScrollable = new ScrollComponent("", 5)
    .setX(new CenterConstraint())
    .setY((1).pixels())
    .setWidth((80).percent())
    .setHeight((90).percent())
    .setChildOf(bgBox)

const scrollableSlider = new UIRoundedRectangle(3)
    .setX(new CramSiblingConstraint(2))
    .setY((5).pixels())
    .setHeight((5).pixels())
    .setWidth((5).pixels())
    .setColor(ElementUtils.getJavaColor(scheme.Amaterasu.scrollbar.color))
    .setChildOf(bgBox)

bgScrollable.setScrollBarComponent(scrollableSlider, true, false)

const buttons = new Set()

class ButtonComponent {
    constructor(name, gui) {
        this.bgButtonBox = new UIRoundedRectangle(scheme.Button.background.roundness)
            .setX((1).pixels())
            .setY(new CramSiblingConstraint(5))
            .setWidth((100).percent())
            .setHeight((12).percent())
            .setColor(ElementUtils.getJavaColor(scheme.Button.background.color))
            .enableEffect(new OutlineEffect(ElementUtils.getJavaColor(scheme.Button.background.outlineColor), scheme.Button.background.outlineSize))
            .setChildOf(bgScrollable)
            .onMouseClick((_, event) => {
                if (event.mouseButton === 0) gui.open()
            })

        this.buttonText = new UIText(name)
            .setX(new CenterConstraint())
            .setY(new CenterConstraint())
            .setChildOf(this.bgButtonBox)

        buttons.add(name)
    }
}

addCommand("gui", "Opens the Editor Gui", () => {
    GuiFeatures.forEach((gui) => {
        if (!buttons.has(gui.setting)) new ButtonComponent(gui.setting, gui)
    })

    handler.ctGui.open()
})

handler._drawNormal(bgBox)