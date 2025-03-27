/**
 * - Gets an accessible wrapped java reflected method
 * @param {JavaTClass} instance class or instance
 * @param {String} methodName 
 * @returns {WrappedJavaMethod}
 */
export function getMethod(instance, methodName) {
    return new WrappedJavaMethod(instance, methodName);
}

/**
 * - Calls a wrapped java reflected method once
 * - For single-use calls
 * @param {JavaTClass} instance class or instance
 * @param {String} methodName 
 * @param {...*} params parameters used during method invocation
 * @returns {*} value returned by method, if any
 */
export function callMethod(instance, methodName, ...params) {
    return new WrappedJavaMethod(instance, methodName).call(instance, params);
}

/** @internal */
class WrappedJavaMethod {
    /**
     * @param {JavaTClass} instance class or instance
     * @param {String} methodName 
     */
    constructor(instance, methodName) {
        this.property = instance.class.getDeclaredMethod(methodName);
        this.shouldLeaveOpen = this.property.isAccessible();
    }

    /**
     * - Accesses and calls the wrapped java reflected method
     * @param {JavaTClass} instance class or instance
     * @param {...*} params parameters used during method invocation
     * @returns value returned by method, if any
     */
    call(instance, ...params) {
        if (!instance) return console.warn("Reflected Java Methods require an instance parameter to access this caller");
        /* Resetting accessibility because it is better practice despite it being largely unnecessary */

        if (!this.shouldLeaveOpen) this.property.setAccessible(true);
        const value = this.property.invoke(instance, params);
        if (!this.shouldLeaveOpen) this.property.setAccessible(false);

        return value;
    }
}