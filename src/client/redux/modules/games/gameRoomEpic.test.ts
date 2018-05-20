import { ActionsObservable } from "redux-observable";
import { asyncScheduler, EMPTY, NEVER, of } from "rxjs";
import { toArray } from "rxjs/operators";
import { clearChat } from "../chat/chatActions";
import { fetchGameDataRequest, fetchGameDataSuccess } from "./gameDataActions";
import {
  enterRoom,
  enterSpectatorRoom,
  exitRoom,
  exitSpectatorRoom,
  joinGame,
  leaveGame,
} from "./gameRoomActions";
import gameRoomEpic from "./gameRoomEpic";

describe("game room epic", () => {
  const state$: any = undefined;
  let dependencies: any;
  let deepstreamClient: any;
  let ajax: any;

  beforeEach(() => {
    deepstreamClient = {
      make: jest.fn(),
      subscribe: jest.fn(),
    };
    ajax = {
      getJSON: jest.fn(),
    };
    dependencies = {
      deepstreamClient,
      ajax,
    };
  });

  test("subscribes to spectator events when entering spectator room", async () => {
    const action = enterSpectatorRoom("game_id");
    const action$ = new ActionsObservable(of(action, asyncScheduler));

    deepstreamClient.subscribe.mockReturnValue(EMPTY);

    await gameRoomEpic(action$, state$, dependencies)
      .pipe(toArray())
      .toPromise();

    expect(deepstreamClient.subscribe).toHaveBeenCalledTimes(1);
    expect(deepstreamClient.subscribe).toHaveBeenCalledWith("spectate:game_id");
  });

  test("unsubscribes from spectator events when exiting spectator room", async () => {
    const action$ = new ActionsObservable(
      of(enterSpectatorRoom("game_id"), exitSpectatorRoom("game_id"), asyncScheduler)
    );

    deepstreamClient.subscribe.mockReturnValue(NEVER);
    await gameRoomEpic(action$, state$, dependencies)
      .pipe(toArray())
      .toPromise();
    // Pass = No timeout
  });

  test("fetches game data if needed when entering room", async () => {
    const shouldFetchGameData = true;
    const action = enterRoom("game_id", shouldFetchGameData);
    const action$ = new ActionsObservable(of(action));

    const resultActions = await gameRoomEpic(action$, state$, dependencies)
      .pipe(toArray())
      .toPromise();

    expect(resultActions).toContainEqual(fetchGameDataRequest("game_id"));
  });

  test("does not fetch game data if not needed when entering room", async () => {
    const shouldFetchGameData = false;
    const action = enterRoom("game_id", shouldFetchGameData);
    const action$ = new ActionsObservable(of(action));

    const resultActions = await gameRoomEpic(action$, state$, dependencies)
      .pipe(toArray())
      .toPromise();

    expect(resultActions).not.toContainEqual(fetchGameDataRequest("game_id"));
  });

  test("fetch game request action performs ajax call", async () => {
    const action = fetchGameDataRequest("game_id");
    const action$ = new ActionsObservable(of(action));

    const mockGame = {
      createdTime: "2017-06-24T19:03:37.996Z",
      host: "user_id",
      players: ["user_id"],
      id: "game_id",
    };

    ajax.getJSON.mockReturnValue(of(mockGame));

    const resultActions = await gameRoomEpic(action$, state$, dependencies)
      .pipe(toArray())
      .toPromise();

    expect(resultActions).toContainEqual(fetchGameDataSuccess(mockGame));
  });

  test("clears chat if exiting room you're not playing in", async () => {
    const isInGame = false;
    const action = exitRoom("game_id", isInGame);
    const action$ = new ActionsObservable(of(action));

    const resultActions = await gameRoomEpic(action$, state$, dependencies)
      .pipe(toArray())
      .toPromise();

    expect(resultActions).toContainEqual(clearChat("game:game_id"));
  });

  test("does not clear chat if exiting room you are playing in", async () => {
    const isInGame = true;
    const action = exitRoom("game_id", isInGame);
    const action$ = new ActionsObservable(of(action));

    const resultActions = await gameRoomEpic(action$, state$, dependencies)
      .pipe(toArray())
      .toPromise();

    expect(resultActions).not.toContainEqual(clearChat("game:game_id"));
  });

  test("makes rpc join game request", async () => {
    const action = joinGame("user_id", "game_id");
    const action$ = new ActionsObservable(of(action));
    await gameRoomEpic(action$, state$, dependencies)
      .pipe(toArray())
      .toPromise();

    expect(deepstreamClient.make).toHaveBeenCalledWith("join-game", action.payload);
  });

  test("makes rpc leave game request", async () => {
    const action = leaveGame("user_id", "game_id");
    const action$ = new ActionsObservable(of(action));
    await gameRoomEpic(action$, state$, dependencies)
      .pipe(toArray())
      .toPromise();

    expect(deepstreamClient.make).toHaveBeenCalledWith("leave-game", action.payload);
  });
});
