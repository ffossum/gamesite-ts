import { ActionsObservable } from "redux-observable";
import { asyncScheduler, empty, of } from "rxjs";
import { toArray } from "rxjs/operators";
import { createGameRequest, enterLobby, gameCreated, gameUpdated } from "./lobbyActions";
import lobbyEpic from "./lobbyEpic";

describe("lobby epic", () => {
  const state$: any = undefined;
  let deepstreamClient: any;
  beforeEach(() => {
    deepstreamClient = {
      subscribe: jest.fn(),
      make: jest.fn(),
    };
  });

  test("subscribes to lobby events when entering lobby", async () => {
    deepstreamClient.subscribe.mockReturnValue(empty());
    deepstreamClient.make.mockReturnValue(Promise.resolve([]));
    const dependencies: any = { deepstreamClient };

    const action = enterLobby();
    const action$ = new ActionsObservable(of(action, asyncScheduler));

    await lobbyEpic(action$, state$, dependencies)
      .pipe(toArray())
      .toPromise();

    expect(deepstreamClient.subscribe).toHaveBeenCalledTimes(1);
    expect(deepstreamClient.subscribe).toHaveBeenCalledWith("lobby");
  });

  test("handles game created events after subscribing", async () => {
    const gameData = {
      id: "game-id",
      host: "user-id",
      createdTime: "2017-06-11T15:47:15.613Z",
      players: [],
    };
    const event = {
      t: "create-game",
      p: gameData,
    };
    deepstreamClient.subscribe.mockReturnValue(of(event));
    deepstreamClient.make.mockReturnValue(Promise.resolve([]));
    const dependencies: any = { deepstreamClient };

    const action = enterLobby();
    const action$ = new ActionsObservable(of(action, asyncScheduler));

    const resultActions = await lobbyEpic(action$, state$, dependencies)
      .pipe(toArray())
      .toPromise();

    expect(resultActions).toContainEqual(gameCreated(gameData));
  });

  test("handles game updated events", async () => {
    const gameUpdateData = {
      id: "game-id",
      players: ["asdf-id", "zxcv-id"],
    };
    const event = {
      t: "game-updated",
      p: gameUpdateData,
    };
    deepstreamClient.subscribe.mockReturnValue(of(event));
    deepstreamClient.make.mockReturnValue(Promise.resolve([]));
    const dependencies: any = { deepstreamClient };

    const action = enterLobby();
    const action$ = new ActionsObservable(of(action, asyncScheduler));

    const resultActions = await lobbyEpic(action$, state$, dependencies)
      .pipe(toArray())
      .toPromise();

    expect(resultActions).toContainEqual(gameUpdated(gameUpdateData));
  });

  test("makes deepstream rpc request to create game", async () => {
    const history = {
      push: jest.fn(),
    };
    deepstreamClient.make.mockReturnValue(Promise.resolve({ id: "game-id" }));

    const dependencies: any = {
      deepstreamClient,
      history,
    };
    const action = createGameRequest("user-id");
    const action$ = new ActionsObservable(of(action, asyncScheduler));

    await lobbyEpic(action$, state$, dependencies)
      .pipe(toArray())
      .toPromise();

    expect(deepstreamClient.make).toHaveBeenCalledTimes(1);
    expect(deepstreamClient.make).toHaveBeenCalledWith("create-game", {
      uid: "user-id",
    });
    expect(history.push).toHaveBeenCalledTimes(1);
    expect(history.push).toHaveBeenCalledWith("/game/game-id");
  });
});
