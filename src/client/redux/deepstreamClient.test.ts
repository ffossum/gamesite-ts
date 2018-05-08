import { take, toArray } from "rxjs/operators";
import DeepstreamClient from "./deepstreamClient";

describe("deepstream client", () => {
  test("constructor passes args to deepstream", () => {
    const deepstream: any = jest.fn();
    const client = new DeepstreamClient(deepstream, "localhost:6020");

    expect(client).toBeDefined();
    expect(deepstream).toHaveBeenCalledTimes(1);
    expect(deepstream).toHaveBeenCalledWith("localhost:6020");
  });

  describe("login", () => {
    test("passes args to deepstream login", () => {
      const mockClient = {
        login: jest.fn(),
      };
      const deepstream: any = () => mockClient;

      const client = new DeepstreamClient(deepstream, "url");
      client.login();

      expect(mockClient.login).toHaveBeenCalledTimes(1);
    });

    test("returns a promise", async () => {
      const mockClient = {
        login: (cb: any) => cb(true),
      };
      const deepstream: any = () => mockClient;

      const client = new DeepstreamClient(deepstream, "url");
      const resolved = await client.login();

      expect(resolved).toBe(client);
    });
  });

  test("subscribe returns an observable of a deepstream event", async () => {
    const testEvents = [
      {
        t: "test-event",
      },
      "event data string",
      42,
    ];

    let handler: any;

    const mockClient = {
      event: {
        subscribe: jest.fn().mockImplementation((_, h) => (handler = h)),
        unsubscribe: jest.fn(),
      },
    };

    const deepstream: any = () => mockClient;
    const client = new DeepstreamClient(deepstream, "url");
    const event$ = client.subscribe("event name");

    const eventsPromise = event$.pipe(take(testEvents.length), toArray()).toPromise();
    testEvents.forEach(e => handler(e));

    const receivedEvents = await eventsPromise;
    expect(receivedEvents).toEqual(testEvents);
  });

  test("emit passes data to event.emit", () => {
    const mockClient = {
      event: {
        emit: jest.fn(),
      },
    };
    const deepstream: any = () => mockClient;
    const client = new DeepstreamClient(deepstream, "url");

    client.emit("event name", "data");

    expect(mockClient.event.emit).toHaveBeenCalledTimes(1);
    expect(mockClient.event.emit).toHaveBeenCalledWith("event name", "data");
  });

  describe("make", () => {
    test("passes parameters to rpc.make", () => {
      const mockClient = {
        rpc: {
          make: jest.fn(),
        },
      };
      const deepstream: any = () => mockClient;
      const client = new DeepstreamClient(deepstream, "url");

      client.make("rpc-name", "data");

      expect(mockClient.rpc.make.mock.calls[0][0]).toBe("rpc-name");
      expect(mockClient.rpc.make.mock.calls[0][1]).toBe("data");
      expect(typeof mockClient.rpc.make.mock.calls[0][2]).toBe("function");
    });

    test("returns promise", () => {
      let callback: any;

      const mockClient = {
        rpc: {
          make(_0: any, _1: any, cb: any) {
            callback = cb;
          },
        },
      };

      const deepstream: any = () => mockClient;
      const client = new DeepstreamClient(deepstream, "url");

      let promise = client.make("rpc-name", "data");
      callback && callback("error");
      expect(promise).rejects.toEqual("error");

      promise = client.make("rpc-name", "data");
      callback && callback(undefined, "success");
      expect(promise).resolves.toEqual("success");
    });
  });
});
