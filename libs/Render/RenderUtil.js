/** 
 * Many optimizations taken from DocileElm and PerseusPotter:
 * Their respective links are:
 * @author DocilElm
 * @license {GNU-GPL-3} https://github.com/DocilElm/Doc/blob/main/LICENSE
 * @credit https://github.com/DocilElm/Doc/blob/main/shared/Render.js
 * @author PerseusPotter
 * @license {GNU-GPL-3} https://github.com/PerseusPotter/chicktils/blob/master/LICENSE.md
 * @credit https://github.com/PerseusPotter/chicktils/blob/master/util/draw.js
 */

import RenderHelper from "./RenderHelper"
const MCTessellator = net.minecraft.client.renderer.Tessellator./* getInstance */func_178181_a()
const DefaultVertexFormats = net.minecraft.client.renderer.vertex.DefaultVertexFormats
const DefaultVertexFormats$POSITION = DefaultVertexFormats./* POSITION */field_181705_e
const WorldRenderer = MCTessellator./* getWorldRenderer */func_178180_c()
const MathHelper = net.minecraft.util.MathHelper

// From BeaconBeam module
const ResourceLocation = net.minecraft.util.ResourceLocation
const beaconBeam = new ResourceLocation("textures/entity/beacon_beam.png")

export default class RenderUtil {
    /**
     * @param {Number} x
     * @param {Number} y
     * @param {Number} z
     * @param {Number} w
     * @param {Number} h
     * @param {Number[]} color r, g, b, a
     * @param {Boolean} esp 
     * @param {Number} lineWidth 
     * @param {Boolean} checkFrustum
     */
    static drawOutlinedBox(x, y, z, w, h, color, esp, lineWidth, checkFrustum) {
        this.drawOutlinedAABB(RenderHelper.toAABB(x, y, z, w, h), color, esp, lineWidth, checkFrustum)
    }

    /**
     * @param {net.minecraft.util.AxisAlignedBB} aabb 
     * @param {Number[]} color r, g, b, a
     * @param {Boolean} esp 
     * @param {Number} lineWidth 
     * @param {Boolean} checkFrustum
     */
    static drawOutlinedAABB(aabb, color, esp, lineWidth, checkFrustum) {
        if (checkFrustum && !RenderHelper.inFrustum(aabb)) return

        const {rx, ry, rz} = RenderHelper.getRenderPos()

        GL11.glLineWidth(lineWidth)
        GL11.glEnable(2848)
        GlStateManager./* enableBlend */func_179147_l()
        GlStateManager./* disableTexture2D */func_179090_x()
        GlStateManager./* tryBlendFuncSeparate */func_179120_a(770, 771, 1, 0)
        if (esp) GlStateManager./* disableDepth */func_179097_i()
        GlStateManager./* pushMatrix */func_179094_E()
        GlStateManager./* color */func_179131_c(color[0] / 255, color[1] / 255, color[2] / 255, color[3] / 255)
        GlStateManager./* translate */func_179109_b(-rx, -ry, -rz)

        const [minX, minY, minZ, maxX, maxY, maxZ] = RenderHelper.getAxisCoords(aabb)
        WorldRenderer./* begin */func_181668_a(3, DefaultVertexFormats$POSITION)
        WorldRenderer./* pos */func_181662_b(minX, minY, minZ)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(maxX, minY, minZ)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(maxX, minY, maxZ)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(minX, minY, maxZ)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(minX, minY, minZ)./* endVertex */func_181675_d()
        MCTessellator./* draw */func_78381_a()
        WorldRenderer./* begin */func_181668_a(3, DefaultVertexFormats$POSITION)
        WorldRenderer./* pos */func_181662_b(minX, maxY, minZ)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(maxX, maxY, minZ)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(maxX, maxY, maxZ)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(minX, maxY, maxZ)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(minX, maxY, minZ)./* endVertex */func_181675_d()
        MCTessellator./* draw */func_78381_a()
        WorldRenderer./* begin */func_181668_a(1, DefaultVertexFormats$POSITION)
        WorldRenderer./* pos */func_181662_b(minX, minY, minZ)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(minX, maxY, minZ)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(maxX, minY, minZ)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(maxX, maxY, minZ)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(maxX, minY, maxZ)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(maxX, maxY, maxZ)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(minX, minY, maxZ)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(minX, maxY, maxZ)./* endVertex */func_181675_d()
        MCTessellator./* draw */func_78381_a()

        GlStateManager./* popMatrix */func_179121_F()
        GlStateManager./* disableBlend */func_179084_k()
        GlStateManager./* enableTexture2D */func_179098_w()
        if (esp) GlStateManager./* enableDepth */func_179126_j()
        GL11.glDisable(2848)
        GL11.glLineWidth(3)
    }

