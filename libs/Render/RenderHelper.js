import Frustum from "./Frustum"
const AxisAlignedBB = net.minecraft.util.AxisAlignedBB
const IBlockStateAir = new BlockType(0).getDefaultState()
const RenderManager = Renderer.getRenderManager()

export default class RenderHelper {
    static getRenderYaw = () => RenderManager./* playerViewX */field_78732_j

    static getRenderPitch = () => RenderManager./* playerViewY */field_78735_i

    static getRenderPos() {
        return [
            RenderManager./* field_78725_b */renderPosX, 
            RenderManager./* field_78726_c */renderPosY, 
            RenderManager./* field_78723_d */renderPosZ
        ]
    }
    
    static getRenderDistanceBlocks() {
        return Client.settings.video.getRenderDistance() * 16
    }

    static getAxisCoords(aabb) {
        return [
            aabb./* minX */field_72340_a, // Min X
            aabb./* minY */field_72338_b, // Min Y
            aabb./* minZ */field_72339_c, // Min Z
            aabb./* maxX */field_72336_d, // Max X
            aabb./* maxY */field_72337_e, // Max Y
            aabb./* maxZ */field_72334_f // Max Z
        ]
    }

    static isAABB = (object) => object instanceof AxisAlignedBB

    static isAir = (mcBlockState) => mcBlockState == IBlockStateAir

    static toAABB(x, y, z, w = 1, h = 1) {
        return new AxisAlignedBB(
            x - w / 2,
            y,
            z - w / 2,
            x + w / 2,
            y + h,
            z + w / 2
        )./* expand */func_72314_b(0.002, 0.002, 0.002)
    }

    /** @param {Block} ctBlock*/
    static getCTBlockAABB(ctBlock) {
        const MCBlockPos = ctBlock.pos.toMCBlock()
        const MCBlock = ctBlock.type.mcBlock
        const MCWorldClient = World.getWorld()

        if (!this.isAir(ctBlock))
            MCBlock./* setBlockBoundsBasedOnState */func_180654_a(MCWorldClient, MCBlockPos)

        return MCBlock./* getSelectedBoundingBox */func_180646_a(MCWorldClient, MCBlockPos)./* expand */func_72314_b(0.002, 0.002, 0.002)
    }

    static coerceToRenderDist(x, y, z) {
        const renderDistBlocks = this.getRenderDistanceBlocks()
        const [rx, ry, rz] = this.getRenderPos()
        const distTo = Math.hypot(rx - x, ry - y, rz - z)

        if (distTo < renderDistBlocks) return [x, y, z]

        const scale = renderDistBlocks / distTo

        return [
            rx + (x - rx) * scale,
            ry + (y - ry) * scale,
            rz + (z - rz) * scale
        ]
    }

    static inFrustum = (aabb) => Frustum?.inFrustum(aabb)
}