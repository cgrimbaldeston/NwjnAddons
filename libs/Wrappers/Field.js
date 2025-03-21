export function getField(instance, fieldName) {
    return new WrappedJavaField(instance, fieldName);
}

export function getFields(instance, ...fieldNames) {
    return fieldNames.map(name => new WrappedJavaField(instance, name));
}

export function getFieldValue(instance, fieldName) {
    return WrappedJavaField.get(instance, fieldName);
}

export function setFieldValue(instance, fieldName, value) {
    return WrappedJavaField.set(instance, fieldName, value);
}

/**
 * For Minecraft classes this is hardly necessary, however,
 * This is better practice for any kind of reflection.
 * Additionally this may be important while working with Non-Minecraft classes
 * @param {JavaTField} field 
 * @param {Function} runnable 
 * @returns value of [runnable] if any
 */
function runSafely(field, runnable) {
    field.setAccessible(true);
    const ret = runnable();
    field.setAccessible(false);

    return ret;
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
        this.isSafe = this.property.isAccessible();
    }

    get(instance = null) {
        if (this.isSafe) return this.property.get(instance);

        return runSafely(this.property, () => this.property.get(instance));
    }

    set(instance = null, value) {
        if (this.isSafe) return this.property.set(instance, value);

        return runSafely(this.property, () => this.property.set(instance, value));
    }
}