/**
 * Regexes from BloomCore
 * @credits BloomCore by UnclaimedBloom6
 */
import Event from "../libs/Events/Event"

export default new class Party {
	constructor() {
        this.members = new Set()
        this.leader = null

        new Event("serverChat", (member) => this.add(member), /^(?:(.+) joined the party\.|.+ invited (.+) to the party! They have 60 seconds to accept\.|Party Finder > (.+) joined the (dungeon )?group! \(.+\))$/)
            
        new Event("serverChat", (member) => this.members.delete(this.getUsername(member)), /^(?:(.+) has been removed from the party\.|(.+) has left the party\.|(.+) was removed from your party because they disconnected\.|Kicked (.+) because they were offline\.)$/)
            
        new Event("serverChat", () => this.clear(), /^(?:.+ has disbanded the party!|The party was disbanded because all invites expired and the party was empty|You left the party\.|You are not currently in a party\.|You have been kicked from the party by .+|The party was disbanded because the party leader disconnected\.)$/)
            
        new Event("serverChat", (leader) => this.leader = this.getUsername(leader), /^(?:Party Leader: (.+) ●|You have joined (.+)'s? party!|The party was transferred to (.+) by .+)$/)
            
        new Event("serverChat", (list) => list.split(", ").forEach(member => this.add(member)), /You'll be partying with: (.+)/)
            
        new Event("serverChat", (list) => list.split(/ ?● ?/).forEach(member => this.add(member)), /^Party .+: (.+)/)
            
        new Event("serverChat", () => ChatLib.command("pl"), /^Party Finder > Your party has been queued in the (dungeon|party) finder!$/)
        
        new Event("serverChat", () => !this.members.size && (this.leader = Player.getName()), /^.+ invited .+ to the party! They have 60 seconds to accept\.$/)
        
        new Event("serverChat", (leader, member) => {
            const LeaderIgn = this.getUsername(leader)
            if (LeaderIgn === Player.getName()) return this.clear()

            this.leader = LeaderIgn
            this.members.delete(this.getUsername(member))
        }, /The party was transferred to (.+) because (.+) left/)

        if (World.isLoaded()) ChatLib.command("pl")
	}

    add(member) {
        const Username = this.getUsername(member)
        if (Username) this.members.add(Username)
    }

	clear() {
        this.members.clear()
        this.leader = null
    }

    getUsername(string) {
        const match = string.match(/(\w{1,16})/)
        if (match) return match[1]
    }
    
    amILeader = () => this.leader === Player.getName()

}