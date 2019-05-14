export interface IResponder {
  handleTopic: string;
  /**
   * The execute method called by topic : handleTopic, and executed with req param.
   * Res(response) object will
   * Res(null) method fail
   */
  executeWithResult(req: any): Promise<any>;
}
