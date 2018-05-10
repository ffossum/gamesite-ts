import { includes } from "lodash";
import { connect, Dispatch } from "react-redux";
import { match } from "react-router-dom";
import { bindActionCreators } from "redux";
import { UserId } from "../../../../common/user";
import GameRoom from "../../../components/game/GameRoom";
import { Props as GameRoomProps } from "../../../components/game/GameRoom";
import { State } from "../root";
import {
  cancelGame,
  enterRoom,
  enterSpectatorRoom,
  exitRoom,
  exitSpectatorRoom,
  joinGame,
  leaveGame,
  startGame,
} from "./gameRoomActions";

interface OwnProps {
  location: Location;
  history: History;
  match: match<{ gameId?: string }>;
}

export function mapStateToProps(state: State, ownProps: OwnProps) {
  const gameId = ownProps.match.params.gameId || "";
  const game = state.games[gameId];
  return {
    gameId,
    game,
    users: state.users,
    user: state.session.user,
  };
}

export function mapDispatchToProps(dispatch: Dispatch<State>) {
  return bindActionCreators(
    {
      enterRoom,
      exitRoom,
      enterSpectatorRoom,
      exitSpectatorRoom,
      joinGame,
      leaveGame,
      cancelGame,
      startGame,
    },
    dispatch
  );
}

export function mergeProps(
  stateProps: ReturnType<typeof mapStateToProps>,
  dispatchProps: ReturnType<typeof mapDispatchToProps>
): GameRoomProps {
  const { game, gameId, users, user } = stateProps;

  const placeholderUser = (userId: UserId) => ({ id: userId, username: "" });

  const transformedGame = game && {
    id: gameId,
    host: users[game.host] || placeholderUser(game.host),
    players: game.players.map(playerId => users[playerId] || placeholderUser(playerId)),
    status: game.status,
  };

  const isInGame = !!(game && user && includes(game.players, user.id));

  return {
    enterRoom(enteredGameId) {
      const shouldFetchGameData = !isInGame;
      dispatchProps.enterRoom(enteredGameId, shouldFetchGameData);
    },
    exitRoom(exitedGameId) {
      dispatchProps.exitRoom(exitedGameId, isInGame);
    },
    enterSpectatorRoom: dispatchProps.enterSpectatorRoom,
    exitSpectatorRoom: dispatchProps.exitSpectatorRoom,
    joinGame() {
      user && dispatchProps.joinGame(user.id, gameId);
    },
    leaveGame() {
      user && dispatchProps.leaveGame(user.id, gameId);
    },
    cancelGame() {
      user && game && user.id === game.host && dispatchProps.cancelGame(user.id, game.id);
    },
    startGame() {
      user && game && user.id === game.host && dispatchProps.startGame(user.id, game.id);
    },
    gameId,
    game: transformedGame,
    user,
  };
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(GameRoom);
