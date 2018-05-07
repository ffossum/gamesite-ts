import { createStore } from "redux";
import { rootReducer } from "../root";
import { authenticatedUser } from "../session/sessionActions";
import { fetchedUserData } from "../users/userDataActions";
import { receiveMessage, sendMessage } from "./chatActions";
import { createMapStateToProps, mapDispatchToProps, mergeProps } from "./ChatContainer";

describe("chat container", () => {
  let store;
  let dispatch;
  let mapStateToProps;
  const ownProps = { channelName: "channel" };

  beforeEach(() => {
    store = createStore(rootReducer);
    dispatch = jest.fn();
    mapStateToProps = createMapStateToProps(undefined, ownProps);
  });

  test("does not dispatch action when logged out user tries to send message", () => {
    const stateProps = mapStateToProps(store.getState(), ownProps);
    const dispatchProps = mapDispatchToProps(dispatch);

    const props = mergeProps(stateProps, dispatchProps, ownProps);

    props.sendMessage("hello");

    expect(dispatch).not.toHaveBeenCalled();
  });

  test("dispatches action when logged in user sends message", () => {
    store.dispatch(
      authenticatedUser({
        email: "asdf@asdf.com",
        id: "asdf-id",
        username: "asdf",
      })
    );

    const stateProps = mapStateToProps(store.getState(), ownProps);
    const dispatchProps = mapDispatchToProps(dispatch);

    const props = mergeProps(stateProps, dispatchProps, ownProps);

    props.sendMessage("hello");

    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith(sendMessage("asdf-id", "channel", "hello"));
  });

  test("creates denormalized message array", () => {
    store.dispatch(
      receiveMessage({ ch: "channel", txt: "hey", uid: "zxcv-id" }, "2017-06-08T02:07:37.605Z")
    );
    store.dispatch(
      receiveMessage({ ch: "channel", txt: "hi", uid: "qwer-id" }, "2017-06-08T02:07:37.605Z")
    );

    store.dispatch(
      fetchedUserData([{ id: "qwer-id", username: "qwer" }, { id: "zxcv-id", username: "zxcv" }])
    );

    const stateProps = mapStateToProps(store.getState(), ownProps);

    expect(stateProps).toMatchSnapshot();
  });
});
