import { Window, UIRoundedRectangle, OutlineEffect } from "../../../Elementa"
import { addCommand } from "../../utils/Command"
const JavaColor = java.awt.Color

const Windex = new Window()
const GuiFeatures = new Set()

const EditorGui = new Gui()
addCommand("gui", "Opens the Editor Gui", () => EditorGui.open())

// Editing Handlers
EditorGui.registerClicked((x, y, b) => Windex.mouseClick(x, y, b))
EditorGui.registerMouseDragged((x, y) => GuiFeatures.forEach(feat => feat.isEditing && feat.dragMouse(x, y)))
EditorGui.registerMouseReleased(() => Windex.mouseRelease())
EditorGui.registerScrolled((x, y, d) => Windex.hitTest(x, y)?.mouseScroll(d))

// Rendering Handlers
const Overlay = register("renderOverlay", () => GuiFeatures.forEach(feat => feat.isRegistered && feat.draw()))
EditorGui.registerOpened(() => Overlay.unregister())
EditorGui.registerClosed(() => Overlay.register())
EditorGui.registerDraw(() => GuiFeatures.forEach(feat => feat.draw()))

export function createOverlayForFeature(GuiFeature) {
    const Data = GuiFeature.data
    const Component = new UIRoundedRectangle(3)
        .setX(Data.x.pixels())
        .setY(Data.y.pixels())
        .enableEffect(new OutlineEffect(new JavaColor(1, 1, 1, 0.3), 1))

        .onMouseClick(_ => GuiFeature.isEditing = true)
        .onMouseRelease(_ => GuiFeature.isEditing = false)
        .onMouseScroll((_, {delta}) => {
            Data.scale += (delta * 0.025)

            Component.setWidth((Renderer.getStringWidth(GuiFeature.text) * Data.scale).pixels())
            Component.setHeight((10 * Data.scale).pixels())
        })

        .setColor(new JavaColor(0, 0, 0, 0.63))
        .setChildOf(Windex)
        
    GuiFeature.dragMouse = (x, y) => {
        Component.setX((Data.x = x).pixels())
        Component.setY((Data.y = y).pixels())
    }

    GuiFeature.setText = (text) => {
        GuiFeature.text = text
        
        Component.setWidth((Renderer.getStringWidth(text) * Data.scale).pixels())
        Component.setHeight((10 * Data.scale).pixels())
    }

    GuiFeature.draw = () => {
        Component.draw()
    
        Renderer.translate(
            Data.x, 
            Data.y + (Component.getHeight() - 9) / 5
        )
        Renderer.scale(Data.scale, Data.scale)

        if (GuiFeature.Color) Renderer.colorize(...GuiFeature.Color)

        if (EditorGui.isOpen() && !GuiFeature.text) Renderer.drawStringWithShadow(GuiFeature.defaultText, 0, 0)
        else Renderer.drawStringWithShadow(GuiFeature.text, 0, 0)
    }

    GuiFeature.setText(GuiFeature.defaultText)
    GuiFeatures.add(GuiFeature)
}