    /**
     * @param {Number} x
     * @param {Number} y
     * @param {Number} z
     * @param {Number} w
     * @param {Number} h
     * @param {Number[]} color r, g, b, a
     * @param {Boolean} esp 
     * @param {Boolean} checkFrustum
     */
    static drawFilledBox(x, y, z, w, h, color, esp, checkFrustum) {
        this.drawFilledBox(RenderHelper.toAABB(x, y, z, w, h), color, esp, checkFrustum)
    }

    /**
     * @param {net.minecraft.util.AxisAlignedBB} aabb 
     * @param {Number[]} color r, g, b, a
     * @param {Boolean} esp 
     * @param {Boolean} checkFrustum
     */
    static drawFilledAABB(aabb, color, esp, checkFrustum) {
        if (checkFrustum && !RenderHelper.inFrustum(aabb)) return
        
        const {rx, ry, rz} = RenderHelper.getRenderPos()
        
        GlStateManager./* enableBlend */func_179147_l()
        GlStateManager./* disableTexture2D */func_179090_x()
        GlStateManager./* tryBlendFuncSeparate */func_179120_a(770, 771, 1, 0)
        if (esp) GlStateManager./* disableDepth */func_179097_i()
        GlStateManager./* pushMatrix */func_179094_E()
        GlStateManager./* color */func_179131_c(color[0] / 255, color[1] / 255, color[2] / 255, color[3] / 255)
        GlStateManager./* translate */func_179109_b(-rx, -ry, -rz)
                
        const [minX, minY, minZ, maxX, maxY, maxZ] = RenderHelper.getAxisCoords(aabb)
        WorldRenderer./* begin */func_181668_a(5, DefaultVertexFormats$POSITION)
        WorldRenderer./* pos */func_181662_b(minX, minY, minZ)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(maxX, minY, minZ)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(minX, minY, maxZ)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(maxX, minY, maxZ)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(minX, maxY, maxZ)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(maxX, maxY, maxZ)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(minX, maxY, minZ)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(maxX, maxY, minZ)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(minX, minY, minZ)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(maxX, minY, minZ)./* endVertex */func_181675_d()
        MCTessellator./* draw */func_78381_a()

        WorldRenderer./* begin */func_181668_a(7, DefaultVertexFormats$POSITION)
        WorldRenderer./* pos */func_181662_b(minX, minY, minZ)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(minX, minY, maxZ)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(minX, maxY, maxZ)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(minX, maxY, minZ)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(maxX, minY, minZ)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(maxX, minY, maxZ)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(maxX, maxY, maxZ)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(maxX, maxY, minZ)./* endVertex */func_181675_d()
        MCTessellator./* draw */func_78381_a()

            
        GlStateManager./* popMatrix */func_179121_F()
        GlStateManager./* disableBlend */func_179084_k()
        GlStateManager./* enableTexture2D */func_179098_w()
        if (esp) GlStateManager./* enableDepth */func_179126_j()
    }

