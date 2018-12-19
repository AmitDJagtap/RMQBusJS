import { Broker } from '../interfaces/Broker';
import amqp, { Replies } from 'amqplib';
import {Connection,Channel} from 'amqplib';



export default class RMQBroker implements Broker {

    private static _conn : Connection;
    private static _functionsDir = __dirname + '/api/services/*.js';

    init():Promise<any>{
        return new Promise<any>((res,rej)=>{
            amqp.connect('amqp://ayopop:sRwH55P6F4@13.232.192.49:30056').then((connectedCon: Connection)=> { 
                RMQBroker._conn = connectedCon;
                res();
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
        
        return new Promise<any>((res,rej)=>{
            console.log("RPC Invoked.");    
            RMQBroker._conn.createChannel().then((ch:Channel)=>{
                //

               ch.assertQueue('',{exclusive:true}).then((q:Replies.AssertQueue)=>{
                var corr = generateUuid();
                console.log(' Sending Data -', message);

                ch.consume(q.queue, function(msg) {
                  if (msg.properties.correlationId == corr) {
                    console.log(' Response Received ', msg.content.toString());
                    res(msg.content);
                  }
                }, {noAck: true});
          
                ch.sendToQueue(topic,new Buffer(message.toString()),{ correlationId: corr, replyTo: q.queue });
               });

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
