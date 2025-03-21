/** 
 * An adaption of STuF (With Stuffy)
 * @author Stuffyerface
 * @link https://github.com/stuffyerface/ImageLinkFix
 */

import Feature from "../../libs/Features/Feature";
import TextUtil from "../../core/static/TextUtil";
import { getField } from "../../libs/Wrappers/Field";

new class LinkFix extends Feature {
    /**
     * @override
     * Decodes a string in Standardized Truncated url Format.
     * @param {String} encoded The encoded string to decode.
     * @returns {String} The decoded url
     */
    decode(encoded) {}

    /**
     * @override
     * Encodes a string in Standardized Truncated url Format.
     * @param {String} url - The URL to Encode.
     * @returns {String} The encoded url
     */
    encode(url) {}

    /**
     * @override
     * @param {String} input 
     * @param {Number} inc Encode uses 1, Decode uses -1
     * @returns {String}
     */
    translate(input, offset) {}

    /**
     * @override
     * @param {Number} index 
     * @param {Number} min
     * @param {Number} max
     * @returns {Number}
     */
    wrapIndex(index, min, max) {}

    constructor() {
        super({setting: this.constructor.name})
            .addEvent("messageSent", (msg, event) => {
                const [link] = TextUtil.getMatches(/([a-z\d]{2,}:\/\/[-\w.]+\.[a-z]{2,}\/(?:$|\S+\.\w+|\S+))/, msg)
                if (!link) return
        
                const encoded = this.encode(link)
                if (!encoded) return
        
                cancel(event)
                ChatLib.say(msg.replace(link, encoded))
            })
        
            .addEvent("serverChat", (url, _, __, component) => {
                const decoded = this.decode(url)
                if (!decoded) return
        
                component./* getSiblings */func_150253_a().find(comp => {
                    const text = this.textField?.get(comp)
                    if (!text?.includes(url)) return false
        
                    // Bypass CT messing up link text in new TextComponent & setText
                    this.textField?.set(comp, text.replace(url, decoded))
        
                    // Now use CT's TextComponent with MC's TextComponent
                    comp = new TextComponent(comp)
                        .setHover("show_text", decoded)
                        .setClick("open_url", decoded)
                        .chatComponentText

                    return true
                })
            }, / (l\$(?:h|H)?\d+\|\S+)/)
        this.init()
    }

    onEnabled() {
        this.textField = getField(net.minecraft.util.ChatComponentText, /* text */"field_150267_b")

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

        this.wrapIndex = (index, min, max) => {
            const range = (max - min) + 1
            return ((index - min) % range + range) % range + min
        }

        this.translate = (input, offset) => {
            return Array.from(input).reduce((prev, curr) => {
                const idx = charSet.indexOf(curr)
    
                const ret = ~idx ? charSet[this.wrapIndex(idx + offset, 0, charSet.length - 1)] : curr
    
                return prev + ret
            }, "")
        }

        this.decode = (encoded) => {
            const [matched, scheme, extension, dots, body] = TextUtil.getMatches(/^(l\$(\S)?(\S)?(\d+)\|(\S+))$/, encoded)
            if (!matched) return
    
            const dotsLen = 9 - dots.length
    
            const firstBody = body.slice(0, dotsLen)
            const secondBody = body.slice(dotsLen).replace(/\^/g, ".")
    
            const translated = this.translate(firstBody + secondBody, -1)
    
            const dotted = Array.from(dots).reduce((prev, curr) => {
                const slice = prev.slice(Number(curr))
                return prev.replace(slice, "." + slice)
            }, translated)
    
            const prefix = schemes[scheme] ?? ""
            const suffix = extensions[extension] ?? ""
    
            return prefix + dotted + suffix
        }

        this.encode = (url) => {
            let encoded = "l$"
    
            const [matched, scheme, host, dir] = TextUtil.getMatches(/^(([a-z\d]{2,}:\/\/)([-\w.]+\.[a-z]{2,})(\/\S*))$/, url)
            if (!matched) return
    
            const prefix = (encoded == (encoded += schemes[scheme] ?? "")) ? scheme : ""
            const suffix = (encoded == (encoded += extensions[dir.slice(-5)] ?? "")) ? (encoded += 0, dir) : dir.slice(0, -5)
    
            const dotted = prefix + host + suffix
    
            const firstBody = Array.from(dotted.slice(0, 10)).reduce((prev, curr, idx) => {
                if (curr === ".") return encoded += idx, prev
                else return prev + curr
            }, "")
            encoded += "|" 
    
            const secondBody = dotted.slice(10).replace(/\./g, "^")
    
            return encoded += this.translate(firstBody + secondBody, 1)
        }
    }

    onDisabled() {
        delete this.wrapIndex
        delete this.translate
        delete this.decode
        delete this.encode
        delete this.textField
    }
}