    /**
     * @param {Number} ix
     * @param {Number} iy
     * @param {Number} iz
     * @param {Number[]} color r, g, b, a
     * @param {Boolean} esp
     * @param {Number} height 
     * @param {Boolean} checkFrustum
     * @link https://github.com/NotEnoughUpdates/NotEnoughUpdates/blob/98f4f6140ab8371f1fd18846f5489318af2b2252/src/main/java/io/github/moulberry/notenoughupdates/core/util/render/RenderUtils.java#L220
     */
    static renderBeaconBeam(x, y, z, color, esp, height, checkFrustum) {
        if (checkFrustum && !RenderHelper.inFrustum(RenderHelper.toAABB(x, y, z, 0.5, height))) return

        const [r, g, b, a] = [color[0] / 255, color[1] / 255, color[2] / 255, color[3] / 255]

        Tessellator
            .pushMatrix()
            .enableTexture2D()
            .tryBlendFuncSeparate(770, 771, 1, 771)
            .enableBlend()
        if (esp) Tessellator
            .disableDepth()
            .depthMask(false)
        GlStateManager./* enableCull */func_179089_o()
        Client.getMinecraft()./* getTextureManager */func_110434_K()./* bindTexture */func_110577_a(beaconBeam)
        GL11.glTexParameterf(3553, 10242, 10497)
        GL11.glTexParameterf(3553, 10243, 10497)

        const bottomOffset = 0
        const topOffset = bottomOffset + height
        const time = 0.2 * (World.getWorld()./* getTotalWorldTime */func_82737_E() + Tessellator.getPartialTicks())
        const d1 = Math.ceil(time) - time
        const d2 = time * -0.1875
        const d4 = Math.cos(d2 + 2.356194490192345) * 0.2
        const d5 = Math.sin(d2 + 2.356194490192345) * 0.2
        const d6 = Math.cos(d2 + 0.7853981633974483) * 0.2
        const d7 = Math.sin(d2 + 0.7853981633974483) * 0.2
        const d8 = Math.cos(d2 + 3.9269908169872414) * 0.2
        const d9 = Math.sin(d2 + 3.9269908169872414) * 0.2
        const d10 = Math.cos(d2 + 5.497787143782138) * 0.2
        const d11 = Math.sin(d2 + 5.497787143782138) * 0.2
        const d14 = d1 - 1
        const d15 = height * 2.5 + d14

        WorldRenderer./* begin */func_181668_a(7, DefaultVertexFormats./* POSITION_TEX_COLOR */field_181709_i)
        WorldRenderer./* pos */func_181662_b(x + d4, y + topOffset, z + d5)./* tex */func_181673_a(1, d15)./* color */func_181666_a(r, g, b, a)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(x + d4, y + bottomOffset, z + d5)./* tex */func_181673_a(1, d14)./* color */func_181666_a(r, g, b, 1)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(x + d6, y + bottomOffset, z + d7)./* tex */func_181673_a(0, d14)./* color */func_181666_a(r, g, b, 1)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(x + d6, y + topOffset, z + d7)./* tex */func_181673_a(0, d15)./* color */func_181666_a(r, g, b, a)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(x + d10, y + topOffset, z + d11)./* tex */func_181673_a(1, d15)./* color */func_181666_a(r, g, b, a)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(x + d10, y + bottomOffset, z + d11)./* tex */func_181673_a(1, d14)./* color */func_181666_a(r, g, b, 1)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(x + d8, y + bottomOffset, z + d9)./* tex */func_181673_a(0, d14)./* color */func_181666_a(r, g, b, 1)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(x + d8, y + topOffset, z + d9)./* tex */func_181673_a(0, d15)./* color */func_181666_a(r, g, b, a)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(x + d6, y + topOffset, z + d7)./* tex */func_181673_a(1, d15)./* color */func_181666_a(r, g, b, a)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(x + d6, y + bottomOffset, z + d7)./* tex */func_181673_a(1, d14)./* color */func_181666_a(r, g, b, 1)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(x + d10, y + bottomOffset, z + d11)./* tex */func_181673_a(0, d14)./* color */func_181666_a(r, g, b, 1)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(x + d10, y + topOffset, z + d11)./* tex */func_181673_a(0, d15)./* color */func_181666_a(r, g, b, a)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(x + d8, y + topOffset, z + d9)./* tex */func_181673_a(1, d15)./* color */func_181666_a(r, g, b, a)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(x + d8, y + bottomOffset, z + d9)./* tex */func_181673_a(1, d14)./* color */func_181666_a(r, g, b, 1)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(x + d4, y + bottomOffset, z + d5)./* tex */func_181673_a(0, d14)./* color */func_181666_a(r, g, b, 1)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(x + d4, y + topOffset, z + d5)./* tex */func_181673_a(0, d15)./* color */func_181666_a(r, g, b, a)./* endVertex */func_181675_d()
        MCTessellator./* draw */func_78381_a()
        GlStateManager./* disableCull */func_179129_p()

        const d13 = height + d14
        const qA = a / 4
        const w = 0.3 * 0.2

        WorldRenderer./* begin */func_181668_a(7, DefaultVertexFormats./* POSITION_TEX_COLOR */field_181709_i)
        WorldRenderer./* pos */func_181662_b(x - w, y + topOffset, z - w)./* tex */func_181673_a(1, d13)./* color */func_181666_a(r, g, b, qA)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(x - w, y + bottomOffset, z - w)./* tex */func_181673_a(1, d14)./* color */func_181666_a(r, g, b, 0.25)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(x + w, y + bottomOffset, z - w)./* tex */func_181673_a(0, d14)./* color */func_181666_a(r, g, b, 0.25)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(x + w, y + topOffset, z - w)./* tex */func_181673_a(0, d13)./* color */func_181666_a(r, g, b, qA)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(x + w, y + topOffset, z + w)./* tex */func_181673_a(1, d13)./* color */func_181666_a(r, g, b, qA)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(x + w, y + bottomOffset, z + w)./* tex */func_181673_a(1, d14)./* color */func_181666_a(r, g, b, 0.25)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(x - w, y + bottomOffset, z + w)./* tex */func_181673_a(0, d14)./* color */func_181666_a(r, g, b, 0.25)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(x - w, y + topOffset, z + w)./* tex */func_181673_a(0, d13)./* color */func_181666_a(r, g, b, qA)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(x + w, y + topOffset, z - w)./* tex */func_181673_a(1, d13)./* color */func_181666_a(r, g, b, qA)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(x + w, y + bottomOffset, z - w)./* tex */func_181673_a(1, d14)./* color */func_181666_a(r, g, b, 0.25)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(x + w, y + bottomOffset, z + w)./* tex */func_181673_a(0, d14)./* color */func_181666_a(r, g, b, 0.25)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(x + w, y + topOffset, z + w)./* tex */func_181673_a(0, d13)./* color */func_181666_a(r, g, b, qA)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(x - w, y + topOffset, z + w)./* tex */func_181673_a(1, d13)./* color */func_181666_a(r, g, b, qA)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(x - w, y + bottomOffset, z + w)./* tex */func_181673_a(1, d14)./* color */func_181666_a(r, g, b, 0.25)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(x - w, y + bottomOffset, z - w)./* tex */func_181673_a(0, d14)./* color */func_181666_a(r, g, b, 0.25)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(x - w, y + topOffset, z - w)./* tex */func_181673_a(0, d13)./* color */func_181666_a(r, g, b, qA)./* endVertex */func_181675_d()
        MCTessellator./* draw */func_78381_a()

        if (esp) Tessellator
            .depthMask(true)
            .enableDepth()
        Tessellator
            .enableTexture2D()
            .popMatrix()
    }
    
