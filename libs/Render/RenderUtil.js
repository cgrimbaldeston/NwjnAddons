/** 
 * Largely from:
 * @author DocilElm
 * @license {GNU-GPL-3} https://github.com/DocilElm/Doc/blob/main/LICENSE
 * @credit https://github.com/DocilElm/Doc/blob/main/shared/Render.js
 */

import RenderHelper from "./RenderHelper"
const RenderGlobal = net.minecraft.client.renderer.RenderGlobal
const MCTessellator = net.minecraft.client.renderer.Tessellator./* getInstance */func_178181_a()
const DefaultVertexFormats = net.minecraft.client.renderer.vertex.DefaultVertexFormats
const WorldRenderer = MCTessellator./* getWorldRenderer */func_178180_c()

// From BeaconBeam module
const ResourceLocation = net.minecraft.util.ResourceLocation
const beaconBeam = new ResourceLocation("textures/entity/beacon_beam.png")

export default class RenderUtil {
    /**
     * - Based off DocilElm
     * @param {net.minecraft.util.AxisAlignedBB} aabb 
     * @param {Number} r 
     * @param {Number} g 
     * @param {Number} b 
     * @param {Number} a 
     * @param {Boolean} phase 
     * @param {Number} lineWidth 
     */
    static drawOutlinedAABB(aabb, r, g, b, a, phase = false, lineWidth = 3, checkFrustum = true) {
        if (checkFrustum && !RenderHelper.inFrustum(aabb)) return

        const {rx, ry, rz} = RenderHelper.getRenderPos()

        Tessellator.pushMatrix()
        GlStateManager./* disableCull */func_179129_p()
        Tessellator
            .disableTexture2D()
            .enableBlend()
            .disableLighting()
            .disableAlpha()
            .tryBlendFuncSeparate(770, 771, 1, 0)
            .colorize(r / 255, g / 255, b / 255, a / 255)
        GL11.glLineWidth(lineWidth)
        
        if (phase) Tessellator.disableDepth()

        RenderGlobal./* drawSelectionBoundingBox */func_181561_a(
            aabb
                ./* expand */func_72314_b(0.002, 0.002, 0.002)
                ./* offset */func_72317_d(-rx, -ry, -rz)
        )

        if (phase) Tessellator.enableDepth()
        
        Tessellator
            .disableBlend()
            .enableAlpha()
            .enableTexture2D()
            .colorize(1, 1, 1, 1)
        
            GlStateManager./* enableCull */func_179089_o()
            Tessellator
                .enableLighting()
                .popMatrix()
    }

    /**
     * @param {number} x X axis
     * @param {number} y Y axis
     * @param {number} z Z axis
     * @param {number} w Width
     * @param {number} h Height
     * @param {number} r Red 0 - 255
     * @param {number} g Green 0 - 255
     * @param {number} b Blue 0 - 255
     * @param {number} a Alpha 0 - 255
     * @param {boolean} phase Whether to render the box through walls or not (`false` by default)
     * @param {number} lineWidth The width of the line
     */
    static drawOutlinedBox(x, y, z, w, h, r, g, b, a, phase = false, lineWidth = 3, checkFrustum = true) {
        const aabb = RenderHelper.toAABB(x, y, z, w, h)
        if (checkFrustum && !RenderHelper.inFrustum(aabb)) return
        this.drawOutlinedAABB(aabb, r, g, b, a, phase, lineWidth, false)
    }

