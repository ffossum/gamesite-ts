import { ActionsObservable } from "redux-observable";
import { EMPTY, Observable, of } from "rxjs";
import { toArray } from "rxjs/operators";
import { playerJoined, playerLeft } from "../games/gameRoomActions";
import { authenticatedUser } from "./sessionActions";
import sessionEpic from "./sessionEpic";

describe("session epic", () => {
  const store: any = undefined;
  let deepstreamClient: any;
  let dependencies: any;
  beforeEach(() => {
    deepstreamClient = {
      subscribe: jest.fn(),
    };
    dependencies = {
      deepstreamClient,
    };
  });

  test("authenticated user subscribes to user events", async () => {
    deepstreamClient.subscribe.mockReturnValue(EMPTY);

    const userData = {
      email: "bob@test.com",
      id: "user_id",
      username: "Bob",
    };

    const action = authenticatedUser(userData);
    const action$ = new ActionsObservable(of(action));

    await sessionEpic(action$, store, dependencies)
      .pipe(toArray())
      .toPromise();

    expect(deepstreamClient.subscribe).toHaveBeenCalledTimes(1);
    expect(deepstreamClient.subscribe).toHaveBeenCalledWith("user:user_id");
  });

  test("handles events from subscription", async () => {
    deepstreamClient.subscribe.mockReturnValue(
      of(
        {
          t: "player-joined",
          p: {
            gid: "game1",
            uid: "user1",
          },
        },
        {
          t: "player-left",
          p: {
            gid: "game1",
            uid: "user1",
          },
        }
      )
    );

    const userData = {
      email: "bob@test.com",
      id: "user_id",
      username: "Bob",
    };

    const action = authenticatedUser(userData);
    const action$ = new ActionsObservable(of(action));

    const resultActions = await sessionEpic(action$, store, dependencies)
      .pipe(toArray())
      .toPromise();

    expect(resultActions).toEqual([playerJoined("user1", "game1"), playerLeft("user1", "game1")]);
  });
});
