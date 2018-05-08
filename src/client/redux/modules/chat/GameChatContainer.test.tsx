import { createStore, Store } from "redux";
import { fetchGameDataSuccess } from "../games/gameDataActions";
import { rootReducer, State } from "../root";
import { authenticatedUser } from "../session/sessionActions";
import { fetchedUserData } from "../users/userDataActions";
import { receiveMessage } from "./chatActions";
import { createMapStateToProps, mapDispatchToProps, mergeProps } from "./GameChatContainer";

describe("GameChatContainer", () => {
  let store: Store<State>;
  let dispatch: any;
  let mapStateToProps: any;
  const ownProps = { gameId: "game_id" };

  beforeEach(() => {
    store = createStore(rootReducer);

    dispatch = jest.fn();
    mapStateToProps = createMapStateToProps(undefined as any, ownProps);
  });

  test("does not dispatch send message if game is unavailable", () => {
    store.dispatch(
      authenticatedUser({
        email: "user@test.com",
        id: "user_id",
        username: "user_name",
      })
    );

    const stateProps = mapStateToProps(store.getState(), ownProps);
    const dispatchProps = mapDispatchToProps(dispatch);
    const props = mergeProps(stateProps, dispatchProps);

    props.sendMessage("hello");

    expect(dispatch).not.toHaveBeenCalled();
  });

  test("does not dispatch send message if user is not authenticated", () => {
    store.dispatch(
      fetchGameDataSuccess({
        id: ownProps.gameId,
        host: "qwer-id",
        createdTime: "2017-06-25T16:51:53.625Z",
        players: ["qwer-id"],
      })
    );

    const stateProps = mapStateToProps(store.getState(), ownProps);
    const dispatchProps = mapDispatchToProps(dispatch);
    const props = mergeProps(stateProps, dispatchProps);

    props.sendMessage("hello");

    expect(dispatch).not.toHaveBeenCalled();
  });

  test("dispatches message if game data is available and user is authenticated", () => {
    store.dispatch(
      authenticatedUser({
        email: "user@test.com",
        id: "user_id",
        username: "user_name",
      })
    );
    store.dispatch(
      fetchGameDataSuccess({
        id: ownProps.gameId,
        host: "qwer-id",
        createdTime: "2017-06-25T16:51:53.625Z",
        players: ["qwer-id"],
      })
    );

    const stateProps = mapStateToProps(store.getState(), ownProps);
    const dispatchProps = mapDispatchToProps(dispatch);
    const props = mergeProps(stateProps, dispatchProps);

    props.sendMessage("hello");

    expect(dispatch).toHaveBeenCalled();
  });

  test("creates denormalized message array", () => {
    store.dispatch(
      receiveMessage({ ch: "game:game_id", txt: "hey", uid: "zxcv-id" }, "2017-06-08T02:07:37.605Z")
    );
    store.dispatch(
      receiveMessage({ ch: "game:game_id", txt: "hi", uid: "qwer-id" }, "2017-06-08T02:07:37.605Z")
    );

    store.dispatch(
      fetchedUserData([{ id: "qwer-id", username: "qwer" }, { id: "zxcv-id", username: "zxcv" }])
    );

    const stateProps = mapStateToProps(store.getState(), ownProps);

    expect(stateProps).toMatchSnapshot();
  });
});
