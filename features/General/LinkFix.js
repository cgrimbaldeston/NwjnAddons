/** @see StuffysCipher */
import StuffysCipher from "../../core/static/StuffysCipher";
import Feature from "../../libs/Features/Feature";

const whitelist = /^(wiki.)?hypixel.net|plancke.io$/

new Feature({setting: "linkFix"})
    .addEvent("messageSent", (link, domain, event, msg) => {
        if (whitelist.test(domain)) return

        const encoded = StuffysCipher.encode(link)
        if (!encoded) return

        cancel(event)
        ChatLib.say(msg.replace(link, encoded))
    }, /([a-z\d]{2,}:\/\/([-\w.]+\.[a-z]{2,})\/(?:$|\S+\.\w+|\S+))/)

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
                .setHover("show_text", decoded.removeFormatting())
                .setClick("open_url", decoded.removeFormatting())
                .chatComponentText
        })
    }, / (l\$(?:h|H)?\d+\|\S+)/)