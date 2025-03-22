export function getField(instance, fieldName) {
    return new WrappedJavaField(instance, fieldName);
}

export function getFieldValue(instance, fieldName) {
    return WrappedJavaField.get(instance, fieldName);
}

export function setFieldValue(instance, fieldName, value) {
    return WrappedJavaField.set(instance, fieldName, value);
}

class WrappedJavaField {
    static get(instance, fieldName) {
        return new this(instance, fieldName).get(instance);
    }

    static set(instance, fieldName, value) {
        return new this(instance, fieldName).set(instance, value);
    }

    constructor(instance, fieldName) {
        this.property = instance.class.getDeclaredField(fieldName);
        this.shouldLeaveOpen = this.property.isAccessible();
    }

    get(instance) {
        if (!instance) return console.warn("Reflected Java Fields require an instance parameter to access this getter");
        /* Resetting accessibility because it is better practice despite it being largely unnecessary */

        if (!this.shouldLeaveOpen) this.property.setAccessible(true);
        const value = this.property.get(instance);
        if (!this.shouldLeaveOpen) this.property.setAccessible(false);

        return value;
    }

    set(instance, value) {
        if (!instance) return console.warn("Reflected Java Fields require an instance parameter to access this setter");
        /* Resetting accessibility because it is better practice despite it being largely unnecessary */

        if (!this.shouldLeaveOpen) this.property.setAccessible(true);
        this.property.set(instance, value);
        if (!this.shouldLeaveOpen) this.property.setAccessible(false);
    }
}