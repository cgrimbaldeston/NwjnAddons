import PogObject from "../../PogData/index.js";

export const data = new PogObject("NwjnAddons", {
  "newUser": true,
  "newMsg": "",

  "power": "Unknown",
  "tuning": "Unknown",
  "enrich": "Unknown",
  "mp": "Unknown",

  "gummy": 0,
  "wisp": 0,
  "lastMini": {},
  "blacklist": {}
}, "/data/.User.json");
register("gameUnload", () => data.save())