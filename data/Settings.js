import Settings from "../../Amaterasu/core/Settings"
import DefaultConfig from "../../Amaterasu/core/DefaultConfig"

const defCon1 = new DefaultConfig("NwjnAddons", "/data/.Config.json")
.addSwitch({
    category: "General",
    configName: "linkFix",
    title: "&e✯&r &bLink Fix",
    description: "Encodes and Decodes Links to allow sending and viewing for those with the mod",
    value: true
})
.addSwitch({
    category: "General",
    configName: "blockHighlight",
    title: "Toggle Block Highlight",
    description: "Toggles block highlight",
    value: false
})
.addColorPicker({
    category: "General",
    configName: "highlightColor",
    title: "Highlight Color",
    description: "Sets the color for block highlight",
    value: [255, 190, 239, 255],
    shouldShow: data => data.blockHighlight === true
})
.addSwitch({
    category: "General",
    configName: "waypoint",
    title: "Draw Chat Waypoints",
    description: "Creates waypoints taken from chat messages in patcher sendcoords format",
    value: false
})
.addColorPicker({
    category: "General",
    configName: "wpColor",
    title: "➤ Waypoint Color",
    description: "     Sets the color for waypoints",
    value: [255, 190, 239, 200],
    shouldShow: data => data.waypoint === true
})
.addSlider({
    category: "General",
    configName: "wpTime",
    title: "➤ Waypoint Time",
    description: "     The amount of seconds waypoints should stay",
    options: [30, 90],
    value: 120,
    shouldShow: data => data.waypoint === true
})
.addSwitch({
    category: "General",
    configName: "partyCommands",
    title: "Party Commands",
    description: "Enables party commands, universally triggers on [.,!?] commands",
    value: false
})
.addMultiCheckbox({
    category: "General",
    configName: "partyToggles",
    title: "Party Command Toggles",
    description: "Toggles for various party commands",
    placeHolder: "Click",
    options: [
        {
            title: "Join Instance",
            configName: "pcInstance",
            value: true
        },
        {
            title: "Party Transfer <?ign>",
            configName: "pcTransfer",
            value: true
        },
        {
            title: "Warp",
            configName: "pcWarp",
            value: true
        },
        {
            title: "Invite <ign>",
            configName: "pcInvite",
            value: true
        },
        {
            title: "All Invite",
            configName: "pcAllinvite",
            value: true
        },
        {
            title: "Build Imgur",
            configName: "pcBuild",
            value: true
        },
        {
            title: "Server TPS",
            configName: "pcTps",
            value: "true"
        },
        {
            title: "Tab Stats",
            configName: "pcStats",
            value: true
        },
        {
            title: "Power, Tuning, Enrich, MP Data",
            configName: "pcPower",
            value: true
        },
        {
            title: "Send Coords",
            configName: "pcCoords",
            value: true
        },
        {
            title: "Your Current Time",
            configName: "pcTime",
            value: true
        }
    ],
    shouldShow: data => data.partyCommands === true
})
.addSwitch({
    category: "General",
    configName: "skyblockXP",
    title: "Skyblock XP Gain Message",
    description: "Displays skyblock xp gains in chat",
    value: false
})
.addSwitch({
    category: "General",
    configName: "clock",
    title: "Clock Display",
    description: "Stay productive by keeping track of time!",
    subcategory: "Clock",
    value: false
})
.addColorPicker({
    category: "General",
    configName: "clockColor",
    title: "➤ Clock Color",
    description: "     Sets the color for the clock display",
    subcategory: "Clock",
    value: [255, 190, 239, 255],

    shouldShow: data => data.clock === true
})
.addSwitch({
    category: "Combat",
    configName: "damageTracker",
    title: "Damage Tracker",
    description: "Displays Damage Tag values in chat",
    value: false
})
.addSwitch({
    category: "Combat",
    configName: "reaperTimer",
    title: "Reaper Buff Timer",
    description: "Displays the time left on your reaper armor buff",
    value: false
})
.addSwitch({
    category: "Combat",
    configName: "rendArrows",
    title: "Rend Arrows",
    description: "Displays the amount of arrows pulled on rend in chat",
    value: false
})
.addDropDown({
    category: "Combat",
    configName: "fatalTempo",
    title: "Fatal Tempo Display",
    description: "Select when to show Fatal Tempo Display -> /moveFT",
    options: ["Off", "Always", "Over 0%", "At 200%"],
    value: 0,
    subcategory: "Fatal Tempo"
})
.addMultiCheckbox({
    category: "Combat",
    configName: "ftParts",
    title: "Fatal Tempo Components",
    description: "Toggles for different aspects of this display",
    placeHolder: "Click",
    options: [
        {
            title: "Prefix",
            configName: "ftPrefix",
            value: true
        },
        {
            title: "Percent",
            configName: "ftPercent",
            value: true
        },
        {
            title: "Time",
            configName: "ftTime",
            value: true
        }
    ],
    shouldShow: data => data.fatalTempo !== 0
})
.addTextInput({
    category: "Bestiary",
    configName: "mobList",
    title: "Mob Highlight",
    description: "Boxes entities by input based on mob class and health\n&bExamples: `Zombie` or `Zombie-100|120|2k|45k` or `Zombie, Skeleton` or `Zombie-100, Cow`",
    value: ""
})
.addColorPicker({
    category: "Bestiary",
    configName: "mobHighlightColor",
    title: "Mob Highlight Color",
    description: "Sets the color for monster hitboxes",
    value: [255, 190, 239, 255],
    shouldShow: data => data.mobList !== ""
})
.addTextInput({
    category: "Bestiary",
    configName: "standList",
    title: "Armor Stand Names Highlight",
    description: "Draws hitboxes around armor stands that include the inputted name, seperate with '|' character",
    value: ""
})
.addColorPicker({
    category: "Bestiary",
    configName: "standColor",
    title: "Armor Stand Highlight Color",
    description: "Sets the color for armor stand hitboxes",
    value: [255, 190, 239, 255],
    shouldShow: data => data.standList !== ""
})
.addTextInput({
    category: "Bestiary",
    configName: "playerList",
    title: "Player Highlight",
    description: "Draws hitboxes around players that include the inputted name, seperate with '|' character\nInput `Player` to show all real players",
    value: ""
})
.addColorPicker({
    category: "Bestiary",
    configName: "playerColor",
    title: "Player Highlight Color",
    description: "Sets the color for player hitboxes",
    value: [255, 190, 239, 255],
    shouldShow: data => data.playerList !== ""
})
.addButton({
    category: "HUD",
    configName: "gui",
    title: "Move GUI Elements",
    description: "Click to edit gui locations",
    onClick: () => ChatLib.command("nwjn gui", true)
})
.addSwitch({
    category: "HUD",
    configName: "blaze",
    title: "Blaze Display",
    description: "Shows how much time left on gummy and wisp pot -> /moveBlaze",
    subcategory: "Blaze",
    value: false
})
.addSwitch({
    category: "HUD",
    configName: "poison",
    title: "Poison Display",
    description: "Displays the amount of poisons in your inventory -> /movePoison",
    subcategory: "Poison",
    value: false
})
.addSwitch({
    category: "HUD",
    configName: "mini",
    title: "Miniboss Display",
    description: "Shows your recent CI miniboss kills -> /moveMini",
    subcategory: "Miniboss",
    value: false
})
.addSwitch({
    category: "HUD",
    configName: "widget",
    title: "Widget Display",
    description: "Renders tab widgets on screen",
    subcategory: "Widget",
    value: false
})
.addSwitch({
    category: "Kuudra",
    configName: "kuudraHP",
    title: "Draws Kuudra's HP",
    description: "Displays text of Kuudra's hp on kuudra",
    subcategory: "General",
    value: false
})
.addSwitch({
    category: "Kuudra",
    configName: "teamHighlight",
    title: "Team Highlight",
    description: "Draws a box of the selected color on teammates, changes to green if that player gets fresh tools",
    subcategory: "General",
    value: false
})
.addColorPicker({
    category: "Kuudra",
    configName: "teammateColor",
    title: "➤ Team Color",
    description: "     Sets the color for teammates",
    value: [255, 190, 239, 255],
    subcategory: "General"
})
.addSwitch({
    category: "Kuudra",
    configName: "unrenderPerks",
    title: "Unrender Perks",
    description: "Declutters the shop gui by unrendering unused perks",
    subcategory: "General",
    value: false
})
.addSwitch({
    category: "Kuudra",
    configName: "kuudraHitbox",
    title: "Draws Kuudra's Hitbox",
    description: "Draws a box around Kuudra's hitbox",
    subcategory: "General",
    value: false
})
.addSwitch({
    category: "Kuudra",
    configName: "supplyBeacons",
    title: "Supply Beacons",
    description: "Draws beacons where supplies are",
    subcategory: "Phase 1",
    value: false
})
.addSwitch({
    category: "Kuudra",
    configName: "supplyPiles",
    title: "Supply Drop Beacons",
    description: "Draws beacons on piles where supplies are needed",
    subcategory: "Phase 1",
    value: false
})
.addSwitch({
    category: "Kuudra",
    configName: "pearl",
    title: "Pearl Lineups",
    description: "Draws target boxes of where to pearl to insta place supply\n&eBoxes on the ceiling: pearl at ~38%\n&eBoxes on the sides: pearl at ~76%",
    subcategory: "Phase 1",
    value: false
})
.addSwitch({
    category: "Kuudra",
    configName: "noSupply",
    title: "No Supply Chat",
    description: "Tells party if your pre or second doesn't spawn",
    subcategory: "Phase 1",
    value: false
})
.addSwitch({
    category: "Kuudra",
    configName: "customSupply",
    title: "Custom Supply Drop Message",
    description: "Changes supply message to include time when a supply is dropped:\n&r&6[MVP&r&9++&r&6] nwjn&r&f &a&lrecovered a supply at 18s! &r&8(1/6)&r",
    subcategory: "Phase 1",
    value: false
})
.addSwitch({
    category: "Kuudra",
    configName: "buildPiles",
    title: "Unfinished Pile Beacons",
    description: "Draws beacons on build piles that are incomplete",
    subcategory: "Phase 2",
    value: false
})
.addSwitch({
    category: "Kuudra",
    configName: "buildPercent",
    title: "Cumulative Build Percentage",
    description: "Draws the overall build percentage over the ballista",
    subcategory: "Phase 2",
    value: false
})
.addSwitch({
    category: "Kuudra",
    configName: "buildFresh",
    title: "Fresh Timer",
    description: "Draws the seconds of fresh you have left on the ballista",
    subcategory: "Phase 2",
    value: false
})
.addSwitch({
    category: "Kuudra",
    configName: "progressWithPhase",
    title: "Show Pile Progress Through Mobs",
    description: "Draws the 'Progress: 77%' text on a pile through mobs",
    subcategory: "Phase 2",
    value: false
})
.addSwitch({
    category: "Kuudra",
    configName: "fresh",
    title: "Notify Party On Fresh",
    description: "Say `FRESH!` in party chat when you get fresh tools",
    subcategory: "Phase 2",
    value: false
})
.addSwitch({
    category: "Kuudra",
    configName: "partyDrain",
    title: "Party Drain",
    description: "Tells your party who you mana drained\n&9Party &8> &6[MVP&8++&6] nwjn&f: Drained 2431 mana for: [LucDJ, raidermc, LhxSeven]",
    subcategory: "Phase 4",
    value: false
})
.addSwitch({
    category: "Kuudra",
    configName: "drainDisplay",
    title: "Mana Drain Display",
    description: "Shows buffs received from mana drain",
    subcategory: "Phase 4",
    value: false
})
.addSwitch({
    category: "Crimson Isle",
    configName: "announceVanqs",
    title: "Announce Vanquishers",
    description: "Announces Vanquisher coords to party",
    value: false
})
.addSwitch({
    category: "Crimson Isle",
    configName: "magma",
    title: "Better Magma Boss Message",
    description: "Replaces magma boss damage messages with custom ones that also show total damage\n&r&4&lMagma Boss&r &8> &c+35% &7(100%)",
    value: false
})
.addSwitch({
    category: "Mining",
    configName: "mineshaftWaypoints",
    title: "Mineshaft Waypoints",
    description: "Shows guesses of corpses and exit in mineshaft, walk within 3 blocks of a guess waypoint to remove it",
    value: false
})
.addSwitch({
    category: "Performance",
    subcategory: "Death Clutter",
    configName: "removeDyingMobs",
    title: "&e✯&r &bRemove Dying Mobs",
    description: "Fully kills the entity before it can perform the animation",
    value: true
})
.addSwitch({
    category: "Performance",
    subcategory: "Death Clutter",
    configName: "removeDeadNames",
    title: "&e✯&r &bRemove Names of Dead Mobs",
    description: "Kills the ArmorStand used for a mob's HP instantly when the mob dies",
    value: true
})
.addSwitch({
    category: "Performance",
    subcategory: "Spawn Clutter",
    configName: "abortJunkSpawns",
    title: "&e✯&r &bAbort Junk-Spawns",
    description: `Completely cancels the construction of many unused + non-performative entities`,
    value: true
})
.addMultiCheckbox({
    category: "Performance",
    subcategory: "Spawn Clutter",
    configName: "abortJunkSpawnsOptions",
    title: "➤ &e✯&r &bAbort Junk-Spawns Customization",
    description: "     Optional toggles for a few entities",
    placeHolder: "Edit",
    options: [
        {
            title: "Arrows",
            configName: "removeArrows",
            value: false
        },
        {
            title: "&e✯&r Falling Blocks",
            configName: "removeFallingBlocks",
            value: true
        }
    ],
    shouldShow: data => data.abortJunkSpawns === true
})

import TextUtil from "../core/static/TextUtil"
const meinConf = new Settings("NwjnAddons", defCon1, "/data/Scheme.json", `${TextUtil.NWJNADDONS} by &6nwjn`)
    .setPos(15, 15)
    .setSize(70, 70)
    .apply()
    
export default meinConf.settings
