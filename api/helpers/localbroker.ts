import { Broker } from '../interfaces/Broker';

export class LocalBroker implements Broker {
    publish(topic: string, msg: any): Promise<any> {
        throw new Error("Method not implemented.");
    }    
    subscribe(topic: string, callback: any): Promise<any> {
        throw new Error("Method not implemented.");
    }
    rpc(topic: string, message: any, callback: any): Promise<any> {
        throw new Error("Method not implemented.");
    }
    unsubscribe(topic: string): void {
        throw new Error("Method not implemented.");
    }


}