export class DefaultOptions {

    public RPC_TIMEOUT: number = 60000;
    public RESPONDER_QUEUE_DURABLE: boolean = true;
    public RESPONDER_QUEUE_EXCLUSIVE: boolean = false;
    public RESPONDER_QUEUE_AUTODEL: boolean = false;
    public RESPONDER_CB_QUEUE_DURABLE: boolean = false;
    public RESPONDER_CB_QUEUE_EXCLUSIVE: boolean = true;
    public RESPONDER_CB_QUEUE_AUTODEL: boolean = true;
    public CONSUMER_QUEUE_DURABLE: boolean = true;
    public CONSUMER_QUEUE_EXCLUSIVE: boolean = false;
    public CONSUMER_QUEUE_AUTODEL: boolean = false;
    public CONSUMER_EXCHANGE_AUTODEL: boolean = false;
    public CONSUMER_EXCHANGE_DURAble: boolean = true;
    public CONSUME_CALL_NOACK: boolean = false;
    public GLOBAL_EXCHANGE_NAME: string = "ayopop"
    public URL: string;
    public APP_NAME: string;

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