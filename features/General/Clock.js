import GuiFeature from "../../libs/Features/GuiFeature";

new class Clock extends GuiFeature {
    constructor() {
        super(this)
            .addEvent("interval", () => this?.setTime(), 1)

        this.setText("00:00:00 AM")
    }

    onEnabled() {
        const TimeFormatter = new java.text.SimpleDateFormat("hh:mm:ss a", java.util.Locale.US)
        this.setTime = () => this.setText(TimeFormatter.format(Date.now()))
    }
    
    onDisabled() {
        delete this.setTime
    }
}