    static drawFilledAABB(aabb, r, g, b, a, phase = true, checkFrustum = true) {
        if (checkFrustum && !RenderHelper.inFrustum(aabb)) return

        const [ x0, y0, z0, x1, y1, z1 ] = RenderHelper.getAxisCoords(aabb)
        
        const {rx, ry, rz} = RenderHelper.getRenderPos()

        Tessellator.pushMatrix()
        GlStateManager./* disableCull */func_179129_p()
        Tessellator
            .disableTexture2D()
            .enableBlend()
            .disableLighting()
            .disableAlpha()
            .tryBlendFuncSeparate(770, 771, 1, 0)
            .translate(-rx, -ry, -rz)
        
        if (phase) Tessellator.disableDepth()

        Tessellator.colorize(r / 255, g / 255, b / 255, a / 255)

        WorldRenderer./* begin */func_181668_a(5, DefaultVertexFormats./* POSITION */field_181705_e)
        WorldRenderer./* pos */func_181662_b(x0, y0, z0)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(x1, y0, z0)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(x0, y0, z1)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(x1, y0, z1)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(x0, y1, z1)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(x1, y1, z1)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(x0, y1, z0)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(x1, y1, z0)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(x0, y0, z0)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(x1, y0, z0)./* endVertex */func_181675_d()
        MCTessellator./* draw */func_78381_a()

        WorldRenderer./* begin */func_181668_a(7, DefaultVertexFormats./* POSITION */field_181705_e)
        WorldRenderer./* pos */func_181662_b(x0, y0, z0)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(x0, y0, z1)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(x0, y1, z1)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(x0, y1, z0)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(x1, y0, z0)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(x1, y0, z1)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(x1, y1, z1)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(x1, y1, z0)./* endVertex */func_181675_d()
        MCTessellator./* draw */func_78381_a()

        if (phase) Tessellator.enableDepth()
            
        Tessellator
            .translate(rx, ry, rz)
            .disableBlend()
            .enableAlpha()
            .enableTexture2D()
            .colorize(1, 1, 1, 1)

        GlStateManager./* enableCull */func_179089_o()
        Tessellator
            .enableLighting()
            .popMatrix()
    }

    /**
     * @param {number} x X axis
     * @param {number} y Y axis
     * @param {number} z Z axis
     * @param {number} w Width
     * @param {number} h Height
     * @param {number} r Red 0 - 255
     * @param {number} g Green 0 - 255
     * @param {number} b Blue 0 - 255
     * @param {number} a Alpha 0 - 255
     * @param {boolean} phase Whether to render the box through walls or not (`false` by default)
     */
    static drawFilledBox(x, y, z, w, h, r, g, b, a, phase = false, checkFrustum = true) {
        const aabb = RenderHelper.toAABB(x, y, z, w, h)
        this.drawFilledBox(aabb, r, g, b, a, phase, checkFrustum)
    }

