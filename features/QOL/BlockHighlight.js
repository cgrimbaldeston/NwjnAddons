import Feature from "../../libs/Features/Feature"
import RenderUtil from "../../libs/Render/RenderUtil"
import Settings from "../../data/Settings"
import RenderHelper from "../../libs/Render/RenderHelper"

new class BlockHighlight extends Feature {
    constructor() {
        super({setting: "blockHighlight"}), this
            .addEvent(net.minecraftforge.client.event.DrawBlockHighlightEvent, (event) => {
                const {target} = event
                cancel(event)
        
                if (!this?.isTargetingBlock(target./* typeOfHit */field_72313_a)) return
        
                const BlockPos = target./* getBlockPos */func_178782_a()
                if (!BlockPos) return

                const BlockState = this.World./* getStateAt */func_180495_p(BlockPos) 
                if (RenderHelper.isAir(BlockState)) return
        
                // Accurately retrieve the Block's bounds
                const Block = BlockState./* getBlock */func_177230_c()
                Block./* setBoundsBasedOnState */func_180654_a(this.World, BlockPos)
                const BlockBounds = Block./* getSelectedBoundingBox */func_180646_a(this.World, BlockPos)
        
                const [r, g, b, a] = this.Color
                RenderUtil.drawOutlinedAABB(BlockBounds, r, g, b, a, false, 3, false)
            })

        Settings().getConfig().registerListener("highlightColor", (_, val) => this.Color = val)
    }

    onRegister() {
        const MovingObjectType$BLOCK = net.minecraft.util.MovingObjectPosition.MovingObjectType.BLOCK
        this.isTargetingBlock = (typeOfHit) => typeOfHit == MovingObjectType$BLOCK

        this.World = World.getWorld()
        this.Color = Settings().highlightColor
    }

    onUnregister() {
        this.isTargetingBlock = null
        this.World = null
        this.Color = null
    }
}