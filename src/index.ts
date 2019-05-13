import { Broker } from './Broker';
import * as amqp from 'amqplib';
import { Connection, Channel, Replies } from 'amqplib';

export default class RMQBroker implements Broker {
  private static _conn: Connection;
  private static _chan: Channel;
  private static _functionsDir = __dirname + '/api/services/*.js';
  private static _messageTtl: number;
  private static _rpcTimeout: number;

  init(rmqConfig: any): Promise<any> {
    return new Promise<any>((res, rej) => {
      RMQBroker._rpcTimeout = rmqConfig.rpcTimeout;
      RMQBroker._messageTtl = rmqConfig.messageTtl;
      amqp.connect(rmqConfig.url).then((connectedCon: Connection) => {
        RMQBroker._conn = connectedCon;
        RMQBroker._conn.createChannel().then((ch: Channel) => {
          RMQBroker._chan = ch;
          res();
        });
      });
    });
  }

  publish(topic: string, message: any): any {
    let buff = Buffer.from(JSON.stringify(message));
    let tempsplit = topic.split('.');
    let routingKey = tempsplit[1];
    let exchange = tempsplit[0];
    let ok = RMQBroker._chan.publish(exchange, routingKey, buff);
    console.log('[x] Event Published : ' + topic);
    return ok;
  }

  subscribe(topic: string, callback: any): Promise<any> {
    throw new Error('Method not implemented.');
  }

  rpc(topic: string, message: any): Promise<any> {
    return new Promise<any>((res, rej) => {
      console.log('[x] RPC Invoked : ' + topic);
      let buf = Buffer.from(JSON.stringify(message));

      RMQBroker._chan
        .assertQueue('', { exclusive: true, durable: false, autoDelete: true })
        .then((q: Replies.AssertQueue) => {
          let corr = generateUuid();
          RMQBroker._chan.consume(
            q.queue,
            function(msg: any) {
              if (msg && msg.properties.correlationId == corr) {
                let consumerTag = msg.fields.consumerTag;
                console.log('[x] Response Received for : ' + q.queue);
                res(msg.content);
                RMQBroker._chan.cancel(consumerTag);
              }
            },
            { noAck: true },
          );

          RMQBroker._chan.sendToQueue(topic, buf, {
            correlationId: corr,
            replyTo: q.queue,
          });
          // return if no respose received from topic in 15 sec's
          setTimeout(() => {
            res(false);
          }, 60000);
        })
        .catch(err => {
          throw err;
        });
    });
  }

  unsubscribe(topic: string): void {
    throw new Error('Method not implemented.');
  }
}

//temp for public code.
function generateUuid() {
  return Math.random().toString() + Math.random().toString() + Math.random().toString();
}
