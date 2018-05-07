import * as React from "react";
import { SessionUser } from "../../redux/modules/session/sessionReducer";
import ChatInput from "./ChatInput";
import UserTextMessage from "./UserTextMessage";
import { MessageProp } from "./UserTextMessage";

export interface Props {
  messages: MessageProp[];
  user?: SessionUser;
  sendMessage: (text: string) => void;
}
export default function Chat(props: Props) {
  const { messages, sendMessage, user } = props;

  const disabled = !user;

  return (
    <div>
      <ul>
        {messages.map((msg, i) => (
          <li key={msg.user.id + i}>
            <UserTextMessage message={msg} />
          </li>
        ))}
      </ul>
      <ChatInput
        disabled={disabled}
        disabledPlaceholder="Log in to chat"
        sendMessage={sendMessage}
      />
    </div>
  );
}
