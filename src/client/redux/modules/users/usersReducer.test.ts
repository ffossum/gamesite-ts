/* @flow */
/* eslint-env jest */
import { fetchedUserData } from "./userDataActions";
import usersReducer from "./usersReducer";

describe("users reducer", () => {
  test("initial state", () => {
    const initAction: any = { type: "@@INIT" };
    const initialState = usersReducer(undefined, initAction);
    expect(initialState).toMatchSnapshot();
  });
  test("fetched users are added to state", () => {
    const action = fetchedUserData([
      {
        id: "asdf-id",
        username: "asdf",
      },
      {
        id: "zxcv-id",
        username: "zxcv",
      },
    ]);
    const state = usersReducer(undefined, action);
    expect(state).toEqual({
      "asdf-id": {
        id: "asdf-id",
        username: "asdf",
      },
      "zxcv-id": {
        id: "zxcv-id",
        username: "zxcv",
      },
    });
  });
});
