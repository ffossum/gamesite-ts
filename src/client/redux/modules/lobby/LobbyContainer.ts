import { filter, map, pick, values } from "lodash";
import { connect, Dispatch } from "react-redux";
import { PublicUserData } from "../../../../common/user";
import Lobby from "../../../components/lobby/Lobby";
import { Props as LobbyProps } from "../../../components/lobby/Lobby";
import { Action } from "../../actions";
import { GameDataState, GamesState } from "../games/gamesReducer";
import { State } from "../root";
import { createGameRequest, enterLobby, exitLobby } from "./lobbyActions";
import { GameId } from "./lobbyReducer";

export function mapStateToProps(state: State) {
  return {
    games: state.games,
    lobby: state.lobby,
    user: state.session.user,
    users: state.users,
  };
}

export function mapDispatchToProps(dispatch: Dispatch<Action>) {
  return {
    createGame(userId: string) {
      dispatch(createGameRequest(userId));
    },
    enterLobby() {
      dispatch(enterLobby());
    },
    exitLobby() {
      dispatch(exitLobby());
    },
  };
}

function placeholderUser(userId: string): PublicUserData {
  return { id: userId, username: "" };
}

export function mergeProps(
  stateProps: ReturnType<typeof mapStateToProps>,
  dispatchProps: ReturnType<typeof mapDispatchToProps>
): LobbyProps {
  const { user, games, users, lobby } = stateProps;

  const partialCreateGame = () => user && dispatchProps.createGame(user.id);

  const lobbyGames = values(pick<GamesState, GameId>(games, lobby.games));
  const onlyNotStartedGames = filter(lobbyGames, game => game.status === "not_started");
  const transformedGames = map(onlyNotStartedGames, (game: GameDataState) => {
    const { host, players, ...rest } = game;
    return {
      ...rest,
      host: users[host] || placeholderUser(host),
      players: players.map(playerId => users[playerId] || placeholderUser(playerId)),
    };
  });

  return {
    user,
    games: transformedGames,
    createGame: partialCreateGame,
    enterLobby: dispatchProps.enterLobby,
    exitLobby: dispatchProps.exitLobby,
  };
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Lobby);
