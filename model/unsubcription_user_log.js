const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let unsubscriptionuserlogSchema = new Schema({
    userId: { type: String, required: true, index: true },
    platform: {type: String, required:true,index: true},
    bill_id:{type: String, index: true},
    product_id: {type: String, index: true, require: true},
    create_at: { type: Date, default: Date.now, index: true }
});
 mongoose.model('unsubscriptionuser', unsubscriptionuserlogSchema);