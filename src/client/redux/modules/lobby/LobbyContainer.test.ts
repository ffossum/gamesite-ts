import { rootReducer } from "../root";
import { authenticatedUser } from "../session/sessionActions";
import { createGameRequest, refreshLobby } from "./lobbyActions";
import { mapDispatchToProps, mapStateToProps, mergeProps } from "./LobbyContainer";

describe("lobby container", () => {
  let state;
  let dispatch;

  beforeEach(() => {
    state = rootReducer(
      state,
      refreshLobby({
        game_id: {
          status: "not_started",
          createdTime: "2017-06-25T08:33:29.565Z",
          host: "other_user_id",
          players: ["other_user_id"],
          id: "game_id",
        },
      })
    );
    dispatch = jest.fn();
  });

  test("denormalizes games data", () => {
    const stateProps = mapStateToProps(state);
    const dispatchProps = mapDispatchToProps(dispatch);
    const props = mergeProps(stateProps, dispatchProps);

    expect(props.games).toMatchSnapshot();
  });

  test("does not dispatch create game action if user is not authenticated", () => {
    const stateProps = mapStateToProps(state);
    const dispatchProps = mapDispatchToProps(dispatch);
    const props = mergeProps(stateProps, dispatchProps);

    props.createGame();
    expect(dispatch).not.toHaveBeenCalled();
  });

  test("dispatches create game action if user is authenticated", () => {
    state = rootReducer(
      state,
      authenticatedUser({
        email: "user@test.com",
        id: "user_id",
        username: "user_name",
      })
    );

    const stateProps = mapStateToProps(state);
    const dispatchProps = mapDispatchToProps(dispatch);
    const props = mergeProps(stateProps, dispatchProps);

    props.createGame();

    expect(dispatch).toHaveBeenCalledWith(createGameRequest("user_id"));
  });
});
