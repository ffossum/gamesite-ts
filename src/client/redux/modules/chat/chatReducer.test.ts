import { clearChat, receiveMessage } from "./chatActions";
import chatReducer from "./chatReducer";

describe("chat reducer", () => {
  test("initial state", () => {
    const initAction: any = { type: "@@INIT" };
    const initialState = chatReducer(undefined, initAction);
    expect(initialState).toMatchSnapshot();
  });

  test("adds received message to channel", () => {
    const action = receiveMessage(
      {
        ch: "mainchat",
        uid: "userid",
        txt: "hello",
      },
      "2017-06-08T01:49:25.779Z"
    );
    const state = chatReducer(undefined, action);

    expect(state.mainchat && state.mainchat.messages).toHaveLength(1);
    expect(state.mainchat && state.mainchat.messages[0]).toEqual({
      userId: "userid",
      text: "hello",
      time: "2017-06-08T01:49:25.779Z",
    });
  });

  test("removes all channel data when clearing channel", () => {
    const addMessageAction = receiveMessage(
      {
        ch: "mainchat",
        uid: "userid",
        txt: "hello",
      },
      "2017-06-08T01:49:25.779Z"
    );
    let state = chatReducer(undefined, addMessageAction);

    expect(state).toHaveProperty("mainchat");
    const leaveChannelAction = clearChat("mainchat");

    state = chatReducer(state, leaveChannelAction);
    expect(state).not.toHaveProperty("mainchat");
  });
});
