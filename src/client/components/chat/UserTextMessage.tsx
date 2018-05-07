import * as format from "date-fns/format";
import * as React from "react";
import { PublicUserData } from "../../../common/user";

export interface MessageProp {
  user: PublicUserData;
  text: string;
  time: string;
}

const dateFormat = "HH:mm";

export interface Props {
  message: MessageProp;
}
export default function UserTextMessage(props: Props) {
  const { message } = props;
  return (
    <div>
      <strong>
        {format(message.time, dateFormat)} {message.user.username}
      </strong>{" "}
      <span>{message.text}</span>
    </div>
  );
}
