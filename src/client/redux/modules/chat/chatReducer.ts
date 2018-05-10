import { omit } from "lodash";
import { Action } from "../../actions";
import { ChannelState } from "./channelReducer";
import channelReducer from "./channelReducer";
import { CLEAR_CHAT, RECEIVE_MESSAGE } from "./chatActions";

export interface ChatState {
  [channelName: string]: ChannelState;
}
const initialState: ChatState = {};

export default function chatReducer(state: ChatState = initialState, action: Action) {
  switch (action.type) {
    case RECEIVE_MESSAGE: {
      const { ch } = action.payload.msg;
      return {
        ...state,
        [ch]: channelReducer(state[ch], action),
      };
    }
    case CLEAR_CHAT: {
      const channelName = action.payload;
      return omit(state, channelName);
    }
    default:
      return state;
  }
}
