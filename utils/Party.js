// Credit: BloomCore
import Feature from "../libs/Features/Feature"
import { scheduleTask } from "../libs/Time/ServerTime"
import Seconds from "../libs/Time/Seconds"
import TextUtil from "../core/static/TextUtil"

export default new class Party extends Feature {
	constructor() {
        this.members = new Set()
        this.leader = null

        super(), this
            .addEvent("serverChat", (member) => {
                const ign = TextUtil.getSenderName(member)
                ign && this.members.add(ign)
            }, /^(?:(.+) joined the party\.|.+ invited (.+) to the party! They have 60 seconds to accept\.|Party Finder > (.+) joined the (dungeon )?group! \(.+\))$/)
            
            .addEvent("serverChat", (member) => {
                this.members.delete(TextUtil.getSenderName(member))
            }, /^(?:(.+) has been removed from the party\.|(.+) has left the party\.|(.+) was removed from your party because they disconnected\.|Kicked (.+) because they were offline\.)$/)
            
            .addEvent("serverChat", () => {
                this.disbandParty()
            }, /^(?:.+ has disbanded the party!|The party was disbanded because all invites expired and the party was empty|You left the party\.|You are not currently in a party\.|You have been kicked from the party by .+|he party was disbanded because the party leader disconnected\.)$/)
            
            .addEvent("serverChat", (lead) => {
                this.leader = TextUtil.getSenderName(lead)
            }, /^(?:Party Leader: (.+) ●|You have joined (.+)'s? party!|The party was transferred to (.+) by .+)$/)
            
            .addEvent("serverChat", (pList) => {
                pList.split(", ").forEach(p => {
                    const ign = TextUtil.getSenderName(p)
                    ign && this.members.add(ign)
                })
            }, /You'll be partying with: (.+)/)
            
            .addEvent("serverChat", (pList) => {
                pList.split(/ ?● ?/).forEach(p => {
                    const ign = TextUtil.getSenderName(p)
                    ign && this.members.add(ign)
                })
            }, /^Party .+: (.+)/)
            
            .addEvent("serverChat", () => {
                this.checkParty()
            }, /^Party Finder > Your party has been queued in the (dungeon|party) finder!$/)
            
            .addEvent("serverChat", () => {
                if (!this.members.size) this.leader = Player.getName()
            }, /^.+ invited .+ to the party! They have 60 seconds to accept\.$/)
            
            .addEvent("serverChat", (lead, left) => {
                const ignLead = TextUtil.getSenderName(lead)
                if (ignLead === Player.getName()) return this.disbandParty()

                this.leader = ignLead
                this.members.delete(TextUtil.getSenderName(left))
            }, /The party was transferred to (.+) because (.+) left/)
            
            .addSubEvent("serverChat", (event) => cancel(event), /^(?:-{53}|Party (?:Members|Moderators|Leader)\:?.*|You are not currently in a party\.)$/)
            
            .addSubEvent("messageSent", (msg, event) => /^\/(?:pl|party list)$/i.test(msg) && cancel(event))

        this.checkParty()
	}

    checkParty() {
        if (!World.isLoaded()) return

        this.updateSubEvents()
        ChatLib.command("pl")

        scheduleTask(() => {
            this.checkingParty = false
            this.unregisterSubEvents()
        }, Seconds.of(1))
    }

	disbandParty() {
		this.members.clear()
		this.leader = null
    }
    
    amILeader = () => this.leader === Player.getName()
}