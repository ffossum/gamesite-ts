import { createStore } from "redux";
import { ActionsObservable } from "redux-observable";
import { from, Observable, of } from "rxjs";
import { toArray } from "rxjs/operators";
import { receiveMessage } from "../chat/chatActions";
import { gameCreated } from "../lobby/lobbyActions";
import { rootReducer } from "../root";
import { fetchedUserData } from "./userDataActions";
import userDataEpic from "./userDataEpic";

describe("user data epic", () => {
  let ajax;
  let store;
  let dependencies;

  beforeEach(() => {
    ajax = {
      getJSON: jest.fn(),
    };
    ajax.getJSON.mockReturnValueOnce(
      of([
        {
          id: "user-id",
          username: "Username",
        },
      ])
    );
    store = createStore(rootReducer);

    dependencies = {
      ajax,
      store,
    };
  });
  test("fetches host user data when a new game is created", async () => {
    const action: any = gameCreated({
      id: "game-id",
      host: "user-id",
      createdTime: "2017-06-08T01:49:25.779Z",
      players: [],
    });
    const action$ = new ActionsObservable(of(action));

    const resultActions = await userDataEpic(action$, store, dependencies)
      .pipe(toArray())
      .toPromise();

    expect(ajax.getJSON).toHaveBeenCalledWith("/api/users?id=user-id");
    expect(resultActions).toHaveLength(1);
    expect(resultActions[0]).toEqual(
      fetchedUserData([
        {
          id: "user-id",
          username: "Username",
        },
      ])
    );
  });
  test("fetches user data when a message is received", async () => {
    const action: any = receiveMessage(
      {
        ch: "channel name",
        uid: "user-id",
        txt: "message text",
      },
      "2017-06-08T01:49:25.779Z"
    );

    const action$ = new ActionsObservable(of(action));

    const resultActions = await userDataEpic(action$, store, dependencies)
      .pipe(toArray())
      .toPromise();

    expect(ajax.getJSON).toHaveBeenCalledWith("/api/users?id=user-id");
    expect(resultActions).toHaveLength(1);
    expect(resultActions[0]).toEqual(
      fetchedUserData([
        {
          id: "user-id",
          username: "Username",
        },
      ])
    );
  });
  test("does not refetch already fetched user data", async () => {
    store.dispatch(
      fetchedUserData([
        {
          id: "user-id",
          username: "Username",
        },
      ])
    );

    const action = receiveMessage(
      {
        ch: "channel name",
        uid: "user-id",
        txt: "message text",
      },
      "2017-06-08T01:49:25.779Z"
    );

    const action$ = new ActionsObservable(of(action));

    await userDataEpic(action$, store, dependencies)
      .pipe(toArray())
      .toPromise();

    expect(ajax.getJSON).not.toHaveBeenCalled();
  });
});
