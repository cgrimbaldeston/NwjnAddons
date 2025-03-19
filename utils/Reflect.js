export function getProperty(instance, propertyName) {
    return new WrappedJavaProperty(instance, propertyName);
}

class WrappedJavaProperty {
    constructor(instance, propertyName) {
        const clazz = instance.class
        if (!clazz.isInstance(instance)) this.class = instance;
        this.isMethod = /^func_/.test(propertyName);

        this.property = this.isMethod 
            ? clazz.getDeclaredMethod(propertyName)
            : clazz.getDeclaredField(propertyName);

        this.initialFlag = this.property.isAccessible();
    }

    get(instance = this.class) {
        if (this.isMethod) return;

        if (!this.initialFlag) this.property.setAccessible(true);
        
        const value = this.property.get(instance);

        if (!this.initialFlag) this.property.setAccessible(false);

        return value;
    }

    set(instance = this.class, value) {
        if (this.isMethod) return;

        if (!this.initialFlag) this.property.setAccessible(true);
        
        const value = this.property.set(instance, value);

        if (!this.initialFlag) this.property.setAccessible(false);
    }

    call(instance = this.class, ...params) {
        if (!this.isMethod) return;

        if (!this.initialFlag) this.property.setAccessible(true);
        
        this.property.invoke(instance, params);

        if (!this.initialFlag) this.property.setAccessible(false);
    }
}