    static renderWaypoint(text, x, y, z, color, phase, checkFrustum) {
        const [r, g, b, a] = color

        const BeaconBB = RenderHelper.toAABB(x, y, z, 1, 100)
        if (checkFrustum && !RenderHelper.inFrustum(BeaconBB)) return
        RenderUtil.renderBeaconBeam(x - 0.5, y, z - 0.5, [r, g, b, 165], phase, 100, false)

        const BlockBB = RenderHelper.toAABB(x, y, z, 1, 1)
        if (checkFrustum && !RenderHelper.inFrustum(BlockBB)) return

        RenderUtil.drawOutlinedAABB(BlockBB, [r, g, b, 50], phase, 3, false)
        RenderUtil.drawFilledAABB(BlockBB, [r, g, b, 50], phase, false)
        RenderUtil.drawString(text, x, y + 3, z, [255, 255, 255, 255], true, 1, true, true, true, false)
    }
    
    /**
     * - Chattriggers' Tessellator.drawString() with depth check and multiline
     * - Renders floating lines of text in the 3D world at a specific position.
     *
     * @param {String} text The text to render
     * @param {Number} x X coordinate in the game world
     * @param {Number} y Y coordinate in the game world
     * @param {Number} z Z coordinate in the game world
     * @param {Number[]} color the color of the text
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
        color,
        renderBlackBox = true,
        iScale = 1,
        autoScale = true,
        shadow = true,
        depth = true,
        checkFrustum = true
    ) {
        if (checkFrustum && !RenderHelper.isBoundsInFrustum(x, y, z, 1, 1)) return
        const {rx, ry, rz} = RenderHelper.getRenderPos()
        
        iScale /= 2
        const lScale = autoScale 
            ? iScale * Math.hypot(x, y, z) / RenderHelper.getRenderDistanceBlocks()
            : iScale
        const xMulti = Client.settings.getSettings()./* thirdPersonView */field_74320_O === 2 ? -1 : 1
        