    /**
     * - Draws a beacon beam
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @param {number} r 0 - 255
     * @param {number} g 0 - 255
     * @param {number} b 0 - 255
     * @param {number} a 0 - 255
     * @param {boolean} phase Whether it should render through walls or not
     * @param {number} height The limit height for the beam to render to (`300` by default)
     * @param {boolean} translate Whether to translate the rendering coords to the [RenderViewEntity] coords (`true` by default)
     * @link From [NotEnoughUpdates](https://github.com/NotEnoughUpdates/NotEnoughUpdates/blob/master/src/main/java/io/github/moulberry/notenoughupdates/core/util/render/RenderUtils.java#L220)
     */
    static renderBeaconBeam(x, y, z, r, g, b, a, phase = false, height = 150, checkFrustum = true) {
        const aabb = RenderHelper.toAABB(x, y, z, 0.5, height)
        if (checkFrustum && !RenderHelper.inFrustum(aabb)) return

        ({x, y, z} = Tessellator.getRenderPos(x, y, z))

        Tessellator.pushMatrix()

        if (phase) Tessellator.disableDepth()

        r = r / 255
        g = g / 255
        b = b / 255
        a = a / 255

        Client.getMinecraft()./* getTextureManager */func_110434_K()./* bindTexture */func_110577_a(beaconBeam)

        GL11.glTexParameterf(GL11.GL_TEXTURE_2D, GL11.GL_TEXTURE_WRAP_S, GL11.GL_REPEAT)
        GL11.glTexParameterf(GL11.GL_TEXTURE_2D, GL11.GL_TEXTURE_WRAP_T, GL11.GL_REPEAT)

        Tessellator.disableLighting()
        GlStateManager./* enableCull */func_179089_o()
            
        Tessellator
            .enableTexture2D()
            .tryBlendFuncSeparate(GL11.GL_SRC_ALPHA, GL11.GL_ONE, GL11.GL_ONE, GL11.GL_ZERO)
            .enableBlend()
            .tryBlendFuncSeparate(GL11.GL_SRC_ALPHA, GL11.GL_ONE_MINUS_SRC_ALPHA, GL11.GL_ONE, GL11.GL_ZERO)

        const time = World.getTime() + Tessellator.getPartialTicks()
        const bounds = -time * 0.2 - Math.floor(-time * 0.1)
        const d1 = bounds - Math.floor(bounds)
        const d2 = time * 0.025 * -1.5
        const d4 = 0.5 + Math.cos(d2 + 2.356194490192345) * 0.2
        const d5 = 0.5 + Math.sin(d2 + 2.356194490192345) * 0.2
        const d6 = 0.5 + Math.cos(d2 + (Math.PI / 4)) * 0.2
        const d7 = 0.5 + Math.sin(d2 + (Math.PI / 4)) * 0.2
        const d8 = 0.5 + Math.cos(d2 + 3.9269908169872414) * 0.2
        const d9 = 0.5 + Math.sin(d2 + 3.9269908169872414) * 0.2
        const d10 = 0.5 + Math.cos(d2 + 5.497787143782138) * 0.2
        const d11 = 0.5 + Math.sin(d2 + 5.497787143782138) * 0.2
        const d14 = -1 + d1
        const d15 = height * 2.5 + d14

        WorldRenderer./* begin */func_181668_a(GL11.GL_QUADS, DefaultVertexFormats./* POSITION_TEX_COLOR */field_181709_i)
        WorldRenderer./* pos */func_181662_b(x + d4, y + height, z + d5)./* tex */func_181673_a(1, d15)./* color */func_181666_a(r, g, b, a)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(x + d4, y, z + d5)./* tex */func_181673_a(0, d14)./* color */func_181666_a(r, g, b, a)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(x + d6, y, z + d7)./* tex */func_181673_a(0, d14)./* color */func_181666_a(r, g, b, 1)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(x + d6, y + height, z + d7)./* tex */func_181673_a(0, d15)./* color */func_181666_a(r, g, b, a)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(x + d10, y + height, z + d11)./* tex */func_181673_a(1, d15)./* color */func_181666_a(r, g, b, a)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(x + d10, y, z + d11)./* tex */func_181673_a(1, d14)./* color */func_181666_a(r, g, b, 1)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(x + d8, y, z + d9)./* tex */func_181673_a(0, d14)./* color */func_181666_a(r, g, b, 1)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(x + d8, y + height, z + d9)./* tex */func_181673_a(0, d15)./* color */func_181666_a(r, g, b, a)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(x + d6, y + height, z + d7)./* tex */func_181673_a(1, d15)./* color */func_181666_a(r, g, b, a)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(x + d6, y, z + d7)./* tex */func_181673_a(1, d14)./* color */func_181666_a(r, g, b, 1)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(x + d10, y, z + d11)./* tex */func_181673_a(0, d14)./* color */func_181666_a(r, g, b, 1)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(x + d10, y + height, z + d11)./* tex */func_181673_a(0, d15)./* color */func_181666_a(r, g, b, a)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(x + d8, y + height, z + d9)./* tex */func_181673_a(1, d15)./* color */func_181666_a(r, g, b, a)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(x + d8, y, z + d9)./* tex */func_181673_a(1, d14)./* color */func_181666_a(r, g, b, 1)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(x + d4, y, z + d5)./* tex */func_181673_a(0, d14)./* color */func_181666_a(r, g, b, 1)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(x + d4, y + height, z + d5)./* tex */func_181673_a(0, d15)./* color */func_181666_a(r, g, b, a)./* endVertex */func_181675_d()
        MCTessellator./* draw */func_78381_a()

        GlStateManager./* disableCull */func_179129_p()

        const d12 = -1 + d1
        const d13 = height + d12

        const rA = a * 0.25
        WorldRenderer./* begin */func_181668_a(GL11.GL_QUADS, DefaultVertexFormats./* POSITION_TEX_COLOR */field_181709_i)
        WorldRenderer./* pos */func_181662_b(x + 0.2, y + height, z + 0.2)./* tex */func_181673_a(1, d13)./* color */func_181666_a(r, g, b, rA)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(x + 0.2, y, z + 0.2)./* tex */func_181673_a(1, d12)./* color */func_181666_a(r, g, b, 0.25)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(x + 0.8, y, z + 0.2)./* tex */func_181673_a(0, d12)./* color */func_181666_a(r, g, b, 0.25)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(x + 0.8, y + height, z + 0.2)./* tex */func_181673_a(0, d13)./* color */func_181666_a(r, g, b, rA)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(x + 0.8, y + height, z + 0.8)./* tex */func_181673_a(1, d13)./* color */func_181666_a(r, g, b, rA)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(x + 0.8, y, z + 0.8)./* tex */func_181673_a(1, d12)./* color */func_181666_a(r, g, b, 0.25)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(x + 0.2, y, z + 0.8)./* tex */func_181673_a(0, d12)./* color */func_181666_a(r, g, b, 0.25)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(x + 0.2, y + height, z + 0.8)./* tex */func_181673_a(0, d13)./* color */func_181666_a(r, g, b, rA)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(x + 0.8, y + height, z + 0.2)./* tex */func_181673_a(1, d13)./* color */func_181666_a(r, g, b, rA)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(x + 0.8, y, z + 0.2)./* tex */func_181673_a(1, d12)./* color */func_181666_a(r, g, b, 0.25)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(x + 0.8, y, z + 0.8)./* tex */func_181673_a(0, d12)./* color */func_181666_a(r, g, b, 0.25)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(x + 0.8, y + height, z + 0.8)./* tex */func_181673_a(0, d13)./* color */func_181666_a(r, g, b, rA)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(x + 0.2, y + height, z + 0.8)./* tex */func_181673_a(1, d13)./* color */func_181666_a(r, g, b, rA)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(x + 0.2, y, z + 0.8)./* tex */func_181673_a(1, d12)./* color */func_181666_a(r, g, b, 0.25)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(x + 0.2, y, z + 0.2)./* tex */func_181673_a(0, d12)./* color */func_181666_a(r, g, b, 0.25)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(x + 0.2, y + height, z + 0.2)./* tex */func_181673_a(0, d13)./* color */func_181666_a(r, g, b, rA)./* endVertex */func_181675_d()
        MCTessellator./* draw */func_78381_a()

        if (phase) Tessellator.enableDepth()

        Tessellator
            .enableLighting()
            .enableTexture2D()
            .popMatrix()
    }
    
