import { connect, Dispatch } from "react-redux";
import { bindActionCreators } from "redux";
import Chat from "../../../components/chat/Chat";
import { Props as ChatProps } from "../../../components/chat/Chat";
import { State } from "../root";
import { sendMessage } from "./chatActions";
import { createChatContainerSelector } from "./chatSelectors";

export interface Props {
  channelName: string;
}

export function createMapStateToProps(_: State, ownProps: Props) {
  return createChatContainerSelector(ownProps.channelName);
}

export function mapDispatchToProps(dispatch: Dispatch<State>) {
  return bindActionCreators({ sendMessage }, dispatch);
}

export function mergeProps(
  stateProps: ReturnType<ReturnType<typeof createMapStateToProps>>,
  dispatchProps: ReturnType<typeof mapDispatchToProps>,
  ownProps: Props
): ChatProps {
  const { messages, user } = stateProps;

  const partialSendMessage = (messageText: string) => {
    user && dispatchProps.sendMessage(user.id, ownProps.channelName, messageText);
  };

  return {
    messages,
    sendMessage: partialSendMessage,
    user,
  };
}

export default connect(createMapStateToProps, mapDispatchToProps, mergeProps)(Chat);
