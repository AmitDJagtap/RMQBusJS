import { IBroker } from './Broker';
import * as amqp from 'amqplib';
import { Connection, Channel, Replies } from 'amqplib';
import FunctionRegistry from './FunctionRegistory';

export default class RMQBroker implements IBroker {
  private static CONN: Connection;
  private static CHAN: Channel;
  private static FUNCTIONS_FIR = __dirname + '/api/services/*.js';
  private static MESSAGE_TTL: number;
  private static RPC_TIMEOUT: number;

  public init(rmqConfig: any): Promise<any> {
    return new Promise<any>((res, rej) => {
      RMQBroker.RPC_TIMEOUT = rmqConfig.rpcTimeout;
      RMQBroker.MESSAGE_TTL = rmqConfig.messageTtl;
      amqp.connect(rmqConfig.url).then((connectedCon: Connection) => {
        RMQBroker.CONN = connectedCon;
        RMQBroker.CONN.createChannel().then((ch: Channel) => {
          RMQBroker.CHAN = ch;
          res();
        });
      });
    });
  }

  public initFunctions(rmqConfig: any): Promise<any> {
    return new Promise<any>((res, rej) => {
      const FuncReg: FunctionRegistry = new FunctionRegistry();
      FuncReg.initResponder(RMQBroker.CHAN, rmqConfig).then(() => {
        FuncReg.initConsumer(RMQBroker.CHAN, rmqConfig).then(() => {
          FuncReg.initGlobalConsumer(RMQBroker.CHAN, rmqConfig).then(() => {
            res();
          });
        });
      });
    });
  }

  public publish(topic: string, message: any): any {
    const buff = Buffer.from(JSON.stringify(message));
    const tempsplit = topic.split('.');
    const routingKey = tempsplit[1];
    const exchange = tempsplit[0];
    const ok = RMQBroker.CHAN.publish(exchange, routingKey, buff);
    console.log('[x] Event Published : ' + topic);
    return ok;
  }

  public subscribe(topic: string, callback: any): Promise<any> {
    throw new Error('Method not implemented.');
  }

  public rpc(topic: string, message: any): Promise<any> {
    return new Promise<any>((res, rej) => {
      console.log('[x] RPC Invoked : ' + topic);
      const buf = Buffer.from(JSON.stringify(message));

      RMQBroker.CHAN.assertQueue('', { exclusive: true, durable: false, autoDelete: true })
        .then((q: Replies.AssertQueue) => {
          const corr = generateUuid();
          RMQBroker.CHAN.consume(
            q.queue,
            (msg: any) => {
              if (msg && msg.properties.correlationId === corr) {
                const consumerTag = msg.fields.consumerTag;
                console.log('[x] Response Received for : ' + q.queue);
                res(msg.content);
                RMQBroker.CHAN.cancel(consumerTag);
              }
            },
            { noAck: true },
          );

          RMQBroker.CHAN.sendToQueue(topic, buf, {
            correlationId: corr,
            replyTo: q.queue,
          });
          // return if no respose received from topic in 15 sec's
          setTimeout(() => {
            res(false);
          }, RMQBroker.RPC_TIMEOUT);
        })
        .catch(err => {
          throw err;
        });
    });
  }

  public unsubscribe(topic: string): void {
    throw new Error('Method not implemented.');
  }
}

// temp for public code.
function generateUuid() {
  return Math.random().toString() + Math.random().toString() + Math.random().toString();
}
