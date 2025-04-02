import "./data/Data"
import "./utils/Broadcasting"
import "./utils/Command"
import "./utils/Location"
import "./utils/Party"
import "./utils/Profile"
import "./libs/Time/ServerTime"

// Handles loading all Feature files because I was too lazy to type them all out
let pathFinder = /NwjnAddons[\/\\]features[\/\\](.+[\/\\]\w+)\.js$/
let fileSeparator = /\\/g
let relativeDest = "./features/"

let modules = []
void function requireFeatures(file) {
    if (file.isDirectory()) return file.listFiles().forEach(file => requireFeatures(file))
        
    let match = file.getPath().match(pathFinder)
    if (!match) return
    
    modules.push(relativeDest + match[1].replace(fileSeparator, "/"))
}(new java.io.File(`${Config.modulesFolder}/NwjnAddons/features`))

let module
while (module = modules.pop()) {
    require(module)
}