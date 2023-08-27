const { exit } = require("process");
const fs = require("fs");
const request = require("sync-request");
const nodemailer = require("nodemailer");

exports.ListNotificationURL =
	"https://api-cloudgame.mihoyo.com/hk4e_cg_cn/gamer/api/listNotifications?is_sort=true&source=NotificationSourceUnknown&status=NotificationStatusUnread&type=NotificationTypePopup";
exports.AckNotificationURL =
	"https://api-cloudgame.mihoyo.com/hk4e_cg_cn/gamer/api/ackNotification";
exports.WalletURL =
	"https://api-cloudgame.mihoyo.com/hk4e_cg_cn/wallet/wallet/get?cost_method=COST_METHOD_UNSPECIFIED";
// Here must be an earlier version so that the response won't be null
exports.AppVersionURL =
	"https://api-takumi.mihoyo.com/ptolemaios/api/getLatestRelease?app_id=1953443910&app_version=3.8.0&channel=mihoyo";

exports.ListNotification = function (header) {
	let tmp = JSON.parse(
		request("GET", exports.ListNotificationURL, {
			headers: header,
		}).body.toString()
	);
	tmp.StringVersion = JSON.stringify(tmp);
	return tmp;
};
exports.AckNotification = function (header, id) {
	request("POST", exports.AckNotificationURL, {
		headers: header,
		body: `{"id":"${id}"}`,
	});
};
exports.Wallet = function (header) {
	let tmp = JSON.parse(
		request("GET", exports.WalletURL, {
			headers: header,
		}).body.toString()
	);
	tmp.StringVersion = JSON.stringify(tmp);
	return tmp;
};
exports.AppVersion = function () {
	let tmp = JSON.parse(request("GET", exports.AppVersionURL).body.toString());
	tmp.StringVersion = JSON.stringify(tmp);
	return tmp;
};
var configKeys = [
	"token",
	"client_type",
	"device_name",
	"device_model",
	"sys_version",
	"channel",
];

exports.getGlobalConfig = function () {
	try {
		var globalConfig = fs.readFileSync("global.json");
	} catch (e) {
		if (
			e == "Error: ENOENT: no such file or directory, scandir 'global.json'"
		) {
			log.error(`读取配置失败!找不到全局配置文件`);
		} else {
			log.error(`读取配置失败!错误信息：${e}`);
		}
		exit();
	}
	return JSON.parse(globalConfig);
};

exports.getConfigs = function () {
	// var configsList;
	try {
		var configsList = fs.readdirSync("configs");
	} catch (e) {
		if (e == "Error: ENOENT: no such file or directory, scandir 'configs'") {
			log.error(`读取配置失败!找不到configs文件夹`);
		} else {
			log.error(`读取配置失败!错误信息：${e}`);
		}
		exit();
	}
	log.info(`检测到${configsList.length}个配置文件：`);
	configsList.forEach((file) => {
		log.info(`${file}`);
	});
	var configs = {};
	configsList.forEach((file) => {
		configs[file] = JSON.parse(fs.readFileSync(`configs/${file}`));
	});
	return configs;
};
exports.checkConfigs = function (configs) {
	for (file in configs) {
		var configThis = configs[file];
		var isNoProbem = true;
		for (key in configKeys) {
			if (
				configThis[configKeys[key]] == "" ||
				configThis[configKeys[key]] == undefined ||
				configThis[configKeys[key]] == null ||
				configThis[configKeys[key]] == NaN
			) {
				log.error(`配置文件 ${file} 异常：`);
				log.error(`  —— ${configKeys[key]}字段缺失`);
				// isNoProbem = false;
			}
		}

		// if(!isNoProbem) {
		//     exit();
		// }
	}
};

// var appversion = exports.AppVersion();

exports.makeHeader = function (data, appversion) {
	return {
		"x-rpc-combo_token": data.token,
		"x-rpc-client_type": data.client_type,
		"x-rpc-app_version": appversion,
		"x-rpc-sys_version": data.sys_version,
		"x-rpc-channel": data.channel,
		"x-rpc-device_id": data.device_id,
		"x-rpc-device_name": data.device_name,
		"x-rpc-device_model": data.device_model,
		"x-rpc-app_id": 1953439974,
		"x-rpc-cg_game_biz": "hk4e_cn",
		"x-rpc-preview": 0,
		"x-rpc-op_biz": "clgm_cn",
		"x-rpc-language": "zh-cn",
		"x-rpc-vendor_id": 2,
		Referer: "https://app.mihoyo.com",
		Host: "api-cloudgame.mihoyo.com",
		Connection: "Keep-Alive",
		"Accept-Encoding": "gzip, deflate",
		Accept: "*/*",
	};
};

exports.SendLog = function (
	transporter,
	mailfrom,
	mailto,
	successNum,
	totalNum,
	content
) {
	transporter.sendMail(
		{
			from: mailfrom + '" Genshin Cloud Game Helper"', //邮件来源
			to: mailto, //邮件发送到哪里，多个邮箱使用逗号隔开
			subject: `今日已签到${successNum}/${totalNum}名用户`, // 邮件主题
			text: "", // 存文本类型的邮件正文
			html: `${content}`, // html类型的邮件正文
		},
		(error, info) => {
			if (error) {
				return console.log(error);
			}
			log.info("日志已丢出！");
		}
	);
};
