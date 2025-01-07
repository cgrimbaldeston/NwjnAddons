// Credit: https://github.com/DocilElm/Doc/blob/main/shared/TextHelper.js
const numberFormat = { undefined: 1, "k": 1_000, "m": 1_000_000, "b": 1_000_000_000 };

export default class MathUtil {
    static toRadian = (num) => num * (Math.PI / 180)

    /**
     * - Converts a string into it's value in number e.g 1.2k to 1200
     * @param {String} string 
     * @returns {Number}
     */
    static convertToNumber(string) {
        const [ _, number, format ] = string.toLowerCase().match(/([\d\.,]+)([kmb])?/)

        return parseFloat(number) * numberFormat[format]
    }

    /**
     * Adds seperator notation to bigger numbers
     * @param {Number} num 
     * @param {String} seperator 
     * @returns {String}
     */
    static addCommas = (num, seperator = ',') => num.toFixed(1).replace(/\B(?=(\d{3})+(?!\d))/g, seperator)

    static getDistance(arr1, arr2) {
        return Math.abs(Math.hypot(arr1[0] - arr2[0], arr1[1] - arr2[1], arr1[2] - arr2[2]))
    }
}