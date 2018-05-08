import { ActionsObservable } from "redux-observable";
import { of, throwError } from "rxjs";
import { toArray } from "rxjs/operators";
import {
  registrationFailure,
  registrationRequest,
  registrationSuccess,
} from "./registrationActions";
import registrationEpic from "./registrationEpic";

describe("registration epic", () => {
  const state$: any = undefined;
  const registration = {
    username: "bob",
    email: "bob@test.com",
    password: "bobisthebest",
    repeatPassword: "bobisthebest",
  };
  let location: any;
  beforeEach(() => {
    location = {
      reload: jest.fn(),
    };
  });

  test("registration success", async () => {
    const action = registrationRequest(registration);
    const action$ = new ActionsObservable(of(action));
    const ajax = () =>
      of({
        response: {
          email: "bob@bob.com",
          id: "user id",
          username: "bob",
        },
      });

    const dependencies: any = {
      ajax,
      location,
    };
    const actions = await registrationEpic(action$, state$, dependencies)
      .pipe(toArray())
      .toPromise();

    expect(location.reload).toHaveBeenCalled();
    expect(actions).toEqual([
      registrationSuccess({
        email: "bob@bob.com",
        id: "user id",
        username: "bob",
      }),
    ]);
  });

  test("registration failure", async () => {
    const action = registrationRequest(registration);
    const action$ = new ActionsObservable(of(action));
    const ajax = () => throwError(new Error("error"));

    const dependencies: any = {
      ajax,
      location,
    };
    const actions = await registrationEpic(action$, state$, dependencies)
      .pipe(toArray())
      .toPromise();

    expect(location.reload).not.toHaveBeenCalled();
    expect(actions).toEqual([registrationFailure()]);
  });
});
