import {
    Broker
} from '../interfaces/Broker';
import amqp, {
    Replies
} from 'amqplib';
import {
    Connection,
    Channel
} from 'amqplib';

export default class RMQBroker implements Broker {

    private static _conn: Connection;
    private static _chan: Channel;
    private static _functionsDir = __dirname + '/api/services/*.js';

    init(rmqConfig: any): Promise < any > {
        return new Promise < any > ((res, rej) => {

            amqp.connect(rmqConfig.url).then((connectedCon: Connection) => {
                RMQBroker._conn = connectedCon;
                RMQBroker._conn.createChannel().then((ch: Channel) => {
                    RMQBroker._chan = ch;
                    res();
                });
            });

        });
    }

    publish(exchangeTopic: string, message: any): any {
        let buff = Buffer.from(JSON.stringify(message));
        RMQBroker._chan.assertExchange(exchangeTopic, 'fanout', {
            durable: false
        });
        let ok = RMQBroker._chan.publish(exchangeTopic, '', buff);
        console.log("[x] Event Published : " + exchangeTopic);
        return ok;
    }

    subscribe(topic: string, callback: any): Promise < any > {
        throw new Error("Method not implemented.");
    }

    rpc(topic: string, message: any): Promise < any > {

        return new Promise < any > ((res, rej) => {
            console.log("[x] RPC Invoked : " + topic);
            let buf = Buffer.from(JSON.stringify(message));

            RMQBroker._chan.assertQueue('', {
                exclusive: true
            }).then((q: Replies.AssertQueue) => {
                let corr = generateUuid();

                RMQBroker._chan.consume(q.queue, function (msg) {
                    if (msg.properties.correlationId == corr) {
                        console.log('[x] Response Received for : ' + q.queue);
                        res(msg.content);
                    }
                }, {
                    noAck: true
                });

                RMQBroker._chan.sendToQueue(topic, buf, {
                    correlationId: corr,
                    replyTo: q.queue
                });
                // return if no respose received from topic in 15 sec's
                setTimeout(() => {
                    res(false);
                }, 15000);

            });


        });
    }

    unsubscribe(topic: string): void {
        throw new Error("Method not implemented.");
    }

}

function generateUuid() {
    return Math.random().toString() +
        Math.random().toString() +
        Math.random().toString();
}