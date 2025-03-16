import GuiFeature from "../../libs/Features/GuiFeature";

new class Clock extends GuiFeature {
    constructor() {
        const defaultText = ["00:00:00 AM"]

        super(this, defaultText)
            .addEvent("interval", () => this?.setTime(), 1)

        this.init()
    }

    onEnabled() {
        const TimeFormatter = new java.text.SimpleDateFormat("hh:mm:ss a", java.util.Locale.US)
        this.setTime = () => this.setLine(TimeFormatter.format(Date.now()))
    }
    
    onDisabled() {
        delete this.setTime
    }
}