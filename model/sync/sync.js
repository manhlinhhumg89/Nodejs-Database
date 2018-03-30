/*
	Sync controller
	Converted to ES6 by cuongpham at 29/01/2016
 */

'use strict';

let env	= process.env.NODE_ENV;
let Error = require('../../config/error');
let SyncCodes = require('../../config/sync_codes');
let Permission = require('../../model/permission');
let SyncContant = require('../../config/sync_contant');
let TagConstant = require('../../config/tag_constant');
let mongoose = require('mongoose');
let AccountSchema = mongoose.model('Account');
let User = mongoose.model('User');
let FailedSyncItem = mongoose.model('FailedSyncItem');
let errorLog = mongoose.model('errorLog');
//let redisClient = require('../../config/database').redisClient;
let config = require('../../config/config')[env];
let utils = require('../../helper/utils');
let async = require('async');
let sprintf	= require("sprintf-js").sprintf;
let platformCode = require('../../config/platform_codes').platformCode;
let appIdCode = require('../../config/platform_codes').appIdCode;
let pushController = require('./push_controller');
let FinsifyController = require('../../helper/finsify-controller');

class Sync {
	constructor(request) {
		this.Schema = null;
		this.request = null;
		this.__user_id = null;
		this.__tokenDevice = null;
		this.__deviceId = null;
		this.maxSyncQuota = config.maxSyncItem;
		this.skipCheckAccount = false;
		this.isSyncSub = false;
		this.propertiesSelect = '';
		this.default_push_limit = 40;
		this.isServerMaintain = global.isServerMaintain;
		this.__pushObj = null;
		this.syncCode = 0;
		this.__skipGetListUser = false;
		this.syncByUser = false;
		this.__dataType = null;
		this.__changeAccount = null;
		this.__account_id = null;
		this.__AndroidVersionCode = 551;
		this.__iOSVersionCode = 500;
		this.__iOSVersionCodePlus = 500;
		this.__wpVersionCode = 500;
		this.__osxVersionCode = 500;
		this.__webVersionCode = 500;
		this.__transactionNotificationCount = 0;
		this.__walletInfo = null;
		this.__userInfo = null;
		this.__kickSharedUser = false;

		this.setRequest(request);
		//this.__setPush(request);
		this.__getUserInfo(request);
	}

	__getUserInfo(req){
		if (!req.user_id) {
			return;
		}

		User.findById(req.user_id, (err, userInfo) => {
			if (userInfo) {
				this.__userInfo = userInfo;
			}
		});
	}

	__checkAppVersion(){
		let that = this;
		let platform = that.__request.body.pl || 1;
		let appVersionCode = that.__request.body.av;

		if (!appVersionCode || !platform) {
			return false;
		}

		if (platform === appIdCode.ANDROID && appVersionCode >= that.__AndroidVersionCode) return true;
		if (platform === appIdCode.IOS_FREE && appVersionCode >= that.__iOSVersionCode) return true;
		if (platform === appIdCode.IOS_PLUS && appVersionCode >= that.__iOSVersionCodePlus) return true;
		if (platform === appIdCode.WINDOWS_PHONE && appVersionCode >= that.__wpVersionCode) return true;
		if (platform === appIdCode.WINDOWS_PC && appVersionCode >= that.__wpVersionCode) return true;
		if (platform === appIdCode.MAC && appVersionCode >= that.__osxVersionCode) return true;
		if (platform === appIdCode.WEB && appVersionCode >= that.__webVersionCode) return true;
		if (platform === 99 && appVersionCode >= that.__iOSVersionCode) return true;

		return false;
	}

	setRequest(request) {
		this.__request = request;
		this.__user_id = request.user_id;
		this.__tokenDevice = request.tokenDevice;
	}

	setSyncSub(status) {
		this.isSyncSub = status;
		if(status) this.syncCode += 100;
	}

