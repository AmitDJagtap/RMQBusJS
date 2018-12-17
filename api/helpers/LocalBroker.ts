import { Broker } from '../interfaces/Broker';
import amqp from 'amqplib';

export default class LocalBroker implements Broker {

    init(){
        amqp.connect('amqp://ayopop:sRwH55P6F4@13.232.192.49:30056', function(err:any, conn:any) {
            conn.createChannel(function(err:any, ch:any) {
              var q = 'hello';
          
              ch.assertQueue(q, {durable: false});
              // Note: on Node 6 Buffer.from(msg) should be used
              ch.sendToQueue(q, new Buffer('Hello World!'));
              console.log(" [x] Sent 'Hello World!'");
            });
          });
    }    
    
    publish(topic: string, msg: any): Promise<any> {
        throw new Error("Method not implemented.");
    }    
    subscribe(topic: string, callback: any): Promise<any> {
        throw new Error("Method not implemented.");
    }
    rpc(topic: string, message: any): Promise<any> {
        throw new Error("Method not implemented.");
    }
    unsubscribe(topic: string): void {
        throw new Error("Method not implemented.");
    }


}