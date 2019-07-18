import * as glob from 'glob';
import * as path from 'path';
import { IConsumer as Consumer } from './Consumer';
import { IResponder as Responder } from './Responder';
import * as amqp from 'amqplib';
import { Connection, Channel } from 'amqplib';
import * as appRoot from 'app-root-path';

export default class FunctionRegistry {
  private static CONN: Connection;
  private respondersDir: string = appRoot.path + '/dist/responders/*.js';
  private consumersDir: string = appRoot.path + '/dist/consumers/*.js';
  private globalConsumersDir: string = appRoot.path + '/dist/globalconsumers/*.js';

  public init(rmqConfig: any): Promise<any> {
    return new Promise<any>(res => {
      amqp.connect(rmqConfig.url).then((connectedCon: Connection) => {
        FunctionRegistry.CONN = connectedCon;
        FunctionRegistry.CONN.createChannel().then((ch: Channel) => {
          this.initResponder(ch, rmqConfig).then(() => {
            this.initConsumer(ch, rmqConfig).then(() => {
              res();
            });
          });
        });
      });
    });
  }

  public initResponder(ch: Channel, config: any): Promise<any> {
    return new Promise<any>(res => {
      let instance: any;
      glob(this.respondersDir, (er, files) => {
        files.forEach(file => {
          // Split file path
          const stringArray: string[] = file.split('/');
          // Get the class name
          let className: string = stringArray[stringArray.length - 1];
          className = className.replace('.js', '');
          instance = require(file)[className];
          const temp: Responder = new instance();

          const ListenTopicName = config.app + '.' + temp.handleTopic;
          ch.assertQueue(ListenTopicName, {
            durable: false,
          });
          ch.prefetch(1);

          ch.consume(ListenTopicName, function reply(msg: any) {
            const incomingData = JSON.parse(msg.content.toString());
            temp
              .executeWithResult(incomingData)
              .then(response => {
                ch.sendToQueue(msg.properties.replyTo, new Buffer(response.toString()), {
                  correlationId: msg.properties.correlationId,
                });

                ch.ack(msg);
              })
              .catch(err => {
                console.log(err);
                ch.nack(msg);
              });
          });
          console.log(' [x] Responders registered for event : ' + ListenTopicName);
        });
        res();
      });
    });
  }

  public initConsumer(ch: Channel, config: any): Promise<any> {
    return new Promise<any>(res => {
      let instance: any;
      glob(this.consumersDir, (er, files) => {
        files.forEach(file => {
          const stringArray: string[] = file.split('/');
          let className: string = stringArray[stringArray.length - 1];
          className = className.replace('.js', '');
          instance = require(file)[className];
          const temp: Consumer = new instance();

          const ListenTopicName = config.app + '.' + temp.eventTopic;
          ch.assertExchange(config.app, 'direct');
          ch.assertQueue(ListenTopicName, {
            exclusive: false,
            durable: true,
          }).then((q: any) => {
            ch.bindQueue(q.queue, config.app, temp.eventTopic);
            ch.consume(q.queue, function reply(msg: any) {
              const incomingData = JSON.parse(msg.content.toString());
              temp
                .handleEvent(incomingData)
                .then(() => {
                  console.log('Consumed');
                  // ch.ack(incomingData);
                })
                .catch(err => {
                  console.log(err);
                  ch.nack(incomingData);
                });
            });
          });
          console.log(' [x] Consumer registered for event : ' + ListenTopicName);
        });
        res();
      });
    });
  }

  public initGlobalConsumer(ch: Channel, config: any): Promise<any> {
    return new Promise<any>(res => {
      let instance: any;
      const appName = config.app;

      glob(this.globalConsumersDir, (er, files) => {
        files.forEach(file => {
          const stringArray: string[] = file.split('/');
          let className: string = stringArray[stringArray.length - 1];
          className = className.replace('.js', '');
          instance = require(file)[className];
          const temp: Consumer = new instance();

          const ListenTopicName = appName + '.' + temp.eventTopic;
          ch.assertExchange('ayopop', 'direct', { durable: false });
          ch.assertQueue(ListenTopicName, {
            exclusive: false,
            durable: false,
          }).then((q: any) => {
            ch.bindQueue(q.queue, 'ayopop', temp.eventTopic);
            ch.consume(q.queue, function reply(msg: any) {
              const incomingData = JSON.parse(msg.content.toString());
              temp
                .handleEvent(incomingData)
                .then(() => {
                  console.log('Consumed');
                  // ch.ack(incomingData);
                })
                .catch(err => {
                  console.log(err);
                  ch.nack(incomingData);
                });
            });
          });
          console.log(' [x] Global Consumer registered for event : ' + ListenTopicName);
        });
        res();
      });
    });
  }

  public getFunctionPaths() {
    return { responder: this.respondersDir, consumer: this.consumersDir };
  }
}
