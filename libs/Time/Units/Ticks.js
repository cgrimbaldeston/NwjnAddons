export default class Ticks {
    /** @override */ onChange(value) {}

    static of(value) {
        if (typeof(seconds) === "number") return new this(value)
        return new this(value?.toTicks())
    }

    constructor(ticks) {
        this.value = ~~ticks
    }

    toSeconds = () => this.value * 0.05

    getValue = () => this.value

    setValue(value) {
        this.value = value

        this.onChange(this.value)
    }
}