	pull(callback) {
		if (this.isServerMaintain) {
			return callback(false, null, Error.SYNC_SERVER_MAINTAINCE);
		}

		if (!this.__checkAppVersion()) {
			return callback(false, null, Error.APP_OUT_OF_DATE);
		}

		let params = this.__request.body;
		let account_id = this.__account_id = params.account_id;
		let limit = params.limit || this.default_push_limit;
		let skip = params.skip || 0;
		let lastUpdate = parseInt(params.lastUpdate, 10);
		let user_id = this.__user_id;

		this.__checkReadPermission(user_id, account_id, (err, readStatus) => {
			if (err) {
				return callback(false, null, Error.ERROR_SERVER);
			}
			
			if (!readStatus) {
				return callback(false, null, Error.SYNC_ACCOUNT_CAN_NOT_READ);
			}

			this.__checkAccount(account_id, (status, account) => {
				if (!status) return callback(false, null, Error.ACCOUNT_NOT_FOUND);

				this.__pull({
					lastUpdate: lastUpdate,
					user_id: user_id,
					account: account_id,
					isSyncSub: this.isSyncSub,
					limit: limit,
					skip: skip,
					tokenDevice: this.__tokenDevice
				}, callback);
			});
		});
	}

	pushToServer(callback){
		if (this.isServerMaintain) {
			return callback(false, null, Error.SYNC_SERVER_MAINTAINCE);
		}

		if (!this.__checkAppVersion()) {
			return callback(false, null, Error.APP_OUT_OF_DATE);
		}

		let that = this;
		let params = that.__request.body;
		let account_id = that.__account_id = params.account_id;
		let data = params.data;
		let user_id = that.__user_id;

		try {
			data = JSON.parse(data);
			data = data.d;
		} catch(e){
			return callback(false, null, Error.SYNC_DATA_INVAILD_FORMAT);
		}

		if (!data instanceof Array) {
			return callback(false, null, Error.SYNC_ERROR_TYPE_DATA);
		}

		if (data.length > this.maxSyncQuota) {
			return callback(false, null, Error.OVER_DATA_QUOTA);
		}

		that.__checkWritePermission(user_id, account_id, function(errCheck, status) {
			if (errCheck) {
				return callback(false, null, Error.ERROR_SERVER);
			}

			if (!status) {
				return callback(false, null, Error.SYNC_ACCOUNT_CAN_NOT_WRITE);
			}

			that.__checkAccount(account_id, function(status, account) {
				if (!status) {
					return callback(false, null, Error.ACCOUNT_NOT_FOUND);
				}

				if (account) {
					that.__walletInfo = account;
				}

				that.__push(data, user_id, account_id, that.isSyncSub, callback);
			});
		});
	}

	__getParent(parent_id, callback) {
		if (this.skipCheckAccount) return callback(true);

		if (!this.isSyncSub) return callback(true);

		if (!parent_id) return callback(false);

		this.Schema.findById(parent_id, function(err, parent) {
			if (err || !parent) {
				return callback(false);
			}

			callback(true, parent);
		});
	}

	__checkAccount(account_id, callback) {
		if (this.skipCheckAccount) return callback(true);
		if (!account_id) return callback(false);

		AccountSchema.findById(account_id, function(err, account) {
			if (err || !account) callback(false);
			else callback(true, account);
		});
	}

	__checkReadPermission(user_id, account_id, callback) {
		if (this.skipCheckAccount) return callback(null, true);

		Permission.checkReadPermission(user_id, account_id, callback);
	}

	__checkWritePermission(user_id, account_id, callback) {
		if (this.skipCheckAccount) return callback(null, true);

		Permission.checkWritePermission(user_id, account_id, callback);
	}

	pullCondition(params) {
		let condition = [];
		let account = params.account;

		if (params.lastUpdate === 0) {
			condition.push({ 'isDelete': false });
		} else {
			condition.push({ tokenDevice: { '$ne': params.tokenDevice } });
		}

		if (this.syncByUser) {
			condition.push({ 'owner': this.__user_id });
		} else if (account) {
			condition.push({ 'account': account });
		} else {
			condition.push({'listUser': this.__user_id});
		}

		if (params.isSyncSub) {
			condition.push({ parent: { '$ne': null } });
		} else if (this.syncCode === 200 || this.syncCode === 600) {
			//category & transaction
			condition.push({ parent: null });
		}

		if (params.lastUpdate > 0) {
			condition.push({ 'updateAt': { $gt: params.lastUpdate } });
		}

		return {
			$and: condition
		};
	}

