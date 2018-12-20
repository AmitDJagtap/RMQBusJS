import { Broker } from '../interfaces/Broker';
import amqp, { Replies } from 'amqplib';
import {Connection,Channel} from 'amqplib';


export default class RMQBroker implements Broker {

    private static _conn : Connection;
    private static _functionsDir = __dirname + '/api/services/*.js';

    init(rmqConfig:any):Promise<any>{
        return new Promise<any>((res,rej)=>{
           
            amqp.connect(rmqConfig.url).then((connectedCon: Connection)=> { 
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
                let buf = Buffer.from(JSON.stringify(message));
                ch.assertQueue('',{exclusive:true}).then((q:Replies.AssertQueue)=>{
                let corr = generateUuid();

                ch.consume(q.queue, function(msg) {
                  if (msg.properties.correlationId == corr) {
                    console.log(' Response Received ', msg.content.toString());
                    res(msg.content);
                  }
                }, {noAck: true});
          
                ch.sendToQueue(topic,buf,{ correlationId: corr, replyTo: q.queue });
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
