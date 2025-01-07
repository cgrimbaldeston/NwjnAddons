/** 
 * An adaption of STuF (Requested by Stuffy)
 * @author stuffyerface
 * @credit https://github.com/stuffyerface/ImageLinkFix
 */

import Feature from "../../libs/Features/Feature";
import TextUtil from "../../core/static/TextUtil";

const whitelist = /^(wiki.)?hypixel.net|plancke.io$/

new Feature({setting: "linkFix"})
    .addEvent("messageSent", (msg, event) => {
        const [link, domain] = TextUtil.getMatches(/([a-z\d]{2,}:\/\/([-\w.]+\.[a-z]{2,})\/(?:$|\S+\.\w+|\S+))/, msg, 2)
        if (!(msg && link && domain) || whitelist.test(domain)) return

        const encoded = StuffysCipher.encode(link)
        if (!encoded) return

        cancel(event)
        ChatLib.say(msg.replace(link, encoded))
    })

    .addEvent("serverChat", (url, _, __, component) => {
        const decoded = StuffysCipher.decode(url)
        if (!decoded) return

        component["getSiblings", "func_150253_a"]().map(comp => {
            const text = comp.text
            if (!text.includes(url)) return comp

            // Bypass CT messing up link text in new TextComponent & setText
            comp.text = text.replace(url, decoded)

            // Now use CT's TextComponent with MC's TextComponent
            return new TextComponent(comp)
                .setHover("show_text", decoded)
                .setClick("open_url", decoded)
                .chatComponentText
        })
    }, / (l\$(?:h|H)?\d+\|\S+)/)

const schemes = {
    "h": "http://",
    "H": "https://",
    "http://": "h",
    "https://": "H"
}
const extensions = {
    1: ".png",
    2: ".jpg",
    3: ".jpeg",
    4: ".gif",
    ".png": 1,
    ".jpg": 2,
    ".jpeg": 3,
    ".gif": 4
}
const charSet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
class StuffysCipher {
    /**
    * Decodes a string in Standardized Truncated url Format.
    * @param {String} encoded The encoded string to decode.
    * @returns {String} The decoded url
    */
    static decode(encoded) {
        const [valid, scheme, extension, dots, body] = TextUtil.getMatches(/^(l\$(\S)?(\S)?(\d+)\|(\S+))$/, encoded, 5)
        if (!valid) return

        const dotsLen = 9 - dots.length

        const firstBody = body.slice(0, dotsLen)
        const secondBody = body.slice(dotsLen).replace(/\^/g, ".")

        const translated = StuffysCipher.translate(firstBody + secondBody, -1)

        const dotted = Array.from(dots).reduce((prev, curr) => {
            const slice = prev.slice(Number(curr))
            return prev.replace(slice, "." + slice)
        }, translated)

        const prefix = schemes[scheme] ?? ""
        const suffix = extensions[extension] ?? ""

        return prefix + dotted + suffix
    }

    /**
    * Encodes a string in Standardized Truncated url Format.
    * @param {String} url - The URL to Encode.
    * @returns {String} The encoded url
    */
    static encode(url) {
        let encoded = "l$"

        const [valid, scheme, host, dir] = TextUtil.getMatches(/^(([a-z\d]{2,}:\/\/)([-\w.]+\.[a-z]{2,})(\/\S*))$/, url, 5)
        if (!valid) return

        const prefix = (encoded == (encoded += schemes[scheme] ?? "")) ? scheme : ""
        const suffix = (encoded == (encoded += extensions[dir.slice(-5)] ?? "")) ? (encoded += 0, dir) : dir.slice(0, -5)

        const dotted = prefix + host + suffix

        const firstBody = Array.from(dotted.slice(0, 10)).reduce((prev, curr, idx) => {
            if (curr === ".") return encoded += idx, prev
            else return prev + curr
        }, "")
        encoded += "|" 

        const secondBody = dotted.slice(10).replace(/\./g, "^")

        return encoded += StuffysCipher.translate(firstBody + secondBody, 1)
    }

    /**
    * @param {String} input 
    * @param {Number} inc Encode uses 1, Decode uses -1
    * @returns {String}
    */
    static translate(input, inc) {
        return Array.from(input).reduce((prev, curr) => {
            const idx = charSet.indexOf(curr)

            const ret = ~idx ? charSet[StuffysCipher.wrapIndex(idx + inc, 0, 61)] : curr

            return prev + ret
        }, "")
    }

    static wrapIndex(index, min, max) {
        const range = (max - min) + 1
        return ((index - min) % range + range) % range + min
    }
}