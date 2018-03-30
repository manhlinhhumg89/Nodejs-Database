const env = process.env.NODE_ENV || 'local';
const mongoose = require('mongoose');
const fs = require('fs')
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const config = require('../../config/config')[env];

const connectOptions = {
    server: {
        auto_reconnect: true
    }
};

// Connect to MongoDB
mongoose.Promise = global.Promise;
mongoose.connect(config.db_url, connectOptions);
let db = mongoose.connection;
console.log(db.collections)
db.on('error', console.error.bind(console, ' Sync Database connection error:'));
db.once('open', function callback() {
    console.log('[' + env + '] ' + config.app.name + ' Sync Database connection opened.');

    // syncerrorlogs collection
    let syncErrorLogSchema = new Schema({
        userId: { type: String, required: true, index: true },
        postData: { type: String },
        errorCode: { type: Number, required: true },
        errorMessage: { type: String, required: true },
        errorDetail: { type: String },
        platform: { type: Number, index: true },
        tokenDevice: { type: String },
        url: { type: String, index: true },
        errorDate: { type: Date, default: Date.now, index: true }
    });

    let syncErrorLogModel = mongoose.model('syncerrorlogs', syncErrorLogSchema);

    fs.readFile('./data/syncerrorlogs.json', (err, buff) => {
        if (err) throw err;
        let results = JSON.parse(buff.toString());
        results.map(data => {
            let syncErrorLogInsert = new syncErrorLogModel({
                userId: data.userId,
                postData: data.postData,
                errorCode: data.errorCode,
                errorMessage: data.errorMessage,
                errorDetail: data.errorDetail,
                platform: data.platform,
                tokenDevice: data.tokenDevice,
                url: '/api/purchase/bill',
                errorDate: data.errorDate
            });

            syncErrorLogInsert.save(function (err) {
                if (err) console.log(err);
            });
        })
    });

    // purchaserequestlogs collection
    let purchaseRequestLogSchema = new Schema({
        userId: { type: String, required: true, index: true },
        statusCode: { type: Number, default: 200 },
        platform: { type: Number, required: true, index: true },
        url: { type: String, required: true, index: true },
        logAt: { type: Date, required: true, index: true },
        createdAt: { type: Date, default: Date.now, index: true }
    });

    let purchaseRequestLogModel = mongoose.model('purchaserequestlogs', purchaseRequestLogSchema);

    fs.readFile('./data/purchaserequestlogs.json', (err, buff) => {
        if (err) throw err;
        let results = JSON.parse(buff.toString());
        results.map(data => {
            let purchaseRequestLogInsert = new purchaseRequestLogModel({
                userId: data.userId,
                statusCode: 200,
                platform: data.platform,
                url: '/api/purchase/bill',
                logAt: data.logAt,
                createdAt: data.createdAt
            });

            purchaseRequestLogInsert.save(function (err) {
                if (err) console.log(err);
            });
        })
    });
});

db.on('reconnected', function () {
    console.log('[' + env + '] ' + config.app.name + ' Database connection reconnected.');
});

db.on('disconnected', function () {
    console.log('Money DB DISCONNECTED');
});
