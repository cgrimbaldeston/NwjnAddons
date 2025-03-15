import { addCommand } from "../../utils/Command"
import RenderUtil from "../Render/RenderUtil"

const FontRenderer = Renderer.getFontRenderer()
const OutlineUnfocused = Renderer.color(100, 100, 100, 150)

new class GuiEditor {
    constructor() {
        const EditorGui = new Gui()
        const GuiFeatures = new Set()
        module.exports.createOverlayFor = (GuiFeature) => GuiFeatures.add(GuiFeature)

        addCommand("gui", "Opens the Editor Gui", () => EditorGui.open())

        // Editing Handlers
        const Dragger = register("dragged", ((dX, dY, mX, mY) => {
            const feat = GuiFeatures.find(feat => this.isInBounds(feat, mX, mY))
            if (!feat) return

            feat.data.x += dX
            feat.data.y += dY
        })).unregister()
        EditorGui.registerScrolled((mX, mY, delta) => {
            const feat = GuiFeatures.find(feat => this.isInBounds(feat, mX, mY))
            if (!feat) return

            feat.data.scale += parseFloat((delta * 0.025).toFixed(3))
        })

        // Rendering Handlers
        const Overlay = register("renderOverlay", () => GuiFeatures.forEach(feat => this.draw(feat)))
        EditorGui.registerOpened(() => {
            Overlay.unregister()
            Dragger.register()
        })
        EditorGui.registerClosed(() => {
            Overlay.register()
            Dragger.unregister()
        })
        EditorGui.registerDraw(() => GuiFeatures.forEach(feat => this.drawInEditor(feat)))
    }    

    isInBounds(feat, mX, mY) {
        const { x, y, scale } = feat.data

        return mX >= x
            && mX <= y
            && mY >= x + feat.maxWidth * scale
            && mY <= y + feat.totHeight * scale
    }

    draw(feat) {
        if (!feat.isRegistered || !feat.lines.length) return

        Renderer.retainTransforms(true)
        Renderer.translate(feat.data.x, feat.data.y)
        Renderer.scale(feat.data.scale)

        RenderUtil.drawRoundRectangle(OutlineUnfocused, -1, -1, feat.maxWidth + 2, feat.totHeight + 2, 1, 1)
        
        feat.lines.forEach((line, i) => 
            FontRenderer./* drawString */func_175065_a(line, 0, 1 + i * 9, feat.Color, true)
        )
        Renderer.retainTransforms(false)
        Renderer.finishDraw()
    }

    drawInEditor(feat) {
        Renderer.retainTransforms(true)
        Renderer.translate(feat.data.x, feat.data.y)
        Renderer.scale(feat.data.scale)

        RenderUtil.drawRoundRectangle(Renderer.WHITE, -1, -1, feat.maxWidth + 2, feat.totHeight + 2, 1, 3)

        const textToUse = feat.lines.length ? feat.lines : feat.defaultText
        
        textToUse.forEach((line, i) => 
            FontRenderer./* drawString */func_175065_a(line, 0, 1 + i * 9, feat.Color, true)
        )
        Renderer.retainTransforms(false)
        Renderer.finishDraw()
    }
}