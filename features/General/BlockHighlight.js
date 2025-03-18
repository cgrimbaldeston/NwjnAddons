import Feature from "../../libs/Features/Feature"
import RenderUtil from "../../libs/Render/RenderUtil"
import RenderHelper from "../../libs/Render/RenderHelper"

new class BlockHighlight extends Feature {
    constructor() {
        super({setting: this.constructor.name})
            .addColorListener()
            .addEvent(net.minecraftforge.client.event.DrawBlockHighlightEvent, (event) => {
                const {target} = event
                cancel(event)
        
                if (!this.isTargetingBlock(target./* typeOfHit */field_72313_a)) return
                const world = World.getWorld()
        
                const BlockPos = target./* getBlockPos */func_178782_a()
                if (!BlockPos) return

                const BlockState = world./* getBlockState */func_180495_p(BlockPos) 
                if (RenderHelper.isAir(BlockState)) return
        
                // Accurately retrieve the Block's bounds
                const Block = BlockState./* getBlock */func_177230_c()
                Block./* setBlockBoundsBasedOnState */func_180654_a(world, BlockPos)
                const BlockBounds = Block./* getSelectedBoundingBox */func_180646_a(world, BlockPos)
        
                RenderUtil.drawFilledOutline(BlockBounds, this.Color, false, 6, false)
            })

        this.init()
    }

    onEnabled() {
        const MovingObjectType$BLOCK = net.minecraft.util.MovingObjectPosition.MovingObjectType.BLOCK
        this.isTargetingBlock = (typeOfHit) => typeOfHit.equals(MovingObjectType$BLOCK)
    }

    onDisabled() {
        delete this.isTargetingBlock
    }
}