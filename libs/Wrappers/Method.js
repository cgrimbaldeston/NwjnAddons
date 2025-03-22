export function getMethod(instance, methodName) {
    return new WrappedJavaMethod(instance, methodName);
}

export function getMethodValue(instance, methodName, ...params) {
    return WrappedJavaMethod.call(instance, methodName, params);
}

class WrappedJavaMethod {
    static call(instance, methodName, params) {
        return new this(instance, methodName).call(instance, params);
    }

    constructor(instance, methodName) {
        this.property = instance.class.getDeclaredMethod(methodName);
        this.shouldLeaveOpen = this.property.isAccessible();
    }

    call(instance, ...params) {
        if (!instance) return console.warn("Reflected Java Methods require an instance parameter to access this caller");
        /* Resetting accessibility because it is better practice despite it being largely unnecessary */

        if (!this.shouldLeaveOpen) this.property.setAccessible(true);
        const value = this.property.invoke(instance, params);
        if (!this.shouldLeaveOpen) this.property.setAccessible(false);

        return value;
    }
}