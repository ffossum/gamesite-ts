import { rootReducer, State } from "../root";
import { authenticatedUser } from "../session/sessionActions";
import { fetchGameDataSuccess } from "./gameDataActions";
import { enterRoom, exitRoom, joinGame, playerJoined } from "./gameRoomActions";
import { mapDispatchToProps, mapStateToProps, mergeProps } from "./GameRoomContainer";

describe("GameRoomContainer", () => {
  let state: State;
  let dispatch: any;
  let ownProps: any;

  beforeEach(() => {
    state = rootReducer(
      state,
      fetchGameDataSuccess({
        createdTime: "2017-06-25T08:33:29.565Z",
        host: "other_user_id",
        players: ["other_user_id"],
        id: "game_id",
      })
    );
    dispatch = jest.fn();
    ownProps = {
      match: {
        params: {
          gameId: "game_id",
        },
      },
    };
  });

  test("denormalizes data", () => {
    const stateProps = mapStateToProps(state, ownProps);
    const dispatchProps = mapDispatchToProps(dispatch);
    const props = mergeProps(stateProps, dispatchProps);

    expect(props.game).toEqual({
      id: "game_id",
      host: { id: "other_user_id", username: "" },
      players: [
        {
          id: "other_user_id",
          username: "",
        },
      ],
    });
  });

  describe("with authenticated user", () => {
    beforeEach(() => {
      state = rootReducer(
        state,
        authenticatedUser({
          email: "user@test.com",
          id: "user_id",
          username: "user_name",
        })
      );
    });

    test("adds user id and game id to join game request", () => {
      const stateProps = mapStateToProps(state, ownProps);
      const dispatchProps = mapDispatchToProps(dispatch);
      const props = mergeProps(stateProps, dispatchProps);

      props.joinGame();
      expect(dispatch).toHaveBeenCalledWith(joinGame("user_id", "game_id"));
    });

    test("sets isInGame to false if user has not joined game when they exit", () => {
      const stateProps = mapStateToProps(state, ownProps);
      const dispatchProps = mapDispatchToProps(dispatch);
      const props = mergeProps(stateProps, dispatchProps);

      props.exitRoom("game_id");
      expect(dispatch).toHaveBeenCalledWith(exitRoom("game_id", false));
    });

    test("sets isInGame to true if user has joined game when they exit", () => {
      state = rootReducer(state, playerJoined("user_id", "game_id"));
      const stateProps = mapStateToProps(state, ownProps);
      const dispatchProps = mapDispatchToProps(dispatch);
      const props = mergeProps(stateProps, dispatchProps);

      props.exitRoom("game_id");
      expect(dispatch).toHaveBeenCalledWith(exitRoom("game_id", true));
    });
  });

  describe("entering room", () => {
    test("should fetch data when unauthenticated user enters", () => {
      const stateProps = mapStateToProps(state, ownProps);
      const dispatchProps = mapDispatchToProps(dispatch);
      const props = mergeProps(stateProps, dispatchProps);

      props.enterRoom("game_id");
      expect(dispatch).toHaveBeenCalledWith(enterRoom("game_id", true));
    });

    test("should fetch data when user enters while not having joined", () => {
      state = rootReducer(
        state,
        authenticatedUser({
          email: "user@test.com",
          id: "user_id",
          username: "user_name",
        })
      );

      const stateProps = mapStateToProps(state, ownProps);
      const dispatchProps = mapDispatchToProps(dispatch);
      const props = mergeProps(stateProps, dispatchProps);

      props.enterRoom("game_id");
      expect(dispatch).toHaveBeenCalledWith(enterRoom("game_id", true));
    });

    test("should not fetch data when user enters while having previously joined", () => {
      state = rootReducer(
        state,
        authenticatedUser({
          email: "user@test.com",
          id: "user_id",
          username: "user_name",
        })
      );
      state = rootReducer(state, playerJoined("user_id", "game_id"));

      const stateProps = mapStateToProps(state, ownProps);
      const dispatchProps = mapDispatchToProps(dispatch);
      const props = mergeProps(stateProps, dispatchProps);

      props.enterRoom("game_id");
      expect(dispatch).toHaveBeenCalledWith(enterRoom("game_id", false));
    });
  });
});