        Tessellator
            .pushMatrix()
            .translate(x - rx, y - ry, z - rz)
            .rotate(-RenderHelper.getRenderPitch(), 0, 1, 0)
            .rotate(RenderHelper.getRenderYaw() * xMulti, 1, 0, 0)
            .scale(-lScale, -lScale, -lScale)
            .enableAlpha()
            .enableBlend()
            .tryBlendFuncSeparate(770, 771, 1, 771)
            .depthMask(false)
            if (depth) Tessellator.disableDepth()
            
        const lines = text.addColor().split("\n")
        const height = lines.length * 9 + 1
        const widths = lines.map(l => Renderer.getStringWidth(l) / 2)
        const maxWidth = Math.max.call(null, widths) + 1

        if (renderBlackBox) {
            Tessellator.colorize(0, 0, 0, 0.25)
            WorldRenderer./* begin */func_181668_a(5, DefaultVertexFormats$POSITION)
            WorldRenderer./* pos */func_181662_b(-maxWidth, -1, -1)./* endVertex */func_181675_d()
            WorldRenderer./* pos */func_181662_b(-maxWidth, height, -1)./* endVertex */func_181675_d()
            WorldRenderer./* pos */func_181662_b(maxWidth, -1, -1)./* endVertex */func_181675_d()
            WorldRenderer./* pos */func_181662_b(maxWidth, height, -1)./* endVertex */func_181675_d()
            MCTessellator./* draw */func_78381_a()
        }
        
        Tessellator
            .enableTexture2D()
        GlStateManager./* color */func_179131_c(color[0] / 255, color[1] / 255, color[2] / 255, color[3] / 255)

        const FontRenderer = Renderer.getFontRenderer()
        lines.forEach((line, index) => 
            FontRenderer./* drawString */func_175065_a(line, -widths[index], index * 9, Renderer.WHITE, shadow)
        )

