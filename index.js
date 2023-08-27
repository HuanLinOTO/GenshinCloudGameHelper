const request = require("sync-request");

const fs = require("fs");

const log4js = require("log4js");

const {
	getConfigs,
	checkConfigs,
	makeHeader,
	ListNotification,
	AckNotification,
	Wallet,
	SendLog,
	AppVersion,
	getGlobalConfig,
} = require("./config");
const urlconfig = require("./config");

const nodemailer = require("nodemailer");

var baseLogger = log4js.getLogger();
baseLogger.level = "info";
var logContent = ``;

global.log = {
	info(content) {
		logContent += `<strong style="color: green">[info]</strong> ${content}<br>`;
		baseLogger.info(content);
	},
	error(content) {
		logContent += `<strong style="color: red">[error]</strong> ${content}<br>`;
		baseLogger.error(content);
	},
};

log.info("开始获取全局配置");
var globalConfig = getGlobalConfig();
log.info("获取成功");
if (globalConfig.sendMail == true) {
	log.info("组装邮件发射器");
	var transporter = nodemailer.createTransport({
		host: globalConfig.mailConfig.smtpServer,
		port: globalConfig.mailConfig.smtpPort,
		secure: globalConfig.mailConfig.smtpSecure,
		auth: {
			user: globalConfig.mailConfig.user,
			pass: globalConfig.mailConfig.pass,
		},
	});
}
var configs = getConfigs();
log.info(`正在检测配置有效性`);
checkConfigs(configs);
log.info("检测完毕！");

log.info("正在获取版本号");
var appversion = AppVersion();
appversion = appversion.data.package_version;
log.info(`获取成功！当前版本号：${appversion}`);
var successNum = 0,
	totalNum = 0;
for (key in configs) {
	totalNum++;
	log.info(`正在执行配置 ${key}`);
	log.info("尝试签到……");
	var header = makeHeader(configs[key], appversion);
	var WalletRespond = Wallet(header);
	logContent += `<span style="color: orange">${key} Wallet返回体 <br> ${JSON.stringify(
		WalletRespond
	)}</span><br>`;
	var NotificationRespond = ListNotification(header);
	logContent += `<span style="color: orange">${key} Notification返回体 <br> ${JSON.stringify(
		NotificationRespond
	)}</span><br>`;
	if (WalletRespond.data != null) {
		successNum++;
		log.info(
			`签到完毕! 剩余时长:${WalletRespond.data.free_time.free_time}分钟`
		);
		let NotificationLength = NotificationRespond.data.list.length;
		let postHeader = header;
		Object.assign(postHeader, {
			"Content-Length": 28,
			"Content-Type": "application/json",
		});
		for (var i = 0; i < NotificationLength; i++) {
			AckNotification(postHeader, NotificationRespond.data.list[i].id);
		}
	} else {
		log.error("签到失败");
	}
}

if (globalConfig.sendMail == true) {
	log.info(`运行完毕！丢出日志`);
	SendLog(
		transporter,
		globalConfig.mailConfig.user,
		globalConfig.mailConfig.mailto,
		successNum,
		totalNum,
		logContent
	);
}
