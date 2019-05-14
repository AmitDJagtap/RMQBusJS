export interface IConsumer {
  eventTopic: string;
  /**
   * The execute method called by topic : handleTopic, and executed with req param.
   * Res(response) object will
   * Res(null) method fail
   */
  handleEvent(req: any): Promise<any>;
}
