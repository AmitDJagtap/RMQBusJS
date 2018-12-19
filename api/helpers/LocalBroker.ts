import { Broker } from '../interfaces/Broker';
import amqp from 'amqplib';
import {Connection,Channel} from 'amqplib';

export default class LocalBroker implements Broker {

    init():Promise<any>{
        return new Promise<any>((res,rej)=>{
            amqp.connect('amqp://ayopop:sRwH55P6F4@13.232.192.49:30056').then((conn: Connection)=> { 
                conn.createChannel().then((ch:Channel)=>{
                    var q = 'hello';
                    ch.assertQueue(q, {durable: false});
                    ch.sendToQueue(q, new Buffer('Hello World!'));
                    console.log(" [x] Sent 'Hello World!'");
                    res();
                });

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