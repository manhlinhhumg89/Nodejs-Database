const env = process.env.NODE_ENV || 'local';
const mongoose = require('mongoose');
const fs = require('fs');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const config = require('../../config/config')[env];


const connectOptions ={
    server : {
        auto_reconnect: true
    }
}

//Connect to mongodb

mongoose.Promise = global.Promise;
mongoose.connect(config.db_url,connectOptions)
let db = mongoose.connection;
console.log(db.collections)

db.on('error', console.error.bind(console, ' Sync Database connection error:'));
db.once('open', function callback() {
    console.log('[' + env + '] ' + config.app.name + ' Sync Database connection opened.');

    // syncerrorlogs collection
    let unsubscriptionuserlogSchema = new Schema({
        userId: { type: String, required: true, index: true },
        platform: {type: String, required:true,index: true},
        bill_id:{type: String, index: true},
        product_id: {type: String, index: true, require: true},
        create_at: { type: Date, default: Date.now, index: true }
    });

    let unSubScriptionUserModel = mongoose.model('unsubscriptionuser', unsubscriptionuserlogSchema);

    fs.readFile('./data/unSubscriptionUserLogs.json', (err, buff) => {
        if (err) throw err;
        let results = JSON.parse(buff.toString());
        results.map(data => {
            let unSubScriptionUserInsert = new unSubScriptionUserModel({
                userId: data.userId,
                platform: data.platform,
                bill_id: data.bill_id,
                product_id: data.product_id,
                create_at: data.create_at
            });

            unSubScriptionUserInsert.save(function (err) {
                if (err) console.log(err);
            });
            // console.log(data)
        })
    });
    
});

db.on('reconnected', function () {
    console.log('[' + env + '] ' + config.app.name + ' Database connection reconnected.');
});

db.on('disconnected', function () {
    console.log('Money DB DISCONNECTED');
});