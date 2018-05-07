/* @flow */
import { fromEventPattern, Observable } from "rxjs";

export default class DeepstreamClient {
  private client: any;

  constructor(deepstream: any, ...args: any[]) {
    this.client = deepstream(...args);
  }
  public login(...args: any[]): Promise<DeepstreamClient> {
    return new Promise((resolve, reject) => {
      this.client.login(...args, (success: any) => {
        success ? resolve(this) : reject();
      });
    });
  }
  public subscribe(eventName: string): Observable<any> /* TODO type */ {
    return fromEventPattern(
      handler => this.client.event.subscribe(eventName, handler),
      handler => this.client.event.unsubscribe(eventName, handler)
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
