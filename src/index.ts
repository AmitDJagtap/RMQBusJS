import { IBroker } from './Broker';
import * as amqp from 'amqplib';
import { Connection, Channel, Replies, Options } from 'amqplib';
import FunctionRegistry from './FunctionRegistory';
import { DefaultOptions } from './DefaultOptions';

export default class RMQBroker implements IBroker {
  public static rmqOptions: DefaultOptions;
  private static CONN: Connection;
  private static CHAN: Channel;
  private static FUNCTIONS_FIR = __dirname + '/api/services/*.js';

  public init(rmqConfig: DefaultOptions): Promise<any> {
    return new Promise<any>((res, rej) => {
      RMQBroker.rmqOptions = rmqConfig;
      amqp.connect(rmqConfig.URL).then((connectedCon: Connection) => {
        RMQBroker.CONN = connectedCon;
        RMQBroker.CONN.createChannel().then((ch: Channel) => {
          RMQBroker.CHAN = ch;
          res();
        });
      });
    });
  }

  public initFunctions(rmqConfig: DefaultOptions): Promise<any> {
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

  public publish(topic: string, message: any, persistMessage?: boolean, expireMessageIn?: string): any {
    const buff = Buffer.from(JSON.stringify(message));
    const tempsplit = topic.split('.');
    const routingKey = tempsplit[1];
    const exchange = tempsplit[0];
    const ok = RMQBroker.CHAN.publish(exchange, routingKey, buff, {
      persistent: persistMessage,
      expiration: expireMessageIn,
    });
    console.log('[x] Event Published : ' + topic);
    return ok;
  }

  public subscribe(topic: string, callback: any): Promise<any> {
    throw new Error('Method not implemented.');
  }

  public rpc(topic: string, message: any, persistMessage?: boolean, expireMessageIn?: string): Promise<any> {
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
            persistent: persistMessage,
            expiration: expireMessageIn,
          });
          // return if no respose received from topic in 15 sec's
          setTimeout(() => {
            res(false);
          }, RMQBroker.rmqOptions.RPC_TIMEOUT);
        })
        .catch(err => {
          throw err;
        });
    });
  }

  public unsubscribe(topic: string): void {
    throw new Error('Method not implemented.');
  }

  public onConnectionClose(handleCloseEvent: any) {
    RMQBroker.CHAN.on('close', handleCloseEvent);
  }

  public onConnectionError(handleErrorEvent: any) {
    RMQBroker.CHAN.on('error', handleErrorEvent);
  }
}

// temp for public code.
function generateUuid() {
  return Math.random().toString() + Math.random().toString() + Math.random().toString();
}
