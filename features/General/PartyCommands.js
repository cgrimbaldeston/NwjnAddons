import Feature from "../../libs/Features/Feature";
import Party from "../../utils/Party";
import { data } from "../../data/Data";
import TextUtil from "../../core/static/TextUtil";
import Time from "../../libs/Time/Util"
import Location from "../../utils/Location";
import Settings from "../../data/Settings";
import { getTPS, scheduleTask } from "../../libs/Time/ServerTime";

const commands = {
    "help": {
        matches: /^help$/,
        access: () => true,
        fn: () => "pc NwjnAddons Cmds > " + Object.keys(commands).map(key => `.${ key }`).join(" | ")
    },

    "time": {
        matches: /^time$/,
        access: () => Settings().pcTime,
        fn: () => "pc " + Time.getLongTime()
    },

    "coords": {
        matches: /^coord(s)?|loc|xyz$/,
        access: () => Settings().pcCoords,
        fn: () => `pc x: ${ ~~Player.getX() }, y: ${ ~~Player.getY() }, z: ${ ~~Player.getZ() } [${Location.getWorld()} - ${Location.getZone()}]`
    },

    "power": {
        matches: /^pow(er)?$/,
        access: () => Settings().pcPower,
        fn: () => `pc Power: ${ data.power } | Tuning: ${ data.tuning } | Enrich: ${ data.enrich } | MP: ${ data.mp }`
    },

    "stats": {
        matches: /^stats$/,
        access: () => Settings().pcStats,
        fn: () => "pc " + (
            TextUtil.getTabBlock(
                TabList.getNames().map(it => it.removeFormatting()),
                Location.inWorld("Catacombs") ? /Skills:/ : /Stats:/
            )
            ?.map(it => it.match(/: (.[\d]+)$/)?.[1])
            ?.join(" | ")
                ?? "Me no have stat widget"
        )
    },

    "tps": {
        matches: /^tps$/,
        access: () => Settings().pcTps,
        fn: () => "pc TPS: " + getTPS()
    },

    "build": {
        matches: /^build$/,
        access: () => Settings().pcBuild,
        fn: () => "pc https://i.imgur.com/tsg6tx5.jpg"
    },

    "allinvite": {
        matches: /^allinv(ite)?$/,
        access: () => Settings().pcAllinvite && Party.amILeader(),
        fn: () => "p settings allinvite"
    },

    "invite": {
        matches: /^inv(ite)?$/,
        access: () => Settings().pcInvite && Party.amILeader(),
        fn: (_, cmd) => `p ${cmd.split(" ").slice(-1)[0]}`
    },

    "warp": {
        matches: /^warp$/,
        access: () => Settings().pcWarp && Party.amILeader(),
        fn: () => "p warp"
    },

    "transfer": {
        matches: /^transfer|pt(?:me)?$/,
        access: () => Settings().pcTransfer && Party.amILeader(),
        fn: (ign, cmd) => cmd.includes(" ") ? `p transfer ${ cmd.split(" ").slice(-1)[0] }` : `p transfer ${ ign }`
    },

    "f1-7 | .m1-7 | .t1-5": {
        matches: /^([fmt]) ?([1-7])$/,
        access: () => Settings().pcInstance && Party.amILeader(),
        fn: (_, cmd) => {
            const [type, number] = TextUtil.getMatches(/^([fmt]) ?([1-7])$/, cmd)

            switch (type) {
                case "f":
                    return `joininstance catacombs_floor_${ TextUtil.getFloorWord(number) }`;
                case "m":
                    return `joininstance master_catacombs_floor_${ TextUtil.getFloorWord(number) }`;
                case "t":
                    return `joininstance kuudra_${ TextUtil.getTierWord(number) }`;
                default: 
                    return "pc Invalid instance?"
            }
        }
    }
}

new Feature({setting: "partyCommands"})
    .addEvent("serverChat", (player, command, event) => {
        const ign = TextUtil.getSenderName(player).toLowerCase()
        const cmd = command.toLowerCase()

        if (ign in data.blacklist) return TextUtil.append(event.func_148915_c(), "&cBlacklisted")
        
        const response = Object.values(commands).find(obj => obj.matches.test(cmd) && obj.access())

        if (response) scheduleTask(() => ChatLib.command(response.fn(ign, cmd)))
    }, /^Party > (.+): [,.?!](.+)$/)