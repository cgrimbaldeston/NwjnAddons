import Frustum from "./Frustum"
const AxisAlignedBB = net.minecraft.util.AxisAlignedBB
const IBlockStateAir = new BlockType(0).getDefaultState()
const RenderManager = Renderer.getRenderManager()

export default class RenderHelper {
    static getRenderYaw = () => RenderManager./* playerViewX */field_78732_j

    static getRenderPitch = () => RenderManager./* playerViewY */field_78735_i

    static getRenderPos = () => {
        return {
            rx: Frustum.getRenderX(),
            ry: Frustum.getRenderY(),
            rz: Frustum.getRenderZ()
        }
    }

    static inFrustum = (aabb) => Frustum.isAABBInFrustum(aabb)

    static isEntityInFrustum = (entity) => Frustum.isAABBInFrustum(entity./* getEntityBoundingBox */func_174813_aQ())
    
    static getRenderDistanceBlocks() {
        return Client.settings.video.getRenderDistance() * 16
    }

    static getAxisCoords(aabb) {
        return [
            aabb./* minX */field_72340_a,
            aabb./* minY */field_72338_b,
            aabb./* minZ */field_72339_c,
            aabb./* maxX */field_72336_d,
            aabb./* maxY */field_72337_e,
            aabb./* maxZ */field_72334_f
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
        const {rx, ry, rz} = this.getRenderPos()
        const distTo = Math.hypot(rx - x, ry - y, rz - z)

        if (distTo < renderDistBlocks) return [x, y, z]

        const scale = renderDistBlocks / distTo

        return [
            rx + (x - rx) * scale,
            ry + (y - ry) * scale,
            rz + (z - rz) * scale
        ]
    }
}