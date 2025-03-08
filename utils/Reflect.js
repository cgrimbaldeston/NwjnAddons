/**
 * https://github.com/PerseusPotter/chicktils/blob/master/util/polyfill.js#L75
 * @template {import ('../../@types/External').JavaClass<'java.lang.reflect.AccessibleObject'>} T
 * @param {T} obj
 * @returns {T}
 */
export function setAccessible(obj) {
    obj.setAccessible(true)
    return obj
}

export function getMethod(clazz, methodName) {
    return setAccessible(clazz.class.getDeclaredMethod(methodName))
}

export function getField(clazz, fieldName) {
    return setAccessible(clazz.class.getDeclaredField(fieldName))
}