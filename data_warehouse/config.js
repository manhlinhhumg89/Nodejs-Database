module.exports = {
    local: {
        EVENT_WORKER: {
            EVENT_INSERT_NAME: 'hook.ready.raw',
            EVENT_UPDATE_NAME: 'hook.ready.rawupdate',
            EVENT_SALE_INSERT: 'hook.ready.rawsale',

            EVENT_PUBLISH_UNSUBSCRIPTION_USER_LOG:'hook.ready.unSubscriptionUserLog',
            EVENT_RECEIVE_UNSUBSCRIPTION_USER_LOG:'hook.ready.unSubscriptionUserLog',
            WORKER_RECEIVE_FOR_UNSUBSCRIPTION_USER_LOG: 'queue_worker_receive_unsubscription_user_log',
            EVENT_PUBLISH_UNSUBSCRIPTION_INSERT_POSTGRES:'hook.ready.rawPostgres',
            EVENT_RECEIVE_UNSUBSCRIPTION_INSERT_POSTGRES:'hook.ready.rawPostgres',
            WORKER_RECEIVE_UNSUB_POSTGRES_LOG:'queue_worker_insert_log_postgres',

            EVENT_PUBLISH_PURCHASE_REQUEST_SYNC_ERROR_LOG: 'hook.ready.receiveErrorLog',
            EVENT_RECEIVE_FOR_ERROR_LOG: 'hook.ready.receiveErrorLog',
            WORKER_RECEIVE_ERROR_LOG: 'queue_worker_receive_error_log',
            EVENT_PUBLISH_INSERT_POSTGRES: 'hook.ready.rawPostgres',
            EVENT_RECEIVE_INSERT_POSTGRES: 'hook.ready.rawPostgres',
            WORKER_RECEIVE_POSTGRES_LOG: 'queue_worker_insert_log_postgres',

            WORKER_RECEIVE_RAW_INSERT_NAME: 'queue_worker_receive_raw_message_name',
            WORKER_INSERT_GENERATED_DATA: 'queue_worker_insert',
            EVENT_RECEIVE_RAW_INSERT_MESSAGE: 'hook.ready.raw',
            EVENT_PUBLISH_FOR_INSERT: 'hook.ready.insert',

            WORKER_RECEIVE_RAW_UPDATE_NAME: 'queue_worker_receive_raw_update',
            EVENT_RECEIVE_RAW_UPDATE_NAME: 'hook.ready.rawupdate',
            WORKER_UPDATE_EXCUTED_DATA: 'queue_worker_update',
            EVENT_PUBLISH_FOR_UPDATE: 'hook.ready.update',

            EVENT_SALE_INSERT: 'hook.ready.rawsale',
            WORKER_SALE_LOG_INSERT: 'queue_worker_sale_log_insert',
            EVENT_RECEIVE_RAW_SALE_INSERT: 'hook.ready.receiveSale',
            WORKER_RECEIVE_RAW_SALE_INSERT: 'queue_woker_receive_sale_insert',


            WORKER_INSERT_GENERATED_DATA: 'queue_worker_insert',
            WORKER_UPDATE_EXCUTED_DATA: 'queue_worker_update',
            EVENT_RECEIVE_RAW_SALE_INSERT: 'hook.ready.receiveSale',
            WORKER_RECEIVE_RAW_SALE_INSERT: 'queue_woker_receive_sale_insert',
            EVENT_PUBLISH_FOR_INSERT: 'hook.ready.insert',
            EVENT_PUBLISH_FOR_UPDATE: 'hook.ready.update',

            EVENT_DISCOUNT_TRACKING: 'hook.ready.discount-push',
            WORKER_DISCOUNT_LOG_INSERT: 'queue_woker_discount_log',
            EVENT_RECEIVE_RAW_DISCOUNT_INSERT: 'hook.ready.discount-process',
            WORKER_RECEIVE_RAW_DISCOUNT_INSERT: 'queue_worker_discount_process'
        },
        PREVIEW_MODE: {
            EVENT_INSERT_NAME: 'hook.ready.user-insert',
            EVENT_UPDATE_NAME: 'hook.ready.user-update',
            EVENT_SALE_INSERT: 'hook.ready.sale-insert',

            WORKER_RECEIVE_RAW_INSERT_NAME: 'queue_worker_receive_raw_message_name_preview',
            WORKER_INSERT_GENERATED_DATA: 'queue_worker_insert_preview',
            EVENT_RECEIVE_RAW_INSERT_MESSAGE: 'hook.ready.user-insert',
            EVENT_PUBLISH_FOR_INSERT: 'hook.ready.insert_preview',

            WORKER_RECEIVE_RAW_UPDATE_NAME: 'queue_worker_receive_raw_update_preview',
            EVENT_RECEIVE_RAW_UPDATE_NAME: 'hook.ready.user-update',
            WORKER_UPDATE_EXCUTED_DATA: 'queue_worker_update_preview',
            EVENT_PUBLISH_FOR_UPDATE: 'hook.ready.update_preview',

            EVENT_SALE_INSERT: 'hook.ready.sale-insert',
            WORKER_SALE_LOG_INSERT: 'queue_worker_sale_log_insert_preview',
            EVENT_RECEIVE_RAW_SALE_INSERT: 'hook.ready.receiveSale_preview',
            WORKER_RECEIVE_RAW_SALE_INSERT: 'queue_woker_receive_sale_insert_preview',


            WORKER_INSERT_GENERATED_DATA: 'queue_worker_insert_preview',
            WORKER_UPDATE_EXCUTED_DATA: 'queue_worker_update_preview',
            EVENT_RECEIVE_RAW_SALE_INSERT: 'hook.ready.receiveSale_preview',
            WORKER_RECEIVE_RAW_SALE_INSERT: 'queue_woker_receive_sale_insert_preview',
            EVENT_PUBLISH_FOR_INSERT: 'hook.ready.insert_preview',
            EVENT_PUBLISH_FOR_UPDATE: 'hook.ready.update_preview',

            EVENT_DISCOUNT_TRACKING: 'hook.ready.discount-push',
            WORKER_DISCOUNT_LOG_INSERT: 'queue_woker_discount_log',
            EVENT_RECEIVE_RAW_DISCOUNT_INSERT: 'hook.ready.discount-process',
            WORKER_RECEIVE_RAW_DISCOUNT_INSERT: 'queue_worker_discount_process'
        },
        rabbit: {
            host: 'localhost',
            port: 5672,
            user: 'guest',
            password: 'guest',
            vhost: 'data_ware_house',
            url: 'amqp://guest:guest@localhost:5672/data_ware_house'
        }
    },
    dev: {
        EVENT_WORKER: {
            EVENT_INSERT_NAME: 'hook.ready.rawfix',
            EVENT_UPDATE_NAME: 'hook.ready.rawupdatefix',
            EVENT_SALE_INSERT: 'hook.ready.rawsalefix',

            WORKER_RECEIVE_RAW_INSERT_NAME: 'queue_worker_receive_raw_message_name_fix',
            WORKER_INSERT_GENERATED_DATA: 'queue_worker_insert_fix',
            EVENT_RECEIVE_RAW_INSERT_MESSAGE: 'hook.ready.rawfix',
            EVENT_PUBLISH_FOR_INSERT: 'hook.ready.insertfix',

            WORKER_RECEIVE_RAW_UPDATE_NAME: 'queue_worker_receive_raw_update_fix',
            EVENT_RECEIVE_RAW_UPDATE_NAME: 'hook.ready.rawupdatefix',
            WORKER_UPDATE_EXCUTED_DATA: 'queue_worker_updatefix',
            EVENT_PUBLISH_FOR_UPDATE: 'hook.ready.updatefix',

            EVENT_SALE_INSERT: 'hook.ready.rawsalefix',
            WORKER_SALE_LOG_INSERT: 'queue_worker_sale_log_insert_fix',
            EVENT_RECEIVE_RAW_SALE_INSERT: 'hook.ready.receiveSaleFix',
            WORKER_RECEIVE_RAW_SALE_INSERT: 'queue_woker_receive_sale_insert_fix',

            WORKER_INSERT_GENERATED_DATA: 'queue_worker_insert_fix',
            WORKER_UPDATE_EXCUTED_DATA: 'queue_worker_updatefix',
            EVENT_RECEIVE_RAW_SALE_INSERT: 'hook.ready.receiveSaleFix',
            WORKER_RECEIVE_RAW_SALE_INSERT: 'queue_woker_receive_sale_insert_fix',
            EVENT_PUBLISH_FOR_INSERT: 'hook.ready.insertfix',
            EVENT_PUBLISH_FOR_UPDATE: 'hook.ready.updatefix',

            EVENT_DISCOUNT_TRACKING: 'hook.ready.discount-push-dev',
            WORKER_DISCOUNT_LOG_INSERT: 'queue_woker_discount_log_dev',
            EVENT_RECEIVE_RAW_DISCOUNT_INSERT: 'hook.ready.discount-process-dev',
            WORKER_RECEIVE_RAW_DISCOUNT_INSERT: 'queue_worker_discount_process-dev'

        },
        PREVIEW_MODE: {
            EVENT_INSERT_NAME: 'hook.ready.user-insert',
            EVENT_UPDATE_NAME: 'hook.ready.user-update',
            EVENT_SALE_INSERT: 'hook.ready.sale-insert',

            WORKER_RECEIVE_RAW_INSERT_NAME: 'queue_worker_receive_raw_message_name_preview',
            WORKER_INSERT_GENERATED_DATA: 'queue_worker_insert_preview',
            EVENT_RECEIVE_RAW_INSERT_MESSAGE: 'hook.ready.user-insert',
            EVENT_PUBLISH_FOR_INSERT: 'hook.ready.insert_preview',

            WORKER_RECEIVE_RAW_UPDATE_NAME: 'queue_worker_receive_raw_update_preview',
            EVENT_RECEIVE_RAW_UPDATE_NAME: 'hook.ready.user-update',
            WORKER_UPDATE_EXCUTED_DATA: 'queue_worker_update_preview',
            EVENT_PUBLISH_FOR_UPDATE: 'hook.ready.update_preview',

            EVENT_SALE_INSERT: 'hook.ready.sale-insert',
            WORKER_SALE_LOG_INSERT: 'queue_worker_sale_log_insert_preview',
            EVENT_RECEIVE_RAW_SALE_INSERT: 'hook.ready.receiveSale_preview',
            WORKER_RECEIVE_RAW_SALE_INSERT: 'queue_woker_receive_sale_insert_preview',


            WORKER_INSERT_GENERATED_DATA: 'queue_worker_insert_preview',
            WORKER_UPDATE_EXCUTED_DATA: 'queue_worker_update_preview',
            EVENT_RECEIVE_RAW_SALE_INSERT: 'hook.ready.receiveSale_preview',
            WORKER_RECEIVE_RAW_SALE_INSERT: 'queue_woker_receive_sale_insert_preview',
            EVENT_PUBLISH_FOR_INSERT: 'hook.ready.insert_preview',
            EVENT_PUBLISH_FOR_UPDATE: 'hook.ready.update_preview',

            EVENT_DISCOUNT_TRACKING: 'hook.ready.discount-push-dev',
            WORKER_DISCOUNT_LOG_INSERT: 'queue_woker_discount_log_dev',
            EVENT_RECEIVE_RAW_DISCOUNT_INSERT: 'hook.ready.discount-process-dev',
            WORKER_RECEIVE_RAW_DISCOUNT_INSERT: 'queue_worker_discount_process-dev'
        },
        rabbit: {
            host: 'redis-msg',
            port: 5672,
            user: 'moneylover',
            password: '7337610',
            vhost: 'data_ware_house_dev',
            url: 'amqp://moneylover:7337610@redis-msg:5672/data_ware_house_dev'
        }
    },
    production: {
        EVENT_WORKER: {
            EVENT_INSERT_NAME: 'hook.ready.raw',
            EVENT_UPDATE_NAME: 'hook.ready.rawupdate',
            EVENT_SALE_INSERT: 'hook.ready.rawsale',

            WORKER_RECEIVE_RAW_INSERT_NAME: 'queue_worker_receive_raw_message_name',
            WORKER_INSERT_GENERATED_DATA: 'queue_worker_insert',
            EVENT_RECEIVE_RAW_INSERT_MESSAGE: 'hook.ready.raw',
            EVENT_PUBLISH_FOR_INSERT: 'hook.ready.insert',

            WORKER_RECEIVE_RAW_UPDATE_NAME: 'queue_worker_receive_raw_update',
            EVENT_RECEIVE_RAW_UPDATE_NAME: 'hook.ready.rawupdate',
            WORKER_UPDATE_EXCUTED_DATA: 'queue_worker_update',
            EVENT_PUBLISH_FOR_UPDATE: 'hook.ready.update',

            EVENT_SALE_INSERT: 'hook.ready.rawsale',
            WORKER_SALE_LOG_INSERT: 'queue_worker_sale_log_insert',
            EVENT_RECEIVE_RAW_SALE_INSERT: 'hook.ready.receiveSale',
            WORKER_RECEIVE_RAW_SALE_INSERT: 'queue_woker_receive_sale_insert',


            WORKER_INSERT_GENERATED_DATA: 'queue_worker_insert',
            WORKER_UPDATE_EXCUTED_DATA: 'queue_worker_update',
            EVENT_RECEIVE_RAW_SALE_INSERT: 'hook.ready.receiveSale',
            WORKER_RECEIVE_RAW_SALE_INSERT: 'queue_woker_receive_sale_insert',
            EVENT_PUBLISH_FOR_INSERT: 'hook.ready.insert',
            EVENT_PUBLISH_FOR_UPDATE: 'hook.ready.update',

            EVENT_DISCOUNT_TRACKING: 'hook.ready.discount-push',
            WORKER_DISCOUNT_LOG_INSERT: 'queue_woker_discount_log',
            EVENT_RECEIVE_RAW_DISCOUNT_INSERT: 'hook.ready.discount-process',
            WORKER_RECEIVE_RAW_DISCOUNT_INSERT: 'queue_worker_discount_process'
        },
        PREVIEW_MODE: {
            EVENT_INSERT_NAME: 'hook.ready.user-insert',
            EVENT_UPDATE_NAME: 'hook.ready.user-update',
            EVENT_SALE_INSERT: 'hook.ready.sale-insert',

            WORKER_RECEIVE_RAW_INSERT_NAME: 'queue_worker_receive_raw_message_name_preview',
            WORKER_INSERT_GENERATED_DATA: 'queue_worker_insert_preview',
            EVENT_RECEIVE_RAW_INSERT_MESSAGE: 'hook.ready.user-insert',
            EVENT_PUBLISH_FOR_INSERT: 'hook.ready.insert_preview',

            WORKER_RECEIVE_RAW_UPDATE_NAME: 'queue_worker_receive_raw_update_preview',
            EVENT_RECEIVE_RAW_UPDATE_NAME: 'hook.ready.user-update',
            WORKER_UPDATE_EXCUTED_DATA: 'queue_worker_update_preview',
            EVENT_PUBLISH_FOR_UPDATE: 'hook.ready.update_preview',

            EVENT_SALE_INSERT: 'hook.ready.sale-insert',
            WORKER_SALE_LOG_INSERT: 'queue_worker_sale_log_insert_preview',
            EVENT_RECEIVE_RAW_SALE_INSERT: 'hook.ready.receiveSale_preview',
            WORKER_RECEIVE_RAW_SALE_INSERT: 'queue_woker_receive_sale_insert_preview',


            WORKER_INSERT_GENERATED_DATA: 'queue_worker_insert_preview',
            WORKER_UPDATE_EXCUTED_DATA: 'queue_worker_update_preview',
            EVENT_RECEIVE_RAW_SALE_INSERT: 'hook.ready.receiveSale_preview',
            WORKER_RECEIVE_RAW_SALE_INSERT: 'queue_woker_receive_sale_insert_preview',
            EVENT_PUBLISH_FOR_INSERT: 'hook.ready.insert_preview',
            EVENT_PUBLISH_FOR_UPDATE: 'hook.ready.update_preview',

            EVENT_DISCOUNT_TRACKING: 'hook.ready.discount-push',
            WORKER_DISCOUNT_LOG_INSERT: 'queue_woker_discount_log',
            EVENT_RECEIVE_RAW_DISCOUNT_INSERT: 'hook.ready.discount-process',
            WORKER_RECEIVE_RAW_DISCOUNT_INSERT: 'queue_worker_discount_process'
        },
        rabbit: {
            host: 'redis-msg',
            port: 5672,
            user: 'zoostd',
            password: '19f3fdbce4',
            vhost: 'data_ware_house',
            url: 'amqp://zoostd:19f3fdbce4@redis-msg:5672/data_ware_house'
        }
    }
}
