import Time from "../../libs/Time/Util"
import GuiFeature from "../../libs/Features/GuiFeature";
import { data } from "../../data/Data";

const clock = new GuiFeature({
    setting: "clock",
    name: "Clock",
    dataObj: data.Clock,
    baseText: "0:00:00",
    color: "clockColor"
})
    .addEvent("interval", () => {
        clock.text = Time.getShortTime()
    }, 1)