	__updateLastSync(){
		let that = this;

		if(that.syncCode === 600 && that.__user_id){
			User.updateLastSync(that.__user_id);
		}
	}

	__pull(params, callback) {
		this.pullData(params, callback);
		this.__updateLastSync();
	}

	__push(data, user, account, isSyncSub, callback) {
		this.__updateData(data, user, account, isSyncSub, (list, status, failed) => {
			if (!status) {
				return callback(false, null, Error.SYNC_DATA_INVAILD_FORMAT);
			}

			if (failed && failed.length > 0) {
				callback(true, list, failed);
			} else {
				this.__updateLastSync();

				callback(true, list);
			}
		})
	}

	__minAccountId(listAc){
		if(listAc.length === 1) return listAc;

		let tmpAc = [];

		listAc.forEach(function(ac){
			if(tmpAc.indexOf(ac) === -1) tmpAc.push(ac);
		});

		return tmpAc;
	}
	__pushSyncNotification(){
		pushController.pushSyncNotification({
			user_id: this.__user_id,
			wallet_id: this.__account_id,
			flag: this.syncCode,
			tokenDevice: this.__tokenDevice
		});

		if (this.syncCode === SyncCodes.WALLET && this.__kickSharedUser) {
			pushController.pushKickShareWallet({
				userId: this.__user_id,
				walletId: this.__account_id,
				tokenDevice: this.__tokenDevice
			});
		}

		if (env === 'production') {
			//if (this.__walletInfo.isPublic) {
			//	pushController.pushWidgetMessage(this.__account_id);
			//}
		} else {
			pushController.pushWidgetMessage(this.__account_id);
		}
	}

	__getListAccount(data){
		let tmpList = [];

		data.forEach(function(item){
			tmpList.push(item.ac);
		});

		return tmpList;
	}

	__cleanData(data, allowAccount){
		let tmpData = [];

		data.forEach(function(item){
			if(allowAccount.indexOf(item.ac) >= 0) tmpData.push(item);
		});

		return tmpData;
	}

	__checkPermission(data, cb){
		if (this.syncCode === SyncCodes.BUDGET || this.syncCode === SyncCodes.CAMPAIGN){
			if (this.syncCode === SyncCodes.CAMPAIGN) {
				if (!this.__account_id) {
					return cb(data);
				}
			}

			let that = this;
			let tmpAccount = that.__getListAccount(data);
			let listAc = that.__minAccountId(tmpAccount);
			let allowAccount = [];
			let num = listAc.length;

			let updateState = function(status, account_id){
				--num;
				if(status) {
					allowAccount.push(account_id);
				}

				if(num === 0) cb(that.__cleanData(data, allowAccount));
			};

			listAc.forEach(function(account_id){
				Permission.checkWritePermission(that.__user_id, account_id, function(errCheck, status){
					updateState(status, account_id);
				});
			});
		} else {
			cb(data);
		}
	}

	__updateData(data, user, account, isSyncSub, callback) {
		let list = [];
		let failed = [];
		let num = data.length;
		let that = this;

		if (num === 0) return callback(list, true);

		let updateCb = function(status, obj, error_item) {
			--num;
			if (status) {
				list.push(obj);
			} else {
				if(error_item) {
					failed.push(error_item);
				}
			}

			if (num === 0) {
				callback(list, true, failed);
				//that.__pushNotif();
				that.__pushSyncNotification();
				that.__pushTransactionNotification();
			}
		};

		that.__checkPermission(data, function(newData){
			that.__updateMixedData(that, newData, user, account, isSyncSub, updateCb);
		});
	}

