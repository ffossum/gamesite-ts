import { createStore, Store } from "redux";
import { rootReducer, State } from "../root";
import { authenticatedUser } from "../session/sessionActions";
import { fetchedUserData } from "../users/userDataActions";
import { receiveMessage, sendMessage } from "./chatActions";
import { createMapStateToProps, mapDispatchToProps, mergeProps } from "./ChatContainer";

describe("chat container", () => {
  let store: Store<State>;
  let dispatch: any;
  const ownProps = { channelName: "channel" };
  let mapStateToProps = createMapStateToProps(undefined as any, ownProps);

  beforeEach(() => {
    store = createStore(rootReducer);
    dispatch = jest.fn();
    mapStateToProps = createMapStateToProps(undefined as any, ownProps);
  });

  test("does not dispatch action when logged out user tries to send message", () => {
    const stateProps = mapStateToProps(store.getState());
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

    const stateProps = mapStateToProps(store.getState());
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

    const stateProps = mapStateToProps(store.getState());

    expect(stateProps).toMatchSnapshot();
  });
});
