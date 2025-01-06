const SimpleDateFormat = java.text.SimpleDateFormat
const LocaleUS = java.util.Locale.US

const TIME_SHORT = new SimpleDateFormat("hh:mm:ss a", LocaleUS)
const TIME_LONG = new SimpleDateFormat("E hh:mm:ss a z", LocaleUS)

export default class TimeUtil {
    static getShortTime() {
        return TIME_SHORT.format(Date.now())
    }
    
    static getLongTime() {
        return TIME_LONG.format(Date.now())
    }
}