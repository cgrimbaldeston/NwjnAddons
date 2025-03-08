import Feature from "../../libs/Features/Feature"
import RenderUtil from "../../libs/Render/RenderUtil"
import Settings from "../../data/Settings"
import RenderHelper from "../../libs/Render/RenderHelper"

new class BlockHighlight extends Feature {
    constructor() {
        super(this)
            .addEvent(net.minecraftforge.client.event.DrawBlockHighlightEvent, (event) => {
                const {target} = event
                cancel(event)
        
                if (!this?.isTargetingBlock(target./* typeOfHit */field_72313_a)) return
        
                const BlockPos = target./* getBlockPos */func_178782_a()
                if (!BlockPos) return

                const BlockState = this.World./* getBlockState */func_180495_p(BlockPos) 
                if (RenderHelper.isAir(BlockState)) return
        
                // Accurately retrieve the Block's bounds
                const Block = BlockState./* getBlock */func_177230_c()
                Block./* setBlockBoundsBasedOnState */func_180654_a(this.World, BlockPos)
                const BlockBounds = Block./* getSelectedBoundingBox */func_180646_a(this.World, BlockPos)
        
                RenderUtil.drawOutlinedAABB(BlockBounds, this.Color, false, 4, false)
            })

        Settings.getConfig().registerListener("BlockHighlightColor", (_, val) => this.Color = val)
    }

    onEnabled() {
        const MovingObjectType$BLOCK = net.minecraft.util.MovingObjectPosition.MovingObjectType.BLOCK
        this.isTargetingBlock = (typeOfHit) => typeOfHit.equals(MovingObjectType$BLOCK)
    }

    onDisabled() {
        delete this.isTargetingBlock
    }

    onRegister() {
        this.World = World.getWorld()
        this.Color = Settings.BlockHighlightColor
    }

    onUnregister() {
        delete this.World
        delete this.Color
    }
}