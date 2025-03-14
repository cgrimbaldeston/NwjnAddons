import { addCommand } from "../../utils/Command"
const FontRenderer = Renderer.getFontRenderer()

const GuiFeatures = new Set()

const EditorGui = new Gui()
addCommand("gui", "Opens the Editor Gui", () => EditorGui.open())

// Editing Handlers
const Dragger = register("dragged", ((dX, dY, mX, mY) => {
    const feat = GuiFeatures.find(feat => feat.isInBounds(mX, mY))
    if (!feat) return

    feat.data.x += dX
    feat.data.y += dY
})).unregister()
EditorGui.registerScrolled((x, y, delta) => {
    const feat = GuiFeatures.find(feat => feat.isInBounds(x, y))
    if (!feat) return

    feat.data.scale += parseFloat((delta * 0.025).toFixed(3))
})

// Rendering Handlers
const Overlay = register("renderOverlay", () => GuiFeatures.forEach(feat => feat.isRegistered && feat.draw(FontRenderer)))
EditorGui.registerOpened(() => {
    Overlay.unregister()
    Dragger.register()
})
EditorGui.registerClosed(() => {
    Overlay.register()
    Dragger.unregister()
})
EditorGui.registerDraw(() => GuiFeatures.forEach(feat => feat.draw(FontRenderer)))

export default function addFeature(GuiFeature) {
    GuiFeatures.add(GuiFeature)
}