const reggol = require("reggol")
const baseLogger = new reggol("GenshinCloudPlayHelper")
var logContent = `` 

exports.log = {
    info(content){
        logContent += `<strong style="color: green">[info]</strong> ${content}<br>`
        baseLogger.info(content)
    },
    error(content){
        logContent += `<strong style="color: red">[error]</strong> ${content}<br>`
        baseLogger.error(content)
    }
}