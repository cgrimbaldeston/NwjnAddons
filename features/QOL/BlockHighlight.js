import Feature from "../../libs/Features/Feature"
import RenderUtil from "../../core/static/RenderUtil"
import Settings from "../../data/Settings"

const DrawBlockHighlightEvent = net.minecraftforge.client.event.DrawBlockHighlightEvent
const MovingObjectTypeBLOCK = net.minecraft.util.MovingObjectPosition.MovingObjectType.BLOCK
const Air = net.minecraft.block.material.Material["air", "field_151579_a"]

new Feature({setting: "blockHighlight"})
    .addEvent(DrawBlockHighlightEvent, (event) => {
        const { target } = event
        if (target["typeOfHit", "field_72313_a"] !== MovingObjectTypeBLOCK) return
        
        const pos = target["getBlockPos", "func_178782_a"]()
        const WorldClient = World.getWorld()
        const BlockAt = WorldClient["getStateAt", "func_180495_p"](pos)["getBlock", "func_177230_c"]()
        
        if (BlockAt["getMaterial", "func_149688_o"]() === Air) return
        
        BlockAt["setBlockBoundsBasedOnState", "func_180654_a"](WorldClient, pos)
        const AABB = BlockAt["getSelectedBoundingBox", "func_180646_a"](WorldClient, pos)
        
        const color = Settings().highlightColor
        RenderUtil.drawOutlinedAABB(AABB, color[0], color[1], color[2], color[3], false, 3)
        cancel(event)
    })