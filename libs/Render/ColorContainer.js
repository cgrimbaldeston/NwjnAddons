export class ColorContainer {
    static registerListener(settings, configName) {
        const color = new ColorContainer(settings[configName])
        settings.getConfig().registerListener(configName, (_, newValue) => color.set(newValue))
        return color
    }

    static normal255(obj) {
        if (Array.isArray(obj)) return obj.map(comp => comp)
        else if (obj instanceof ColorContainer) return obj.rgba255
    }

    static normal1(obj) {
        if (Array.isArray(obj)) return obj.map(comp => comp / 0xff)
        else if (obj instanceof ColorContainer) return obj.rgba1
    }

    static color255(obj) {
        if (Array.isArray(obj)) return GlStateManager./* color */func_179131_c(obj[0] / 255, obj[1] / 255, obj[2] / 255, obj[3] / 255)
        else if (obj instanceof ColorContainer) return obj.glColor()
    }

    static color1(obj) {
        if (Array.isArray(obj)) return GlStateManager./* color */func_179131_c(obj[0], obj[1], obj[2], obj[3])
        else if (obj instanceof ColorContainer) return obj.glColor()
    }

    static toHex(rgba255Array) {
        const [r, g, b, a] = rgba255Array

        return r * 0x1000000
             + g * 0x10000
             + b * 0x100
             + a * 0x1
    }

    static toRGBA(int) {
        return [
            int >> 24 & 0xff,
            int >> 16 & 0xff,
            int >> 8  & 0xff,
            int >> 0  & 0xff
        ]
    }

    constructor(rgba255Array) {
        this.set(rgba255Array)
    }

    getRGBA255() {
        return this.rgba255.slice()
    }

    getRGBA1() {
        return this.rgba1.slice()
    }

    getHex() {
        return this.rgbaHex
    }

    getFontHex() {
        return this.argbHex | 0
    }

    set(rgba255Array) {
        if (typeof(rgba255Array) === "number") return this.set(ColorContainer.toRGBA(rgba255Array))
        if (!rgba255Array.every(comp => comp === parseInt(comp))) return this.set(rgba255Array.map(comp => comp * 0xff))

        const r = rgba255Array[0] & 0xff
        const g = rgba255Array[1] & 0xff
        const b = rgba255Array[2] & 0xff
        const a = rgba255Array[3] & 0xff

        this.rgba255 = [r, g, b, a]
        this.rgba1 = [r / 0xff, g / 0xff, b / 0xff, a / 0xff]
        this.rgbaHex = ColorContainer.toHex([r, g, b, a])
        this.argbHex = ColorContainer.toHex([a, r, g, b])
    }

    glColor(alpha = this.rgba1[3]) {
        GlStateManager./* color */func_179131_c(this.rgba1[0], this.rgba1[1], this.rgba1[2], alpha)
    }
}