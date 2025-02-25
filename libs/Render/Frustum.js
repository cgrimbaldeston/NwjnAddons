/** Optimized by PerseusPotter */

export default new class Frustum {
    /**
     * @override Should be overridden when Frustum is created
     * @param AxisAlignedBB net.minecraft.util.AxisAlignedBB
     * @returns {Boolean} true if any corner of the aabb is within the frustum
     */
    isAABBInFrustum(AxisAlignedBB) {}
        
    /**
     * @override Should be overridden when Frustum is created
     * @param {Number} minX
     * @param {Number} minY
     * @param {Number} minZ
     * @param {Number} maxX
     * @param {Number} maxY
     * @param {Number} maxZ
     * @returns {Boolean} true if any corner of the aabb is within the frustum
     */
    isBoxInFrustum(minX, minY, minZ, maxX, maxY, maxZ) {}

    constructor() {
        // Needs to be called from within the Minecraft Thread to initialize the Frustum class
        Client.scheduleTask(() => {
            const RenderManager = Renderer.getRenderManager()
            const RenderManagerClass = RenderManager.class
            const renderPosX = RenderManagerClass.getDeclaredField("field_78725_b")
            const renderPosY = RenderManagerClass.getDeclaredField("field_78726_c")
            const renderPosZ = RenderManagerClass.getDeclaredField("field_78723_d")
            renderPosX.setAccessible(true), renderPosY.setAccessible(true), renderPosZ.setAccessible(true)

            // Needs to be called from within the Minecraft Thread to initialize the Frustum class
            // Otherwise you will get this error: Java.lang.RuntimeException: No OpenGL context found in the current thread.
            const frustum = new net.minecraft.client.renderer.culling.Frustum()

            this.isAABBInFrustum = (AxisAlignedBB) => frustum./* isBoundingBoxInFrustum */func_78546_a(AxisAlignedBB)
            this.isBoxInFrustum = (minX, minY, minZ, maxX, maxY, maxZ) => frustum./* isBoxInFrustum */func_78548_b(minX, minY, minZ, maxX, maxY, maxZ)

            // Updates frustum position on preRenderTicks, all view angle changes are handled within GL
            const PRE = net.minecraftforge.fml.common.gameevent.TickEvent.Phase.START
            register(net.minecraftforge.fml.common.gameevent.TickEvent.RenderTickEvent, ({phase}) => {
                if (phase.equals(PRE)) return

                frustum./* setPos */func_78547_a(
                    renderPosX.get(RenderManager), 
                    renderPosY.get(RenderManager), 
                    renderPosZ.get(RenderManager)
                )
            })
        })
    }
}