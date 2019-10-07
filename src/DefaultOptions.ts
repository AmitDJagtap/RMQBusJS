export class DefaultOptions {

    RPC_TIMEOUT: number = 60000;
    RESPONDER_QUEUE_DURABLE: boolean = true;
    RESPONDER_QUEUE_EXCLUSIVE: boolean = false;
    RESPONDER_QUEUE_AUTODEL: boolean = false;
    RESPONDER_CB_QUEUE_DURABLE: boolean = false;
    RESPONDER_CB_QUEUE_EXCLUSIVE: boolean = true;
    RESPONDER_CB_QUEUE_AUTODEL: boolean = true;
    CONSUMER_QUEUE_DURABLE: boolean = true;
    CONSUMER_QUEUE_EXCLUSIVE: boolean = false;
    CONSUMER_QUEUE_AUTODEL: boolean = false;
    CONSUMER_EXCHANGE_AUTODEL: boolean = false;
    CONSUMER_EXCHANGE_DURAble: boolean = true;
    CONSUME_CALL_NOACK: boolean = false;
    GLOBAL_EXCHANGE_NAME: string = "ayopop"
    URL: string;
    APP_NAME: string;

    /**
     * 
     * @param appName Name of the Microservice
     * @param url Rabbitmq server url e.g - amqp://username:psswd@12.34.45.56:5672
     */
    constructor(appName: string, url: string) {
        this.APP_NAME = appName;
        this.URL = url;
    }
}