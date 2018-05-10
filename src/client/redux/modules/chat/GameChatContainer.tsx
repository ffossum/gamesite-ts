import { connect, Dispatch } from "react-redux";
import { bindActionCreators } from "redux";
import Chat from "../../../components/chat/Chat";
import { Props as ChatProps } from "../../../components/chat/Chat";
import { MessageProp } from "../../../components/chat/UserTextMessage";
import { Action } from "../../actions";
import { GameDataState } from "../games/gamesReducer";
import { State } from "../root";
import { SessionUser } from "../session/sessionReducer";
import { sendGameMessage } from "./chatActions";
import { createGameChatContainerSelector } from "./chatSelectors";

export interface Props {
  gameId: string;
}
export interface StateProps {
  game?: GameDataState;
  messages: MessageProp[];
  user?: SessionUser;
}

export function createMapStateToProps(_: State, ownProps: Props) {
  return createGameChatContainerSelector(ownProps.gameId);
}

export function mapDispatchToProps(dispatch: Dispatch<Action>) {
  return bindActionCreators({ sendGameMessage }, dispatch);
}

export function mergeProps(
  stateProps: ReturnType<ReturnType<typeof createMapStateToProps>>,
  dispatchProps: ReturnType<typeof mapDispatchToProps>
): ChatProps {
  const { game, messages, user } = stateProps;

  return {
    user,
    messages,
    sendMessage(messageText: string) {
      game && user && dispatchProps.sendGameMessage(user.id, game.id, game.players, messageText);
    },
  };
}

export default connect(createMapStateToProps, mapDispatchToProps, mergeProps)(Chat);
