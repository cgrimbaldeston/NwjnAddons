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
        const [r, g, b, a] = color

        Tessellator
            .pushMatrix()
            .disableTexture2D()
            .enableBlend()
            .disableLighting()
            .disableAlpha()
            .tryBlendFuncSeparate(770, 771, 1, 0)
            .colorize(r / 255, g / 255, b / 255, a / 255)
            .translate(-rx, -ry, -rz)
        GL11.glLineWidth(lineWidth)
        
        if (esp) Tessellator.disableDepth()

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

        if (esp) Tessellator.enableDepth()
        
        Tessellator
            .translate(rx, ry, rz)
            .disableBlend()
            .enableAlpha()
            .enableTexture2D()
            .colorize(1, 1, 1, 1)
            .enableLighting()
            .popMatrix()
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
        const [r, g, b] = color
        
        Tessellator
            .disableTexture2D()
            .disableLighting()
            .disableAlpha()
            .colorize(r / 255, g / 255, b / 255, 0.2)
            .pushMatrix()
            .translate(-rx, -ry, -rz)
            .depthMask(false)
            .enableBlend()
            .tryBlendFuncSeparate(770, 771, 1, 0)
            if (esp) Tessellator.disableDepth()
                
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

            
        Tessellator
            .popMatrix()
            .enableTexture2D()
            .enableAlpha()
            .depthMask(true)
            .disableBlend()
            if (esp) Tessellator.enableDepth()
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
    static renderBeaconBeam(ix, iy, iz, color, esp, height, checkFrustum) {
        const {x, y, z, s} = RenderHelper.coerceToRenderDist(ix, iy, iz)

        if (checkFrustum && !RenderHelper.inFrustum(RenderHelper.toAABB(x, y, z, 0.5, height))) return

        const [r, g, b, a] = [color[0] / 255, color[1] / 255, color[2] / 255, 0.65]

        Tessellator
            .pushMatrix()
            .disableLighting()
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
        const d2 = time * -0.1875;
        const fS = 0.2 * s
        const d4 = Math.cos(d2 + 2.356194490192345) * fS
        const d5 = Math.sin(d2 + 2.356194490192345) * fS
        const d6 = Math.cos(d2 + 0.7853981633974483) * fS
        const d7 = Math.sin(d2 + 0.7853981633974483) * fS
        const d8 = Math.cos(d2 + 3.9269908169872414) * fS
        const d9 = Math.sin(d2 + 3.9269908169872414) * fS
        const d10 = Math.cos(d2 + 5.497787143782138) * fS
        const d11 = Math.sin(d2 + 5.497787143782138) * fS
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
        const w = 0.3 * s

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
    
    static renderWaypoint(text, ix, iy, iz, color, phase, checkFrustum) {
        const {x, y, z, s} = RenderHelper.coerceToRenderDist(ix, iy, iz)

        const BeaconBB = RenderHelper.toAABB(x, y, z, 1, 100)
        if (checkFrustum && !RenderHelper.inFrustum(BeaconBB)) return
        this.renderBeaconBeam(x - 0.5, y, z - 0.5, color, phase, 100, false)

        const BlockBB = RenderHelper.toAABB(x, y, z, 1, 1)
        if (checkFrustum && !RenderHelper.inFrustum(BlockBB)) return

        this.drawOutlinedAABB(BlockBB, color, phase, 3, false)
        this.drawFilledAABB(BlockBB, color, phase, false)
        this.drawString(text, x, y + 3, z, [255, 255, 255, 255], true, 1, true, true, true, false)
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
        ix,
        iy,
        iz,
        color,
        renderBlackBox = true,
        iScale = 1,
        autoScale = true,
        shadow = true,
        depth = true,
        checkFrustum = true
    ) {
        
        const {x, y, z, s} = RenderHelper.coerceToRenderDist(ix, iy, iz)
        if (checkFrustum && !RenderHelper.isBoundsInFrustum(x, y, z, 1, 1)) return
        
        iScale /= 2
        const lScale = autoScale 
            ? iScale * Math.hypot(x, y, z) / RenderHelper.getRenderDistanceBlocks()
            : iScale
        const xMulti = Client.settings.getSettings()./* thirdPersonView */field_74320_O === 2 ? -1 : 1
        
        Tessellator
            .pushMatrix()
            .translate(x, y, z)
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
            WorldRenderer./* begin */func_181668_a(5, DefaultVertexFormats./* POSITION */field_181705_e);
            WorldRenderer./* pos */func_181662_b(-maxWidth, -1, -1)./* endVertex */func_181675_d();
            WorldRenderer./* pos */func_181662_b(-maxWidth, height, -1)./* endVertex */func_181675_d();
            WorldRenderer./* pos */func_181662_b(maxWidth, -1, -1)./* endVertex */func_181675_d();
            WorldRenderer./* pos */func_181662_b(maxWidth, height, -1)./* endVertex */func_181675_d();
            MCTessellator./* draw */func_78381_a();
        }
        
        const [r, g, b, a] = color
        Tessellator
            .enableTexture2D()
            .colorize(r / 255, g / 255, b / 255, a / 255)

        const FontRenderer = Renderer.getFontRenderer()
        lines.forEach((line, index) => 
            FontRenderer./* drawString */func_175065_a(line, -widths[index], index * 9, -1, shadow)
        )

        Tessellator
            .popMatrix()
            .disableBlend()
            .depthMask(true)
            if (depth) Tessellator.enableDepth()
    }
}