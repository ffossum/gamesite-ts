import { ActionsObservable } from "redux-observable";
import { asyncScheduler, EMPTY, NEVER, of } from "rxjs";
import { toArray } from "rxjs/operators";
import { isISO8601 } from "validator";
import {
  joinChannel,
  leaveChannel,
  receiveMessage,
  ReceiveMessageAction,
  sendMessage,
} from "./chatActions";
import chatEpic from "./chatEpic";

describe("chat epic", () => {
  let deepstreamClient: any;
  let dependencies: any;
  const state$: any = undefined;

  beforeEach(() => {
    deepstreamClient = {
      emit: jest.fn(),
      subscribe: jest.fn(),
    };
    dependencies = {
      deepstreamClient,
    };
  });

  test("emits send message event to deepstream", async () => {
    const action = sendMessage("asdf-id", "general", "message text");
    const action$ = new ActionsObservable(of(action));

    const actions = await chatEpic(action$, state$, dependencies)
      .pipe(toArray())
      .toPromise();

    expect(deepstreamClient.emit).toHaveBeenCalledTimes(1);
    expect(deepstreamClient.emit.mock.calls).toMatchSnapshot();
    expect(actions).toHaveLength(0);
  });

  test("subscribes to chat channel deepstream events", async () => {
    const action = joinChannel("general");
    const action$ = new ActionsObservable(of(action, asyncScheduler));

    deepstreamClient.subscribe.mockReturnValueOnce(EMPTY);

    const actions = await chatEpic(action$, state$, dependencies)
      .pipe(toArray())
      .toPromise();

    expect(deepstreamClient.subscribe).toHaveBeenCalledTimes(1);
    expect(actions).toHaveLength(0);
  });

  test("handles events from deepstream subscription", async () => {
    const action = joinChannel("general");
    const action$ = new ActionsObservable(of(action, asyncScheduler));

    const eventData = {
      t: "chatmsg",
      ch: "general",
      uid: "asdf-id",
      txt: "message text",
    };
    deepstreamClient.subscribe.mockReturnValueOnce(of(eventData));

    const actions = await chatEpic(action$, state$, dependencies)
      .pipe(toArray())
      .toPromise();

    expect(deepstreamClient.subscribe).toHaveBeenCalledTimes(1);

    expect(actions).toHaveLength(1);

    const resultAction = actions[0] as ReceiveMessageAction;
    const timeStamp = resultAction.payload.time;

    expect(isISO8601(timeStamp)).toBe(true);
    expect(resultAction).toEqual(receiveMessage(eventData, timeStamp));
  });

  test("unsubscribes from events after leave channel action", async () => {
    const action$ = new ActionsObservable(
      of(joinChannel("general"), leaveChannel("general"), asyncScheduler)
    );

    deepstreamClient.subscribe.mockReturnValueOnce(NEVER);

    await chatEpic(action$, state$, dependencies)
      .pipe(toArray())
      .toPromise();

    expect(deepstreamClient.subscribe).toHaveBeenCalledTimes(1);
  });
});
