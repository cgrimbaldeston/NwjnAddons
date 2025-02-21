export default new class Frustum {
    constructor() {
        const RenderManager = Renderer.getRenderManager()

        // Needs to be called from within the Minecraft Thread to initialize the Frustum class
        Client.scheduleTask(() => {
            const frustum = new net.minecraft.client.renderer.culling.Frustum()

            this.inFrustum = (aabb) => frustum./* isBoundingBoxInFrustum */func_78546_a(aabb)

            register("packetSent", () => 
                frustum./* setPos */func_78547_a(
                    RenderManager./* field_78725_b */renderPosX, 
                    RenderManager./* field_78726_c */renderPosY, 
                    RenderManager./* field_78723_d */renderPosZ
                )
            ).setFilteredClass(net.minecraft.network.play.client.C03PacketPlayer$C04PacketPlayerPosition)
        })
    }
}