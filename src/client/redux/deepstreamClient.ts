import { fromEventPattern, Observable } from "rxjs";

export default class DeepstreamClient {
  private client: deepstreamIO.Client;

  constructor(deepstream: deepstreamIO.deepstreamStatic, url: string, ...args: any[]) {
    this.client = deepstream(url, ...args);
  }
  public login(...args: any[]): Promise<DeepstreamClient> {
    return new Promise((resolve, reject) => {
      this.client.login(...args, (success: any) => {
        success ? resolve(this) : reject();
      });
    });
  }
  public subscribe(eventName: string): Observable<any> /* TODO type */ {
    type Handler = (data: any) => void;
    return fromEventPattern(
      handler => this.client.event.subscribe(eventName, handler as Handler),
      handler => this.client.event.unsubscribe(eventName, handler as Handler)
    );
  }
  public emit(eventName: string, data?: any): void {
    this.client.event.emit(eventName, data);
  }
  public make(rpcName: string, data?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.client.rpc.make(rpcName, data, (error: any, result: any) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      });
    });
  }
}