        Tessellator
            .popMatrix()
            .disableBlend()
            .depthMask(true)
            if (depth) Tessellator.enableDepth()
    }

    /**
     * @param {Number} color long
     * @param {Number} x center
     * @param {Number} y center
     * @param {Number} radius
     * @param {Number} angleI initial radians
     * @param {Number} angleF final radians
     * @param {Number} segments roundness 
     * @param {Number} lineWidth
     */
    static drawArc(color, x, y, radius, angleI, angleF, segments, lineWidth) {
        if (angleF < angleI) return this.drawArc(color, x, y, radius, angleF, angleI, segments, lineWidth)

        const dAngle = angleF - angleI
        const rotations = dAngle / segments
    
        GL11.glLineWidth(lineWidth)
        GL11.glEnable(2848) // GL_LINE_SMOOTH
        GlStateManager./* enableBlend */func_179147_l()
        GlStateManager./* disableTexture2D */func_179090_x()
        GlStateManager./* tryBlendFuncSeparate */func_179120_a(770, 771, 1, 0)
        GlStateManager./* disableDepth */func_179097_i()
        GlStateManager./* disableCull */func_179129_p()
        GlStateManager./* pushMatrix */func_179094_E()
        GlStateManager./* color */func_179131_c(
            ((color >> 24) & 0xFF) / 255,
            ((color >> 16) & 0xFF) / 255,
            ((color >> 8) & 0xFF) / 255,
            ((color >> 0) & 0xFF) / 255
        )

        WorldRenderer./* begin */func_181668_a(3, DefaultVertexFormats$POSITION);
        WorldRenderer./* pos */func_181662_b(x + Math.cos(angleI) * radius, y - Math.sin(angleI) * radius, 0)./* endVertex */func_181675_d()
        for (let i = 1; i <= segments; i++) {
            let segment = angleI + rotations * i
            WorldRenderer./* pos */func_181662_b(x + Math.cos(segment) * radius, y - Math.sin(segment) * radius, 0)./* endVertex */func_181675_d()
        }
        MCTessellator./* draw */func_78381_a()

        GlStateManager./* popMatrix */func_179121_F()
        GlStateManager./* disableBlend */func_179084_k()
        GlStateManager./* enableTexture2D */func_179098_w()
        GlStateManager./* enableDepth */func_179126_j()
        GlStateManager./* enableCull */func_179089_o()
        GL11.glDisable(2848) // GL_LINE_SMOOTH
        GL11.glLineWidth(3)
    }
    
    /**
     * @param {Number} color long
     * @param {Number} x
     * @param {Number} y
     * @param {Number} width
     * @param {Number} height
     * @param {Number} radius
     * @param {Number} lineWidth
     */
    static drawRoundRectangle(color, x, y, width, height, radius, lineWidth) {
        radius = Math.min(width / 2, height / 2, radius);
    
        GL11.glLineWidth(lineWidth)
        GL11.glEnable(2848)
        GlStateManager./* enableBlend */func_179147_l()
        GlStateManager./* disableTexture2D */func_179090_x()
        GlStateManager./* tryBlendFuncSeparate */func_179120_a(770, 771, 1, 0)
        GlStateManager./* disableDepth */func_179097_i()
        GlStateManager./* disableCull */func_179129_p()
        GlStateManager./* pushMatrix */func_179094_E()
        GlStateManager./* color */func_179131_c(
            ((color >> 24) & 0xFF) / 255,
            ((color >> 16) & 0xFF) / 255,
            ((color >> 8) & 0xFF) / 255,
            ((color >> 0) & 0xFF) / 255
        )

        WorldRenderer./* begin */func_181668_a(1, DefaultVertexFormats$POSITION)
        WorldRenderer./* pos */func_181662_b(x + radius, y, 0)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(x + width - radius, y, 0)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(x, y + radius, 0)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(x, y + height - radius, 0)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(x + radius, y + height, 0)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(x + width - radius, y + height, 0)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(x + width, y + radius, 0)./* endVertex */func_181675_d()
        WorldRenderer./* pos */func_181662_b(x + width, y + height - radius, 0)./* endVertex */func_181675_d()
        MCTessellator./* draw */func_78381_a()
        
        GlStateManager./* popMatrix */func_179121_F()
        GlStateManager./* disableBlend */func_179084_k()
        GlStateManager./* enableTexture2D */func_179098_w()
        GlStateManager./* enableDepth */func_179126_j()
        GlStateManager./* enableCull */func_179089_o()
        GL11.glDisable(2848)
        GL11.glLineWidth(3)

        this.drawArc(color, x + radius, y + radius, radius, Math.PI / 2, Math.PI, 10, lineWidth)
        this.drawArc(color, x + width - radius, y + radius, radius, 0, Math.PI / 2, 10, lineWidth)
        this.drawArc(color, x + radius, y + height - radius, radius, Math.PI, Math.PI * 3 / 2, 10, lineWidth)
        this.drawArc(color, x + width - radius, y + height - radius, radius, Math.PI * 3 / 2, 2 * Math.PI, 10, lineWidth)
    }
}