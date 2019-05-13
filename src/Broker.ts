export interface IBroker {
  publish(topic: string, msg: any): Promise<any>;
  subscribe(topic: string, callback: any): Promise<any>;
  rpc(topic: string, message: any, callback: any): Promise<any>;
  unsubscribe(topic: string): void;
}
