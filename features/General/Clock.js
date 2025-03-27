import GuiFeature from "../../libs/Features/GuiFeature"
import { ColorContainer } from "../../libs/Render/ColorContainer"
import Settings from "../../data/Settings"

new class Clock extends GuiFeature {
    constructor() {
        super({setting: "Clock"}, ["00:00:00 AM"])

        this.Color = ColorContainer.registerListener(Settings, "ClockColor")
        this.formatter = new java.text.SimpleDateFormat("hh:mm:ss a", java.util.Locale.US)

        this.addEvent("interval", this.onSecond.bind(this), 1)

        this.init()
    }

    onSecond() {
        this.setLine(this.formatter.format(Date.now()))
    }
}