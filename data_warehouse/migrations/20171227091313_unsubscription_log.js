
exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.createTable('unsubscription_user_log', function(table){
            table.increments('id').notNull().primary();
            table.string('userid',50).notNull().index();
            table.integer('platform').notNull().index()
            table.string('billid',100).notNull().index();
            table.string('productid',100).notNull().index();
            table.timestamp('createdat',true).defaultTo(knex.fn.now());
            
        })
    ])
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.dropTable('unsubscription_user_log')
            .then(function(res) {
                console.log('Drop table UnSubscriptionUserLog!')
            }).catch(function (error) {
                console.log(error);
            })

    ])
};
