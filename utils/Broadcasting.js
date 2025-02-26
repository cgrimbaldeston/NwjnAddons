import TextUtil, { notify } from "../core/static/TextUtil"
import { data } from "../data/Data"

new class Broadcaster {
    constructor() {
        try {
            const moduleApi = JSON.parse(FileLib.getUrlContent("https://chattriggers.com/api/modules/NwjnAddons"))
        
            // [Welcome Message]
            const welcome = data.newUser && register("worldLoad", () => {
                welcome.unregister()
                data.newUser = false
        
                notify(`&dFrom &6nwjn: &7Welcome! Open settings with '/nwjn'. Official Discord: https://discord.gg/3S3wXpC4gE`)
            })
        
            // [Broadcast Message]
            const messenger = register("worldLoad", () => {
                messenger.unregister()
                
                const [secretMessage] = TextUtil.getMatches(/\[(.+)\]: # $/, moduleApi.description)
        
                if (secretMessage && secretMessage !== "Nothing" && secretMessage !== data.newMsg) {
                    data.newMsg = secretMessage
                    notify(`&dFrom &6nwjn: &7${ secretMessage }`)
                }
            });
        
            // [CT ModVersion Message]
            const version = register("worldLoad", () => {
                version.unregister()
                const {releaseVersion, modVersion} = moduleApi.releases[0]
        
                const rel = this.compareVersions(TextUtil.VERSION, releaseVersion)
                const mod = this.compareVersions(ChatTriggers.MODVERSION, modVersion)
        
                if (!rel && mod) 
                    notify(`Please use Chattriggers-v${modVersion} to run this module most efficiently. https://github.com/ChatTriggers/ChatTriggers/releases/tag/${modVer}`)
            })
        } catch (e) {}
    }

    compareVersions(current, compareTo) {
        const v1 = current.split(".")
        const v2 = compareTo.split(".")
    
        let p1, p2
        for (let i = 0; i < 3; i++) {
            if ((p1 = Number(v1[i]) === (p2 = Number(v2[i])))) continue
    
            else if (p1 > p2) return 1
            else return -1
        }
    
        return 0
    }
}