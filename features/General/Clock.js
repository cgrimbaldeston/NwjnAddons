import GuiFeature from "../../libs/Features/GuiFeature";
import { data } from "../../data/Data";

new class Clock extends GuiFeature {
    constructor() {
        super({
            setting: "clock",
            name: "Clock",
            dataObj: data.Clock,
            initText: "00:00:00 AM",
            color: "clockColor"
        })
            .addEvent("interval", () => this.setText(this?.getTime()), 1)
    }

    onEnabled() {
        const TimeFormatter = new java.text.SimpleDateFormat("hh:mm:ss a", java.util.Locale.US)

        this.getTime = () => TimeFormatter.format(Date.now())
    }

    onDisabled() {
        this.getTime = null
    }
}