import Feature from "../../libs/Features/Feature";
import RenderHelper from "../../libs/Render/RenderHelper";

new class BetterCulling extends Feature {
    constructor() {
        super({setting: "betterCulling"}), this

            // Cancel rendering for entities outside of screen area
            .addEvent(
                register(net.minecraftforge.client.event.RenderLivingEvent.Pre, (event) => 
                    !RenderHelper.isEntityInFrustum(event.entity) && cancel(event)
                ).setPriority(Priority.HIGHEST)
            )

            // Cancel receiving position, rotation, and other logic updates for entities outside of screen area
            .addEvent(net.minecraftforge.event.entity.living.LivingEvent.LivingUpdateEvent, (event) => 
                !RenderHelper.isEntityInFrustum(event.entity) && !event.entity./* isInvisible */func_82150_aj() && cancel(event)
            )
    }
}