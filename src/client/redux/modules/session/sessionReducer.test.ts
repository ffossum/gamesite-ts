import { authenticatedUser } from "./sessionActions";
import reducer from "./sessionReducer";

describe("session reducer", () => {
  test("initial state", () => {
    const initAction: any = { type: "@@INIT" };
    const initialState = reducer(undefined, initAction);
    expect(initialState).toMatchSnapshot();
  });
  test("contains user data after user is authenticated", () => {
    const action = authenticatedUser({
      email: "bob@bob.com",
      username: "bob",
      id: "userid",
    });

    const state = reducer(undefined, action);
    expect(state).toEqual({
      user: {
        email: "bob@bob.com",
        username: "bob",
        id: "userid",
      },
    });
  });
});