    static renderWaypoint(text, x, y, z, r, g, b, a, phase = true, checkFrustum = true) {
        [x, y, z] = RenderHelper.coerceToRenderDist(x, y, z)

        const BeaconBB = RenderHelper.toAABB(x, y, z, 1, 150)
        if (checkFrustum && !RenderHelper.inFrustum(BeaconBB)) return
        this.renderBeaconBeam(x - 0.5, y, z - 0.5, r, g, b, 150, phase, 150, false)

        const BlockBB = RenderHelper.toAABB(x, y, z, 1, 1)
        if (checkFrustum && !RenderHelper.inFrustum(BlockBB)) return

        this.drawOutlinedAABB(BlockBB, r, g, b, a, phase, 2, false)
        this.drawFilledAABB(BlockBB, r, g, b, 50, phase, false)
        this.drawString(text, x, y + 3, z, 0xffffff, true, 1, true, true, true, false)
    }
    
    /**
     * - Chattriggers' Tessellator.drawString() with depth check and multiline
     * - Renders floating lines of text in the 3D world at a specific position.
     *
     * @param {String} text The text to render
     * @param {Number} x X coordinate in the game world
     * @param {Number} y Y coordinate in the game world
     * @param {Number} z Z coordinate in the game world
     * @param {Number} color the color of the text
     * @param {Boolean} renderBlackBox
     * @param {Number} iScale the scale of the text
     * @param {Boolean} autoScale whether to scale the text up as the player moves away
     * @param {Boolean} shadow whether to render shadow
     * @param {Boolean} depth whether to render through walls
     */
    static drawString(
        text,
        x,
        y,
        z,
        color = 0xffffff,
        renderBlackBox = true,
        iScale = 1,
        autoScale = true,
        shadow = true,
        depth = true,
        checkFrustum = true
    ) {
        const aabb = RenderHelper.toAABB(x, y, z, 1, 1)
        if (checkFrustum && !RenderHelper.inFrustum(aabb)) return
        
        ({ x, y, z } = Tessellator.getRenderPos(x, y, z))
        iScale /= 2

        const lScale = autoScale 
            ? iScale * Math.hypot(x, y, z) / RenderHelper.getRenderDistanceBlocks()
            : iScale
        const xMulti = Client.getMinecraft()./* gameSettings */field_71474_y./* thirdPersonView */field_74320_O == 2 ? -1 : 1
        
        Tessellator
            .colorize(1, 1, 1, 0.5)
            .pushMatrix()
            .translate(x, y, z)
            .rotate(-RenderHelper.getRenderPitch(), 0, 1, 0)
            .rotate(RenderHelper.getRenderYaw() * xMulti, 1, 0, 0)

            .scale(-lScale, -lScale, lScale)
            .disableLighting()
            .depthMask(false)
            
        if (depth) Tessellator.disableDepth()

        Tessellator
            .enableBlend()
            .blendFunc(770, 771)
            
        let maxWidth = 0
        let l = 0
        const lines = text.addColor().split("\n").map(it => {
            const res = [it, -(Renderer.getStringWidth(it) / 2), l++ * 9]

            maxWidth = Math.min(maxWidth, res[1])

            return res
        })

        if (renderBlackBox) {
            Tessellator.disableTexture2D()
            WorldRenderer./* begin */func_181668_a(7, DefaultVertexFormats./* POSITION_COLOR */field_181706_f)
            WorldRenderer./* pos */func_181662_b(maxWidth - 1, -1 * l, 0)./* color */func_181666_a(0, 0, 0, 0.25)./* endVertex */func_181675_d()
            WorldRenderer./* pos */func_181662_b(maxWidth - 1, 9 * l, 0)./* color */func_181666_a(0, 0, 0, 0.25)./* endVertex */func_181675_d()
            WorldRenderer./* pos */func_181662_b(-maxWidth + 1, 9 * l, 0)./* color */func_181666_a(0, 0, 0, 0.25)./* endVertex */func_181675_d()
            WorldRenderer./* pos */func_181662_b(-maxWidth + 1, -1 * l, 0)./* color */func_181666_a(0, 0, 0, 0.25)./* endVertex */func_181675_d()
            MCTessellator./* draw */func_78381_a()
            Tessellator.enableTexture2D()
        }

        const fr = Renderer.getFontRenderer()
        lines.forEach(([it, width, height]) => 
            fr./* drawString */func_175065_a(it, width, height, color, shadow)
        )

        Tessellator
            .colorize(1, 1, 1, 1)
            .depthMask(true)
            .enableDepth()
            .popMatrix()
    }
}