	__updateMixedData(that, data, user, account, isSyncSub, updateState) {
		data.forEach(function(item) {
			let syncFlag = parseInt(item.f, 10);

			switch (syncFlag) {
				case SyncContant.FLAG_ADD:
					that.__addItem(item, user, account, isSyncSub, updateState);
					if (that.syncCode === SyncCodes.TRANSACTION) {
						that.__transactionNotificationCount++;
					}
					break;
				case SyncContant.FLAG_EDIT:
					that.__editItem(item, user, account, isSyncSub, updateState);
					break;
				case SyncContant.FLAG_DELETE:
					that.__deleteItem(item, user, updateState);
					break;
				default:
					updateState(false);
			}
		});
	}

	__addItem(item, user, account, isSyncSub, updateState) {
		let that = this;
		this.__getParent(item.pi, function(status, parent) {
			if (!status) return updateState(false);

			that.makeNewItem(item, user, account, parent, function(itemData) {
				let obj = new that.Schema(itemData);
				obj.lastEditBy = user;
				obj.tokenDevice = that.__tokenDevice;

				that.__saveCallback(item, obj, SyncContant.FLAG_ADD, updateState);
			});
		});
	}

	__editItem(item, user, account, isSyncSub, updateState) {
		let syncId = item.gid;
		let that = this;

		if(!syncId) {
			return updateState(false);
		}

		that.Schema.findById(syncId, function(err, obj) {
			if (err || !obj) {
				let failItem = { gid: syncId, flag: 2 };
				if (err) failItem.error = Error.SYNC_UNKNOWN_ERROR;
				else if (!obj) failItem.error = Error.SYNC_NO_RECORD_ON_DB;
				return updateState(false, null, failItem);
			}
			that.__getParent(item.pi, function(status, parent) {
				that.makeEditItem(item, obj, account, parent, function(obj) {
					obj.lastEditBy = user;
					obj.tokenDevice = that.__tokenDevice;
					that.__saveCallback(item, obj, SyncContant.FLAG_EDIT, updateState);
				});
			});
		});
	}

	__deleteItem(item, user, callback) {
		let syncId = item.gid;
		let that = this;

		if (!syncId) {
			return callback(false);
		}

		that.Schema.findById(syncId, function(err, obj) {
			if (err || !obj) {
				let failItem = { gid: syncId, flag: 3 };

				if (err) {
					failItem.error = Error.SYNC_UNKNOWN_ERROR;
				} else if (!obj) {
					failItem.error = Error.SYNC_NO_RECORD_ON_DB;
				}

				return callback(false, null, failItem);
			}

			obj.lastEditBy = user;

			/**
			 * extra chứa các thông tin đánh dấu phụ để phần __saveCallback thực hiện nếu có
             */
			let extra = {};

			if (that.syncCode !== 100) {
				obj.isDelete = true;
				obj.tokenDevice = that.__tokenDevice;
			} else {
				/**
				 * Wallet
				 */
				if (user == obj.owner) {
					//nếu người xoá là owner
					//đánh cờ isDelete luôn và ngay
					obj.isDelete = true;
					obj.tokenDevice = that.__tokenDevice;
					
					extra.restoreDefaultPermission = true;
					that.__kickSharedUser = true;
				} else {
					if (obj.listUser.length > 1) {
						obj.tokenDevice = 'moneylover';
						
						extra.kickUser = user; //đánh dấu để kick khỏi list quyền
					} else {
						obj.isDelete = true;
						obj.tokenDevice = that.__tokenDevice;
					}
				}
			}

			that.__saveCallback(item, obj, SyncContant.FLAG_DELETE, callback, extra);
		});
	}

