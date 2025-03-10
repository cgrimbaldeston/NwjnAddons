import Frustum from "./Frustum"
const AxisAlignedBB = net.minecraft.util.AxisAlignedBB
const IBlockStateAir = new BlockType(0).getDefaultState()
const RenderManager = Renderer.getRenderManager()

export default class RenderHelper {
    static getRenderYaw = () => RenderManager./* playerViewX */field_78732_j

    static getRenderPitch = () => RenderManager./* playerViewY */field_78735_i

    static getRenderPos() {
        return {
            rx: Frustum.getRenderX(),
            ry: Frustum.getRenderY(),
            rz: Frustum.getRenderZ()
        }
    }

    static lerp = (last, curr, mult) => last + (curr - last) * mult

    static toRGBA(long) {
        return [
            ((long >> 24) & 0xFF) / 255,
            ((long >> 16) & 0xFF) / 255,
            ((long >> 8) & 0xFF) / 255,
            ((long >> 0) & 0xFF) / 255
        ]
    }

    static inFrustum = (aabb) => Frustum.isAABBInFrustum(aabb)

    static isBoundsInFrustum = (x, y, z, w, h) => Frustum.isBoxInFrustum.call(null, RenderHelper.createBounds(x, y, z, w, h))

    static isEntityInFrustum = (entity) => Frustum.isAABBInFrustum(entity./* getEntityBoundingBox */func_174813_aQ())
    
    static getRenderDistanceBlocks = () => Client.settings.video.getRenderDistance() * 16

    static getAxisCoords(aabb) {
        return [
            aabb./* minX */field_72340_a - 0.002,
            aabb./* minY */field_72338_b - 0.002,
            aabb./* minZ */field_72339_c - 0.002,
            aabb./* maxX */field_72336_d + 0.002,
            aabb./* maxY */field_72337_e + 0.002,
            aabb./* maxZ */field_72334_f + 0.002
        ]
    }

    static createBounds(x, y, z, w, h) {
        const wHalf = w / 2
        return [
            (x - wHalf) - 0.002,
            (y) - 0.002,
            (z - wHalf) - 0.002,

            (x + wHalf) + 0.002,
            (y + h) + 0.002,
            (z + wHalf) + 0.002
        ]
    }

    static isAABB = (object) => object instanceof AxisAlignedBB

    static isAir = (mcBlockState) => mcBlockState == IBlockStateAir

    static toAABB = (x, y, z, w, h) => new AxisAlignedBB.call(null, RenderHelper.createBounds(x, y, z, w, h))

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

        return {
            x: this.lerp(rx, x, scale),
            y: this.lerp(ry, y, scale),
            z: this.lerp(rz, z, scale),
            s: scale
        }
    }
}