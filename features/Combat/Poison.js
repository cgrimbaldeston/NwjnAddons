import GuiFeature from "../../libs/Features/GuiFeature"

new class Poison extends GuiFeature {
    constructor() {
        super(this)
            .addEvent("interval", () => {
                if (!World.isLoaded()) return

                const stats = [0, 0, 0]

                Player.getInventory().getItems().forEach(item => {
                    if (!/(dyePowder|arrow)/g.test(item?.toString())) return

                    const itemName = item.getName().removeFormatting()
                    const stackSize = item.getStackSize()

                    switch(itemName) {
                        case "Twilight Arrow Poison": return stats[0] += stackSize
                        case "Flint Arrow": return stats[1] += stackSize
                        case "Toxic Arrow Poison": return stats[2] += stackSize
                        default: return
                    }
                })

                this.setStatistics(stats)
            }, 1)

        this.defaultText = this.setStatistics([0, 0, 0])
    }

    setStatistics([twilight, arrows, toxic]) {
        this.setText([
            `${twilight}&8x &5Twilight Arrow Poison`,
            `${arrows}&8x &rFlint Arrows`,
            `${toxic}&8x &aToxic Arrow Poison`
        ].join("\n"))

        return this.text
    }
}