	__saveCallback(item, obj, syncFlag, updateState, extra) {
		let that = this;

		obj.save(function(err, obj) {
			if (err) {
				handleError(err);
			} else {
				handleSuccess(obj);
			}
		});

		function handleError(err){
			if (typeof err != 'string') err = JSON.stringify(err);

			let failItem = {
				gid: item.gid,
				flag: syncFlag
			};

			if ((err.indexOf('11000') != -1) || (err.indexOf('11001') != -1)) {
				failItem.error = Error.SYNC_DUPLICATE_ITEM;
			} else if (err.indexOf('Cast to date failed') != -1) {
				failItem.error = Error.SYNC_DATETIME_ERROR;
			} else if (err.indexOf('No matching document found') != -1) {
				failItem.error = Error.SYNC_NO_RECORD_ON_DB;
			} else {
				failItem.error = Error.SYNC_UNKNOWN_ERROR;
			}

			updateState(false, null, failItem);
		}

		function handleSuccess(obj){
			let temp = {};
			// temp.i = item.i;
			temp.gid = item.gid;
			temp.f = syncFlag;

			if (that.syncCode === SyncCodes.WALLET) {
				that.__account_id = obj._id;
				
				if (syncFlag === SyncContant.FLAG_ADD) {
					that.syncCode += SyncContant.FLAG_ADD;
				} else {
					that.__changeAccount = obj._id;

					if (syncFlag === SyncContant.FLAG_DELETE) {
						that.__isNoWalletByLoginId(obj.rwInfo.login_id, (err, status) => {
							if (status) {
								//remove finsify login session
								that.__removeFinsifyLoginId(obj.rwInfo.secret);
							}
						});
					}
				}
			}

			if (syncFlag === SyncContant.FLAG_ADD && that.syncCode === SyncCodes.WALLET + SyncContant.FLAG_ADD){
				that.__updateUserTag(obj);

				Permission.setAccountPermission(that.__user_id, item.gid, true, true, function(status) {
					updateState(true, temp);
				});
			} else if (syncFlag === SyncContant.FLAG_DELETE && that.syncCode === SyncCodes.WALLET) {
				if (extra.kickUser) {
					Permission.setAccountPermission(extra.kickUser, obj._id, false, false, function(status, removeUserToAccountResult){
						updateState(true, temp);
					});
				} else if (extra.restoreDefaultPermission) {
					Permission.defaultPermission(obj._id, function(status){
						updateState(true, temp);
					});
				} else {
					updateState(true, temp);
				}
			} else {
				updateState(true, temp);
			}
		}
	}

	__pushTransactionNotification(){
		if (this.syncCode !== SyncCodes.TRANSACTION) {
			return 0;
		}

		if (!this.__walletInfo || !this.__walletInfo.transaction_notification) {
			return 0;
		}

		if (this.__transactionNotificationCount) {
			let language = null;

			if (this.__userInfo && this.__userInfo.client_setting && this.__userInfo.client_setting.l) {
				language = this.__userInfo.client_setting.l;
			}

			pushController.pushTransactionNotification({
				new_transaction_amount: this.__transactionNotificationCount,
				wallet_id: this.__account_id,
				user_id: this.__user_id,
				platform: platformCode.IOS,
				language: language,
				tokenDevice: this.__tokenDevice
			});
		}
	}

	__updateUserTag(obj){
		if (obj.account_type === 1 || obj.account_type === 2) {
			User.updateTags(this.__user_id, [sprintf(TagConstant.LINKEDWALLET, obj.rwInfo.service_id)], function(){

			});
		}
	}

	__isNoWalletByLoginId(loginId, callback){
		AccountSchema.count({isDelete: false, "rwInfo.login_id": loginId}, (err, count) => {
			callback(err, !count);
		});
	}

	__removeFinsifyLoginId(loginSecret){
		User.getFinsifyCustomerId(this.__user_id, (err, customerId) => {
			if (err) {
				return Promise.reject(err);
			}

			if (!customerId) {
				return Promise.resolve();
			}

			return FinsifyController.unlinkRemoteWallet(loginSecret, customerId);
		});
	}

	clearSub(datas){
		if(datas.length === 0) return [];

		let newData = [];
		let tmpData = null;
		datas.forEach(function(item){
			if(item.parent && item.parent.isDelete === false) {
				tmpData = item;
				tmpData.parent = item.parent._id;
				newData.push(tmpData);
			}
		});
		tmpData = undefined;
		return newData;
	}

	pullData(){
		throw new Error("pullData must be implemented");
	}

	validSyncItem(){
		throw new Error("validSyncItem must be implemented");
	}

	makeNewItem(){
		throw new Error("makeNewItem must be implemented");
	}

	makeEditItem(){
		throw new Error("makeEditItem must be implemented");
	}
}

exports.Sync = Sync;
