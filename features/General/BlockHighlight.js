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
                const ZeWorld = World.getWorld()
        
                const BlockPos = target./* getBlockPos */func_178782_a()
                if (!BlockPos) return

                const BlockState = ZeWorld./* getBlockState */func_180495_p(BlockPos) 
                if (RenderHelper.isAir(BlockState)) return
        
                // Accurately retrieve the Block's bounds
                const Block = BlockState./* getBlock */func_177230_c()
                Block./* setBlockBoundsBasedOnState */func_180654_a(ZeWorld, BlockPos)
                const BlockBounds = Block./* getSelectedBoundingBox */func_180646_a(ZeWorld, BlockPos)
        
                RenderUtil.drawFilledOutline(BlockBounds, this.Color, false, 6, false)
            })

        Settings.getConfig().registerListener("BlockHighlightColor", (_, val) => this.Color = val)
        this.init()
    }

    onEnabled() {
        const MovingObjectType$BLOCK = net.minecraft.util.MovingObjectPosition.MovingObjectType.BLOCK
        this.isTargetingBlock = (typeOfHit) => typeOfHit.equals(MovingObjectType$BLOCK)
        this.Color = Settings.BlockHighlightColor
    }

    onDisabled() {
        delete this.isTargetingBlock
        delete this.Color
    }
}