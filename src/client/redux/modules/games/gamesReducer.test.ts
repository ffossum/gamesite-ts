import { gameCreated, gameUpdated, refreshLobby } from "../lobby/lobbyActions";
import { fetchGameDataSuccess } from "./gameDataActions";
import { playerJoined, playerLeft } from "./gameRoomActions";
import gamesReducer from "./gamesReducer";

describe("games reducer", () => {
  test("adds refreshed lobby to games without removing other games", () => {
    const game0 = {
      createdTime: "2017-06-11T10:57:22.414Z",
      id: "game_id0",
      host: "qwer-id",
      players: ["qwer-id"],
    };

    const game1 = {
      createdTime: "2017-06-11T10:57:22.414Z",
      id: "game_id1",
      host: "asdf-id",
      players: ["asdf-id"],
    };

    const initialState = {
      game_id0: game0,
    };

    const action = refreshLobby({
      game_id1: game1,
    });

    const state = gamesReducer(initialState, action);

    expect(state).toEqual({
      game_id0: game0,
      game_id1: game1,
    });
  });

  test("adds new created game to games", () => {
    const action = gameCreated({
      createdTime: "2017-06-11T10:57:22.414Z",
      id: "gameid-1",
      host: "asdf-id",
      players: ["asdf-id"],
    });
    const state = gamesReducer(undefined, action);

    expect(state).toEqual({
      "gameid-1": {
        createdTime: "2017-06-11T10:57:22.414Z",
        id: "gameid-1",
        host: "asdf-id",
        players: ["asdf-id"],
      },
    });
  });

  test("adds fetched game data to games", () => {
    const action = fetchGameDataSuccess({
      createdTime: "2017-06-11T10:57:22.414Z",
      id: "gameid-1",
      host: "asdf-id",
      players: ["asdf-id"],
    });
    const state = gamesReducer(undefined, action);

    expect(state).toEqual({
      "gameid-1": {
        createdTime: "2017-06-11T10:57:22.414Z",
        id: "gameid-1",
        host: "asdf-id",
        players: ["asdf-id"],
      },
    });
  });

  test("updates game data", () => {
    const action = gameCreated({
      createdTime: "2017-06-11T10:57:22.414Z",
      id: "gameid-1",
      host: "asdf-id",
      players: ["asdf-id"],
    });

    let state = gamesReducer(undefined, action);

    const updateAction = gameUpdated({
      id: "gameid-1",
      players: ["asdf-id", "zxcv-id"],
    });

    state = gamesReducer(state, updateAction);

    expect(state).toEqual({
      "gameid-1": {
        createdTime: "2017-06-11T10:57:22.414Z",
        id: "gameid-1",
        host: "asdf-id",
        players: ["asdf-id", "zxcv-id"],
      },
    });
  });

  test("adds joined player to game data", () => {
    const action = gameCreated({
      createdTime: "2017-06-11T10:57:22.414Z",
      id: "gameid_1",
      host: "asdf-id",
      players: ["asdf-id"],
    });

    let state = gamesReducer(undefined, action);
    const joinAction = playerJoined("qwer-id", "gameid_1");

    state = gamesReducer(state, joinAction);

    expect(state.gameid_1 && state.gameid_1.players).toContainEqual("qwer-id");
  });

  test("removes leaving player from game data", () => {
    let state = gamesReducer(
      undefined,
      gameCreated({
        createdTime: "2017-06-11T10:57:22.414Z",
        id: "game_id",
        host: "asdf_id",
        players: ["asdf_id", "qwer_id", "zxcv_id"],
      })
    );

    state = gamesReducer(state, playerLeft("qwer_id", "game_id"));
    expect(state.game_id && state.game_id.players).toEqual(["asdf_id", "zxcv_id"]);
  });
});
