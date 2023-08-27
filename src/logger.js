const reggol = require("reggol")
const baseLogger = new reggol("GenshinCloudGameHelper")
let logContent = `` 
exports.addLogContent = function(content) {
    logContent += content
}
exports.getLogs = function() {
    return logContent
}

exports.log = {
    info(content) {
        logContent += `<strong style="color: green">[info]</strong> ${content}<br>`
        baseLogger.info(content)
    },
    error(content) {
        logContent += `<strong style="color: red">[error]</strong> ${content}<br>`
        baseLogger.error(content)
    }
}