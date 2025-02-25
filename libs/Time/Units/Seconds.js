export default class Seconds {
    /** @override */ onChange(value) {}

    static of(value) {
        if (typeof(value) === "number") return new this(value)
        return new this(value?.toSeconds())
    }

    constructor(seconds) {
        this.value = ~~seconds
    }

    toTicks = () => this.value * 20

    getValue = () => this.value

    setValue(seconds) {
        this.value = seconds

        this?.onChange(this.value)
    }
}