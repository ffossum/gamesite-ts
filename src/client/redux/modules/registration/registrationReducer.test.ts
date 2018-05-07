/* @flow */
/* eslint-env jest */
import {
  registrationFailure,
  registrationRequest,
  registrationSuccess,
} from "./registrationActions";
import reducer from "./registrationReducer";

describe("registration reducer", () => {
  const registration = {
    username: "bob",
    email: "bob@test.com",
    password: "bobisthebest",
    repeatPassword: "bobisthebest",
  };

  const initAction: any = { type: "@@INIT" };
  const initialState = reducer(undefined, initAction);

  test("initial state", () => {
    expect(initialState).toMatchSnapshot();
  });

  test("is loading after request", () => {
    const action = registrationRequest(registration);
    const state = reducer(initialState, action);
    expect(state.loading).toBe(true);
  });

  test("is no longer loading after success", () => {
    let state = reducer(initialState, registrationRequest(registration));
    state = reducer(
      state,
      registrationSuccess({
        email: "bob@bob.com",
        id: "abc123",
        username: "bob",
      })
    );
    expect(state.loading).toBe(false);
  });

  test("is no longer loading after failure", () => {
    let state = reducer(initialState, registrationRequest(registration));
    state = reducer(state, registrationFailure());
    expect(state.loading).toBe(false);
  });
});
