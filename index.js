import "./data/Data"
import "./utils/Broadcasting"
import "./utils/Command"
import "./utils/Location"
import "./utils/Party"
import "./utils/Profile"
import "./libs/Time/ServerTime"

// import Settings from "./data/Settings"
import TextUtil from "./core/static/TextUtil"
// Handles loading all Feature files because I was too lazy to type them all out
(function requireFeatures(file) {
    if (file.isDirectory()) return file.listFiles().forEach(file => requireFeatures(file))
        
    /* File.separator: "/" or "\" */
    const [path, name] = TextUtil.getMatches(/NwjnAddons[\/\\]features[\/\\](.+[\/\\](\w+))\.js$/, file.getPath())
    if (!path) return

    const importPath = "./features/" + path.replace(/\\/g, "/")
    
    require(importPath)

    // Future ClassLoader and Caching bs
    // if (Settings[name]) {
    //     require(importPath)
    // } else {
    //     const configListenerMap = Settings.getConfig()._configListeners
    //     if (!configListenerMap.has(name)) configListenerMap.set(name, [])

    //     const stemListenerList = configListenerMap.get(name)    
    //     stemListenerList.unshift(() => {
    //         require(importPath)
    //         stemListenerList.shift()
    //     })
    // }
})(new java.io.File(`${Config.modulesFolder}/NwjnAddons/features`))