import Feature from "../../libs/Features/Feature"
import RenderUtil from "../../libs/Render/RenderUtil"
import RenderHelper from "../../libs/Render/RenderHelper"
import { ColorContainer } from "../../libs/Render/ColorContainer"
import Settings from "../../data/Settings"

new class BlockHighlight extends Feature {
    constructor() {
        super({setting: "BlockHighlight"})

        this.Color = ColorContainer.registerListener(Settings, "BlockHighlightColor")

        this.addEvent(net.minecraftforge.client.event.DrawBlockHighlightEvent, this.onBlockHighlight.bind(this))

        this.init()
    }

    onBlockHighlight(event) {
        const {target} = event
        cancel(event)

        if (target./* typeOfHit */field_72313_a?.toString() !== "BLOCK") return
        
        const BlockPos = target./* getBlockPos */func_178782_a()
        if (!BlockPos) return
        
        const world = World.getWorld()
        const BlockState = world./* getBlockState */func_180495_p(BlockPos) 
        if (RenderHelper.isAir(BlockState)) return

        // Accurately retrieve the Block's bounds
        const Block = BlockState./* getBlock */func_177230_c()
        Block./* setBlockBoundsBasedOnState */func_180654_a(world, BlockPos)
        const BlockBounds = Block./* getSelectedBoundingBox */func_180646_a(world, BlockPos)

        RenderUtil.drawFilledOutline(BlockBounds, this.Color, false, 6, false)
    }
}