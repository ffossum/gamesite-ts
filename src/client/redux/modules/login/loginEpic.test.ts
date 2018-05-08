import { ActionsObservable } from "redux-observable";
import { of, throwError } from "rxjs";
import { toArray } from "rxjs/operators";
import { loginFailure, loginRequest, loginSuccess } from "./loginActions";
import loginEpic from "./loginEpic";

describe("login epic", () => {
  const state$: any = undefined;
  const login = {
    email: "bob@test.com",
    password: "bobisthebest",
  };
  let location: any;
  beforeEach(() => {
    location = {
      reload: jest.fn(),
    };
  });

  test("login success", async () => {
    const action = loginRequest(login);
    const action$ = new ActionsObservable(of(action));
    const ajax = () =>
      of({
        response: {
          email: "bob@test.com",
          id: "user id",
          username: "bob",
        },
      });

    const dependencies: any = {
      ajax,
      location,
    };
    const actions = await loginEpic(action$, state$, dependencies)
      .pipe(toArray())
      .toPromise();

    expect(location.reload).toHaveBeenCalled();
    expect(actions).toEqual([
      loginSuccess({
        email: "bob@test.com",
        id: "user id",
        username: "bob",
      }),
    ]);
  });

  test("login failure", async () => {
    const action = loginRequest(login);
    const action$ = new ActionsObservable(of(action));
    const ajax = () => throwError(new Error("error"));

    const dependencies: any = {
      ajax,
      location,
    };
    const actions = await loginEpic(action$, state$, dependencies)
      .pipe(toArray())
      .toPromise();

    expect(location.reload).not.toHaveBeenCalled();
    expect(actions).toEqual([loginFailure()]);
  });
});
