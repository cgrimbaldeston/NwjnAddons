export function getMethod(instance, methodName) {
    return new WrappedJavaMethod(instance, methodName);
}

export function getMethods(instance, ...methodNames) {
    return methodNames.map(name => new WrappedJavaMethod(instance, name));
}

export function getMethodValue(instance, methodName, ...params) {
    return WrappedJavaMethod.call(instance, methodName, params);
}

/**
 * For Minecraft classes this is hardly necessary, however,
 * This is better practice for any kind of reflection.
 * Additionally this may be important while working with Non-Minecraft classes
 * @param {JavaTMethod} method 
 * @param {Function} runnable 
 * @returns value of [runnable] if any
 */
function runSafely(method, runnable) {
    method.setAccessible(true);
    const ret = runnable();
    method.setAccessible(false);

    return ret;
}

class WrappedJavaMethod {
    static call(instance, methodName, params) {
        return new this(instance, methodName).call(instance, params);
    }

    constructor(instance, methodName) {
        this.property = instance.class.getDeclaredMethod(methodName);
        this.isSafe = this.property.isAccessible();
    }

    call(instance = null, ...params) {
        if (this.isSafe) return this.property.invoke(instance, params);

        return runSafely(this.property, () => this.property.invoke(instance, params));
    }
}