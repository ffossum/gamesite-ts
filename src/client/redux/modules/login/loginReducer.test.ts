/* @flow */
/* eslint-env jest */
import { loginFailure, loginRequest, loginSuccess } from "./loginActions";
import reducer from "./loginReducer";

describe("login reducer", () => {
  const login = {
    email: "bob@test.com",
    password: "bobisthebest",
  };

  const initAction: any = { type: "@@INIT" };
  const initialState = reducer(undefined, initAction);

  test("initial state", () => {
    expect(initialState).toMatchSnapshot();
  });

  test("is loading after request", () => {
    const action = loginRequest(login);
    const state = reducer(initialState, action);
    expect(state.loading).toBe(true);
  });

  test("is no longer loading after success", () => {
    let state = reducer(initialState, loginRequest(login));
    state = reducer(
      state,
      loginSuccess({
        email: "bob@test.com",
        id: "abc123",
        username: "bob",
      })
    );
    expect(state.loading).toBe(false);
  });

  test("is no longer loading after failure", () => {
    let state = reducer(initialState, loginRequest(login));
    state = reducer(state, loginFailure());
    expect(state.loading).toBe(false);
  });
});
